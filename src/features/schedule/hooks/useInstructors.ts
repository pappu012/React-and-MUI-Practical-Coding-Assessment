import { useQuery } from "@tanstack/react-query";
import { fetchInstructors } from "../../../api/lessonsApi";

export function useInstructors() {
  return useQuery({
    queryKey: ["instructors"],
    queryFn: fetchInstructors,
    staleTime: 5 * 60 * 1000,
  });
}
