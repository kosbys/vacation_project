import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { Button, Typography, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { VacationFollowData } from "../types";

export default function Report() {
  const { getVacations, checkFollowingNumber } = useContext(AuthContext)!;
  const [data, setData] = useState<VacationFollowData[]>([]);

  useEffect(() => {
    const fetchFollowData = async () => {
      const vacations = await getVacations();
      const vacationsFollowed = await Promise.all(
        vacations.map(async (vacation) => {
          const follows = await checkFollowingNumber(vacation.id);
          return { destination: vacation.destination, followers: follows };
        })
      );

      setData(vacationsFollowed);
    };

    fetchFollowData();
  }, []);

  const handleExportCSV = () => {
    const csv = Papa.unparse(data);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "vacations-followers.csv");
  };

  return (
    <Stack sx={{ padding: 4 }}>
      <Typography
        color="primary"
        textAlign="center"
        variant="h4"
        component="h1"
        gutterBottom
      >
        Vacations Report
      </Typography>
      <Stack
        flexDirection="column"
        alignItems="center"
        justifyItems="center"
        gap={2}
      >
        <BarChart width={1000} height={700} data={data} margin={{ top: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis fontFamily="Roboto" dataKey="destination" />
          <YAxis />
          <Tooltip
            contentStyle={{
              fontFamily: "Roboto",
            }}
          />
          <Bar dataKey="followers" fill="#3f50b5" />
        </BarChart>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportCSV}
          sx={{ width: "200px" }}
        >
          Export to CSV
        </Button>
      </Stack>
    </Stack>
  );
}
