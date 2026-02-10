'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { SceneManager } from '@/lib/three/scene-manager';
import { DataStream } from '@/lib/three/data-stream';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useDeviceType } from '@/lib/hooks/useDeviceType';

interface NoteHighwayProps {
  scrollSpeed: number;
  pausedStreams: { data: boolean; sales: boolean; poker: boolean };
}

const STREAM_CONFIGS = [
  { id: 'data' as const, color: 0x00ffff, lane: -1 },
  { id: 'sales' as const, color: 0xff00ff, lane: 0 },
  { id: 'poker' as const, color: 0xffd700, lane: 1 },
];

export function NoteHighway({ scrollSpeed, pausedStreams }: NoteHighwayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamsRef = useRef<Map<string, DataStream>>(new Map());
  const prefersReduced = useReducedMotion();
  const device = useDeviceType();

  const initScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReduced) return;

    const manager = new SceneManager({
      canvas,
      pixelRatio: device.pixelRatio,
    });

    manager.camera.position.set(0, 0, 4);
    manager.camera.lookAt(0, 0, -10);

    const particleCount = Math.floor(device.particleCount * 0.3);

    STREAM_CONFIGS.forEach(({ id, color, lane }) => {
      const stream = new DataStream({
        color: new THREE.Color(color),
        count: particleCount,
        speed: 0.12,
        lane,
      });
      streamsRef.current.set(id, stream);
      manager.scene.add(stream.group);
    });

    manager.setUpdateCallback((delta) => {
      streamsRef.current.forEach((stream) => {
        stream.update(delta, scrollSpeed);
      });
    });

    manager.start();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const { clientWidth, clientHeight } = canvas.parentElement;
      canvas.width = clientWidth;
      canvas.height = clientHeight;
      manager.resize(clientWidth, clientHeight);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      streamsRef.current.forEach((s) => s.dispose());
      streamsRef.current.clear();
      manager.dispose();
    };
  }, [prefersReduced, device, scrollSpeed]);

  useEffect(() => {
    const cleanup = initScene();
    return cleanup;
  }, [initScene]);

  // Sync pause state
  useEffect(() => {
    STREAM_CONFIGS.forEach(({ id }) => {
      const stream = streamsRef.current.get(id);
      stream?.setPaused(pausedStreams[id]);
    });
  }, [pausedStreams]);

  if (prefersReduced) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex gap-8">
          {STREAM_CONFIGS.map(({ id, color }) => (
            <div
              key={id}
              className="h-32 w-1 rounded-full opacity-40"
              style={{ background: `#${color.toString(16).padStart(6, '0')}` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
