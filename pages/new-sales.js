import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/client";
import formatDate from "@/utils/formatDateFromTimeStamp";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "../styles/new-sales.module.css";

function CustomerDropDown({
  isOpen,
  customers,
  keyword,
  setSelectedCustomer,
  setIsOpen,
}) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className={styles["customer-dropdown"]}>
      {customers
        .filter(
          (item) =>
            item?.phone.includes(keyword) ||
            item?.name.toLowerCase().includes(keyword.toLowerCase())
        )
        ?.map((customer, index) => {
          return (
            <div
              key={index}
              className={styles["customer-preview"]}
              onClick={() => {
                setSelectedCustomer(customer);
                setIsOpen(false);
              }}
            >
              <h3>{customer?.name}</h3>
              <p>{customer?.phone}</p>
            </div>
          );
        })}
    </div>
  );
}

const Sales = () => {
  const router = useRouter();

  const [customers, setCustomers] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [timestamp, setTimestamp] = useState(null);

  const [isCustomerDropDownOpen, setIsCustomerDropDownOpen] = useState(false);
  const [customerSearchKeyword, setCustomerSearchKeyword] = useState("");

  async function fetchProducts() {
    let { data, error } = await supabase.from("product").select("*");
    if (data) {
      setProducts(data);
    }
  }

  async function fetchCustomers() {
    let { data, error } = await supabase.from("customers").select("*");
    if (data) {
      setCustomers(data);
    }
  }

  useEffect(() => {
    setTimestamp(Date.now());
    fetchProducts();
    fetchCustomers();
  }, []);

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["top-bar"]}>
        <div className={styles["top-title"]}>
          <div></div>
          <h1>Sales</h1>
        </div>
        <div className={styles["nav-status"]}>Home/Sales/New Sales</div>
      </div>

      <div className={styles["nav-button"]}>
        <button>Add Sales</button>
        <button>Manage Sales</button>
        <button
          onClick={() => {
            router.push("/sales-list");
          }}
        >
          List Sales
        </button>
      </div>
      <div className={styles["sales-box"]}>
        <h1>New Sales</h1>
        <div className={styles["sales-top"]}>
          <div className={styles["sales-customer"]}>
          <p>Search</p>
            <div >
              <input 
              className={styles["customer-search"]}
              value={customerSearchKeyword}
                type="text"
                placeholder="search customer"
                onClick={(e) => {
                  setIsCustomerDropDownOpen(true);
                }}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setIsCustomerDropDownOpen(false);
                    setCustomerSearchKeyword(e.target.value);
                  } else {
                    setIsCustomerDropDownOpen(true);
                    setCustomerSearchKeyword(e.target.value);
                  }
                }}
              />
              <CustomerDropDown
                isOpen={isCustomerDropDownOpen}
                customers={customers}
                keyword={customerSearchKeyword}
                setSelectedCustomer={setSelectedCustomer}
                setIsOpen={setIsCustomerDropDownOpen}
              />
            </div>
            {selectedCustomer && (
              <div className={styles["sales-customer-details"]}>
                <p>{`Name: ${selectedCustomer?.name}`}</p>
                <p>{`Phone: ${selectedCustomer?.phone}`}</p>
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setCustomerSearchKeyword("");
                  }}
                >
                  x
                </button>
              </div>
            )}

            <button className={styles['add-customer-button']}
              onClick={() => {
                router.push("/add-customer");
              }}
            >
              +
            </button>
          </div>
          <div className={styles['payment']}>
            <p>Payment</p>
            <input type="text" placeholder="by cash / by bank" />
          </div>
          <div className={styles['date']}>
            <p>Date : </p>
            <p>{formatDate(timestamp)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
