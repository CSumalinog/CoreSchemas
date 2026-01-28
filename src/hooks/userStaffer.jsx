import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

export default function useStaffer() {
  const [staffer, setStaffer] = useState(null);

  useEffect(() => {
    const fetchStaffer = async () => {
      const { data: { user } } = await supabase.auth.getUser(); // get current user
      if (!user) return;

      const { data, error } = await supabase
        .from("staffers")
        .select("*")
        .eq("email", user.email)
        .single();

      if (!error) setStaffer(data);
    };

    fetchStaffer();
  }, []);

  return staffer; // will include full_name, email, role, etc.
}
