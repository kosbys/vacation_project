import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import UserVacation from "./UserVacation";

export default function Vacations() {
  const { user, handleLogout } = useContext(AuthContext)!;

  return <UserVacation></UserVacation>;
}
