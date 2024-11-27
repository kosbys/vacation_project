import { Box, FormControlLabel, Switch } from "@mui/material";
import { Filters } from "../types";
import React from "react";

export default function VacationFilters({
  filters,
  onToggle,
}: {
  filters: Filters;
  onToggle: (Filters: Filters) => void;
}) {
  const handleToggle = (filterType: string) => {
    return (_e: React.SyntheticEvent, checked: boolean): void => {
      const newFilters = { ...filters, [filterType]: checked };

      if (filterType === "upcoming" && checked) {
        newFilters.current = false;
      } else if (filterType === "current" && checked) {
        newFilters.upcoming = false;
      }

      onToggle(newFilters);
    };
  };

  return (
    <Box alignSelf="center" display="flex" gap={2} padding={1}>
      <FormControlLabel
        labelPlacement="bottom"
        checked={filters.followed}
        onChange={handleToggle("followed")}
        control={<Switch />}
        label="Followed"
      />
      <FormControlLabel
        labelPlacement="bottom"
        checked={filters.current}
        control={<Switch />}
        onChange={handleToggle("current")}
        label="Ongoing"
      />
      <FormControlLabel
        labelPlacement="bottom"
        checked={filters.upcoming}
        control={<Switch />}
        onChange={handleToggle("upcoming")}
        label="Future"
      />
    </Box>
  );
}
