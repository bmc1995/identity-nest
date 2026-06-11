import * as React from 'react';

/** Removable input chip — scopes, redirect URIs, allowed origins. */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** When provided, renders a remove (×) button and calls this on click. */
  onRemove?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

export function Tag(props: TagProps): JSX.Element;
