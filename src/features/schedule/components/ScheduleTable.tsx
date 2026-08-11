import EventNoteIcon from "@mui/icons-material/EventNote";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import type { Lesson } from "../../../types/lesson";
import {
  ATTENDANCE_STATUS_COLORS,
  LESSON_STATUS_COLORS,
} from "../statusStyles";

const COLUMN_COUNT = 8;

interface ScheduleTableProps {
  lessons: Lesson[];
  isLoading: boolean;
  onView: (lesson: Lesson) => void;
  onMarkAttendance: (lesson: Lesson) => void;
}

function formatLessonDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), "EEE, MMM d yyyy");
  } catch {
    return isoDate;
  }
}

function staggerAnimation(index: number): string {
  const delayMs = Math.min(index, 10) * 35;
  return `fadeInUp 400ms cubic-bezier(0.4, 0, 0.2, 1) ${delayMs}ms both`;
}

function LessonRowActions({
  lesson,
  onView,
  onMarkAttendance,
}: {
  lesson: Lesson;
  onView: (lesson: Lesson) => void;
  onMarkAttendance: (lesson: Lesson) => void;
}) {
  return (
    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
      <Tooltip title="View lesson details">
        <IconButton
          size="small"
          onClick={() => onView(lesson)}
          aria-label={`View details for ${lesson.traineeName}`}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Mark attendance">
        <IconButton
          size="small"
          onClick={() => onMarkAttendance(lesson)}
          aria-label={`Mark attendance for ${lesson.traineeName}`}
        >
          <HowToRegIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

function DesktopSkeletonRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <TableRow key={index}>
          {Array.from({ length: COLUMN_COUNT }).map((__, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function MobileSkeletonCards() {
  return (
    <Stack spacing={1.5}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} variant="outlined">
          <CardContent>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="80%" />
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

export function ScheduleTable({
  lessons,
  isLoading,
  onView,
  onMarkAttendance,
}: ScheduleTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) {
    if (isLoading) return <MobileSkeletonCards />;

    return (
      <Stack spacing={1.5}>
        {lessons.map((lesson, index) => (
          <Card
            key={lesson.id}
            variant="outlined"
            sx={{
              animation: staggerAnimation(index),
              "&:hover": {
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {lesson.traineeName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatLessonDate(lesson.lessonDate)} · {lesson.lessonTime}
                  </Typography>
                </Box>
                <LessonRowActions
                  lesson={lesson}
                  onView={onView}
                  onMarkAttendance={onMarkAttendance}
                />
              </Stack>

              <Divider sx={{ my: 1.25 }} />

              <Stack spacing={0.75}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Instructor
                  </Typography>
                  <Typography variant="body2">{lesson.instructor}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Vehicle / bus
                  </Typography>
                  <Typography variant="body2">{lesson.vehicle}</Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Chip
                  size="small"
                  label={lesson.lessonStatus}
                  color={LESSON_STATUS_COLORS[lesson.lessonStatus]}
                  icon={<EventNoteIcon />}
                />
                <Chip
                  size="small"
                  label={lesson.attendanceStatus}
                  color={ATTENDANCE_STATUS_COLORS[lesson.attendanceStatus]}
                  variant="outlined"
                />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table stickyHeader size="small" sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <TableCell>Trainee</TableCell>
            <TableCell>Lesson date</TableCell>
            <TableCell>Lesson time</TableCell>
            <TableCell>Instructor</TableCell>
            <TableCell>Vehicle / bus</TableCell>
            <TableCell>Lesson status</TableCell>
            <TableCell>Attendance</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <DesktopSkeletonRows />
          ) : (
            lessons.map((lesson, index) => (
              <TableRow
                key={lesson.id}
                hover
                sx={{ animation: staggerAnimation(index) }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {lesson.traineeName}
                  </Typography>
                </TableCell>
                <TableCell>{formatLessonDate(lesson.lessonDate)}</TableCell>
                <TableCell>{lesson.lessonTime}</TableCell>
                <TableCell>{lesson.instructor}</TableCell>
                <TableCell>{lesson.vehicle}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={lesson.lessonStatus}
                    color={LESSON_STATUS_COLORS[lesson.lessonStatus]}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={lesson.attendanceStatus}
                    color={ATTENDANCE_STATUS_COLORS[lesson.attendanceStatus]}
                  />
                </TableCell>
                <TableCell align="right">
                  <LessonRowActions
                    lesson={lesson}
                    onView={onView}
                    onMarkAttendance={onMarkAttendance}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
