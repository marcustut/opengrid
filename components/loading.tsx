import { Loading as LoadingIcon } from '@/components/icons/loading';
import { cn } from '@/lib/utils';

export const Loading: React.FC<{ description: string; className?: string }> = ({
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center space-y-2 text-stone-300',
        className,
      )}
    >
      <LoadingIcon className="animate-spin" />
      <span className="text-sm">{description}</span>
    </div>
  );
};