/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useContext } from 'react';
import { ScaleContext, ScaleContextType } from '../providers/ScaleProvider';

export const useScale = (): ScaleContextType & {
  scalePx: (baseValue: number, minVal?: number, maxVal?: number) => number;
} => {
  const context = useContext(ScaleContext);
  if (!context) {
    throw new Error('useScale must be used inside a ScaleProvider');
  }

  const scalePx = (baseValue: number, minVal?: number, maxVal?: number): number => {
    let scaled = baseValue * context.scaleFactor;
    if (minVal !== undefined) scaled = Math.max(minVal, scaled);
    if (maxVal !== undefined) scaled = Math.min(maxVal, scaled);
    return Math.round(scaled);
  };

  return {
    ...context,
    scalePx,
  };
};
