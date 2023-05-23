import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/cash_ledger.module.css";
import { useRouter } from "next/router";

const Customer = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  async function fetchProducts() {
    let { data, error } = await supabase.from("cash_ledger").select("*");
    if (data) {
      setProducts(data);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["top-bar"]}>
        <div className={styles["top-title"]}>
          <div></div>
          <h1>Cash ledger</h1>
        </div>
        <div className={styles["nav-status"]}>Home/cash_ledger</div>
      </div>

      <div className={styles["nav-button"]}>
        <button
          onClick={() => {
            router.push("/add-product");
          }}
        >
          Add Product{" "}
        </button>
        <button
          onClick={() => {
            router.push("/manage-products");
          }}
        >
          Manage Product
        </button>
        <button>List Product</button>
      </div>

      <div className={styles["add-box"]}>
        <h1>Cash ledger</h1>
        <div className={styles["label"]}>
          <div>
            <h3>Sl</h3>
          </div>
          <div>
            <h3>Date</h3>
          </div>
          <div>
            <h3>invoice</h3>
          </div>
          <div>
            <h3>incomning</h3>
          </div>
          <div>
            <h3>outgoing</h3>
          </div>
          <div>
            <h3>balance</h3>
          </div>

        </div>

        <div className={styles["show-list"]}>
          {products?.map((product, index) => {
            return (
              <React.Fragment key={index}>
                <div>
                  <p>{index + 1}</p>
                </div>
                <div>
                  <p>{product.date}</p>
                </div>
                <div>
                  <p>{product.invoice}</p>
                </div>
                <div>
                  <p>{product.incoming}</p>
                </div>
                <div>
                  <p>{product.outgoing}</p>
                </div>
                <div>
                  <p>{product.balance}</p>
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
