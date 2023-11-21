'use client';

import type { DetailedHTMLProps, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const Gradient: React.FC<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = (
  props,
) => {
  return (
    <div
      {...props}
      style={{ filter: 'blur(72px)', ...props.style }}
      className={cn(
        "h-full bg-cover bg-center bg-[url('/gradient-light.png')] dark:bg-[url('/gradient-dark.png')]",
        props.className,
      )}
    />
  );
};

const Dotted: React.FC<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = (
  props,
) => {
  return (
    <div
      {...props}
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--dot-color)) 1px, transparent 0)`,
        backgroundSize: '24px 24px',
        ...props.style,
      }}
      className={cn('h-full', props.className)}
    />
  );
};

enum Type {
  Gradient = 'gradient',
  Dotted = 'dotted',
}

export const Background: React.FC<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { type: `${Type}` }
> = ({ type, ...props }) => {
  return (
    <div className={'fixed inset-0 -z-10'}>
      {type === Type.Gradient ? (
        <Gradient {...props} />
      ) : type === Type.Dotted ? (
        <Dotted {...props} />
      ) : null}
    </div>
  );
};
