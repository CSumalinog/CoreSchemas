import { createClient } from "@supabase/supabase-js";

// 1️⃣ Your Supabase project URL + Service Role Key (server-side only!)
const supabaseAdmin = createClient(
  "https://sdybgxgykvydvzmfmivd.supabase.co", // replace with your Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkeWJneGd5a3Z5ZHZ6bWZtaXZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5MDE3OCwiZXhwIjoyMDg0NjY2MTc4fQ.khTggLeFmHRjxtVJ-lQLYCtwSRNJiwVYCUkEYlgTySo" // replace with your Service Role Key
);

const staffers = [
  // Administrators
  { email: "admin_eic@thegoldpanicles.com", full_name: "Jonee Elorpe Jr.", role: "Administrator", password: "EIC@12345" },
  { email: "admin_tech@thegoldpanicles.com", full_name: "Jofred James Gerasmio", role: "Administrator", password: "Tech@12345" },
  { email: "admin_manage@thegoldpanicles.com", full_name: "Glen Ferdinan Rojas", role: "Administrator", password: "Manage@12345" },
  { email: "admin_creative@thegoldpanicles.com", full_name: "Levi Brian Cejuela", role: "Administrator", password: "Creative@12345" },

  // Section Heads
  { email: "head_news@thegoldpanicles.com", full_name: "Megumi Erika Labaja", role: "Section Head", password: "News@12345" },
  { email: "head_photo@thegoldpanicles.com", full_name: "Elaine Pearl Silagan", role: "Section Head", password: "Photo@12345" },
  { email: "head_video@thegoldpanicles.com", full_name: "Jules Leo Reserva", role: "Section Head", password: "Video@12345" },

  // Regular Staff
  { email: "staff_news@thegoldpanicles.com", full_name: "Shieny Griethzer Lozada", role: "Regular Staff", password: "StaffNews@123" },
  { email: "staff_photo@thegoldpanicles.com", full_name: "Teejay Abello", role: "Regular Staff", password: "StaffPhoto@123" },
  { email: "staff_video@thegoldpanicles.com", full_name: "Kent Adriane Venatero", role: "Regular Staff", password: "StaffVideo@123" },
];

// 3️⃣ Function to populate staffers
async function populateStaffers() {
  // Get all existing users once
  const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ limit: 1000 });
  if (listError) {
    console.error("❌ Failed to list users:", listError);
    return;
  }

  const existingUsers = listData.users; // ✅ This is the array

  for (const staffer of staffers) {
    const exists = existingUsers.find(u => u.email === staffer.email);
    if (exists) {
      console.log(`✅ Already exists: ${staffer.email}`);
      continue;
    }

    // Create user in Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: staffer.email,
      password: staffer.password,
      user_metadata: {
        full_name: staffer.full_name,
        role: staffer.role,
      },
      email_confirm: true, // mark email as confirmed
    });

    if (error) console.error("❌ Error creating:", staffer.email, error);
    else console.log("✨ Created:", data.email);
  }
}

// Run the script
populateStaffers().then(() => console.log("🎉 Staffers population finished!"));