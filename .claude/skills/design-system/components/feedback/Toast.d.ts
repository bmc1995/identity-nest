import * as React from 'react';

/** Single toast notification. Wrap stacked toasts in <ToastRail>. */
export interface ToastProps {
  /** @default "info" */
  tone?: 'success' | 'danger' | 'warning' | 'info';
  title?: React.ReactNode;
  children?: React.ReactNode;
  onClose?: () => void;
}
export function Toast(props: ToastProps): JSX.Element;

/** Fixed bottom-right stack container for toasts. */
export interface ToastRailProps { children?: React.ReactNode; }
export function ToastRail(props: ToastRailProps): JSX.Element;
