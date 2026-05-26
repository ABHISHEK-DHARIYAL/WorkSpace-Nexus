/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../constants/breakpoints';

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<keyof typeof BREAKPOINTS>('xs');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const w = window.innerWidth;
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

  return breakpoint;
};
