import * as React from 'react';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Optional trailing count pill. */
  count?: number;
}

/** Horizontal tab bar (underline or pill). Controlled via value/onChange, else uncontrolled. */
export interface TabsProps {
  /** Tab items, or plain strings used as both id and label. */
  tabs: (TabItem | string)[];
  /** Controlled active id. */
  value?: string;
  onChange?: (id: string) => void;
  /** @default "underline" */
  variant?: 'underline' | 'pill';
  className?: string;
}
export function Tabs(props: TabsProps): JSX.Element;
