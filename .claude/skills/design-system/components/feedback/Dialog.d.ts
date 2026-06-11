import * as React from 'react';

/** Modal dialog with scrim, optional icon, title, description, body and footer actions. */
export interface DialogProps {
  /** @default true */
  open?: boolean;
  /** Called on scrim click or close button. */
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Leading icon node shown in a tinted square. */
  icon?: React.ReactNode;
  /** Icon tint. @default "accent" */
  tone?: 'accent' | 'danger';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Footer node — typically Buttons. */
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export function Dialog(props: DialogProps): JSX.Element | null;
