import * as React from 'react';

/** CSS-only hover/focus tooltip wrapping a trigger element. */
export interface TooltipProps {
  /** Tooltip content. */
  label: React.ReactNode;
  /** @default "top" */
  placement?: 'top' | 'bottom';
  /** Render label in mono (for keys/values). */
  mono?: boolean;
  children: React.ReactNode;
}
export function Tooltip(props: TooltipProps): JSX.Element;
