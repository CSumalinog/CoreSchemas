
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase.js";
import { Person } from "@mui/icons-material";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalApproved: 0,
    totalDeclined: 0,
    totalCompleted: 0,
  });

  const [staffTasks, setStaffTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      // 1. Total requests
      const { count: totalRequests } = await supabase
        .from("requests")
        .select("*", { count: "exact" });

      // 2. Total approved
      const { count: totalApproved } = await supabase
        .from("requests")
        .select("*", { count: "exact" })
        .eq("status", "approved");

      // 3. Total declined
      const { count: totalDeclined } = await supabase
        .from("requests")
        .select("*", { count: "exact" })
        .eq("status", "declined");

      // 4. Total completed tasks
      const { count: totalCompleted } = await supabase
        .from("tasks")
        .select("*", { count: "exact" })
        .eq("status", "completed");

      setStats({ totalRequests, totalApproved, totalDeclined, totalCompleted });

      // 5. Staff task distribution
      // Fetch all staffers from users table where role = 'staff'
      const { data: staffers, error: staffError } = await supabase
        .from("users")
        .select("id, full_name, role")
        .eq("role", "staff");

      if (staffError) throw staffError;

      // Fetch tasks count for each staffer
      const staffTasksWithCounts = await Promise.all(
        staffers.map(async (staff) => {
          const { count: taskCount } = await supabase
            .from("tasks")
            .select("*", { count: "exact" })
            .eq("assigned_to", staff.id);

          return {
            id: staff.id,
            name: staff.full_name,
            position: staff.role,
            tasks: taskCount || 0,
          };
        })
      );

      // Sort alphabetically
      staffTasksWithCounts.sort((a, b) => a.name.localeCompare(b.name));
      setStaffTasks(staffTasksWithCounts);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-600">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Top Stats Cards */}
      <div className="flex flex-wrap gap-4">
        <div className="bg-white shadow rounded p-6 flex-1 min-w-50">
          <h3 className="text-gray-500 text-md">Total no. of Requests</h3>
          <p className="text-3xl font-bold">{stats.totalRequests}</p>
        </div>
        <div className="bg-white shadow rounded p-6 flex-1 min-w-50">
          <h3 className="text-neutral-500 text-md">Total no. of Approved Requests</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalApproved}</p>
        </div>
        <div className="bg-white shadow rounded p-6 flex-1 min-w-50">
          <h3 className="text-neutral-500 text-md">Total no. of Declined Requests</h3>
          <p className="text-3xl font-bold text-red-600">{stats.totalDeclined}</p>
        </div>
        <div className="bg-white shadow rounded p-6 flex-1 min-w-50">
          <h3 className="text-neutral-500 text-md">Total no. of Completed Tasks</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalCompleted}</p>
        </div>
      </div>

      {/* Task Distribution Table */}
      <div className="bg-white shadow rounded p-6 w-full">
        <h3 className="text-gray-700 font-semibold mb-4">Task Distribution</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="w-3/4 p-3 text-neutral-500 text-md">Staffer</th>
                <th className="w-1/4 p-3 text-neutral-500 text-md">No. of Coverage Catered</th>
              </tr>
            </thead> 
            <tbody>
              {staffTasks.map((staff) => (
                <tr key={staff.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 flex items-center space-x-3"> 
                    <Person className="text-gray-400" />
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-gray-500 text-sm">{staff.position}</p>
                    </div>
                  </td>
                  <td className="p-3 font-bold">{staff.tasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
