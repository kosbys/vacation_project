import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Pagination, Stack } from "@mui/material";
import { Filters, Vacation } from "../types";
import VacationCard from "./VacationCard";
import VacationFilters from "./VacationFilters";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useLocation } from "react-router";

export default function Vacations() {
  const { getVacations, checkFollowing, user } = useContext(AuthContext)!;
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    followed: false,
    upcoming: false,
    current: false,
  });

  const refreshVacations = async () => {
    const fetched = await getVacations();
    const vacationsFull = await Promise.all(
      fetched.map(async (vacation: Vacation) => {
        const following = await checkFollowing(user!.id, vacation.id);
        return { ...vacation, following };
      })
    );

    const filteredVacations = vacationsFull.filter((vacation) => {
      if (filters.followed && !vacation.following) {
        return false;
      }

      if (filters.upcoming) {
        return dayjs(vacation.start_date).isAfter(dayjs());
      }

      if (filters.current) {
        return dayjs().isBetween(
          dayjs(vacation.start_date),
          dayjs(vacation.end_date)
        );
      }

      return true;
    });

    setVacations(filteredVacations);
    setPage(1);
  };

  useEffect(() => {
    refreshVacations();
  }, [filters]);

  const changePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const startIndex = (page - 1) * 10;
  const currentVacations = vacations.slice(startIndex, startIndex + 10);

  const filterToggleClick = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <Stack direction="column">
      <VacationFilters filters={filters} onToggle={filterToggleClick} />
      <Stack
        direction="row"
        justifyContent="center"
        spacing={2}
        useFlexGap
        padding={2}
        flexWrap="wrap"
      >
        {currentVacations.map((vacation) => (
          <VacationCard
            key={vacation.id}
            vacation={vacation}
            refresh={refreshVacations}
          />
        ))}
      </Stack>
      <Stack spacing={2} paddingBottom={2} alignItems="center">
        <Pagination
          count={Math.ceil(vacations.length / 10)}
          page={page}
          onChange={changePage}
          color="primary"
        />
      </Stack>
    </Stack>
  );
}
