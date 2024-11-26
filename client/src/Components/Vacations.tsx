import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import VacationCard from "./Vacation";
import axios from "axios";
import { Vacation } from "../types";
import { Stack } from "@mui/material";

const createVacations = async (role: "user" | "admin") => {
  return axios
    .get("/vacations", { baseURL: "http://localhost:3000" })
    .then((res) => {
      return res.data.map((vacation: Vacation) => {
        return (
          <VacationCard
            key={vacation.id}
            role={role}
            vacation={vacation}
          ></VacationCard>
        );
      });
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
};

export default function Vacations() {
  const { user } = useContext(AuthContext)!;
  const [vacations, setVacations] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const fetchVacations = async () => {
      const vacations = await createVacations(user!.role);
      setVacations(vacations);
    };

    fetchVacations();
  }, [user]);

  return (
    <Stack direction="row" spacing={2} padding={3}>
      {vacations}
    </Stack>
  );
}
