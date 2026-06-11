import * as React from 'react';

/** User/org avatar — image or auto-colored initials, optional status dot. */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Full name — used for initials and deterministic color. */
  name?: string;
  /** Image URL; falls back to initials. */
  src?: string;
  /** @default "md" */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Fully round instead of squircle. */
  round?: boolean;
  /** Presence dot. */
  status?: 'online' | 'away' | 'offline';
}

export function Avatar(props: AvatarProps): JSX.Element;
