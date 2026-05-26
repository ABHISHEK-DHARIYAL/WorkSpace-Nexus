/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DeviceProvider } from '../context/DeviceContext';

export const ViewportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <DeviceProvider>{children}</DeviceProvider>;
};
