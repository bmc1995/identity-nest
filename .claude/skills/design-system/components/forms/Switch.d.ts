import * as React from 'react';

/** Toggle switch for binary on/off settings. */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  /** @default "md" */
  size?: 'sm' | 'md';
}

export function Switch(props: SwitchProps): JSX.Element;
