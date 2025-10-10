import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  // 🔹 Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  // 🔹 Handle Menu Click
  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  // 🔹 Set menu items based on user role
  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    } else {
      setSideMenuData([]); // clear menu if user logs out
    }
  }, [user]);

  return (
    <div className="side-menu">
      <ul>
        {sideMenuData.map((item, index) => (
          <li
            key={index}
            onClick={() => handleClick(item.route)}
            className={`menu-item ${activeMenu === item.route ? "active" : ""}`}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenu;
