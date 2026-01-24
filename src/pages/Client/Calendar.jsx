// src/pages/client/ClientCalendarPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClientSidebar from "../../components/client/ClientSidebar";
import ClientCalendar from "../../components/Calendar";
import { supabase } from "../../lib/supabase";

export default function ClientCalendarPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------
  // Fetch events
  // ---------------------
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        const mappedEvents = data.map((evt) => ({
          id: evt.id,
          title: evt.title,
          start: new Date(evt.start),
          end: new Date(evt.end),
          allDay: evt.all_day,
        }));
        setEvents(mappedEvents);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  // ---------------------
  // Event click handler
  // ---------------------
  const handleSelectEvent = (event) => navigate(`/event/${event.id}`);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ClientSidebar navigate={navigate} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Client Calendar</h1>

        {/* Calendar Component */}
        <ClientCalendar
          events={events}
          loading={loading}
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </div>
  );
}
