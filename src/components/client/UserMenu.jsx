import { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { supabase } from "../../lib/supabase";

export default function UserMenu({ collapsed }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserName(user.user_metadata?.full_name || user.email);
      }
    };
    getUser();
  }, []);

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 cursor-pointer"
      style={{ justifyContent: collapsed ? "center" : "flex-start" }}
    >
      <AccountCircleIcon className="text-gray-700" fontSize="medium" />

      {!collapsed && (
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 150, // adjust according to drawer
            display: "inline-block",
            verticalAlign: "middle",
          }}
        >
          {userName || "Account"}
        </span>
      )}
    </div>
  );
}
