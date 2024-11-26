import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Stack } from "@mui/material";
import { Vacation } from "../types";
import VacationCard from "./VacationCard";

export default function Vacations() {
  const { getVacations } = useContext(AuthContext)!;
  const [vacations, setVacations] = useState<Vacation[]>([]);

  useEffect(() => {
    const fetchVacations = async () => {
      const fetched = await getVacations();
      setVacations(fetched);
    };

    fetchVacations();
  }, []);

  return (
    <Stack direction="row" spacing={2} padding={3}>
      {vacations.map((vacation) => (
        <VacationCard key={vacation.id} vacation={vacation} />
      ))}
    </Stack>
  );
}
