export default function Alert({ text }) {
  return (
    <div className="p-4 my-3 bg-red-100 rounded-md">
      <div className="text-sm leading-5 text-red-700">{text}</div>
    </div>
  );
}
