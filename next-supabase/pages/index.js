import { supabase } from "../lib/initSupabase";
import { Auth } from "@supabase/ui";
import BillList from "../components/BillList";

export default function IndexPage() {
  const { user } = Auth.useUser();

  return (
    <div className="w-full h-full shadow-2xl bg-gradient-to-br from-blue-200 to-purple-400">
      {!user ? (
        <div className="grid items-center justify-center w-full h-full p-4">
          <Auth
            supabaseClient={supabase}
            providers={["google", "github"]}
            socialLayout="horizontal"
            socialButtonSize="xlarge"
            className=""
          />
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center w-full h-full p-4"
          style={{ minWidth: 250, maxWidth: 600, margin: "auto" }}
        >
          <BillList user={supabase.auth.user()} />
          <button
            className="w-full mt-12 btn-black"
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) console.log("Error logging out:", error.message);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
