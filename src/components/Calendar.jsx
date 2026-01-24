// src/components/client/ClientCalendar.jsx
import { useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function ClientCalendar({ events, loading, onSelectEvent }) {
  // ---------------------
  // Custom toolbar
  // ---------------------
  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div className="flex justify-between items-center mb-4 px-4 py-2 bg-gray-100 rounded-md shadow-sm">
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-white border rounded hover:bg-gray-50"
          onClick={() => onNavigate("PREV")}
        >
          Prev
        </button>
        <button
          className="px-3 py-1 bg-white border rounded hover:bg-gray-50"
          onClick={() => onNavigate("TODAY")}
        >
          Today
        </button>
        <button
          className="px-3 py-1 bg-white border rounded hover:bg-gray-50"
          onClick={() => onNavigate("NEXT")}
        >
          Next
        </button>
      </div>

      <span className="text-lg font-semibold text-gray-700">{label}</span>

      <div className="flex gap-2">
        {["month", "week", "day", "agenda"].map((view) => (
          <button
            key={view}
            className="px-3 py-1 bg-white border rounded hover:bg-gray-50"
            onClick={() => onView(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  const components = useMemo(() => ({ toolbar: CustomToolbar }), []);

  return (
    <div>
      {loading ? (
        <p className="text-gray-500">Loading events...</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectEvent={onSelectEvent}
          components={components}
          views={["month", "week", "day", "agenda"]}
          defaultView="month"
          eventPropGetter={() => ({
            className: "bg-blue-600 text-white rounded-md px-2 py-1",
          })}
        />
      )}
    </div>
  );
}
