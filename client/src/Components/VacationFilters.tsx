import { Box, FormControlLabel, Switch, Typography } from "@mui/material";

type Filters = {
  followed: boolean;
  upcoming: boolean;
  current: boolean;
};

// DO THIS DO THIS DO THIS
// Switch that filters only followed vacations
// Switch that filters only vacations that haven't begun (date compare)
// Switch that filters only vacations that are happening right now (date range)
export default function VacationFilters() {
  return (
    <Box alignSelf="center" display="flex" gap={2} padding={1}>
      <FormControlLabel
        labelPlacement="bottom"
        control={<Switch />}
        label="Followed"
      />
      <FormControlLabel
        labelPlacement="bottom"
        control={<Switch />}
        label="Future"
      />
      <FormControlLabel
        labelPlacement="bottom"
        control={<Switch />}
        label="Ongoing"
      />
    </Box>
  );
}
