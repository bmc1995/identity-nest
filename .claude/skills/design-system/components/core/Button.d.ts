import * as React from 'react';

/**
 * Primary action button. Calm, confident; primary carries a soft clay glow.
 * @startingPoint section="Core" subtitle="The action button — 4 variants, 3 sizes" viewport="700x200"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Control height. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Use JetBrains Mono label (for CLI-style CTAs like "$ npm i idnest"). */
  mono?: boolean;
  /** Stretch to container width. */
  fullWidth?: boolean;
  /** Icon node rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Icon node rendered after the label. */
  iconRight?: React.ReactNode;
  /** Show a spinner and disable interaction. */
  loading?: boolean;
  /** Render as <a> instead of <button>. */
  as?: 'button' | 'a';
  /** Href when as="a". */
  href?: string;
}

export function Button(props: ButtonProps): JSX.Element;
