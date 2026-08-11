import { Server, Response, Model } from "miragejs";
import type { ModelDefinition, Registry } from "miragejs/-types";
import { generateLessons } from "./data";
import type { AttendanceUpdatePayload, Lesson } from "../types/lesson";

const LessonModel: ModelDefinition<Lesson> = Model.extend<Partial<Lesson>>({});

type AppRegistry = Registry<{ lesson: typeof LessonModel }, Record<string, never>>;

// Simulated network conditions so the UI's loading / error handling is
// actually exercised, the same way it would be against a real backend.
const ARTIFICIAL_LATENCY_MS = 600;
// Forces every /lessons request to fail while on, so the error state is
// easy to demo without editing code. Toggle from the browser console:
// window.__forceScheduleApiError = true / false
declare global {
  interface Window {
    __forceScheduleApiError?: boolean;
  }
}

export function makeServer({ environment = "development" } = {}) {
  const server = new Server<AppRegistry>({
    environment,
    models: {
      lesson: LessonModel,
    },
    seeds(schema) {
      generateLessons(65).forEach((lesson) => {
        schema.create("lesson", lesson);
      });
    },
    routes() {
      this.namespace = "api";
      this.timing = ARTIFICIAL_LATENCY_MS;

      this.get("/lessons", (schema, request) => {
        if (typeof window !== "undefined" && window.__forceScheduleApiError) {
          // Stays on until explicitly cleared, so it survives React Query's
          // automatic retry instead of being silently swallowed by it.
          return new Response(
            500,
            {},
            { error: "Unable to load the training schedule. Please try again." },
          );
        }

        const { search, instructor, lessonStatus, dateFrom, dateTo } =
          request.queryParams;

        let lessons = schema.all("lesson").models as unknown as Lesson[];

        if (search) {
          const needle = String(search).trim().toLowerCase();
          lessons = lessons.filter((lesson) =>
            lesson.traineeName.toLowerCase().includes(needle),
          );
        }
        if (instructor) {
          lessons = lessons.filter((lesson) => lesson.instructor === instructor);
        }
        if (lessonStatus) {
          lessons = lessons.filter(
            (lesson) => lesson.lessonStatus === lessonStatus,
          );
        }
        if (dateFrom) {
          lessons = lessons.filter((lesson) => lesson.lessonDate >= String(dateFrom));
        }
        if (dateTo) {
          lessons = lessons.filter((lesson) => lesson.lessonDate <= String(dateTo));
        }

        lessons = [...lessons].sort((a, b) =>
          `${a.lessonDate}T${a.lessonTime}`.localeCompare(
            `${b.lessonDate}T${b.lessonTime}`,
          ),
        );

        return { lessons };
      });

      this.get("/lessons/:id", (schema, request) => {
        const lesson = schema.find("lesson", request.params.id);
        if (!lesson) {
          return new Response(404, {}, { error: "Lesson not found." });
        }
        return { lesson };
      });

      this.patch("/lessons/:id/attendance", (schema, request) => {
        const lesson = schema.find("lesson", request.params.id);
        if (!lesson) {
          return new Response(404, {}, { error: "Lesson not found." });
        }

        const payload = JSON.parse(request.requestBody) as AttendanceUpdatePayload;

        if (!payload.attendanceStatus) {
          return new Response(
            422,
            {},
            { error: "Attendance status is required." },
          );
        }

        lesson.update({
          attendanceStatus: payload.attendanceStatus,
          attendanceNotes: payload.attendanceNotes ?? "",
        });

        return { lesson };
      });

      this.get("/instructors", (schema) => {
        const lessons = schema.all("lesson").models as unknown as Lesson[];
        const instructors = Array.from(
          new Set(lessons.map((lesson) => lesson.instructor)),
        ).sort();
        return { instructors };
      });

      this.namespace = "";
      this.passthrough();
    },
  });

  return server;
}
