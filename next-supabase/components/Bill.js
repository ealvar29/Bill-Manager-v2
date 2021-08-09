import { supabase } from "../lib/initSupabase";
import { useState } from "react";
import moment from "../node_modules/moment";

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
    <>
      <tr className="text-sm text-center text-gray-600 bg-gray-100 border-b">
        <td className="p-2 border-r">{expense.billname}</td>
        <td className="p-2 border-r">{expense.cost}</td>
        <td className="p-2 border-r">
          {moment(expense.due_date).format("MMMM / Do / YYYY")}
        </td>
        <td className="p-2 border-r">{expense.type}</td>
        <td className="p-2 border-r">
          <input
            className="cursor-pointer"
            onChange={(e) => toggle()}
            type="checkbox"
            checked={isCompleted ? true : ""}
          />
        </td>
        <td className="p-2 border-r">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle();
              onDelete();
            }}
            className="p-2 text-xs font-thin text-white bg-red-500 hover:shadow-lg"
          >
            Remove
          </button>
        </td>
      </tr>
    </>
  );
}
