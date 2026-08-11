import ReplayIcon from "@mui/icons-material/Replay";
import { Alert, AlertTitle, Button, Stack } from "@mui/material";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Stack
      sx={{
        py: 4,
        px: 2,
        animation: "fadeInUp 400ms cubic-bezier(0.4, 0, 0.2, 1) both",
      }}
    >
      <Alert
        severity="error"
        variant="outlined"
        action={
          <Button
            color="error"
            size="small"
            startIcon={<ReplayIcon />}
            onClick={onRetry}
          >
            Retry
          </Button>
        }
      >
        <AlertTitle>Couldn't load the training schedule</AlertTitle>
        {message}
      </Alert>
    </Stack>
  );
}
