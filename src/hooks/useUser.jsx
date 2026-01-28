import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the current user on mount
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        console.error("Error fetching user:", error);
      } else if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || "",
          role: data.user.user_metadata?.role || "",
        });
      }
    });

    // Subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || "",
          role: session.user.user_metadata?.role || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return user;
}
