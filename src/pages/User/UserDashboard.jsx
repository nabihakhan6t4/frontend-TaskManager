import React, { useContext } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const UserDashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  return <DashboardLayout>UserDashboard</DashboardLayout>;
};

export default UserDashboard;
