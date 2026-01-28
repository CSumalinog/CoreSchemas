import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Toolbar,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";

import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "../../lib/supabase.js";
import { useUser } from "../../hooks/useUser.jsx";

export default function RequestManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const adminUser = useUser(); // current admin user

  // Fetch all requests
  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("requests").select("*");
    if (error) console.error(error);
    else setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Approve request
  const handleApprove = async (requestId) => {
    if (!adminUser) return;
    try {
      const { error, data } = await supabase
        .from("requests")
        .update({
          status: "approved",
          approved_by: adminUser.id,
          date_approved: new Date().toISOString(),
        })
        .eq("id", requestId)
        .select();

      if (error) throw error;

      // Update the state immediately
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, ...data[0] } : r)),
      );
      setDetailsDialogOpen(false);
    } catch (err) {
      console.error("Failed to approve request:", err);
    }
  };

  // Decline request
  const handleDecline = async () => {
    if (!declineReason || !selectedRequest || !adminUser) return;

    try {
      const { error, data } = await supabase
        .from("requests")
        .update({
          status: "declined",
          declined_by: adminUser.id,
          date_declined: new Date().toISOString(),
          decline_reason: declineReason,
        })
        .eq("id", selectedRequest.id)
        .select();

      if (error) throw error;

      // Update the state immediately
      setRequests((prev) =>
        prev.map((r) =>
          r.id === selectedRequest.id ? { ...r, ...data[0] } : r,
        ),
      );

      setDeclineDialogOpen(false);
      setDeclineReason("");
      setDetailsDialogOpen(false);
      setSelectedRequest(null);
    } catch (err) {
      console.error("Failed to decline request:", err);
    }
  };

  const openDeclineDialog = () => {
    if (selectedRequest) setDeclineDialogOpen(true);
  };

  const openDetailsDialog = (request) => {
    setSelectedRequest(request);
    setDetailsDialogOpen(true);
  };

  const filteredRequests = {
    pending: requests.filter((r) => r.status === "pending"),
    approved: requests.filter((r) => r.status === "approved"),
    declined: requests.filter((r) => r.status === "declined"),
  };

  return (
    <Box p={3}>
      <Toolbar
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          boxShadow: 1,
          p: 0,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          variant="fullWidth" // makes tabs equal width
          textColor="primary"
          indicatorColor="primary"
          sx={{ width: "100%" }}
        >
          <Tab
            icon={<PendingActionsIcon />}
            iconPosition="start"
            label="Pending Requests"
          />
          <Tab
            icon={<CheckCircleIcon />}
            iconPosition="start"
            label="Approved Requests"
          />
          <Tab
            icon={<CancelIcon />}
            iconPosition="start"
            label="Declined Requests"
          />
        </Tabs>
      </Toolbar>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {activeTab === 0 && (
            <RequestTable
              requests={filteredRequests.pending}
              showDetails
              onViewDetails={openDetailsDialog}
              columnWidths={["40%", "20%", "20%", "20%"]}
            />
          )}
          {activeTab === 1 && (
            <RequestTable
              requests={filteredRequests.approved}
              showAdmin
              adminField="approved_by"
              dateField="date_approved"
              columnWidths={["40%", "20%", "20%", "20%"]}
            />
          )}
          {activeTab === 2 && (
            <RequestTable
              requests={filteredRequests.declined}
              showAdmin
              adminField="declined_by"
              dateField="date_declined"
              showReason
              columnWidths={["20%", "20%", "20%", "20%"]}
            />
          )}
        </>
      )}

      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        PaperProps={{
          sx: { width: 500, maxWidth: "90%" },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Request Details
          <IconButton
            aria-label="close"
            onClick={() => setDetailsDialogOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box>
              <Typography variant="subtitle1">
                <strong>Title:</strong> {selectedRequest.title}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Description:</strong> {selectedRequest.description}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Event Date:</strong>{" "}
                {new Date(selectedRequest.event_date).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Time:</strong> {selectedRequest.time_from} -{" "}
                {selectedRequest.time_to}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Contact:</strong> {selectedRequest.person_to_contact} (
                {selectedRequest.contact_info})
              </Typography>
              <Typography variant="subtitle1">
                <strong>Segment:</strong> {selectedRequest.segment_name}
              </Typography>
              {selectedRequest.attachment_url && (
                <Typography variant="subtitle1">
                  <strong>Attachment:</strong>{" "}
                  <a
                    href={selectedRequest.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleApprove(selectedRequest.id)}
            disabled={!adminUser}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={openDeclineDialog}
            disabled={!adminUser}
          >
            Decline
          </Button>
        </DialogActions>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog
        open={declineDialogOpen}
        onClose={() => setDeclineDialogOpen(false)}
        PaperProps={{
          sx: { width: 500, maxWidth: "90%" },
        }}
      >
        <DialogTitle>Decline Request</DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            label="Reason for Decline"
            fullWidth
            multiline
            minRows={4}
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeclineDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDecline}
            disabled={!adminUser || !declineReason}
          >
            Decline
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Table component
function RequestTable({
  requests,
  showAdmin,
  adminField,
  dateField,
  showReason,
  showDetails,
  onViewDetails,
  columnWidths,
}) {
  return (
    <div className="flex flex-col w-full h-full mt-4">
      <Paper sx={{ flex: 1, overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: columnWidths?.[0] }}>Title</TableCell>
              <TableCell sx={{ width: columnWidths?.[1] }}>Client</TableCell>
              <TableCell sx={{ width: columnWidths?.[2] }}>Date</TableCell>
              {showAdmin && (
                <TableCell sx={{ width: columnWidths?.[3] }}>By</TableCell>
              )}
              {showReason && (
                <TableCell sx={{ width: columnWidths?.[3] }}>Reason</TableCell>
              )}
              {showDetails && (
                <TableCell sx={{ width: columnWidths?.[3] }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.title}</TableCell>
                <TableCell>{req.segment_name || "N/A"}</TableCell>
                <TableCell>
                  {dateField && req[dateField]
                    ? new Date(req[dateField]).toLocaleString()
                    : new Date(req.event_date).toLocaleDateString()}
                </TableCell>
                {showAdmin && <TableCell>{req[adminField] || "N/A"}</TableCell>}
                {showReason && (
                  <TableCell>{req.decline_reason || "N/A"}</TableCell>
                )}
                {showDetails && (
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => onViewDetails(req)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
