import { useQuery } from "@tanstack/react-query";
import { fetchLessons } from "../../../api/lessonsApi";
import type { LessonFilters } from "../../../types/lesson";

export function lessonsQueryKey(filters: LessonFilters) {
  return ["lessons", filters] as const;
}

export function useLessons(filters: LessonFilters) {
  return useQuery({
    queryKey: lessonsQueryKey(filters),
    queryFn: () => fetchLessons(filters),
    placeholderData: (previousData) => previousData,
  });
}
