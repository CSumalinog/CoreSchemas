import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import RequestFormDialog from "./RequestForm";

export default function CreateRequest({ open }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          height: "35%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ListItem disablePadding sx={{ width: "90%", mb: 3, mt: 3 }}>
          <ListItemButton
            onClick={() => setDialogOpen(true)} // ✅ FIX
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: "#1a1a1a",
              color: "#fff",
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              "&:hover": { backgroundColor: "#fff176", color: "#000" },
              transition: "all 0.3s ease",
            }}
          >
            {open ? (
              <>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 1.5,
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <AddIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Create Request"
                  sx={{ color: "#fff", textAlign: "center", flexGrow: 1 }}
                />
              </>
            ) : (
              <ListItemIcon
                sx={{ minWidth: 0, justifyContent: "center", color: "#fff" }}
              >
                <AddIcon />
              </ListItemIcon>
            )}
          </ListItemButton>
        </ListItem>
      </Box>

      {/* Dialog */}
      <RequestFormDialog
        open={dialogOpen} // ✅ SAME STATE
        onClose={() => setDialogOpen(false)}
        onSubmit={(data) => {
          console.log("New Request:", data);
          setDialogOpen(false);
        }}
      />
    </>
  );
}
