import * as React from 'react';

/**
 * Text field with label, hint, error, affixes. Set `multiline` for a textarea.
 * @startingPoint section="Forms" subtitle="Labeled text field with hint, error & affixes" viewport="700x220"
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Field label rendered above the control. */
  label?: string;
  /** Helper text below the control. */
  hint?: string;
  /** Error message — turns the field red and replaces the hint. */
  error?: React.ReactNode;
  /** Show a required asterisk. */
  required?: boolean;
  /** Leading icon/affix (16px). */
  prefix?: React.ReactNode;
  /** Trailing icon/affix (16px). */
  suffix?: React.ReactNode;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Render value in JetBrains Mono (IDs, secrets, URIs). */
  mono?: boolean;
  /** Render a <textarea> instead of <input>. */
  multiline?: boolean;
}

export function Input(props: InputProps): JSX.Element;
