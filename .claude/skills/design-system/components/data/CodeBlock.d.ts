import * as React from 'react';

/** Code / terminal block with window chrome, language label, and copy button.
 * Pass plain text via `code`, or pre-highlighted JSX children using
 * <span className="tk|ts|tn|tc|tf|tp"> token classes. */
export interface CodeBlockProps {
  /** Filename or label shown in the title bar. */
  title?: string;
  /** Language tag shown at right (e.g. "bash", "json", "ts"). */
  language?: string;
  /** Terminal styling (darker, for shell sessions). */
  terminal?: boolean;
  /** Show traffic-light dots. @default true */
  showDots?: boolean;
  /** Raw code string (also used as copy payload). */
  code?: string;
  /** Highlighted JSX content; if a string, used as the copy payload. */
  children?: React.ReactNode;
  className?: string;
}
export function CodeBlock(props: CodeBlockProps): JSX.Element;
