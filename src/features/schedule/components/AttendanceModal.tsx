import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grow,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import { forwardRef, useEffect, useState } from "react";
import type { ReactElement, Ref } from "react";
import {
  ATTENDANCE_STATUSES,
  type AttendanceStatus,
  type AttendanceUpdatePayload,
  type Lesson,
} from "../../../types/lesson";

interface AttendanceModalProps {
  lesson: Lesson | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: AttendanceUpdatePayload) => void;
  isSubmitting: boolean;
  submitError: string | null;
}

const STATUSES_REQUIRING_NOTES: AttendanceStatus[] = ["Absent", "Late", "Excused"];

interface FormErrors {
  attendanceStatus?: string;
  attendanceNotes?: string;
}

const GrowTransition = forwardRef(function GrowTransition(
  props: TransitionProps & { children: ReactElement },
  ref: Ref<unknown>,
) {
  return <Grow ref={ref} {...props} />;
});

export function AttendanceModal({
  lesson,
  open,
  onClose,
  onSubmit,
  isSubmitting,
  submitError,
}: AttendanceModalProps) {
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus | "">(
    "",
  );
  const [attendanceNotes, setAttendanceNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (lesson && open) {
      setAttendanceStatus(lesson.attendanceStatus);
      setAttendanceNotes(lesson.attendanceNotes ?? "");
      setErrors({});
    }
    // Only reset when a different lesson opens, not on every background
    // refetch that replaces `lesson` with a new object of the same id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id, open]);

  if (!lesson) return null;

  const notesRequired =
    attendanceStatus !== "" && STATUSES_REQUIRING_NOTES.includes(attendanceStatus);

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!attendanceStatus) {
      nextErrors.attendanceStatus = "Attendance status is required.";
    }
    if (notesRequired && attendanceNotes.trim().length === 0) {
      nextErrors.attendanceNotes = `A short note is required when marking a lesson as "${attendanceStatus}".`;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate() || !attendanceStatus) return;

    onSubmit({ attendanceStatus, attendanceNotes: attendanceNotes.trim() });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      TransitionComponent={GrowTransition}
    >
      <DialogTitle sx={{ pr: 6 }}>
        Mark attendance
        <IconButton
          onClick={onClose}
          aria-label="Close"
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2">{lesson.traineeName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {lesson.lessonDate} at {lesson.lessonTime} with {lesson.instructor}
            </Typography>
          </Box>

          {submitError && <Alert severity="error">{submitError}</Alert>}

          <TextField
            select
            required
            label="Attendance status"
            value={attendanceStatus}
            onChange={(e) => {
              setAttendanceStatus(e.target.value as AttendanceStatus);
              setErrors((prev) => ({ ...prev, attendanceStatus: undefined }));
            }}
            error={Boolean(errors.attendanceStatus)}
            helperText={errors.attendanceStatus}
          >
            {ATTENDANCE_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Notes"
            placeholder="Optional context, e.g. reason for absence"
            multiline
            minRows={3}
            required={notesRequired}
            value={attendanceNotes}
            onChange={(e) => {
              setAttendanceNotes(e.target.value);
              setErrors((prev) => ({ ...prev, attendanceNotes: undefined }));
            }}
            error={Boolean(errors.attendanceNotes)}
            helperText={
              errors.attendanceNotes ??
              (notesRequired
                ? "Required for this attendance status."
                : "Optional.")
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} loading={isSubmitting}>
          Save attendance
        </Button>
      </DialogActions>
    </Dialog>
  );
}
