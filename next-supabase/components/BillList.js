import { InputNumber } from "@supabase/ui";
import { useState, useEffect } from "react";
import { Input } from "@supabase/ui";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { supabase } from "../lib/initSupabase";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

// export default function Form() {
//   const [newBillName, setNewBillName] = useState("");
//   const [errorText, setError] = useState("");
//   const [cost, setCost] = useState("0");
//   const [dueDate, setDueDate] = useState(new Date());
//   const [bills, setBills] = useState([]);

//   const onSubmit = (event) => {
//     event.preventDefault();
//     if (newBillName === "") return;
//     supabase
//       .from("bills")
//       .insert({
//         billName: newBillName,
//         cost: cost,
//         due_date: dueDate,
//         bill_type: selectedType.name,
//         user_id: supabase.auth.user().id,
//       })
//       .single()
//       .then(({ data, error }) => {
//         console.log(data, error);
//         if (!error) {
//           setBills((prevBills) => [data, ...prevBills]);
//         }
//       });
//   };
//   return (
//     <div className="w-full bg-grey-500">
//       <div className="py-8 mx-auto">
//         <div className="mx-auto bg-white rounded shadow w-96">
//           <div className="px-8 py-4 mx-16 text-xl font-bold text-center text-black border-b border-grey-500">
//             Enter Bill
//           </div>
//           <form>
//             <div className="px-8 py-4">
//               <div className="mb-4">
//                 <Input
//                   className="w-full px-3 py-3 font-bold rounded text-grey-darker"
//                   label="Bill Name"
//                   value={newBillName || ""}
//                   onChange={(e) => {
//                     setError("");
//                     setNewBillName(e.target.value);
//                   }}
//                 />
//               </div>
//               <div className="mb-4">
//                 <InputNumber
//                   className="w-full px-3 py-5 font-bold border rounded text-grey-darker"
//                   label="Input Amount"
//                   max={1000000}
//                   value={cost || 0}
//                   onChange={(e) => {
//                     setError("");
//                     setCost(e.target.value);
//                   }}
//                 />
//               </div>
//               <div className="mb-4">
//                 <Input
//                   className="w-full px-3 py-3 font-bold text-grey-darker"
//                   label="Due Date"
//                   type="datetime-local"
//                   value={dueDate || new Date()}
//                   onChange={(e) => {
//                     setError("");
//                     setDueDate(e.target.value);
//                   }}
//                 />
//               </div>
//               <div className="mb-4">
//                 <div className="w-full px-3 py-3 font-bold text-grey-darker">
//                   <label>Bill Type</label>
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <button
//                   className="px-24 py-1 mx-16 mb-2 bg-blue-300 rounded-full"
//                   onClick={onSubmit}
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function Todos({ user }) {
  const [todo, setTodos] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [errorText, setError] = useState("");

  const [newBillName, setNewBillName] = useState("");
  const [cost, setCost] = useState("0");
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    let { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("id", true);
    console.log({ data });
    if (error) console.log("error", error);
    else setBills(data);
  };

  const addTodo = async (billText) => {
    let billname = billText.trim();
    if (billname.length) {
      let { data: todo, error } = await supabase
        .from("expenses")
        .insert({ billname, user_id: user.id })
        .single();
      if (error) setError(error.message);
      else setTodos([...todos, todo]);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await supabase.from("expenses").delete().eq("id", id);
      setBills(bills.filter((x) => x.id != id));
    } catch (error) {
      console.log("error", error);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (newBillName === "") return;
    await supabase
      .from("expenses")
      .insert({
        billname: newBillName,
        cost: cost,
        user_id: supabase.auth.user().id,
      })
      .single()
      .then(({ data, error }) => {
        console.log(data, error);
        if (!error) {
          setBills((prevBills) => [...prevBills, data]);
        }
      });
  };

  return (
    <div className="w-full">
      <h1 className="mb-12">Todo List.</h1>
      <div className="flex gap-2 my-2">
        <div className="mb-4">
          <Input
            className="w-full px-3 py-3 font-bold rounded text-grey-darker"
            label="Bill Name"
            value={newBillName || ""}
            onChange={(e) => {
              setError("");
              setNewBillName(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <InputNumber
            className="w-full px-3 py-5 font-bold border rounded text-grey-darker"
            label="Input Amount"
            max={1000000}
            value={cost}
            onChange={(e) => {
              setError("");
              setCost(e.target.value);
            }}
          />
        </div>
        <button className="btn-black" onClick={onSubmit}>
          Add
        </button>
      </div>
      {!!errorText && <Alert text={errorText} />}
      <div className="overflow-hidden bg-white rounded-md shadow">
        <ul>
          {bills.map((expense) => (
            <Todo
              key={expense.id}
              expense={expense}
              onDelete={() => deleteTodo(expense.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

const Todo = ({ expense, onDelete }) => {
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
};

const Alert = ({ text }) => (
  <div className="p-4 my-3 bg-red-100 rounded-md">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
);
