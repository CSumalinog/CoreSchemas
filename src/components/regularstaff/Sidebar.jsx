import * as React from "react"; 
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Collapse,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { useNavigate } from "react-router-dom";

/* ICONS */
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import WorkIcon from "@mui/icons-material/Work";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import UserMenu from "../shared/UserMenu.jsx";
import { supabase } from "../../lib/supabase.js";

const drawerWidth = 260;

/* DRAWER BEHAVIOR */
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width"),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width"),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  whiteSpace: "nowrap",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function RegularStafferSidebar() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(true);
  const [accountOpen, setAccountOpen] = React.useState(false);

  const menuItems = [
    { text: "My Coverage", icon: <WorkIcon />, path: "/staffer-coverage" },
    { text: "My Schedule", icon: <EventNoteIcon />, path: "/staffer-schedule" },
    { text: "My Calendar", icon: <CalendarMonthIcon />, path: "/staffer-calendar" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* TOP BAR */}
      <AppBar position="fixed" open={open} sx={{ backgroundColor: "#1a1a1a" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={[{ marginRight: 2 }, open && { display: "none" }]}
          >
            <MenuIcon />
          </IconButton>

          {/* LOGO */}
          <Box
            component="img"
            src="/tgp.png"
            alt="The Gold Panicles Logo"
            sx={{ width: 50, height: 50, ml: !open ? 1 : 0, mr: 1.5, objectFit: "contain" }}
          />

          <Typography variant="h6" noWrap>
            The Gold Panicles
          </Typography>
        </Toolbar>
      </AppBar>

      {/* DRAWER */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />

        {/* MAIN NAV */}
        <List>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => navigate(path)}
                sx={{ minHeight: 48, px: 2.5, justifyContent: open ? "initial" : "center" }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* ACCOUNT SECTION */}
        <Box sx={{ mt: "auto" }}>
          <Divider />

          {/* ✅ Replaced with UserMenu */}
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton onClick={() => setAccountOpen(!accountOpen)}>
              <UserMenu collapsed={!open} />
            </ListItemButton>
          </ListItem>

          <Collapse in={accountOpen}>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/staffer-settings")}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>

              <ListItemButton
                sx={{ pl: 4 }}
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Collapse>
        </Box>
      </Drawer>
    </Box>
  );
}
