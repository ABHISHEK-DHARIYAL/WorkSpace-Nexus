/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useState, useEffect } from 'react';
import { BREAKPOINTS, Breakpoint } from '../constants/breakpoints';
import { UI_SCALE, getDeviceCategory } from '../constants/uiScale';

export interface ScaleContextType {
  width: number;
  breakpoint: Breakpoint;
  category: 'desktop' | 'tablet' | 'mobile';
  scaleFactor: number;
  typography: {
    h1: number;
    h2: number;
    h3: number;
    body: number;
    small: number;
  };
  button: {
    height: number;
    paddingInline: number;
    fontSize: number;
    borderRadius: number;
  };
  icon: {
    large: number;
    small: number;
  };
  card: {
    padding: number;
    borderRadius: number;
    gap: number;
  };
  sidebar: {
    width: number;
  };
  table: {
    text: number;
  };
  navigation: {
    height: number;
  };
  input: {
    height: number;
    fontSize: number;
  };
  modal: {
    maxWidth: number | string;
    padding: number;
  };
  spacing: {
    gap: number;
    padding: number;
  };
}

export const ScaleContext = createContext<ScaleContextType | null>(null);

export const ScaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1280);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xl');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const w = window.innerWidth;
      setWidth(w);

      if (w >= BREAKPOINTS['3xl']) {
        setBreakpoint('3xl');
      } else if (w >= BREAKPOINTS['2xl']) {
        setBreakpoint('2xl');
      } else if (w >= BREAKPOINTS.xl) {
        setBreakpoint('xl');
      } else if (w >= BREAKPOINTS.lg) {
        setBreakpoint('lg');
      } else if (w >= BREAKPOINTS.md) {
        setBreakpoint('md');
      } else if (w >= BREAKPOINTS.sm) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('xs');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const category = getDeviceCategory(width);
  
  // Calculate a proportional scale factor where 1.0 represents standard lg/xl screens (1024px to 1280px)
  let scaleFactor = 1.0;
  if (width < 1024) {
    // scale factor decreases towards 0.7 on tiny mobiles
    scaleFactor = Math.max(0.7, 0.7 + (0.3 * (width - 320)) / (1024 - 320));
  } else if (width > 1280) {
    // scale factor increases slightly up to 1.3 on ultra wides
    scaleFactor = Math.min(1.3, 1.0 + (0.3 * (width - 1280)) / (1920 - 1280));
  }

  // Build current values based on category
  const values: ScaleContextType = {
    width,
    breakpoint,
    category,
    scaleFactor,
    typography: {
      h1: UI_SCALE.typography.h1[category],
      h2: UI_SCALE.typography.h2[category],
      h3: UI_SCALE.typography.h3[category],
      body: UI_SCALE.typography.body[category],
      small: UI_SCALE.typography.small[category],
    },
    button: {
      height: UI_SCALE.button.height[category],
      paddingInline: UI_SCALE.button.paddingInline[category],
      fontSize: UI_SCALE.button.fontSize[category],
      borderRadius: UI_SCALE.button.borderRadius[category],
    },
    icon: {
      large: UI_SCALE.icon.large[category],
      small: UI_SCALE.icon.small[category],
    },
    card: {
      padding: UI_SCALE.card.padding[category],
      borderRadius: UI_SCALE.card.borderRadius[category],
      gap: UI_SCALE.card.gap[category],
    },
    sidebar: {
      width: UI_SCALE.sidebar.width[category],
    },
    table: {
      text: UI_SCALE.table.text[category],
    },
    navigation: {
      height: UI_SCALE.navigation.height[category],
    },
    input: {
      height: UI_SCALE.input.height[category],
      fontSize: UI_SCALE.input.fontSize[category],
    },
    modal: {
      maxWidth: category === 'mobile' ? '100vw' : UI_SCALE.modal.maxWidth[category],
      padding: UI_SCALE.modal.padding[category],
    },
    spacing: {
      gap: UI_SCALE.spacing.gap[category],
      padding: UI_SCALE.spacing.padding[category],
    },
  };

  // Synchronize CSS custom custom properties at document level
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--scale-factor', `${scaleFactor}`);
    
    // Typography scaling
    root.style.setProperty('--scale-h1', `${values.typography.h1}px`);
    root.style.setProperty('--scale-h2', `${values.typography.h2}px`);
    root.style.setProperty('--scale-h3', `${values.typography.h3}px`);
    root.style.setProperty('--scale-body', `${values.typography.body}px`);
    root.style.setProperty('--scale-small', `${values.typography.small}px`);

    // Button scaling
    root.style.setProperty('--scale-btn-height', `${values.button.height}px`);
    root.style.setProperty('--scale-btn-px', `${values.button.paddingInline}px`);
    root.style.setProperty('--scale-btn-font', `${values.button.fontSize}px`);
    root.style.setProperty('--scale-btn-radius', `${values.button.borderRadius}px`);

    // Icon scaling
    root.style.setProperty('--scale-icon-lg', `${values.icon.large}px`);
    root.style.setProperty('--scale-icon-sm', `${values.icon.small}px`);

    // Card scaling
    root.style.setProperty('--scale-card-p', `${values.card.padding}px`);
    root.style.setProperty('--scale-card-radius', `${values.card.borderRadius}px`);
    root.style.setProperty('--scale-card-gap', `${values.card.gap}px`);

    // Sidebar scaling
    root.style.setProperty('--scale-sidebar-w', `${values.sidebar.width}px`);

    // Table scaling
    root.style.setProperty('--scale-table-font', `${values.table.text}px`);

    // Navigation scaling
    root.style.setProperty('--scale-nav-h', `${values.navigation.height}px`);

    // Input scaling
    root.style.setProperty('--scale-input-h', `${values.input.height}px`);
    root.style.setProperty('--scale-input-font', `${values.input.fontSize}px`);

    // Modal scaling
    root.style.setProperty('--scale-modal-max-w', typeof values.modal.maxWidth === 'number' ? `${values.modal.maxWidth}px` : values.modal.maxWidth);
    root.style.setProperty('--scale-modal-p', `${values.modal.padding}px`);

    // Spacing scaling
    root.style.setProperty('--scale-spacing-gap', `${values.spacing.gap}px`);
    root.style.setProperty('--scale-spacing-p', `${values.spacing.padding}px`);
  }, [values, scaleFactor]);

  return (
    <ScaleContext.Provider value={values}>
      {children}
    </ScaleContext.Provider>
  );
};
