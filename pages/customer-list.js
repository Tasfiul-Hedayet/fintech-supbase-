import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/customer-list.module.css";
import { useRouter } from "next/router";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const router = useRouter();

  async function fetchCustomers() {
    let { data, error } = await supabase.from("customers").select("*");
    if (data) {
      setCustomers(data);
    }
    if(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["top-bar"]}>
        <div className={styles["top-title"]}>
          <div></div>
          <h1>Customer</h1>
        </div>
        <div className={styles["nav-status"]}>Home/Customer/Customer list</div>
      </div>

      <div className={styles["nav-button"]}>
        <button
          onClick={() => {
            router.push("/add-customer");
          }}
        >
          Add Customer{" "}
        </button>
        <button onClick={() => { router.push('/manage-customer') }}>Manage Customer</button>
        <button>List Customer</button>
      </div>
      <div className={styles["add-box"]}>
        <h1>Customer list</h1>
        <div className={styles["label"]}>
          <div>
            <h3>Sl</h3>
          </div>
          <div>
            <h3>ID</h3>
          </div>
          <div>
            <h3>Name</h3>
          </div>
          <div>
            <h3>Phone</h3>
          </div>
          <div>
            <h3>Address</h3>
          </div>
          <div>
            <h3>Description</h3>
          </div>
        </div>
        <div className={styles["show-list"]}>
          {customers?.map((customer, index) => {
            return (
              <React.Fragment className={styles["customer"]} key={index}>
                <div>
                  <p>{index + 1}</p>
                </div>
                <div>
                  <p>{customer.ID}</p>
                </div>
                <div>
                  <p>{customer.name}</p>
                </div>
                <div>
                  <p>{customer.phone}</p>
                </div>
                <div>
                  <p>{customer.address}</p>
                </div>
                <div>
                  <p>{customer.description}</p>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Customer;
