import { Loader } from '@/components/Loader';
import { TodoItem } from '@/components/TodoItem';
import { NextPage } from 'next';
import useSWR from 'swr';
import { api } from '@/utils/api';
import { AddTodo } from '@/pages/components/AddTodo';
import { toast } from 'react-hot-toast';
import { generateUniqueId } from '@/utils/id';
import { useState } from 'react';

const Home: NextPage = () => {
  const { data, mutate, isLoading } = useSWR('/api/todos', api.fetchTodoList);
  const todos = data ?? [];

  const [todoToAddTitle, setTodoToAddTitle] = useState('');

  const handleAdd = async () => {
    setTodoToAddTitle('');
    return mutate(
      async () => {
        try {
          const createdTodo = await api.createTodo(todoToAddTitle, {
            shouldFail: false,
          });
          toast.success('Success!');
          return [
            ...todos,
            ...(createdTodo !== undefined ? [createdTodo] : []),
          ];
        } catch (e) {
          toast.error('Error!');
          throw e;
        }
      },
      {
        optimisticData: [
          ...todos,
          {
            id: generateUniqueId(),
            title: todoToAddTitle,
            complete: false,
          },
        ],
        revalidate: true,
        populateCache: false,
        throwOnError: false,
      },
    );
  };

  const handleComplete = async (params: { id: number; complete: boolean }) => {
    const { id, complete } = params;
    return mutate(
      async () => {
        try {
          const updatedTodo = await api.updateTodo(
            { id, complete },
            {
              shouldFail: false,
            },
          );
          toast.success('Success!');
          return todos.map(todo => (todo.id === id ? updatedTodo : todo));
        } catch (e) {
          toast.error('Error!');
          throw e;
        }
      },
      {
        optimisticData: todos.map(todo =>
          todo.id === id ? { ...todo, complete: params.complete } : todo,
        ),
        revalidate: true,
        populateCache: false,
        throwOnError: false,
      },
    );
  };

  const handleDelete = async (id: number) => {
    return mutate(
      async () => {
        try {
          await api.deleteTodo(id, {
            shouldFail: false,
          });
          toast.success('Success!');
          return todos.filter(todo => todo.id !== id);
        } catch (e) {
          toast.error('Error!');
          throw e;
        }
      },
      {
        optimisticData: todos.filter(todo => todo.id !== id),
        revalidate: true,
        populateCache: false,
        throwOnError: false,
      },
    );
  };

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">TODO</h1>
      <AddTodo
        value={todoToAddTitle}
        onChange={setTodoToAddTitle}
        onAdd={handleAdd}
      />
      <section className="mt-4">
        <h2 className="text-2xl font-bold">List</h2>
        <div className="mt-2">
          {isLoading ? (
            <Loader className="text-gray-700" />
          ) : (
            <ul className="mt-2 flex flex-col items-start gap-1">
              {todos.map(todo => (
                <li key={todo.id}>
                  <TodoItem
                    id={todo.id}
                    title={todo.title}
                    complete={todo.complete}
                    onUpdateComplete={complete =>
                      handleComplete({ id: todo.id, complete })
                    }
                    onDelete={() => handleDelete(todo.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
