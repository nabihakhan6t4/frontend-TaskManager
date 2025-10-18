import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTodo = () => {
    if (inputValue.trim() === "") return;
    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
    };
    setTodoList([...todoList, newTodo]);
    setInputValue("");
  };

  const handleDeleteTodo = (id) => {
    setTodoList(todoList.filter((todo) => todo.id !== id));
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
      {/* Input Field */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTodo}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          <HiMiniPlus size={20} />
        </button>
      </div>

      {/* Todo List */}
      <ul className="flex flex-col gap-2">
        {todoList.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-2 border rounded-lg"
          >
            <span>{todo.text}</span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              <HiOutlineTrash size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoListInput;
