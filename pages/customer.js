import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/customer.module.css";

const customer = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setLoading] = useState(false);

  async function saveCustomer() {
    console.log(name, phone, address, description);

    setLoading(true);
    // let { data, error } = await supabase.from('users').select('*').match({ username: username, password: password });
    await supabase.from("customers").insert([
      {
        name: name,
        phone: phone,
        address: address,
        description: description,
      },
    ]);
    // clear input after submit
    setLoading(false);
    setName("");
    setPhone("");
    setAddress("");
    setDescription("");
  }

  if (isLoading) return <div>Loading ....</div>;

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["box"]}>
      <h2 className={styles["h1"]}>Customer Details </h2>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          placeholder="Name"
        ></input>
        <input
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
          }}
          type="text"
          placeholder="Phone Number"
        ></input>
        <input
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
          type="text"
          placeholder="Address"
        ></input>
        <input
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          type="text"
          placeholder="Description"
        ></input>
        <button onClick={saveCustomer}>Add</button>
      </div>
    </div>
  );
};

export default customer;
