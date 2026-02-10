'use client';

import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceInfo {
  type: DeviceType;
  particleCount: number;
  pixelRatio: number;
}

const deviceProfiles: Record<DeviceType, Omit<DeviceInfo, 'type'>> = {
  mobile: { particleCount: 200, pixelRatio: 1 },
  tablet: { particleCount: 500, pixelRatio: 1.5 },
  desktop: { particleCount: 1000, pixelRatio: 2 },
};

export function useDeviceType(): DeviceInfo {
  const [device, setDevice] = useState<DeviceInfo>({
    type: 'desktop',
    ...deviceProfiles.desktop,
  });

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      let type: DeviceType = 'desktop';
      if (width < 768) type = 'mobile';
      else if (width < 1024) type = 'tablet';

      setDevice({ type, ...deviceProfiles[type] });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return device;
}
