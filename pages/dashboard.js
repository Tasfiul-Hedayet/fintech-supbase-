import Sidebar from "@/components/Sidebar";
import UnAuthenticated from "@/components/UnAuthenticated";
import React, { useEffect, useState } from "react";
import styles from "../styles/dashboard.module.css";
import { supabase } from "@/lib/client";

const Dashboard = () => {
  let [user, setUser] = useState(null);
  const [cashLedger, setcashLedger] = useState([]);

  async function fetchCashLedger() {
    let { data, error } = await supabase.from("cash_ledger").select("*");
    if (data) {
      setcashLedger(data);
    }
    if (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCashLedger();
  }, []);

  useEffect(() => {
    let isLoggedIn = JSON.parse(localStorage.getItem("user")); // should be user
    setUser(isLoggedIn);
  }, []);

  if (user === null) {
    return <UnAuthenticated />;
  } else {
    return (
      <div>
        <Sidebar />
        <div className={styles["page"]}>
          {/* {JSON.stringify(user)} */}
          {/* cart design start here */}
          <div className={styles["cart"]}>
          
            <div className={styles["box1"]}>
              {fetchCashLedger && (
                <div>
                  {cashLedger.length > 0 && (
                    <p>Total Store Cash: {cashLedger[cashLedger.length - 1].balance}</p>
                  )}
                </div>
              )}
            </div>

            <div className={styles["box2"]}>
              <p>
                 Store value - 
              </p>
            </div>

            <div className={styles["box3"]}>
              <p> 
                  Products - 
              </p>
            </div>

            <div className={styles["box4"]}>
              <p>
                Out of stock
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard;
