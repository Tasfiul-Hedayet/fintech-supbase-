import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "../styles/Sidebar.module.css";

const Sidebar = () => {
  const router = useRouter();

  async function logout() {
    localStorage.setItem("user", JSON.stringify(null));
    router.push("/");
  }

  let [isToggled, setToggled] = useState(false);

  function toggle() {
    setToggled((current) => !current);
  }

  if (!isToggled) {
    return (
      <div className={styles["open-sidebar"]}>
        <div
          className={styles["menu-open-button"]}
          onClick={() => {
            toggle();
          }}
        ></div>
      </div>
    );
  } else {
    return (
      <div className={styles["sidebar"]}>
        <div
          className={styles["menu-close-button"]}
          onClick={() => {
            toggle();
          }}
        ></div>
        <div
          className={styles["title-link"]}
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          {"Brother's International"}
        </div>

        <div
          className={styles["link"]}
          onClick={() => {
            router.push("/add-supplier");
          }}
        >
          Supplier
        </div>

        <div
          className={styles["link"]}
          onClick={() => {
            router.push("/add-product");
          }}
        >
          Product
        </div>

        <div
          className={styles["link"]}
          onClick={() => {
            router.push("/add-purchase");
          }}
        >
          Purchase Invoice
        </div>

        <div
          className={styles["link"]}
          onClick={() => {
            router.push("/customer_ledger");
          }}
        >
          Customer Ledger
        </div>

        <div
          className={styles["link"]}
          onClick={() => {
            router.push("/cash_ledger");
          }}
        >
          Cash Ledger
        </div>

        <div
          className={styles["link"]}
          onClick={() => {
            router.push("/sales_ledger");
          }}
        >
          Sales Ledger
        </div>

        {/* <div className={styles['link']} onClick={() => { router.push('/payment') }}>
                    Suppplier Payment
                </div> */}

        <div
          className={styles["link"]}
          onClick={() => {
            router.push("/add-customer");
          }}
        >
          Customer
        </div>

        <div
          className={styles["link"]}
          onClick={() => {
            router.push("/new-sales");
          }}
        >
          Sales Invoice
        </div>

        <div
          className={styles["link"]}
          onClick={() => {
            router.push("/customer-payment");
          }}
        >
          Customer payment
        </div>

        <div className={styles["link"]} onClick={logout}>
          Logout
        </div>
      </div>
    );
  }
};

export default Sidebar;
