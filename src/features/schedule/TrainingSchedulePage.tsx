import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  Container,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ApiError } from "../../api/client";
import type {
  AttendanceUpdatePayload,
  Lesson,
  LessonFilters,
} from "../../types/lesson";
import { AttendanceModal } from "./components/AttendanceModal";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { EMPTY_FILTERS, ScheduleFilters } from "./components/ScheduleFilters";
import { LessonDetailsDialog } from "./components/LessonDetailsDialog";
import { ScheduleTable } from "./components/ScheduleTable";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useInstructors } from "./hooks/useInstructors";
import { useLessons } from "./hooks/useLessons";
import { useUpdateAttendance } from "./hooks/useUpdateAttendance";

export function TrainingSchedulePage() {
  const [filters, setFilters] = useState<LessonFilters>(EMPTY_FILTERS);
  const [debouncedSearch, flushSearch] = useDebouncedValue(filters.search, 300);
  const effectiveFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  );

  const lessonsQuery = useLessons(effectiveFilters);
  const instructorsQuery = useInstructors();
  const attendanceMutation = useUpdateAttendance();

  const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);
  const [attendanceLesson, setAttendanceLesson] = useState<Lesson | null>(null);
  const [attendanceSavedFor, setAttendanceSavedFor] = useState<string | null>(
    null,
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage(0);
  }, [effectiveFilters]);

  const lessons = lessonsQuery.data ?? [];
  const paginatedLessons = lessons.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const isSearching =
    filters.search !== debouncedSearch ||
    (lessonsQuery.isFetching && Boolean(debouncedSearch));
  const hasActiveFilters =
    filters.search !== "" ||
    filters.instructor !== "" ||
    filters.lessonStatus !== "" ||
    filters.dateFrom !== null ||
    filters.dateTo !== null;

  const errorMessage =
    lessonsQuery.error instanceof ApiError
      ? lessonsQuery.error.message
      : lessonsQuery.error instanceof Error
        ? lessonsQuery.error.message
        : "An unexpected error occurred.";

  const attendanceErrorMessage = attendanceMutation.isError
    ? attendanceMutation.error instanceof ApiError
      ? attendanceMutation.error.message
      : "Something went wrong while saving attendance."
    : null;

  function openAttendanceModal(lesson: Lesson) {
    attendanceMutation.reset();
    setAttendanceLesson(lesson);
  }

  function closeAttendanceModal() {
    setAttendanceLesson(null);
    attendanceMutation.reset();
  }

  function handleAttendanceSubmit(payload: AttendanceUpdatePayload) {
    if (!attendanceLesson) return;
    const traineeName = attendanceLesson.traineeName;
    attendanceMutation.mutate(
      { lessonId: attendanceLesson.id, payload },
      {
        onSuccess: () => {
          setAttendanceSavedFor(traineeName);
          setAttendanceLesson(null);
        },
      },
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          sx={{ animation: "fadeInUp 500ms cubic-bezier(0.4, 0, 0.2, 1) both" }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Training Schedule
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View upcoming and past lessons, and manage attendance.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={
              <RefreshIcon
                sx={{
                  animation: lessonsQuery.isFetching
                    ? "spin 900ms linear infinite"
                    : "none",
                }}
              />
            }
            onClick={() => lessonsQuery.refetch()}
            disabled={lessonsQuery.isFetching}
          >
            Refresh
          </Button>
        </Stack>

        <Box
          sx={{
            animation:
              "fadeInUp 500ms cubic-bezier(0.4, 0, 0.2, 1) 100ms both",
          }}
        >
          <ScheduleFilters
            filters={filters}
            onChange={setFilters}
            instructorOptions={instructorsQuery.data ?? []}
            isSearching={isSearching}
            onSearchSubmit={flushSearch}
          />
        </Box>

        <Paper
          variant="outlined"
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            animation:
              "fadeInUp 500ms cubic-bezier(0.4, 0, 0.2, 1) 200ms both",
          }}
        >
          <Box
            sx={{
              opacity: lessonsQuery.isFetching && !lessonsQuery.isLoading ? 1 : 0,
              transition: "opacity 250ms ease",
            }}
          >
            <LinearProgress />
          </Box>
          {lessonsQuery.isError ? (
            <ErrorState
              message={errorMessage}
              onRetry={() => lessonsQuery.refetch()}
            />
          ) : !lessonsQuery.isLoading && lessons.length === 0 ? (
            <EmptyState
              hasActiveFilters={hasActiveFilters}
              onClearFilters={() => setFilters(EMPTY_FILTERS)}
            />
          ) : (
            <>
              <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <ScheduleTable
                  lessons={lessonsQuery.isLoading ? lessons : paginatedLessons}
                  isLoading={lessonsQuery.isLoading}
                  onView={setViewingLesson}
                  onMarkAttendance={openAttendanceModal}
                />
              </Box>
              {!lessonsQuery.isLoading && (
                <TablePagination
                  component="div"
                  count={lessons.length}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              )}
            </>
          )}
        </Paper>

        {!lessonsQuery.isLoading && !lessonsQuery.isError && (
          <Typography variant="caption" color="text.secondary">
            Showing {lessons.length} lesson{lessons.length === 1 ? "" : "s"}
            {lessonsQuery.isFetching ? " · updating…" : ""}
          </Typography>
        )}
      </Stack>

      <LessonDetailsDialog
        lesson={viewingLesson}
        open={Boolean(viewingLesson)}
        onClose={() => setViewingLesson(null)}
      />

      <AttendanceModal
        lesson={attendanceLesson}
        open={Boolean(attendanceLesson)}
        onClose={closeAttendanceModal}
        onSubmit={handleAttendanceSubmit}
        isSubmitting={attendanceMutation.isPending}
        submitError={attendanceErrorMessage}
      />

      <Snackbar
        open={Boolean(attendanceSavedFor)}
        autoHideDuration={4000}
        onClose={() => setAttendanceSavedFor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setAttendanceSavedFor(null)}
        >
          Attendance updated for {attendanceSavedFor}.
        </Alert>
      </Snackbar>
    </Container>
  );
}
