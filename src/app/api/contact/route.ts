import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory rate limiter: IP → [timestamps]
const rateMap = new Map<string, number[]>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  rateMap.set(ip, recent);
  return recent.length >= RATE_LIMIT;
}

function recordRequest(ip: string) {
  const timestamps = rateMap.get(ip) ?? [];
  timestamps.push(Date.now());
  rateMap.set(ip, timestamps);
}

async function appendToSheet(row: string[]) {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error('Google Sheets environment variables are not configured.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A:G',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row],
    },
  });
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    );
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }

  const { name, email, phone, linkedin, company, message } = body as {
    name?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    company?: string;
    message?: string;
  };

  // Validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json(
      { error: 'Name is required.' },
      { status: 400 }
    );
  }

  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return NextResponse.json(
      { error: 'A valid email is required.' },
      { status: 400 }
    );
  }

  // Append to sheet
  const timestamp = new Date().toISOString();
  const row = [
    timestamp,
    name.trim(),
    email.trim(),
    typeof phone === 'string' ? phone.trim() : '',
    typeof linkedin === 'string' ? linkedin.trim() : '',
    typeof company === 'string' ? company.trim() : '',
    typeof message === 'string' ? message.trim() : '',
  ];

  try {
    await appendToSheet(row);
    recordRequest(ip);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Google Sheets append failed:', err);
    return NextResponse.json(
      { error: 'Failed to save your message. Please try again.' },
      { status: 500 }
    );
  }
}
