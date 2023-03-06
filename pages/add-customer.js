import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/add-customer.module.css";
import { useRouter } from "next/router";

const Customer = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  async function saveCustomer() {
    console.log(name, phone, address, description);
    alert("Alert");

    setLoading(true);
    // let { data, error } = await supabase.from('users').select('*').match({ username: username, password: password });
    await supabase
      .from("customers")
      .insert([{ name, phone, address, description }]);
    // clear input after submit
    setLoading(false);
    setName("");
    setAddress("");
    setPhone("");
    setDescription("");
  }

  if (isLoading) return <div>Loading ....</div>;

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["top-bar"]}>
        <div className={styles["top-title"]}>
          <div></div>
          <h1>Customer</h1>
        </div>
        <div className={styles["nav-status"]}>Home/Customer/Add Customer</div>
      </div>

      <div className={styles["nav-button"]}>
        <button>Add Customer</button>
        <button>Manage Customer</button>
        <button onClick={() => { router.push('/customer-list') }}>List Customer</button>
      </div>
      <div className={styles["add-box"]}>
        <h1>Add Customer</h1>
        <div className={styles["add-input"]}>
          <div>
            <label for="Name">Name:</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              type="text"
              placeholder="Name"
            ></input>
          </div>

          <div>
            <label for="Phone">Phone:</label>
            <input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              type="text"
              placeholder="Phone Number"
            ></input>
          </div>

          <div>
            <label for="Address">Address:</label>
            <input
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              type="text"
              placeholder="Address"
            ></input>
          </div>
          <div>
            <label for="Description">Description:</label>
            <input
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              type="text"
              placeholder="Description"
            ></input>
          </div>
        </div>
        <div className={styles["save-button"]}>
        <button onClick={saveCustomer}>Save</button>
        <button onClick={saveCustomer}> Save and add Another</button>
        </div>
      </div>
    </div>
  );
};

export default Customer;
