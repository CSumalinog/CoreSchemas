import { useEffect, useState } from "react";
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

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  };

  return (
    <div
      className={`flex items-center gap-2 py-1 cursor-pointer ${
        collapsed ? "justify-center" : "justify-start"
      }`}
    >
      {/* Initials Avatar at sidebar start */}
      <span
        className="flex items-center justify-center rounded-full bg-yellow-400 text-black font-medium"
        style={{
          width: 32,
          height: 32,
          fontSize: 16,
          minWidth: 32, // aligns with other icons
        }}
      >
        {getInitials(userName) || "?"}
      </span>

      {/* User name text, only when drawer expanded */}
      {!collapsed && (
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 150,
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
