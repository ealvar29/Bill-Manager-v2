import { supabase } from "../lib/initSupabase";
import { useState } from "react";

export default function Bill({ expense, onDelete }) {
  const [isCompleted, setIsCompleted] = useState(expense.is_complete);
  const toggle = async () => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .update({ is_complete: !isCompleted })
        .eq("id", expense.id)
        .single();
      if (error) {
        throw new Error(error);
      }
      setIsCompleted(data.is_complete);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <li
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
      className="block w-full transition duration-150 ease-in-out cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
    >
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="flex items-center flex-1 min-w-0">
          <div className="text-sm font-medium leading-5 truncate">
            {expense.billname}
          </div>
        </div>
        <div className="flex items-center flex-1 min-w-0">
          <div className="text-sm font-medium leading-5 truncate">
            {expense.cost}
          </div>
        </div>
        <div>
          <input
            className="cursor-pointer"
            onChange={(e) => toggle()}
            type="checkbox"
            checked={isCompleted ? true : ""}
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className="w-4 h-4 ml-2 border-2 rounded hover:border-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="gray"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}
