import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function ClientSettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------
  // Fetch current user info
  // ---------------------
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

        {loading ? (
          <div className="text-gray-500">Loading user info…</div>
        ) : !user ? (
          <div className="text-red-500">No user info found.</div>
        ) : (
          <div className="space-y-6 max-w-2xl">
            {/* Account Info */}
            <section className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Account Info</h2>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-medium">User ID:</span> {user.id}
                </div>
              </div>
            </section>

            {/* Password / Security */}
            <section className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Security</h2>
              <button
                onClick={() => alert("Change password functionality")}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
              >
                Change Password
              </button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
