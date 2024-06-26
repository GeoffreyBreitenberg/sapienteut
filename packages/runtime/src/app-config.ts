import type React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppConfig {}

const APP_CONFIG_SYMBOL = 'config';
export const getConfig = (
  Component: React.ComponentType<any>,
): AppConfig | undefined =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  Component[APP_CONFIG_SYMBOL];

export const defineConfig = (
  Component: React.ComponentType<any>,
  config: AppConfig,
): React.ComponentType<any> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  Component[APP_CONFIG_SYMBOL] = config;
  return Component;
};
