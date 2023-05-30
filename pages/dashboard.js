import Sidebar from "@/components/Sidebar";
import UnAuthenticated from "@/components/UnAuthenticated";
import React, { useEffect, useState } from "react";
import styles from "../styles/dashboard.module.css";
import { supabase } from "@/lib/client";

const Dashboard = () => {
  let [user, setUser] = useState(null);
  const [cashLedger, setcashLedger] = useState([]);
  const [products, setProducts] = useState([]);
  
  
  const totalQuantity = products.map((element)=>{
    return element.quantity;
  })

  const sum = totalQuantity.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const outOfStock = []   
  products.map((el, index) => {
    if(el.quantity === 0){
      outOfStock.push(el.quantity);
    }
  })

  console.log(outOfStock);

  
  
  async function fetchCashLedger() {
    let { data, error } = await supabase.from("cash_ledger").select("*");
    if (data) {
      setcashLedger(data);
    }
    if (error) {
      console.error(error);
    }
  }

  async function fetchProducts() {
    let { data, error } = await supabase.from("product").select("*");
    if (data) {
      setProducts(data);
    }
    if(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCashLedger();
    fetchProducts();
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
                 Store value - {outOfStock? outOfStock.length : 0}
              </p>
            </div>

            <div className={styles["box3"]}>
            {fetchProducts && (
                <div>
                    <p>product: {sum? sum: null}</p>
                  
                </div>
              )}
            </div>

            <div className={styles["box4"]}>
              <p>
                Out of stock: {outOfStock? outOfStock.length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard;
