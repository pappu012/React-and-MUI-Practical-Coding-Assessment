import { apiRequest } from "./client";
import type {
  AttendanceUpdatePayload,
  Lesson,
  LessonFilters,
} from "../types/lesson";

export async function fetchLessons(
  filters: Partial<LessonFilters>,
): Promise<Lesson[]> {
  const { lessons } = await apiRequest<{ lessons: Lesson[] }>("/lessons", {
    query: {
      search: filters.search,
      instructor: filters.instructor,
      lessonStatus: filters.lessonStatus,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    },
  });
  return lessons;
}

export async function fetchLessonById(id: string): Promise<Lesson> {
  const { lesson } = await apiRequest<{ lesson: Lesson }>(`/lessons/${id}`);
  return lesson;
}

export async function fetchInstructors(): Promise<string[]> {
  const { instructors } = await apiRequest<{ instructors: string[] }>(
    "/instructors",
  );
  return instructors;
}

export async function updateAttendance(
  lessonId: string,
  payload: AttendanceUpdatePayload,
): Promise<Lesson> {
  const { lesson } = await apiRequest<{ lesson: Lesson }>(
    `/lessons/${lessonId}/attendance`,
    { method: "PATCH", body: payload },
  );
  return lesson;
}
