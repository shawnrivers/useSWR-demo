import { Loader } from '@/components/Loader';
import { api } from '@/utils/api';
import clsx from 'clsx';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const TodoDetails: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  const [title, setTitle] = useState('');
  const [complete, setComplete] = useState(false);

  const { data, isLoading, mutate } = useSWR(`/api/todo/${id}`, () =>
    api.fetchTodo(id),
  );

  // The Traditional Way
  // 1. Make the PATCH API
  // 2. [Revalidate cache] Make the GET API, update the cache using GET's response
  // const handleSave = async () => {
  //   await api
  //     .updateTodo({ id, title, complete }, { shouldFail: false })
  //     .then(() => {
  //       toast.success('Success!');
  //     })
  //     .catch(() => {
  //       toast.error('Error!');
  //     });
  //   mutate();
  // };

  // Populate Cache
  // 1. Make the PATCH API
  // 2. [Populate cache] Update the cache using PATCH's response
  // 3. [Revalidate cache] Make the GET API, update the cache using GET's response
  // const handleSave = async () => {
  //   return mutate(
  //     () =>
  //       api
  //         .updateTodo({ id, title, complete }, { shouldFail: false })
  //         .then(todo => {
  //           toast.success('Success!');
  //           return todo;
  //         })
  //         .catch(e => {
  //           toast.error('Error!');
  //           throw e;
  //         }),
  //     {
  //       revalidate: true,
  //       populateCache: true,
  //       throwOnError: false,
  //     },
  //   );
  // };

  // Optimistic Data
  // 1. [Optimistic update] Update the cache using `optimisticData`
  // 2. Make the PATCH API
  // 3. [Revalidate cache] Make the GET API, update the cache using GET's response
  // const handleSave = async () => {
  //   return mutate(
  //     () =>
  //       api
  //         .updateTodo({ id, title, complete }, { shouldFail: false })
  //         .then(todo => {
  //           toast.success('Success!');
  //           return todo;
  //         })
  //         .catch(e => {
  //           toast.error('Error!');
  //           throw e;
  //         }),
  //     {
  //       optimisticData: { id, title, complete },
  //       revalidate: true,
  //       populateCache: false,
  //       throwOnError: false,
  //     },
  //   );
  // };

  // Optimistic data (useSWRMutation version)
  const { trigger } = useSWRMutation(
    `/api/todo/${id}`,
    async (key, { arg }: { arg: { title: string; complete: boolean } }) =>
      api
        .updateTodo(
          { id, title: arg.title, complete: arg.complete },
          { shouldFail: false },
        )
        .then(todo => {
          toast.success('Success!');
          return todo;
        })
        .catch(e => {
          toast.error('Error!');
          throw e;
        }),
  );
  const handleSave = async () => {
    return trigger(
      { title, complete },
      {
        optimisticData: { id, title, complete },
        revalidate: true,
        populateCache: false,
        throwOnError: false,
      },
    );
  };

  return (
    <main className="p-8">
      <div className="mb-4">
        <Link href="/" aria-label="Back">
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
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
      </div>
      <h1 className="mb-4 text-4xl font-bold">Edit TODO</h1>
      {data && (
        <div className="flex gap-8">
          <div className="min-w-[16rem] rounded-lg bg-gray-100 p-4">
            <h2 className="text-2xl font-bold">Data</h2>
            <div className="mt-4 flex flex-col items-start gap-4">
              <div className="block space-y-2">
                <div className="text-lg font-bold">Title</div>
                <div className="rounded-l py-2">{data.title}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">Complete</span>
                <div className="relative flex">
                  <div
                    className={clsx(
                      'h-6 w-6 appearance-none rounded-full border-[1.5px] border-gray-400',
                      data.complete && 'bg-gray-400',
                    )}
                  >
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className={clsx(
                          'h-4 w-4',
                          data.complete ? 'text-white/100' : 'text-white/0',
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
                </div>
              </div>
            </div>
          </div>
          <div className="border-l-2" />
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSave();
            }}
            className="min-w-[16rem] rounded-lg bg-gray-100 p-4"
          >
            <h2 className="text-2xl font-bold">Editor</h2>
            <div className="mt-4 flex flex-col items-start gap-4">
              <label className="block space-y-2">
                <div className="text-lg font-bold">Title</div>
                <input
                  className="inline-block rounded-lg border border-gray-300 p-2"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </label>
              <label className="flex items-center gap-2">
                <span className="text-lg font-bold">Complete</span>
                <div className="relative flex">
                  <input
                    className={clsx(
                      'h-6 w-6 cursor-pointer appearance-none rounded-full border-[1.5px] border-gray-400',
                      complete && 'bg-gray-400',
                    )}
                    type="checkbox"
                    checked={complete}
                    onChange={e => setComplete(e.target.checked)}
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
              </label>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <button
                disabled={title === ''}
                className="inline-flex items-center gap-2 rounded-lg border bg-gray-700 py-2 px-4 text-gray-100 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
      {isLoading && <Loader />}
    </main>
  );
};

export default TodoDetails;

export const getServerSideProps = (async ({ params }) => {
  if (params == undefined || typeof params.id != 'string') {
    return {
      props: {
        id: 0,
      },
    };
  }

  return { props: { id: parseInt(params.id, 10) } };
}) satisfies GetServerSideProps;
