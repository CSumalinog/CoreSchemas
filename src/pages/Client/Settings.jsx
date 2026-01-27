import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import ConfirmDialog from "../../components/client/DeleteConfimation";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error(error);
      else setUser(data.user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      // Optional: call backend function to delete user data
      await supabase.auth.admin.deleteUser(user.id); // requires supabase admin role
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (!user) return <div className="text-red-500">No user info found.</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex justify-center">
      <div className="w-full">
        {/* Account Info Card */}
        <div className="bg-white shadow-md rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4 text-gray-700">
            {/* Left column: Setting names */}
            <div className="font-medium col-span-1 space-y-4">
              <h2 className="text-xl font-semibold mb-4">
                Account Information
              </h2>
            </div>

            {/* Right column: Values / actions */}
            <div className="col-span-2 space-y-4">
              <p>
                <span className="text-gray-500 font-semibold">Email:</span>{" "}
                {user.email}
              </p>
              <p>
                <span className="text-gray-500 font-semibold">User ID:</span>{" "}
                {user.id}
              </p>

              <div>
                <p className="text-red-600 font-semibold mb-2">Danger Zone</p>

                <hr className="h-px border-0 bg-red-600 mb-4" />

                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Deleting your account is permanent and all your data will be
                    lost.
                  </p>

                  <button
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 whitespace-nowrap"
                    onClick={() => setConfirmOpen(true)}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Dialog */}
        <ConfirmDialog
          open={confirmOpen}
          title="Delete Account?"
          description="Are you sure you want to delete your account? This action cannot be undone."
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleDeleteAccount}
        />
      </div>
    </div>
  );
}
