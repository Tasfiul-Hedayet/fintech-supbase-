import { supabase } from "@/lib/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "../styles/sales-list.module.css";
import Sidebar from "@/components/Sidebar";

const SalesList = () => {
  let [sales, setSales] = useState([]);
  const router = useRouter();

  async function fetchSales() {
    let { data, error } = await supabase.from("invoice").select("*");
    let salesData = [];
    for (let i = 0; i < data?.length; i++) {
      salesData.push({
        salesID: data[i]?.ID,
        invoice_no: data[i]?.invoice_no,
        data: JSON.parse(data[i]?.data),
      });
    }
    console.log(salesData);
    setSales(salesData);
  }

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["top-bar"]}>
        <div className={styles["top-title"]}>
          <h1>Sales list</h1>
        </div>
        <div className={styles["nav-status"]}>Home/Sales/Sales list</div>
      </div>

      <div className={styles["nav-button"]}>
        <button
          onClick={() => {
            router.push("/new-sales");
          }}
        >
          Sales{" "}
        </button>
        <button
          onClick={() => {
            router.push("/sales-list");
          }}
        >
          Sales list{" "}
        </button>
      </div>
      <div className={styles["label"]}>
        <div>
          <h3>Sl</h3>
        </div>
        <div>
          <h3>invoice no</h3>
        </div>
        <div>
          <h3>customer name</h3>
        </div>
        <div>
          <h3>Date</h3>
        </div>
        <div>
          <h3>total sales</h3>
        </div>
        <div>
          <h3>Action</h3>
        </div>
      </div>

      <div className={styles["data"]}>
        {sales.map((sale, index) => {
          return (
            <React.Fragment key={index}>
              <div>
                <h3>{index + 1} </h3>
              </div>
              <div>
                <h3>{sale?.invoice_no}</h3>
              </div>
              <div>
                <h3>{sale?.data?.customer?.name}</h3>
              </div>
              <div>
                <h3>{sale?.data?.date}</h3>
              </div>
              <div>
                <h3>{sale?.data?.grandTotal}</h3>
              </div>
              <div>
                <button
                  onClick={() => {
                    router.push(`/print/${sale?.salesID}`);
                  }}
                >
                  Details
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default SalesList;
