export const LESSON_STATUSES = [
  "Scheduled",
  "In Progress",
  "Completed",
  "Cancelled",
] as const;

export type LessonStatus = (typeof LESSON_STATUSES)[number];

export const ATTENDANCE_STATUSES = [
  "Not Marked",
  "Present",
  "Absent",
  "Late",
  "Excused",
] as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export interface Lesson {
  id: string;
  traineeName: string;
  traineeEmail: string;
  lessonDate: string; // ISO date, e.g. "2026-08-12"
  lessonTime: string; // "HH:mm"
  durationMinutes: number;
  instructor: string;
  vehicle: string;
  lessonStatus: LessonStatus;
  attendanceStatus: AttendanceStatus;
  attendanceNotes?: string;
  location: string;
}

export interface LessonFilters {
  search: string;
  instructor: string | "";
  lessonStatus: LessonStatus | "";
  dateFrom: string | null; // ISO date
  dateTo: string | null; // ISO date
}

export interface AttendanceUpdatePayload {
  attendanceStatus: AttendanceStatus;
  attendanceNotes?: string;
}
