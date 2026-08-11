import type { ChipProps } from "@mui/material";
import type { AttendanceStatus, LessonStatus } from "../../types/lesson";

export const LESSON_STATUS_COLORS: Record<LessonStatus, ChipProps["color"]> = {
  Scheduled: "info",
  "In Progress": "warning",
  Completed: "success",
  Cancelled: "default",
};

export const ATTENDANCE_STATUS_COLORS: Record<
  AttendanceStatus,
  ChipProps["color"]
> = {
  "Not Marked": "default",
  Present: "success",
  Absent: "error",
  Late: "warning",
  Excused: "info",
};
