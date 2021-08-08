import { InputNumber } from "@supabase/ui";
import { useState, useEffect } from "react";
import { Input } from "@supabase/ui";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { supabase } from "../lib/initSupabase";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import Alert from "./Alert";
import Bill from "./Bill";

export default function BillList({ user }) {
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
      <h1 className="mb-12">Budget App v2.0</h1>
      <div className="grid gap-2 my-2 border">
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
        <button className="btn-black" onClick={onSubmit}>
          Add
        </button>
      </div>
      {!!errorText && <Alert text={errorText} />}
      <div className="overflow-hidden bg-white rounded-md shadow">
        <ul>
          {bills.map((expense) => (
            <Bill
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
