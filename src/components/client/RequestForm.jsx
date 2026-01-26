import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";

export default function RequestFormDialog({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    timeFrom: "",
    timeTo: "",
    personToContact: "",
    contactInfo: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      date: "",
      timeFrom: "",
      timeTo: "",
      personToContact: "",
      contactInfo: "",
      file: null,
    });
    onClose();
  };

  // Check if any required field is empty
  const isFormIncomplete =
    !formData.title ||
    !formData.description ||
    !formData.date ||
    !formData.timeFrom ||
    !formData.timeTo ||
    !formData.personToContact ||
    !formData.contactInfo;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          width: 450,
          maxWidth: "100%",
          border: "1px solid #ccc",
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle
        sx={{ textAlign: "center", fontSize: "1.400rem", fontWeight: 600 }}
      >
        REQUEST FORM
      </DialogTitle>
      <hr className="border-neutral-400" />

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Event Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            required
          />

          {/* Date / Time Row */}
          <Box display="flex" gap={1}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 2 }}
              required
            />
            <TextField
              label="Time From"
              name="timeFrom"
              type="time"
              value={formData.timeFrom}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
              required
            />
            <TextField
              label="Time To"
              name="timeTo"
              type="time"
              value={formData.timeTo}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
              required
            />
          </Box>

          <TextField
            label="Person to Contact"
            name="personToContact"
            value={formData.personToContact}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Contact Information"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            fullWidth
            required
          />

          <Button
            variant="contained"
            component="label"
            sx={{
              backgroundColor: "#fff",
              color: "#000",
              "&:hover": {
                backgroundColor: "#171717",
                color: "#fff",
              },
            }}
          >
            Upload File
            <input type="file" hidden name="file" onChange={handleChange} />
          </Button>
          {formData.file && <span>{formData.file.name}</span>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ color: "#fff", backgroundColor: "#171717" }}
          disabled={isFormIncomplete} // <-- disables submit if any required field is empty
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
