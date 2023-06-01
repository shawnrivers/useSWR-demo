import clsx from 'clsx';
import Link from 'next/link';

type TodoItemProps = {
  id: number;
  title: string;
  complete: boolean;
  onUpdateComplete: (complete: boolean) => void;
  onDelete: () => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  complete,
  onUpdateComplete,
  onDelete,
}) => {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="flex items-center gap-2">
        <div className="relative flex">
          <input
            aria-label={`${complete ? 'Un-complete' : 'Complete'} ${title}`}
            className={clsx(
              'h-6 w-6 cursor-pointer appearance-none rounded-full border-[1.5px] border-gray-400',
              complete && 'bg-gray-400',
            )}
            type="checkbox"
            checked={complete}
            onChange={e => onUpdateComplete(e.target.checked)}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className={clsx(
                'h-4 w-4',
                complete ? 'text-white/100' : 'text-white/0',
              )}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
        </div>
        <span
          className={clsx(
            'inline-block px-2 py-1 text-lg',
            complete && 'line-through',
          )}
        >
          {title}
        </span>
        <Link aria-label="Edit" href={`/${id}`} className="text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </Link>
        <button
          aria-label="Delete"
          className="rounded bg-rose-400 text-white"
          onClick={onDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
