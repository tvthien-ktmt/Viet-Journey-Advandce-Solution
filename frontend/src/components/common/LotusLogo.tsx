import * as React from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils';

export function LotusLogo({
  className,
  size = 40,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) {
  const uid = useId().replace(/:/g, '');
  const idGold = `vna-gold-${uid}`;
  const idPetal = `vna-petal-${uid}`;

  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      role="img"
      aria-label="Vietnam Airlines lotus logo"
      className={cn('inline-block', className)}
      {...props}
    >
      <defs>
        <linearGradient id={idGold} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5a623" />
          <stop offset="55%" stopColor="#f5a623" />
          <stop offset="100%" stopColor="#d4891a" />
        </linearGradient>
        <linearGradient id={idPetal} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd66b" />
          <stop offset="50%" stopColor="#f5a623" />
          <stop offset="100%" stopColor="#d4891a" />
        </linearGradient>
      </defs>
      <g fill={`url(#${idGold})`} stroke="#b9700a" strokeWidth="0.6" opacity="0.95">
        <g transform="rotate(-58 40 44)">
          <path d="M40 10 C46 24, 46 38, 40 50 C34 38, 34 24, 40 10 Z" />
        </g>
        <g transform="rotate(58 40 44)">
          <path d="M40 10 C46 24, 46 38, 40 50 C34 38, 34 24, 40 10 Z" />
        </g>
      </g>
      <g fill={`url(#${idPetal})`} stroke="#a86608" strokeWidth="0.5">
        <g transform="rotate(-26 40 44)">
          <path d="M40 8 C45 22, 45 38, 40 52 C35 38, 35 22, 40 8 Z" />
        </g>
        <g transform="rotate(26 40 44)">
          <path d="M40 8 C45 22, 45 38, 40 52 C35 38, 35 22, 40 8 Z" />
        </g>
      </g>
      <g fill={`url(#${idPetal})`} stroke="#a86608" strokeWidth="0.5">
        <path d="M40 6 C45 22, 45 40, 40 56 C35 40, 35 22, 40 6 Z" />
      </g>
      <path
        d="M6 58 C20 50, 32 56, 40 56 C48 56, 60 50, 74 58 C66 66, 54 70, 40 70 C26 70, 14 66, 6 58 Z"
        fill="#023a78"
        opacity="0.95"
      />
      <path
        d="M6 58 C20 50, 32 56, 40 56 C48 56, 60 50, 74 58"
        fill="none"
        stroke="#1f6fb2"
        strokeWidth="1.2"
      />
      <circle cx="40" cy="10" r="2.2" fill="#ffd27a" />
    </svg>
  );
}

export function LotusMark({
  className,
  size = 28,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return <LotusLogo size={size} className={className} {...props} />;
}
