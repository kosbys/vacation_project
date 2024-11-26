import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { Vacation } from "../types";
import { Button, Stack } from "@mui/material";
import { red } from "@mui/material/colors";

// TODO
const followVacation = async () => {};

const checkFollowed = async () => {};

export default function VacationCard({
  vacation,
  role,
}: {
  vacation: Vacation;
  role: string;
}) {
  const formattedDates = {
    startDate: new Date(vacation.start_date).toISOString().split("T")[0],
    endDate: new Date(vacation.end_date).toISOString().split("T")[0],
  };

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardHeader
        title={
          <Stack direction="row">
            <Typography variant="h5" flexGrow={1}>
              {vacation.destination}
            </Typography>
            {/* Check follow, disable for admin */}
            <Typography sx={{ placeSelf: "center" }} variant="body2">
              Following
            </Typography>
          </Stack>
        }
        subheader={
          <Stack paddingTop={1} direction="row" gap={1}>
            <DateRangeIcon></DateRangeIcon>
            {`${formattedDates.startDate} - ${formattedDates.endDate}`}
          </Stack>
        }
      />
      <CardMedia
        component="img"
        image={`http://localhost:3000/public/${vacation.image_name}`}
        alt={vacation.destination}
        sx={{ maxHeight: 500 }}
      />
      <CardContent sx={{ padding: "10px" }}>
        <Stack>
          <Typography
            paddingLeft={2}
            paddingBottom={2}
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            {vacation.description}
          </Typography>
          <Button
            disableRipple
            disableFocusRipple
            disableElevation
            fullWidth
            variant="contained"
            color="primary"
            sx={{ alignSelf: "center", justifySelf: "center" }}
          >
            ${vacation.price}
          </Button>
        </Stack>
      </CardContent>
      <CardActions disableSpacing>
        {role === "admin" ? (
          <>
            <IconButton
              onClick={() => {
                console.log("edit");
              }}
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                console.log("delete");
              }}
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          </>
        ) : (
          <Stack>
            <Button
              variant="outlined"
              onClick={() => {
                console.log("follow");
              }}
              aria-label="follow"
            >
              <FavoriteIcon htmlColor={red[500]} sx={{ paddingRight: "5px" }} />
              Follow
            </Button>
          </Stack>
        )}
      </CardActions>
    </Card>
  );
}
