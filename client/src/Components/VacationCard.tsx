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
import { useNavigate } from "react-router";
import DeleteConfirm from "./DeleteConfirm";

export default function VacationCard({
  vacation,
  refresh,
}: {
  vacation: Vacation;
  refresh: () => Promise<void>;
}) {
  const {
    user,
    handleFollow,
    handleUnFollow,
    checkFollowing,
    checkFollowingNumber,
  } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const role = user?.role;
  const [followingNumber, setFollowingNumber] = useState<number>(0);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpen = () => setOpenConfirm(true);
  const handleClose = () => setOpenConfirm(false);

  const formattedDates = {
    startDate: new Date(vacation.start_date).toISOString().split("T")[0],
    endDate: new Date(vacation.end_date).toISOString().split("T")[0],
  };

  useEffect(() => {
    checkFollowingNumber(vacation.id).then((res) => {
      setFollowingNumber(res);
    });
    checkFollowing(user!.id, vacation.id).then((res) => {
      vacation.following = res;
    });
  }, []);

  return (
    <>
      <DeleteConfirm
        vacation={vacation}
        open={openConfirm}
        onClose={handleClose}
        refresh={refresh}
      />
      <Card sx={{ width: 400, maxHeight: 700 }}>
        <CardHeader
          title={
            <Stack direction="row">
              <Typography variant="h5" flexGrow={1}>
                {vacation.destination}
              </Typography>
              {role === "user" ? (
                <Chip
                  label={vacation.following ? "Following" : "Not following"}
                  sx={{ placeSelf: "end" }}
                  variant={vacation.following ? "filled" : "outlined"}
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
                    vacation.following
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
          height={200}
          width={200}
        />
        <CardContent sx={{ padding: "10px" }}>
          <Stack>
            <Typography
              paddingLeft={2}
              height={200}
              paddingBottom={2}
              variant="body2"
              sx={{ color: "text.secondary" }}
            >
              {vacation.description}
            </Typography>
            <Chip label={`$${vacation.price}`} color="primary"></Chip>
          </Stack>
        </CardContent>
        <CardActions disableSpacing>
          {role === "admin" ? (
            <>
              <IconButton
                onClick={() => {
                  navigate("/editvacation", { state: vacation });
                }}
                aria-label="edit"
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleOpen} aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </>
          ) : (
            <Stack>
              <Button
                onClick={async () => {
                  if (vacation.following) {
                    await handleUnFollow(vacation.id).then(() => {
                      vacation.following = false;
                      setFollowingNumber((prev) => prev - 1);
                    });
                  } else {
                    await handleFollow(vacation.id).then(() => {
                      vacation.following = true;
                      setFollowingNumber((prev) => prev + 1);
                    });
                  }
                }}
                variant={vacation.following ? "outlined" : "contained"}
                aria-label="follow"
              >
                {vacation.following ? (
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
                {vacation.following ? "Unfollow" : "Follow"}
              </Button>
            </Stack>
          )}
        </CardActions>
      </Card>
    </>
  );
}
