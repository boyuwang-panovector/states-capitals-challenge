declare module "react-simple-maps" {
  import { ComponentType, ReactNode } from "react";

  export const ComposableMap: ComponentType<Record<string, unknown>>;
  export const Geographies: ComponentType<Record<string, unknown> & { children: (value: { geographies: unknown[] }) => ReactNode }>;
  export const Geography: ComponentType<Record<string, unknown>>;
}
