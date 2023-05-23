import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/client";
import React, { useEffect, useState } from "react";
import styles from "../styles/customer-payment.module.css";
import formatDate from "@/utils/formatDateFromTimeStamp";
import { useRouter } from "next/router";

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

const CustomerPayment = () => {
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerDropDownOpen, setIsCustomerDropDownOpen] = useState(false);
  const [customerSearchKeyword, setCustomerSearchKeyword] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [timestamp, setTimestamp] = useState(null);
  const [ledger, setLedger] = useState(null);

  async function fetchCustomers() {
    let { data, error } = await supabase.from("customers").select("*");
    if (data) {
      setCustomers(data);
    }
    if (error) {
      console.log(error);
    }
  }

  async function saveToCashLedger(salesID, date) {
    // add the paid Amount to the cash ledger
    let cashLedger = {
      incoming: paidAmount,
      outgoing: 0,
      date: date,
      invoice: salesID,
      balance: ledger[ledger.length-1].balance + paidAmount,
    };
    await supabase.from("cash_ledger").upsert([cashLedger]);
    // add the sales to the sales ledger
  }


  async function updateStoresBalance() {
    let { data: storeData, error } = await supabase
      .from("store")
      .select("*")
      .eq("ID", "store");
    let store = storeData[0];
    let newBalance = store?.store_balance + paidAmount;
    await supabase
      .from("store")
      .update({ store_balance: newBalance })
      .eq("ID", "store");
  }

  function is_numeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function UniqueSalesID() {
    let timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
    let uuid = Math.random().toString(16).substr(2, 8);
    return `${timestamp}${uuid}`.toUpperCase();
  }

  async function buttonPressed() {
    let salesID = UniqueSalesID();
    let date = Date.now();
    await saveToCashLedger(salesID, date);
    // update the customer balance
    let newBalance = selectedCustomer?.balance - paidAmount;
    await supabase
      .from("customers")
      .update({ balance: newBalance })
      .eq("ID", selectedCustomer?.ID);

      let print = confirm("Inserted. Do you want to print?");
      if (print)
      {
        router.push(`/print/${salesID}`);
      } else {
        router.reload();
      }
  }

  async function fetchCashLedger() {
    let { data, error } = await supabase.from("cash_ledger").select("*");
    if (data) {
      setLedger(data);
      //console.log(data);
    }
    if(error){
      console.log(error);
    }
  }

  useEffect(() => {
    setTimestamp(Date.now());
    fetchCustomers();
    fetchCashLedger();
  }, []);

  return (
    <>
      <Sidebar />
      <div className={styles.page}>
        <div className={styles["main"]}>
          <h1>Customer Payment</h1>
          <div className={styles.date_container}>
            <p>Date : </p>
            <p>{formatDate(timestamp)}</p>
          </div>
          <div className={styles.payment_type_container}>
            <p>Payment type:</p>
            <input placeholder="Cash / Bank" type="text" />
          </div>
          <div className={styles.input_main}>
            <div>
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
              {selectedCustomer && <p>Customer : {selectedCustomer.name}</p>}
            </div>
            <p> Due: {selectedCustomer?.balance} </p>
            <div className={styles.amount_container}>
              <p>Amount: </p>
              <input
                value={paidAmount}
                placeholder="0.00"
                onChange={(e) => {
                  if (e.target.value === "") {
                    setPaidAmount(0);
                  } else {
                    if (is_numeric(e.target.value))
                      setPaidAmount(parseFloat(e.target.value));
                  }
                }}
              />
            </div>
          </div>
          <button className={styles.pay_button} onClick={buttonPressed}>
            Pay
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomerPayment;
