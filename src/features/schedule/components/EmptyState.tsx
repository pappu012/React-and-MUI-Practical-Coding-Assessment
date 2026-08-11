import EventBusyIcon from "@mui/icons-material/EventBusy";
import { Button, Stack, Typography } from "@mui/material";

interface EmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyState({ hasActiveFilters, onClearFilters }: EmptyStateProps) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.5}
      sx={{
        py: 8,
        px: 2,
        textAlign: "center",
        animation: "fadeInUp 400ms cubic-bezier(0.4, 0, 0.2, 1) both",
      }}
    >
      <EventBusyIcon sx={{ fontSize: 48, color: "text.disabled" }} />
      <Typography variant="subtitle1" fontWeight={600}>
        No lessons found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
        {hasActiveFilters
          ? "No lessons match your current filters. Try adjusting or clearing them."
          : "There are no training lessons scheduled yet."}
      </Typography>
      {hasActiveFilters && (
        <Button size="small" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </Stack>
  );
}
