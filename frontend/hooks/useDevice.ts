/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useDevice as useDeviceContext } from '../context/DeviceContext';

export const useDevice = () => {
  return useDeviceContext();
};
