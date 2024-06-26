import { useContext, Context } from '../context';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
declare module '@modern-js/runtime/server' {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  export function useContext(): Context;
}

export { useContext };
