import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, type ReactNode } from "react";
import type { AppView } from "../../types/navigation";

const DRAWER_WIDTH = 240;

interface AppShellProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  children: ReactNode;
}

const NAV_ITEMS: { key: AppView; label: string; icon: ReactNode }[] = [
  { key: "home", label: "Home", icon: <HomeRoundedIcon /> },
  {
    key: "schedule",
    label: "Training Schedule",
    icon: <EventNoteRoundedIcon />,
  },
];

export function AppShell({ activeView, onNavigate, children }: AppShellProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerContent = (
    <Box sx={{ width: DRAWER_WIDTH }}>
      <Toolbar />
      <List sx={{ px: 1.5, py: 1.5 }}>
        {NAV_ITEMS.map((item) => {
          const selected = activeView === item.key;
          return (
            <ListItemButton
              key={item.key}
              selected={selected}
              onClick={() => {
                onNavigate(item.key);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                transition: "background-color 150ms ease, color 150ms ease",
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  "& .MuiListItemIcon-root": { color: "primary.main" },
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.14),
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: { fontWeight: selected ? 600 : 500 },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        elevation={0}
        color="inherit"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: alpha("#ffffff", 0.86),
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              sx={{ mr: 1.5 }}
            >
              <MenuRoundedIcon />
            </IconButton>
          )}
          <SchoolRoundedIcon
            sx={{ color: "primary.main", mr: 1.25, fontSize: 26 }}
          />
          <Typography variant="h6" fontWeight={700} noWrap letterSpacing="-0.01em">
                React & MUI Practical Coding Assessment
          </Typography>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
