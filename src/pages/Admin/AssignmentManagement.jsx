import React, { useEffect, useState } from "react";
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
  Checkbox,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "../../lib/supabase.js";

export default function AssignmentManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [sectionHeads, setSectionHeads] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedHead, setSelectedHead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  /* ---------------- FETCH DATA ---------------- */

  const fetchData = async () => {
    setLoading(true);

    // Approved but NOT assigned requests
    const { data: approved } = await supabase
      .from("requests")
      .select("*")
      .eq("status", "approved");

    // Assignments
    const { data: assigned } = await supabase.from("assignments").select(
      `
        id,
        date_assigned,
        status,
        requests ( title ),
        users ( full_name )
      `,
    );

    // Section heads
    const { data: heads } = await supabase
      .from("users")
      .select("id, full_name, section_name")
      .eq("role", "section_head");

    setApprovedRequests(approved || []);
    setAssignments(assigned || []);
    setSectionHeads(heads || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- ASSIGN HANDLER ---------------- */

  const handleAssign = async () => {
    if (!selectedRequest || !selectedHead) return;

    await supabase.from("assignments").insert({
      request_id: selectedRequest.id,
      assigned_to: selectedHead,
      date_assigned: new Date().toISOString(),
      status: "pending",
    });

    await supabase
      .from("requests")
      .update({ status: "assigned" })
      .eq("id", selectedRequest.id);

    setAssignDialogOpen(false);
    setSelectedRequest(null);
    setSelectedHead(null);
    fetchData();
  };

  if (loading) {
    return (
      <Box className="flex justify-center mt-10">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* ---------------- TABS ---------------- */}
      <Paper elevation={2}>
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          variant="fullWidth"
        >
          <Tab
            icon={<PlaylistAddIcon />}
            iconPosition="start"
            label="Pending Assignment"
          />
          <Tab
            icon={<AssignmentIcon />}
            iconPosition="start"
            label="Assignments"
          />
        </Tabs>
      </Paper>

      {/* ---------------- TAB 1: PENDING ASSIGNMENT ---------------- */}
      {activeTab === 0 && (
        <Paper className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "40%" }}>Title</TableCell>
                <TableCell sx={{ width: "30%" }}>Date Approved</TableCell>
                <TableCell sx={{ width: "30%" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {approvedRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.title}</TableCell>
                  <TableCell>
                    {new Date(req.date_approved).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelectedRequest(req);
                        setAssignDialogOpen(true);
                      }}
                    >
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ---------------- TAB 2: ASSIGNMENTS ---------------- */}
      {activeTab === 1 && (
        <Paper className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "40%" }}>Title</TableCell>
                <TableCell sx={{ width: "20%" }}>Date Assigned</TableCell>
                <TableCell sx={{ width: "20%" }}>Assigned To</TableCell>
                <TableCell sx={{ width: "20%" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.requests?.title}</TableCell>
                  <TableCell>
                    {new Date(a.date_assigned).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{a.users?.full_name}</TableCell>
                  <TableCell>
                    <Typography
                      color={a.status === "completed" ? "green" : "orange"}
                    >
                      {a.status}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ---------------- ASSIGN DIALOG ---------------- */}
      <Dialog open={assignDialogOpen} fullWidth maxWidth="sm">
        <DialogTitle>
          Assign to:
          <IconButton
            onClick={() => setAssignDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {sectionHeads.map((head) => (
            <Box
              key={head.id}
              className="flex items-center justify-between border-b py-2"
            >
              <Box>
                <Typography fontWeight="bold">{head.full_name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {head.section_name}
                </Typography>
              </Box>
              <Checkbox
                checked={selectedHead === head.id}
                onChange={() => setSelectedHead(head.id)}
              />
            </Box>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!selectedHead}
            onClick={handleAssign}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
