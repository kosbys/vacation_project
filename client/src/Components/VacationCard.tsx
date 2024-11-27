import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { Vacation } from "../types";
import { Badge, Button, Chip, Stack } from "@mui/material";
import { red } from "@mui/material/colors";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

// pagination
export default function VacationCard({ vacation }: { vacation: Vacation }) {
  const {
    user,
    handleFollow,
    handleUnFollow,
    checkFollowing,
    checkFollowingNumber,
  } = useContext(AuthContext)!;
  const [following, setFollowing] = useState<boolean>(false);
  const [followingNumber, setFollowingNumber] = useState<number>(0);

  const role = user?.role;

  const formattedDates = {
    startDate: new Date(vacation.start_date).toISOString().split("T")[0],
    endDate: new Date(vacation.end_date).toISOString().split("T")[0],
  };

  useEffect(() => {
    checkFollowingNumber(vacation.id).then((res) => {
      setFollowingNumber(res);
    });
    checkFollowing(user!.id, vacation.id).then((res) => {
      setFollowing(res);
    });
  }, []);

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardHeader
        title={
          <Stack direction="row">
            <Typography variant="h5" flexGrow={1}>
              {vacation.destination}
            </Typography>
            {role === "user" ? (
              <Chip
                label={following ? "Following" : "Not following"}
                sx={{ placeSelf: "end" }}
                variant={following ? "filled" : "outlined"}
                color="primary"
              />
            ) : (
              ""
            )}
          </Stack>
        }
        subheader={
          <Stack paddingTop={2} direction="row" gap={1}>
            <DateRangeIcon />
            <Typography
              flexGrow={1}
            >{`${formattedDates.startDate} - ${formattedDates.endDate}`}</Typography>
            {role === "user" ? (
              <Badge
                sx={
                  following
                    ? {
                        "& .MuiBadge-badge": {
                          backgroundColor: "red",
                          color: "white",
                        },
                      }
                    : {}
                }
                color="primary"
                badgeContent={followingNumber}
              >
                <FavoriteIcon />
              </Badge>
            ) : (
              <Badge color="primary" badgeContent={followingNumber}>
                <FavoriteIcon />
              </Badge>
            )}
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
              onClick={async () => {
                if (following) {
                  await handleUnFollow(vacation.id).then(() => {
                    setFollowing(false);
                    setFollowingNumber((prev) => prev - 1);
                  });
                } else {
                  await handleFollow(vacation.id).then(() => {
                    setFollowing(true);
                    setFollowingNumber((prev) => prev + 1);
                  });
                }
              }}
              variant={following ? "outlined" : "contained"}
              aria-label="follow"
            >
              {following ? (
                <FavoriteBorderOutlinedIcon
                  htmlColor={red[500]}
                  sx={{ paddingRight: "5px" }}
                />
              ) : (
                <FavoriteIcon
                  htmlColor={red[500]}
                  sx={{ paddingRight: "5px" }}
                />
              )}
              {following ? "Unfollow" : "Follow"}
            </Button>
          </Stack>
        )}
      </CardActions>
    </Card>
  );
}
