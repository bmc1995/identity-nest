import * as React from 'react';

export type SelectOption = string | { value: string; label: string };

/** Native select styled to match Input, with label/hint/error. */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: React.ReactNode;
  required?: boolean;
  /** @default "md" */
  size?: 'sm' | 'md';
  /** Options as strings or {value,label}. Omit to pass <option> children. */
  options?: SelectOption[];
  /** Disabled placeholder shown first. */
  placeholder?: string;
}

export function Select(props: SelectProps): JSX.Element;
