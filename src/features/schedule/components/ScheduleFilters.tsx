import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import type { KeyboardEvent } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, parseISO } from "date-fns";
import { LESSON_STATUSES, type LessonFilters } from "../../../types/lesson";

const EMPTY_FILTERS: LessonFilters = {
  search: "",
  instructor: "",
  lessonStatus: "",
  dateFrom: null,
  dateTo: null,
};

interface ScheduleFiltersProps {
  filters: LessonFilters;
  onChange: (filters: LessonFilters) => void;
  instructorOptions: string[];
  isSearching?: boolean;
  onSearchSubmit?: () => void;
}

function toDateOrNull(value: string | null): Date | null {
  if (!value) return null;
  try {
    return parseISO(value);
  } catch {
    return null;
  }
}

export function ScheduleFilters({
  filters,
  onChange,
  instructorOptions,
  isSearching = false,
  onSearchSubmit,
}: ScheduleFiltersProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.instructor !== "" ||
    filters.lessonStatus !== "" ||
    filters.dateFrom !== null ||
    filters.dateTo !== null;

  const dateRangeError =
    filters.dateFrom &&
    filters.dateTo &&
    filters.dateFrom > filters.dateTo;

  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3 }}
    >
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" fontWeight={600}>
          Filters
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "2fr 1.2fr 1.3fr 1fr 1fr auto",
            },
            alignItems: "flex-start",
          }}
        >
          <TextField
            label="Search trainee name"
            placeholder="e.g. Ava Thompson"
            size="small"
            fullWidth
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") onSearchSubmit?.();
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {isSearching ? (
                      <CircularProgress size={16} sx={{ mr: 0.5 }} />
                    ) : (
                      <Stack direction="row" spacing={0.25}>
                        {filters.search !== "" && (
                          <Tooltip title="Clear search">
                            <IconButton
                              size="small"
                              onClick={() =>
                                onChange({ ...filters, search: "" })
                              }
                              aria-label="Clear search"
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Search now">
                          <IconButton
                            size="small"
                            onClick={() => onSearchSubmit?.()}
                            aria-label="Search now"
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            label="Instructor"
            size="small"
            fullWidth
            value={filters.instructor}
            onChange={(e) =>
              onChange({ ...filters, instructor: e.target.value })
            }
          >
            <MenuItem value="">All instructors</MenuItem>
            {instructorOptions.map((instructor) => (
              <MenuItem key={instructor} value={instructor}>
                {instructor}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Lesson status"
            size="small"
            fullWidth
            value={filters.lessonStatus}
            onChange={(e) =>
              onChange({
                ...filters,
                lessonStatus: e.target.value as LessonFilters["lessonStatus"],
              })
            }
          >
            <MenuItem value="">All statuses</MenuItem>
            {LESSON_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>

          <DatePicker
            label="From date"
            value={toDateOrNull(filters.dateFrom)}
            onChange={(date) =>
              onChange({
                ...filters,
                dateFrom: date ? format(date, "yyyy-MM-dd") : null,
              })
            }
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                error: Boolean(dateRangeError),
              },
              field: { clearable: true },
            }}
          />

          <DatePicker
            label="To date"
            value={toDateOrNull(filters.dateTo)}
            onChange={(date) =>
              onChange({
                ...filters,
                dateTo: date ? format(date, "yyyy-MM-dd") : null,
              })
            }
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                error: Boolean(dateRangeError),
              },
              field: { clearable: true },
            }}
          />

          <Button
            size="small"
            startIcon={<ClearIcon fontSize="small" />}
            onClick={() => onChange(EMPTY_FILTERS)}
            disabled={!hasActiveFilters}
            sx={{ height: 40, whiteSpace: "nowrap" }}
          >
            Clear filters
          </Button>
        </Box>

        {dateRangeError && (
          <Typography variant="caption" color="error">
            "From date" must be on or before "To date".
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

export { EMPTY_FILTERS };
