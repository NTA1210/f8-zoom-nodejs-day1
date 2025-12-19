import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`);
        const data = await res.json();
        setTodos(data.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    try {
      if (!value.trim()) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: value }),
      });
      const data = await res.json();
      console.log(data);

      setTodos([...todos, data.data]);
      setValue("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckComplete = async (id) => {
    try {
      const todo = todos.find((todo) => todo.id === id);
      todo.isCompleted = !todo.isCompleted;

      setTodos([...todos]);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: todo.title,
            isCompleted: todo.isCompleted,
          }),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const agree = window.confirm(
        "Are you sure you want to delete this task?"
      );
      if (agree) {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
          {
            method: "DELETE",
          }
        );
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`
      );
      const data = await res.json();
      setTodo(data.data);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[300px] h-[400px] border rounded-md shadow-lg">
        <header className="text-2xl font-semibold text-center p-2">
          Todo App
        </header>
        <div className="flex items-center justify-center px-2 gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border outline-none flex-1 rounded-4xl"
            placeholder="Add a new task..."
          />
          <button
            className=" bg-green-500 rounded-full p-2 text-lg hover:bg-green-600 hover:cursor-pointer"
            onClick={handleAddTodo}
          >
            Add
          </button>
        </div>

        <ul className="p-2 h-[300px] overflow-y-auto bg-amber-300 px-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="p-2 border-b last:border-0 flex justify-between items-center"
            >
              <div className=" flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={(e) => handleCheckComplete(todo.id)}
                />
                <span className={todo.isCompleted ? "line-through" : ""}>
                  {todo.title}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className="hover:cursor-pointer"
                  onClick={() => handleViewDetail(todo.id)}
                >
                  view
                </span>
                <span
                  className="text-red-500 hover:cursor-pointer"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  X
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-400/55">
          <div className="p-3 border rounded-md relative bg-white w-[200px]">
            <h3 className="">{todo?.title}</h3>
            <p>ID: {todo?.id}</p>
            <p>Completed: {todo?.isCompleted ? "Yes" : "No"}</p>
            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 hover:cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                setTodo(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
