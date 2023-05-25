import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/add-supplier.module.css";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const Customer = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  async function saveSupplier() {
    console.log(name, phone, address, description);
    // alert("Data Inserted");
    toast.success("Data Inserted");


    // let { data, error } = await supabase.from('users').select('*').match({ username: username, password: password });
    await supabase
      .from("suppliers")
      .insert([{ name, phone, address, description }]);
    // clear input after submit

    setName("");
    setAddress("");
    setPhone("");
    setDescription("");
  }


  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["top-bar"]}>
        <div className={styles["top-title"]}>
          <div></div>
          <h1>Supplier</h1>
        </div>
        <div className={styles["nav-status"]}>Home/Supplier/Add Supplier</div>
      </div>

      <div className={styles["nav-button"]}>
        <button>Add Supplier </button>
        <button onClick={() => { router.push('/manage-supplier') }}>Manage Supplier</button>
        <button onClick={() => { router.push('/supplier-list') }}>List Supplier</button>
      </div>
      
      <div className={styles["add-box"]}>
        <h1>Add Supplier</h1>
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
        <button onClick={saveSupplier}>Save</button>
        <button onClick={saveSupplier}> Save and add Another</button>
        </div>
      </div>
    </div>
  );
};

export default Customer;
