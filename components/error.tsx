import { capitalize } from 'lodash';

import { cn } from '@/lib/utils';

import { ErrorCloud } from './icons/error-cloud';

export const Error: React.FC<{ title?: string; description?: string; className?: string }> = ({
  title,
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center text-red-500 text-center',
        className,
      )}
    >
      <ErrorCloud />
      {title && <span className="mt-2 font-semibold">{capitalize(title)}</span>}
      {description && <span className="text-xs">{description}</span>}
    </div>
  );
};
