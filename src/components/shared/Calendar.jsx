import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.css";

export default function Calendar({
  events = [],
  onDateClick,
  onEventClick,
  loading = false,
}) {
  const handleDateClickInternal = (info) => {
    if (onDateClick) onDateClick(info.dateStr);
  };

  const handleEventClickInternal = (info) => {
    if (onEventClick) onEventClick(info.event);
  };

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Loading...
        </div>
      )}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        weekends={true}
        editable={false}
        selectable={true}
        events={events}
        dateClick={handleDateClickInternal}
        eventClick={handleEventClickInternal}
      />
    </div>
  );
}
