export const colors = {
  portoDusk: '#2E004B',
  portoDuskLight: '#4B0082',
  riverReflection: '#1E90FF',
  terracotta: '#E2725B',
  mistWhite: '#F8F9FA',
  streamCyan: '#00FFFF',
  streamMagenta: '#FF00FF',
  streamGold: '#FFD700',
} as const;

export const glows = {
  river: '0 0 20px rgba(30, 144, 255, 0.4), 0 0 60px rgba(30, 144, 255, 0.2)',
  terracotta: '0 0 20px rgba(226, 114, 91, 0.4), 0 0 60px rgba(226, 114, 91, 0.2)',
  cyan: '0 0 20px rgba(0, 255, 255, 0.4), 0 0 60px rgba(0, 255, 255, 0.2)',
  magenta: '0 0 20px rgba(255, 0, 255, 0.4), 0 0 60px rgba(255, 0, 255, 0.2)',
  gold: '0 0 20px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)',
} as const;

export const gradients = {
  heroBg: `linear-gradient(180deg, ${colors.portoDusk} 0%, ${colors.portoDuskLight} 100%)`,
  riverStatic: `linear-gradient(135deg, ${colors.portoDusk} 0%, ${colors.riverReflection}33 50%, ${colors.portoDusk} 100%)`,
} as const;
