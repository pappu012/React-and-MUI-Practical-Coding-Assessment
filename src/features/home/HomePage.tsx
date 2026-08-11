import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import {
  Box,
  Button,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";
import type { ReactNode } from "react";
import { useInstructors } from "../schedule/hooks/useInstructors";
import { useLessons } from "../schedule/hooks/useLessons";
import type { LessonFilters, LessonStatus } from "../../types/lesson";

const ALL_LESSONS_FILTERS: LessonFilters = {
  search: "",
  instructor: "",
  lessonStatus: "",
  dateFrom: null,
  dateTo: null,
};

interface HomePageProps {
  onNavigateToSchedule: () => void;
}

function countByStatus(
  lessons: { lessonStatus: LessonStatus }[],
  status: LessonStatus,
) {
  return lessons.filter((lesson) => lesson.lessonStatus === status).length;
}

interface StatTileProps {
  label: string;
  value: number;
  icon: ReactNode;
  color: string;
  loading: boolean;
  delayMs: number;
}

function StatTile({ label, value, icon, color, loading, delayMs }: StatTileProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        flex: "1 1 200px",
        minWidth: 200,
        animation: `fadeInUp 500ms cubic-bezier(0.4, 0, 0.2, 1) ${delayMs}ms both`,
        "&:hover": {
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(color, 0.12),
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          {loading ? (
            <Skeleton variant="text" width={48} height={36} />
          ) : (
            <Typography variant="h4" fontWeight={700} letterSpacing="-0.02em">
              {value}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" noWrap>
            {label}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export function HomePage({ onNavigateToSchedule }: HomePageProps) {
  const theme = useTheme();
  const lessonsQuery = useLessons(ALL_LESSONS_FILTERS);
  const instructorsQuery = useInstructors();

  const lessons = lessonsQuery.data ?? [];
  const loading = lessonsQuery.isLoading;

  const stats = [
    {
      label: "Total lessons",
      value: lessons.length,
      icon: <ListAltRoundedIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "Scheduled",
      value: countByStatus(lessons, "Scheduled"),
      icon: <EventAvailableRoundedIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "Completed",
      value: countByStatus(lessons, "Completed"),
      icon: <CheckCircleRoundedIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Cancelled",
      value: countByStatus(lessons, "Cancelled"),
      icon: <CancelRoundedIcon />,
      color: theme.palette.text.secondary,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Stack spacing={3}>
        <Box sx={{ animation: "fadeInUp 500ms cubic-bezier(0.4, 0, 0.2, 1) both" }}>
          <Typography variant="h5" fontWeight={700}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(), "EEEE, MMMM d, yyyy")} · here's how the training
            schedule looks today.
          </Typography>
        </Box>

        <Stack direction="row" flexWrap="wrap" gap={2}>
          {stats.map((stat, index) => (
            <StatTile
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              loading={loading}
              delayMs={80 * (index + 1)}
            />
          ))}
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            animation: "fadeInUp 500ms cubic-bezier(0.4, 0, 0.2, 1) 400ms both",
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.06,
            )}, transparent)`,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Manage the training schedule
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480 }}>
              View upcoming and past lessons, search by trainee, filter by
              instructor or status, and mark attendance
              {instructorsQuery.data
                ? ` across ${instructorsQuery.data.length} instructors.`
                : "."}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={onNavigateToSchedule}
            sx={{ flexShrink: 0 }}
          >
            Open Training Schedule
          </Button>
        </Paper>
      </Stack>
    </Container>
  );
}
