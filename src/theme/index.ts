import { alpha, createTheme } from "@mui/material/styles";

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1d4ed8" },
    background: { default: "#f4f6f8" },
    divider: alpha("#0f172a", 0.08),
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: [
      '"Open Sans"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          transition: `box-shadow 200ms ${EASE}, transform 200ms ${EASE}`,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          transition: `transform 150ms ${EASE}, box-shadow 150ms ${EASE}, background-color 150ms ${EASE}`,
        },
        contained: {
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 6px 16px rgba(29, 78, 216, 0.25)",
          },
        },
        outlined: {
          "&:hover": { transform: "translateY(-1px)" },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: `transform 150ms ${EASE}, background-color 150ms ${EASE}`,
          "&:hover": { transform: "scale(1.08)" },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { transition: `background-color 150ms ${EASE}` },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: "0.72rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#64748b",
          backgroundColor: "#fafafa",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          transition: `transform 150ms ${EASE}, box-shadow 150ms ${EASE}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: `box-shadow 200ms ${EASE}, transform 200ms ${EASE}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: "0 24px 48px rgba(15, 23, 42, 0.18)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          transition: `box-shadow 150ms ${EASE}, border-color 150ms ${EASE}`,
          "&.Mui-focused": {
            boxShadow: `0 0 0 3px ${alpha("#1d4ed8", 0.14)}`,
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4 },
      },
    },
  },
});
