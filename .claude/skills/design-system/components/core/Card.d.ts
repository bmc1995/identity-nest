import * as React from 'react';

/**
 * Surface container. Bare (padded) or with header/title/actions/footer chrome.
 * @startingPoint section="Core" subtitle="Surface container with optional header & footer" viewport="700x260"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header title (string → styled, or a node). Enables header chrome. */
  title?: React.ReactNode;
  /** Right-aligned header actions (buttons, menu). */
  actions?: React.ReactNode;
  /** Footer content (typically right-aligned buttons). */
  footer?: React.ReactNode;
  /** Pad the body when used bare (no chrome). @default true */
  padded?: boolean;
  /** Drop shadow. */
  shadow?: boolean;
  /** Hover lift + cursor (use for clickable cards). */
  interactive?: boolean;
  /** Clay accent border (highlight a recommended/active card). */
  accent?: boolean;
  children?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;
