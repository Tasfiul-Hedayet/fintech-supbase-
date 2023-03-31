import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/supplier-list.module.css";
import { useRouter } from "next/router";

const Customer = () => {
  const [suppliers, setSuppliers] = useState([]);
  const router = useRouter();

  async function fetchSuppliers() {
    let { data, error } = await supabase.from("suppliers").select("*");
    if (data) {
      setSuppliers(data);
    }
  }

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["top-bar"]}>
        <div className={styles["top-title"]}>
          <div></div>
          <h1>Supplier</h1>
        </div>
        <div className={styles["nav-status"]}>Home/Supplier/Supplier list</div>
      </div>

      <div className={styles["nav-button"]}>
        <button
          onClick={() => {
            router.push("/add-supplier");
          }}
        >
          Add Supplier{" "}
        </button>
        <button
          onClick={() => {
            router.push("/manage-supplier");
          }}
        >Manage Supplier</button>
        <button>List Supplier</button>
      </div>
      <div className={styles["add-box"]}>
        <h1>Supplier list</h1>
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
          {suppliers?.map((supplier, index) => {
            return (
              <React.Fragment  key={index}>
                <div>
                  <p>{index + 1}</p>
                </div>
                <div>
                  <p>{supplier?.ID}</p>
                </div>
                <div>
                  <p>{supplier.name}</p>
                </div>
                <div>
                  <p>{supplier.phone}</p>
                </div>
                <div>
                  <p>{supplier.address}</p>
                </div>
                <div>
                  <p>{supplier.description}</p>
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
