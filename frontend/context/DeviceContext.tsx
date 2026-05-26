/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BREAKPOINTS } from '../constants/breakpoints';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'large';
export type Orientation = 'portrait' | 'landscape';

export interface DeviceContextType {
  width: number;
  height: number;
  deviceType: DeviceType;
  orientation: Orientation;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    // Trigger on mount just in case
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const width = viewport.width;
  const height = viewport.height;

  // Classify devices based on standardized breakpoints
  let deviceType: DeviceType = 'desktop';
  if (width < BREAKPOINTS.md) {
    deviceType = 'mobile';
  } else if (width < BREAKPOINTS.lg) {
    deviceType = 'tablet';
  } else if (width < BREAKPOINTS['3xl']) {
    deviceType = 'desktop';
  } else {
    deviceType = 'large';
  }

  const orientation: Orientation = width >= height ? 'landscape' : 'portrait';

  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';
  const isLarge = deviceType === 'large';

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const value: DeviceContextType = {
    width,
    height,
    deviceType,
    orientation,
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  };

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

export const useDevice = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used inside a DeviceProvider');
  }
  return context;
};
