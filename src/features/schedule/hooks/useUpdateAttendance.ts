import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAttendance } from "../../../api/lessonsApi";
import type { AttendanceUpdatePayload } from "../../../types/lesson";

export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      payload,
    }: {
      lessonId: string;
      payload: AttendanceUpdatePayload;
    }) => updateAttendance(lessonId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}
