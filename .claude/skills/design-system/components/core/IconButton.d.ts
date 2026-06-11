import * as React from 'react';

/** Square icon-only button. Always pass `label` for accessibility. */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default "ghost" */
  variant?: 'ghost' | 'solid' | 'accent';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label (sets aria-label + title). Required. */
  label: string;
  /** The icon node (18px SVG recommended). */
  children?: React.ReactNode;
}

export function IconButton(props: IconButtonProps): JSX.Element;
