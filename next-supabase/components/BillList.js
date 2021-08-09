import { InputNumber } from "@supabase/ui";
import { useState, useEffect } from "react";
import { Input } from "@supabase/ui";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { supabase } from "../lib/initSupabase";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import Alert from "./Alert";
import Bill from "./Bill";
import { IconTag, Select } from "@supabase/ui";

export default function BillList({ user }) {
  const [todo, setTodos] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [errorText, setError] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [newBillName, setNewBillName] = useState("");
  const [cost, setCost] = useState("0");
  const [bills, setBills] = useState([]);
  const [type, setType] = useState("");

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
        due_date: dueDate,
        type: type,
        user_id: supabase.auth.user().id,
      })
      .single()
      .then(({ data, error }) => {
        console.log(data, error);
        if (!error) {
          setBills((prevBills) => [...prevBills, data]);
        }
      });

    setNewBillName("");
    setCost(0);
    setDueDate("");
    setType("");
  };

  return (
    <div className="w-full">
      <h1 className="mb-12">Budget App v2.0</h1>
      <div className="grid mx-auto bg-white rounded shadow my-9 w-96">
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
            className="w-full px-3 py-5 font-bold rounded text-grey-darker"
            label="Input Amount"
            max={1000000}
            value={cost}
            onChange={(e) => {
              setError("");
              setCost(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <Input
            className="w-full px-3 py-3 font-bold text-grey-darker"
            label="Due Date"
            type="date"
            value={dueDate || new Date()}
            onChange={(e) => {
              setError("");
              setDueDate(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <Select
            label="Select label"
            className="w-full px-3 py-3 font-bold text-grey-darker"
            onChange={(e) => {
              setError("");
              setType(e.target.value);
            }}
            icon={<IconTag />}
          >
            <Select.Option value="Subscriptions">Subscriptions</Select.Option>
            <Select.Option value="Utilities">Utilities</Select.Option>
            <Select.Option value="Phone">Phone</Select.Option>
            <Select.Option value="Rent">Rent</Select.Option>
            <Select.Option value="Internet">Internet</Select.Option>
            <Select.Option value="Auto">Auto</Select.Option>
            <Select.Option value="Credit Card">Credit Card</Select.Option>
            <Select.Option value="Gas">Gas</Select.Option>
            <Select.Option value="Shopping">Shopping</Select.Option>
            <Select.Option value="Misc.">Misc.</Select.Option>
          </Select>
        </div>
        <div>
          <button className="w-1/4 bg-blue-500 rounded " onClick={onSubmit}>
            Add
          </button>
        </div>
      </div>
      {!!errorText && <Alert text={errorText} />}
      <div className="overflow-hidden bg-white rounded-md shadow">
        <table className="w-full border table-fixed">
          <thead>
            <tr className="bg-gray-200 border-b">
              <th className="w-1/4 p-2 text-sm font-thin text-gray-500 border-r cursor-pointer">
                Expense Name
              </th>
              <th className="w-1/4 p-2 text-sm font-thin text-gray-500 border-r cursor-pointer">
                Amount
              </th>
              <th className="w-1/4 p-2 text-sm font-thin text-gray-500 border-r cursor-pointer">
                Due Date
              </th>
              <th className="w-1/4 p-2 text-sm font-thin text-gray-500 border-r cursor-pointer">
                Type of Expense
              </th>
              <th className="w-1/4 p-2 text-sm font-thin text-gray-500 border-r cursor-pointer">
                Completed
              </th>
              <th className="w-1/4 p-2 text-sm font-thin text-gray-500 border-r cursor-pointer">
                Remove Bill
              </th>
            </tr>
          </thead>
          <tbody>
            {bills.map((expense) => (
              <Bill
                key={expense.id}
                expense={expense}
                onDelete={() => deleteTodo(expense.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
