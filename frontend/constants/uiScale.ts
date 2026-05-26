/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BREAKPOINTS } from './breakpoints';

export const UI_SCALE = {
  typography: {
    h1: { desktop: 48, tablet: 40, mobile: 30 },
    h2: { desktop: 38, tablet: 32, mobile: 24 },
    h3: { desktop: 30, tablet: 24, mobile: 20 },
    body: { desktop: 18, tablet: 16, mobile: 14 },
    small: { desktop: 13, tablet: 12, mobile: 10 },
  },
  button: {
    height: { desktop: 48, tablet: 42, mobile: 36 },
    paddingInline: { desktop: 20, tablet: 16, mobile: 12 },
    fontSize: { desktop: 15, tablet: 14, mobile: 12 },
    borderRadius: { desktop: 14, tablet: 12, mobile: 10 },
  },
  icon: {
    large: { desktop: 24, tablet: 20, mobile: 16 },
    small: { desktop: 18, tablet: 16, mobile: 14 },
  },
  card: {
    padding: { desktop: 24, tablet: 18, mobile: 14 },
    borderRadius: { desktop: 24, tablet: 20, mobile: 16 },
    gap: { desktop: 20, tablet: 18, mobile: 14 },
  },
  sidebar: {
    width: { desktop: 320, tablet: 280, mobile: 240 },
  },
  table: {
    text: { desktop: 14, tablet: 13, mobile: 11 },
  },
  navigation: {
    height: { desktop: 56, tablet: 48, mobile: 42 },
  },
  input: {
    height: { desktop: 48, tablet: 42, mobile: 36 },
    fontSize: { desktop: 15, tablet: 14, mobile: 12 },
  },
  modal: {
    maxWidth: { desktop: 720, tablet: 600, mobile: '100%' },
    padding: { desktop: 28, tablet: 22, mobile: 16 },
  },
  spacing: {
    gap: { desktop: 24, tablet: 18, mobile: 12 },
    padding: { desktop: 24, tablet: 18, mobile: 12 },
  },
} as const;

export function getDeviceCategory(width: number): 'desktop' | 'tablet' | 'mobile' {
  if (width >= BREAKPOINTS.lg) return 'desktop';
  if (width >= BREAKPOINTS.md) return 'tablet';
  return 'mobile';
}
