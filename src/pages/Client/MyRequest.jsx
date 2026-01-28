import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import { supabase } from "../../lib/supabase";
import RequestFormDialog from "../../components/client/RequestForm";
import ConfirmDialog from "../../components/client/DeleteConfimation";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);
  const [editRequest, setEditRequest] = useState(null);

  // Fetch client requests
  const fetchRequests = async () => {
    setLoading(true);
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("created_by", userId)
      .order("created_at", { ascending: true });

    if (error) console.error(error);
    else setRequests(data);

    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests();
  }, []);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="mb-4">
        <p className="text-sm text-gray-500">
          Manage and track all your event coverage requests
        </p>
      </header>

      <TableContainer component={Paper}>
        <Table
          aria-label="requests table"
          sx={{
            "& .MuiTableCell-root": {
              fontSize: "1rem",
              fontWeight: 500,
            },
            "& thead .MuiTableCell-root": {
              fontWeight: 700,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "40%" }}>Title of the Event</TableCell>
              <TableCell sx={{ width: "20%" }}>Date Requested</TableCell>
              <TableCell sx={{ width: "20%" }}>Status</TableCell>
              <TableCell sx={{ width: "20%" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.title}</TableCell>

                <TableCell>
                  {new Date(req.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell>{req.status || "Pending"}</TableCell>

                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="medium"
                      
                      sx={{
                        minWidth: 0,
                        padding: "2px 6px",
                        fontSize: "0.5rem",
                        height: 30,
                        backgroundColor: "#ffeb3b",
                         color: "black",
                      }}
                      onClick={() => setViewRequest(req)}
                    >
                      View Details
                    </Button>

                    <Button
                      size="small"
                      
                      sx={{
                        minWidth: 0,
                        padding: "2px 6px",
                        fontSize: "0.5rem",
                        height: 30,
                        backgroundColor: "red",
                        color: "black",
                      }}
                      onClick={() => {
                        setDeleteId(req.id);
                        setConfirmOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Details Dialog */}
      <Dialog
        open={!!viewRequest}
        onClose={() => setViewRequest(null)}
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
        <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
          Request Details
        </DialogTitle>
        <hr className="border-neutral-400" />

        <DialogContent>
          {viewRequest && (
            <Stack spacing={1}>
              <p>
                <strong>Title:</strong> {viewRequest.title}
              </p>
              <p>
                <strong>Description:</strong> {viewRequest.description}
              </p>
              <p>
                <strong>Date:</strong> {viewRequest.event_date}
              </p>
              <p>
                <strong>Time:</strong> {viewRequest.time_from} -{" "}
                {viewRequest.time_to}
              </p>
              <p>
                <strong>Person to Contact:</strong>{" "}
                {viewRequest.person_to_contact}
              </p>
              <p>
                <strong>Contact Info:</strong> {viewRequest.contact_info}
              </p>
              <p>
                <strong>Classification:</strong>{" "}
                {viewRequest.classification_type}
              </p>
              <p>
                <strong>Segment:</strong> {viewRequest.segment_name}
              </p>
              {viewRequest.attachment_url && (
                <p>
                  <strong>Attachment:</strong> {viewRequest.attachment_url}
                </p>
              )}
              <p>
                <strong>Status:</strong> {viewRequest.status || "Pending"}
              </p>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={() => setViewRequest(null)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setEditRequest(viewRequest);
              setViewRequest(null);
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      {editRequest && (
        <RequestFormDialog
          open={!!editRequest}
          onClose={() => {
            setEditRequest(null);
            fetchRequests();
          }}
          initialData={editRequest} // make sure RequestFormDialog supports initialData
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Request?"
        description="Are you sure you want to delete this request? This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          if (!deleteId) return;
          const { error } = await supabase
            .from("requests")
            .delete()
            .eq("id", deleteId);
          if (error) console.error(error);
          else fetchRequests();
          setConfirmOpen(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
