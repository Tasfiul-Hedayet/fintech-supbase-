import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/purchase.module.css";
import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";

const ids = ["1"];

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
    <div ref={ref}>
      <p>invoice = {invoice}</p>
      <p>date = {date}</p>
      <p>purchase = {purchase}</p>
      <p>quantity = {quantity}</p>
    </div>
  )
);
Document.displayName = 'Document';


function Purchase () {
  const [type, setType] = useState(PAGE_TYPES.ADD);

  const [invoice, setInvoice] = useState("");
  const [date, setDate] = useState("");
  const [purchase, setPurchase] = useState("");
  const [quantity, setQuantity] = useState("");
  const [percentage, setPercentage] = useState("");
  const [direct, setDirect] = useState("");
  const [caring, setCaring] = useState("");
  const [transportation, setTransportation] = useState("");
  const [total, setTotal] = useState("");
  const [signature, setSignature] = useState("");
  const [reference, SetReference] = useState("");

  const documentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => documentRef.current,
  });

  const [isLoading, setLoading] = useState(false);

  async function savePurchase() {
    console.log(
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
      reference
    );

    setLoading(true);
    // let { data, error } = await supabase.from('users').select('*').match({ username: username, password: password });
    await supabase.from("purchase").insert([
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
    ]);
    // clear input after submit
    setLoading(false);
    // setInvoice;
    // setDate;
    // setPurchase;
    // setQuantity;
    // setPercentage;
    // setDirect;
    // setCaring;
    // setTransportation;
    // setTotal;
    // setSignature;
    // SetReference;
  }

  if (isLoading) return <div>{"Loading ...."}</div>;

  return (
    <div className={styles["page"]}>
      <Sidebar />
      {type === PAGE_TYPES.ADD && (
        <div className={styles["box"]}>
          <h2 className={styles["h2"]}>{"Purchase"}</h2>
          <input
            value={invoice}
            onChange={(e) => {
              setInvoice(e.target.value);
            }}
            type="text"
            placeholder="Invoice"
          ></input>
          <input
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
            type="text"
            placeholder="Date"
          ></input>
          <input
            value={purchase}
            onChange={(e) => {
              setPurchase(e.target.value);
            }}
            type="text"
            placeholder="Purchasing Price"
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
          <button
            onClick={() => {
              setType(PAGE_TYPES.PRINT);
            }}
          >
           {"Go to print page"}
          </button>
        </div>
      )}

      {type === PAGE_TYPES.PRINT && (
        <>
          <Document invoice={invoice} ref={documentRef} />
          <button onClick={handlePrint}>{"Print this out!"}</button>
        </>
      )}
    </div>
  );
};

export default Purchase;
