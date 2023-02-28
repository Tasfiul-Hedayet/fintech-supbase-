import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/sales.module.css";

const sales = () => {

  const [invoice, setInvoice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selling, setSelling] = useState("");
  const [percentage, setPercentage] = useState("");
  const [direct, setDirect] = useState("");
  const [caring, setCaring] = useState("");
  const [transportation, setTransportation] = useState("");
  const [total, setTotal] = useState("");
  const [signature, setSignature] = useState("");
  const [reference, SetReference] = useState("");

  const [isLoading, setLoading] = useState(false);

  async function savePurchase() {
    console.log(
      invoice,
      quantity,
      selling,
      percentage,
      direct,
      caring,
      transportation,
      total,
      signature,
      reference
    );

    setLoading(true);
    // let { data, error } = await supabase.from('users').select('*').match({ username: username, password: password });
    await supabase.from("sales").insert([
      {
        invoice,
        selling,
        quantity,
        percentage,
        direct,
        caring,
        transportation,
        total,
        signature,
        reference,
      },
    ]);
    // clear input after submit
    setLoading(false);
    setInvoice;
    setSelling;
    setQuantity;
    setPercentage;
    setDirect;
    setCaring;
    setTransportation;
    setTotal;
    setSignature;
    SetReference;
  }

  if (isLoading) return <div>Loading ....</div>;

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["box"]}>
      <h2 className={styles["h2"]}>Sales Invoice</h2>
        <input
          value={invoice}
          onChange={(e) => {
            setInvoice(e.target.value);
          }}
          type="text"
          placeholder="Invoice"
        ></input>
        <input
          value={selling}
          onChange={(e) => {
            setSelling(e.target.value);
          }}
          type="text"
          placeholder="Selling Price"
        ></input>
        <input
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
          }}
          type="text"
          placeholder="Quantity/unit"
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
          value={caring}
          onChange={(e) => {
            setCaring(e.target.value);
          }}
          type="text"
          placeholder="Caring Cost"
        ></input>
        <input
          value={transportation}
          onChange={(e) => {
            setTransportation(e.target.value);
          }}
          type="text"
          placeholder="Transportation"
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

export default sales;
