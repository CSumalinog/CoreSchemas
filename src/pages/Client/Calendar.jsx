import { useState } from "react";
import Calendar from "../../components/shared/Calendar";
import RequestFormDialog from "../../components/client/RequestForm";

export default function ClientCalendarPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [defaultData, setDefaultData] = useState(null);

  // Triggered when user clicks a date
  const handleDateClick = (dateStr) => {
    setDefaultData({
      date: dateStr, // pre-fill the selected date
      title: "", // empty title for clients
      personToContact: "", // optional: pre-fill if needed
      contactInfo: "",
    });
    setDialogOpen(true);
  };

  // Triggered when user clicks an event
  const handleEventClick = (event) => {
    setDefaultData({
      date: event.startStr,
      title: event.title,
      personToContact: "", // can pre-fill depending on your logic
      contactInfo: "",
    });
    setDialogOpen(true);
  };

  // Close the dialog
  const handleClose = () => {
    setDialogOpen(false);
    setDefaultData(null);
  };

  // Handle form submission
  const handleFormSubmit = (formData) => {
    console.log("Submitted Request:", formData);
    // Here you can call your API to save the request
    handleClose();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Calendar */}
      <Calendar
        onDateClick={handleDateClick} // pass handlers as props
        onEventClick={handleEventClick}
      />

      {/* Request Form Dialog */}
      <RequestFormDialog
        open={dialogOpen}
        onClose={handleClose}
        onSubmit={handleFormSubmit}
        defaultData={defaultData} // pre-fill form dynamically
      />
    </div>
  );
}
