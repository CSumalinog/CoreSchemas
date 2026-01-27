/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  MenuItem,
} from "@mui/material";
import { supabase } from "../../lib/supabase";

export default function RequestFormDialog({ open, onClose, initialData }) {
  const [segments, setSegments] = useState([]);
  const [loadingSegments, setLoadingSegments] = useState(false);

  const [formData, setFormData] = useState({
    classification: "",
    segment: "",
    otherSegment: "",
    title: "",
    description: "",
    date: "",
    timeFrom: "",
    timeTo: "",
    personToContact: "",
    contactInfo: "",
    file: null,
  });

  // Prefill form if editing
  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        classification: initialData.classification_type,
        segment: initialData.classification_id,
        otherSegment: initialData.segment_name || "",
        title: initialData.title,
        description: initialData.description,
        date: initialData.event_date,
        timeFrom: initialData.time_from,
        timeTo: initialData.time_to,
        personToContact: initialData.person_to_contact,
        contactInfo: initialData.contact_info,
        file: null, // cannot prefill file input
      });
    } else {
      setFormData({
        classification: "",
        segment: "",
        otherSegment: "",
        title: "",
        description: "",
        date: "",
        timeFrom: "",
        timeTo: "",
        personToContact: "",
        contactInfo: "",
        file: null,
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
      return;
    }

    if (name === "classification") {
      setFormData({
        ...formData,
        classification: value,
        segment: "",
        otherSegment: "",
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // Fetch segments when classification changes
  useEffect(() => {
    if (!formData.classification) {
      setSegments([]);
      return;
    }

    const fetchSegments = async () => {
      setLoadingSegments(true);
      const { data, error } = await supabase
        .from("classifications")
        .select("id, name")
        .eq("type", formData.classification)
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching segments:", error);
        setSegments([]);
      } else {
        setSegments(data);
      }
      setLoadingSegments(false);
    };

    fetchSegments();
  }, [formData.classification]);

  const handleSubmit = async () => {
    let classificationId = formData.segment;

    // Handle "Other" segment
    if (formData.segment === "other") {
      const { data, error } = await supabase
        .from("classifications")
        .insert({
          type: formData.classification,
          name: formData.otherSegment,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error adding new segment:", error);
        return;
      }

      classificationId = data.id;
    }

    const segmentName =
      formData.segment === "other"
        ? formData.otherSegment
        : segments.find((s) => s.id === formData.segment)?.name;

    const userId = (await supabase.auth.getUser()).data.user?.id || null;

    if (initialData) {
      // Update existing request
      const { error } = await supabase
        .from("requests")
        .update({
          title: formData.title,
          description: formData.description,
          event_date: formData.date,
          time_from: formData.timeFrom,
          time_to: formData.timeTo,
          person_to_contact: formData.personToContact,
          contact_info: formData.contactInfo,
          classification_type: formData.classification,
          classification_id: classificationId,
          segment_name: segmentName,
          attachment_url: formData.file
            ? formData.file.name
            : initialData.attachment_url,
        })
        .eq("id", initialData.id);

      if (error) {
        console.error("Error updating request:", error);
        return;
      }
    } else {
      // Insert new request
      const { error } = await supabase.from("requests").insert([
        {
          title: formData.title,
          description: formData.description,
          event_date: formData.date,
          time_from: formData.timeFrom,
          time_to: formData.timeTo,
          person_to_contact: formData.personToContact,
          contact_info: formData.contactInfo,
          classification_type: formData.classification,
          classification_id: classificationId,
          segment_name: segmentName,
          attachment_url: formData.file ? formData.file.name : null,
          created_by: userId,
        },
      ]);

      if (error) {
        console.error("Error saving request:", error);
        return;
      }
    }

    onClose();
  };

  const isFormIncomplete =
    !formData.classification ||
    (!formData.segment && formData.segment !== "other") ||
    (formData.segment === "other" && !formData.otherSegment?.trim()) ||
    !formData.title?.trim() ||
    !formData.description?.trim() ||
    !formData.date ||
    !formData.timeFrom ||
    !formData.timeTo ||
    !formData.personToContact?.trim() ||
    !formData.contactInfo?.trim();

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
      <DialogTitle sx={{ textAlign: "center", fontWeight: "semibold" }}>
        {initialData ? "Edit Request" : "New Request"}
      </DialogTitle>

      <hr  className="border-neutral-400" /> 

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {/* Form fields same as before */}
          <TextField
            label="Event Title"
            name="title"
            size="small"
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
            size="small"
            required
          />
          <Box display="flex" gap={1}>
            <TextField
              label="Date"
              name="date"
              type="date"
              size="small"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1.5 }}
              required
            />
            <TextField
              label="Time From"
              name="timeFrom"
              type="time"
              size="small"
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
              size="small"
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
            size="small"
            value={formData.personToContact}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Contact Information"
            name="contactInfo"
            size="small"
            value={formData.contactInfo}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            select
            label="Classification"
            name="classification"
            size="small"
            value={formData.classification}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="organization">Organization</MenuItem>
            <MenuItem value="department">Department</MenuItem>
            <MenuItem value="office">Office</MenuItem>
          </TextField>

          <TextField
            select
            label={
              formData.classification
                ? `Select ${formData.classification}`
                : "Select Segment"
            }
            name="segment"
            size="small"
            value={formData.segment}
            onChange={handleChange}
            fullWidth
            required
            disabled={!formData.classification || loadingSegments}
          >
            {segments.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
            <MenuItem value="other">Other (please specify)</MenuItem>
          </TextField>

          {formData.segment === "other" && (
            <TextField
              label="Please specify your segment"
              name="otherSegment"
              value={formData.otherSegment}
              onChange={handleChange}
              fullWidth
              size="small"
              required
            />
          )}

          <Button
            variant="contained"
            component="label"
            sx={{
              backgroundColor: "#171717", // main button color
              color: "#fff", // text color
              "&:hover": {
                backgroundColor: "#333", // hover background color
              },
            }}
          >
            Upload File
            <input type="file" hidden name="file" onChange={handleChange} />
          </Button>

          {formData.file && <span>{formData.file.name}</span>}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          sx={{
            color: "#171717", // text color
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          sx={{
            backgroundColor: "#171717", // main button color
            color: "#fff", // text color
            "&:hover": {
              backgroundColor: "#333", // hover background color
            },
          }}
          onClick={handleSubmit}
          disabled={isFormIncomplete}
          variant="contained"
        >
          {initialData ? "Update" : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
