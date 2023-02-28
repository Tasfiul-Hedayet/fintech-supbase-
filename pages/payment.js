import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/payment.module.css";

const Payment = () => {
  const [invoice, setInvoice] = useState("");
  const [cash, setCash] = useState("");
  const [cheque, setCheque] = useState("");
  const [online, setOnline] = useState("");
  const [percentage, setPercentage] = useState("");
  const [direct, setDirect] = useState("");
  const [total, setTotal] = useState("");
  const [signature, setSignature] = useState("");
  const [reference, SetReference] = useState("");

  const [isLoading, setLoading] = useState(false);

  async function savePurchase() {
    console.log(
      invoice,
      cash,
      cheque,
      online,
      percentage,
      direct,
      total,
      signature,
      reference
    );

    setLoading(true);
    // let { data, error } = await supabase.from('users').select('*').match({ username: username, password: password });
    await supabase.from("payment").insert([
      {
        invoice,
        cash,
        cheque,
        online,
        percentage,
        direct,
        total,
        signature,
        reference,
      },
    ]);
    // clear input after submit
    setLoading(false);
    setInvoice,
      setCash,
      setCheque,
      setOnline,
      setPercentage,
      setDirect,
      setTotal,
      setSignature,
      SetReference;
  }

  if (isLoading) return <div>Loading ....</div>;

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["box"]}>
        <h2 className={styles["h2"]}>{"Supplier's Payment"}</h2>
        <input
          value={invoice}
          onChange={(e) => {
            setInvoice(e.target.value);
          }}
          type="text"
          placeholder="Invoice"
        ></input>
        <input
          value={cash}
          onChange={(e) => {
            setCash(e.target.value);
          }}
          type="text"
          placeholder="Cash"
        ></input>
        <input
          value={cheque}
          onChange={(e) => {
            setCheque(e.target.value);
          }}
          type="text"
          placeholder="Cheque"
        ></input>

        <input
          value={online}
          onChange={(e) => {
            setOnline(e.target.value);
          }}
          type="text"
          placeholder="Online"
        ></input>

        <input
          value={percentage}
          onChange={(e) => {
            setPercentage(e.target.value);
          }}
          type="text"
          placeholder="Percentage"
        ></input>
        <input
          value={direct}
          onChange={(e) => {
            setDirect(e.target.value);
          }}
          type="text"
          placeholder="Direct Discount"
        ></input>

        <input
          value={total}
          onChange={(e) => {
            setTotal(e.target.value);
          }}
          type="text"
          placeholder="Total Amount"
        ></input>
        <input
          value={signature}
          onChange={(e) => {
            setSignature(e.target.value);
          }}
          type="text"
          placeholder="Signature"
        ></input>
        <input
          value={reference}
          onChange={(e) => {
            SetReference(e.target.value);
          }}
          type="text"
          placeholder="Reference"
        ></input>
        <button onClick={savePurchase}>Add</button>
      </div>
    </div>
  );
};

export default Payment;
