import Sidebar from "@/components/Sidebar";
import UnAuthenticated from "@/components/UnAuthenticated";
import React, { useEffect, useState } from "react";
import styles from "../styles/dashboard.module.css";

const Dashboard = () => {
  let [user, setUser] = useState(null);

  useEffect(() => {
    let isLoggedIn = JSON.parse(localStorage.getItem("user")); // should be user
    setUser(isLoggedIn);
  }, []);

  if (user === null) {
    return <UnAuthenticated />;
  } else {
    return (
      <div className={styles["page"]}>
        <Sidebar />
        {JSON.stringify(user)}
      </div>
    );
  }
};

export default Dashboard;
