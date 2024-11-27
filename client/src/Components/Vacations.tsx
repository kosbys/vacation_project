import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Pagination, Stack } from "@mui/material";
import { Vacation } from "../types";
import VacationCard from "./VacationCard";

export default function Vacations() {
  const { getVacations } = useContext(AuthContext)!;
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchVacations = async () => {
      const fetched = await getVacations();
      setVacations(fetched);
    };

    fetchVacations();
  }, []);

  const changePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const startIndex = (page - 1) * 10;
  const currentVacations = vacations.slice(startIndex, startIndex + 10);

  return (
    <Stack direction="column">
      <Stack direction="row" spacing={2} useFlexGap padding={3} flexWrap="wrap">
        {currentVacations.map((vacation) => (
          <VacationCard key={vacation.id} vacation={vacation} />
        ))}
      </Stack>
      <Stack spacing={2} paddingBottom={2} alignItems="center">
        <Pagination
          count={Math.ceil(vacations.length / 10)} // Total pages
          page={page}
          onChange={changePage}
          color="primary"
        />
      </Stack>
    </Stack>
  );
}
