import type { AttendanceStatus, Lesson, LessonStatus } from "../types/lesson";

const TRAINEE_NAMES = [
  "Ava Thompson",
  "Liam Carter",
  "Sophia Nguyen",
  "Noah Patel",
  "Isabella Rossi",
  "Mason Kim",
  "Mia Johansson",
  "Ethan Brooks",
  "Amelia Santos",
  "Lucas Meyer",
  "Charlotte Dubois",
  "Oliver Hayes",
  "Emma Novak",
  "Jack Sullivan",
  "Grace Okafor",
  "Henry Alvarez",
  "Zoe Bennett",
  "Leo Fischer",
  "Chloe Morgan",
  "Daniel Osei",
];

const INSTRUCTORS = [
  "James Whitfield",
  "Maria Gonzalez",
  "Robert Chen",
  "Priya Sharma",
  "David O'Connell",
];

const VEHICLES = [
  "Bus 12 - Blue Line",
  "Bus 07 - Red Line",
  "Sedan 03",
  "Sedan 05",
  "Bus 21 - Green Line",
  "Minivan 02",
];

const LOCATIONS = [
  "North Depot",
  "Downtown Training Center",
  "West Yard",
  "East Campus",
];

const LESSON_STATUS_WEIGHTS: Array<[LessonStatus, number]> = [
  ["Scheduled", 4],
  ["Completed", 4],
  ["In Progress", 1],
  ["Cancelled", 1],
];

function weightedPick<T>(weights: Array<[T, number]>, rng: () => number): T {
  const total = weights.reduce((sum, [, w]) => sum + w, 0);
  let roll = rng() * total;
  for (const [value, weight] of weights) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return weights[weights.length - 1][0];
}

// Small seeded PRNG so mock data is stable across reloads (mulberry32).
function mulberry32(seed: number) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function attendanceForStatus(
  lessonStatus: LessonStatus,
  rng: () => number,
): AttendanceStatus {
  if (lessonStatus === "Scheduled" || lessonStatus === "In Progress") {
    return "Not Marked";
  }
  if (lessonStatus === "Cancelled") {
    return rng() > 0.5 ? "Excused" : "Not Marked";
  }
  // Completed
  return weightedPick<AttendanceStatus>(
    [
      ["Present", 6],
      ["Late", 2],
      ["Absent", 1],
      ["Excused", 1],
    ],
    rng,
  );
}

export function generateLessons(count = 60): Lesson[] {
  const rng = mulberry32(20260811);
  const today = new Date();
  const lessons: Lesson[] = [];

  for (let i = 0; i < count; i++) {
    const dayOffset = Math.floor(rng() * 21) - 10; // -10..+10 days from today
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);

    const hour = 8 + Math.floor(rng() * 9); // 08:00 - 16:00
    const minute = pick([0, 15, 30, 45], rng);

    const lessonStatus =
      dayOffset < 0
        ? weightedPick<LessonStatus>(
            [
              ["Completed", 7],
              ["Cancelled", 2],
              ["Scheduled", 1],
            ],
            rng,
          )
        : dayOffset === 0
          ? weightedPick<LessonStatus>(
              [
                ["In Progress", 2],
                ["Scheduled", 4],
                ["Completed", 3],
              ],
              rng,
            )
          : weightedPick<LessonStatus>(LESSON_STATUS_WEIGHTS.filter(
              ([s]) => s !== "In Progress" && s !== "Completed",
            ), rng);

    const traineeName = pick(TRAINEE_NAMES, rng);

    lessons.push({
      id: `lsn-${(i + 1).toString().padStart(3, "0")}`,
      traineeName,
      traineeEmail: `${traineeName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      lessonDate: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
      lessonTime: `${pad(hour)}:${pad(minute)}`,
      durationMinutes: pick([45, 60, 90], rng),
      instructor: pick(INSTRUCTORS, rng),
      vehicle: pick(VEHICLES, rng),
      lessonStatus,
      attendanceStatus: attendanceForStatus(lessonStatus, rng),
      attendanceNotes: undefined,
      location: pick(LOCATIONS, rng),
    });
  }

  return lessons.sort((a, b) =>
    `${a.lessonDate}T${a.lessonTime}`.localeCompare(
      `${b.lessonDate}T${b.lessonTime}`,
    ),
  );
}

export const INSTRUCTOR_OPTIONS = INSTRUCTORS;
