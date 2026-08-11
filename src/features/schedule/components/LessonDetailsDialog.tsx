import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grow,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import { format, parseISO } from "date-fns";
import { forwardRef } from "react";
import type { ReactElement, ReactNode, Ref } from "react";
import type { Lesson } from "../../../types/lesson";
import {
  ATTENDANCE_STATUS_COLORS,
  LESSON_STATUS_COLORS,
} from "../statusStyles";

interface LessonDetailsDialogProps {
  lesson: Lesson | null;
  open: boolean;
  onClose: () => void;
}

const GrowTransition = forwardRef(function GrowTransition(
  props: TransitionProps & { children: ReactElement },
  ref: Ref<unknown>,
) {
  return <Grow ref={ref} {...props} />;
});

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} textAlign="right">
        {value}
      </Typography>
    </Stack>
  );
}

export function LessonDetailsDialog({
  lesson,
  open,
  onClose,
}: LessonDetailsDialogProps) {
  if (!lesson) return null;

  const formattedDate = (() => {
    try {
      return format(parseISO(lesson.lessonDate), "EEEE, MMMM d, yyyy");
    } catch {
      return lesson.lessonDate;
    }
  })();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      TransitionComponent={GrowTransition}
    >
      <DialogTitle sx={{ pr: 6 }}>
        Lesson details
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
            <Typography variant="h6">{lesson.traineeName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {lesson.traineeEmail}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Chip
              size="small"
              label={lesson.lessonStatus}
              color={LESSON_STATUS_COLORS[lesson.lessonStatus]}
            />
            <Chip
              size="small"
              variant="outlined"
              label={lesson.attendanceStatus}
              color={ATTENDANCE_STATUS_COLORS[lesson.attendanceStatus]}
            />
          </Stack>

          <Divider />

          <Stack spacing={1.25}>
            <DetailRow label="Date" value={formattedDate} />
            <DetailRow
              label="Time"
              value={`${lesson.lessonTime} (${lesson.durationMinutes} min)`}
            />
            <DetailRow label="Instructor" value={lesson.instructor} />
            <DetailRow label="Vehicle / bus" value={lesson.vehicle} />
            <DetailRow label="Location" value={lesson.location} />
          </Stack>

          {lesson.attendanceNotes && (
            <>
              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Attendance notes
                </Typography>
                <Typography variant="body2">{lesson.attendanceNotes}</Typography>
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
