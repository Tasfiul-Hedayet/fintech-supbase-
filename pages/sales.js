import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/sales.module.css";
import { useReactToPrint } from "react-to-print";



const PAGE_TYPES = {
  ADD: "ADD",
  LIST: "LIST",
  PRINT: "PRINT",
};

const Document = React.forwardRef(
  (
    {
      invoice,
      date,
      purchase,
      quantity,
      percentage,
      direct,
      caring,
      transportation,
      total,
      signature,
      reference,

    },
    ref
  ) => (
    <div ref={ref} className={styles['document']}>

      <div className={styles['document-title']}>
        <h1>Invoice</h1>
      </div>
      <p>{`invoice Number : ${invoice}`}</p>
      <p>{`Date : ${date.now()}`}</p>
      <p>{`Purchase : ${Date.now()}`}</p>
      <p>purchase = {purchase}</p>
      <p>quantity = {quantity}</p>
    </div>
  )
);



const sales = () => {

  const [type, setType] = useState(PAGE_TYPES.ADD);

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


  const documentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => documentRef.current,
  });


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
    setType(PAGE_TYPES.PRINT);
    // setInvoice;
    // setSelling;
    // setQuantity;
    // setPercentage;
    // setDirect;
    // setCaring;
    // setTransportation;
    // setTotal;
    // setSignature;
    // SetReference;
  }

  if (isLoading) return <div>Loading ....</div>;

  return (

    <div className={styles["page"]}>
      <Sidebar />
      {
        type === PAGE_TYPES.ADD &&

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
      }

      {type === PAGE_TYPES.PRINT && (
        <div className={styles["print-box"]}>
          <Document 
          invoice={invoice} 
          quantity={quantity}
          percentage={percentage}
          direct={direct}
          caring={caring}
          transportation={transportation}
          total={total}
          signature={signature}
          reference={reference}
          
          ref={documentRef} />

          <div className={styles["buttons"]}>
            <button onClick={() => { setType(PAGE_TYPES.ADD) }} > back </button>
            <button onClick={handlePrint}>Print</button>
          </div>
        </div>

      )}

    </div>
  );
};

export default sales;
