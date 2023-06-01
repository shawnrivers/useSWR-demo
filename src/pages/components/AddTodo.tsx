type AddTodoProps = {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
};

export const AddTodo: React.FC<AddTodoProps> = ({ value, onChange, onAdd }) => {
  return (
    <form
      className="mt-4 flex items-center gap-2"
      onSubmit={async e => {
        e.preventDefault();
        onAdd();
      }}
    >
      <input
        className="inline-block rounded-lg border border-gray-300 p-2"
        aria-label="Todo name"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button className="inline-flex items-center gap-2 rounded-lg border bg-gray-700 p-2 text-gray-100">
        ADD TODO
      </button>
    </form>
  );
};
