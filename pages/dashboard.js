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
      <>
      <Sidebar />
      <div className={styles["page"]}>
        {/* {JSON.stringify(user)} */}
        {/* cart design start here */}
      <div className={styles["cart"]}>

      <div className={styles["box1"]}>
      <p>Hello</p>
      </div>

      <div className={styles["box2"]}>
      <p>kemon</p>
      </div>

      <div className={styles["box3"]}>
      <p>acho</p>
      </div>

      <div className={styles["box4"]}>
      <p>tumi</p> 
      </div>

      </div>
        
      </div>
      </>
    );
  }
};

export default Dashboard;
