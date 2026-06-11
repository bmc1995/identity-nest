import * as React from 'react';

/** Checkbox with optional label + description and indeterminate state. */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Renders the dash (mixed) glyph. */
  indeterminate?: boolean;
}

export function Checkbox(props: CheckboxProps): JSX.Element;
