// Minimal shims so TS can typecheck without local node_modules.
// This repo can run via importmap/CDN, but the TS server still needs module declarations.

declare namespace React {
  export type ReactNode = any;
  export type FC<P = {}> = (props: P) => any;

  export type SetStateAction<S> = S | ((prev: S) => S);
  export type Dispatch<A> = (value: A) => void;

  export interface MouseEvent<T = any> {
    stopPropagation(): void;
    currentTarget: T;
  }
}

declare module 'react' {
  export type ReactNode = React.ReactNode;
  export type FC<P = {}> = React.FC<P>;
  export type SetStateAction<S> = React.SetStateAction<S>;
  export type Dispatch<A> = React.Dispatch<A>;
  export interface MouseEvent<T = any> extends React.MouseEvent<T> {}

  export const StrictMode: any;

  export function useState<S>(
    initialState: S | (() => S)
  ): [S, Dispatch<SetStateAction<S>>];

  export function useEffect(
    effect: () => void | (() => void),
    deps?: any[]
  ): void;

  export function useMemo<T>(factory: () => T, deps: any[]): T;

  const ReactDefault: any;
  export default ReactDefault;
}

declare module 'react-dom/client' {
  export const createRoot: any;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react/jsx-dev-runtime' {
  export const jsxDEV: any;
  export const Fragment: any;
}

