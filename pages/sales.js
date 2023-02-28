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
      <p>{`Date : ${Date.now()}`}</p>
      <p>{`Purchase : ${Date.now()}`}</p>
      <p>purchase = {purchase}</p>
      <p>quantity = {quantity}</p>
    </div>
  )
);
Document.displayName = 'Document';




function Sales() {

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

  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [isCart, setIsCart] = useState(false);


  const [items, setItems] = useState([]);



  function checkIfAlreadyAddedToCart(product) {

    let added = false;
    for (let i = 0; i < items?.length; i++) {
      console.log(items[i]);
      console.log('prod', product);

      if (items[i].ID === product?.ID) {
        added = true;
        break;
      }
    }
    console.log(added);
    return added;
  }


  const documentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => documentRef.current,
  });


  async function fetchProducts() {
    let { data, error } = await supabase.from("product").select("*");
    if (data) {
      setProducts(data);
    }
  }

  useEffect(() => {
    fetchProducts();

  }, []);



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
  }


  function addToCart(product) {
    let updatedItems = [...items, product];
    setItems(updatedItems);
  }

  function removeFromCart(product) {
    let updatedItems = [];

    for (let i = 0; i < items?.length; i++) {
      if (items[i].ID === product?.ID) continue;
      updatedItems.push(items[i]);
    }
    setItems(updatedItems);
  }

  if (isLoading) return <div>Loading ....</div>;

  return (

    <div className={styles["page"]}>
      <Sidebar />
      {
        type === PAGE_TYPES.ADD &&

        <div className={styles["box"]}>
          <div className={styles['select-container']}>
            <div className={isCart ? styles['select'] : styles['active-select']} onClick={() => setIsCart(false)}>
              Products
            </div>
            <div className={isCart ? styles['active-select'] : styles['select']} onClick={() => setIsCart(true)}>
              Cart
            </div>
          </div>
          <h2 className={styles["h2"]}>Sales Invoice</h2>

          <input
            type="text"
            placeholder="search product"
            onChange={(e) => { setKeyword(e.target.value) }}
          />

          {
            !isCart &&
            products?.filter(function (element) {
              // if (!keyword || keyword === '') return null;
              // else 
              return element?.product?.toLowerCase().includes(keyword?.toLowerCase());

            }).map((product, index) => {
              return (
                <div className={styles['product']} key={product.ID}>
                  {/* {JSON.stringify(product)} */}
                  <h1> {`product Name : ${product.product}`}</h1>
                  <h2> {`Selling Pricec: ${product.selling} BDT`}</h2>
                  <h3> {`Category : ${product.category}`}</h3>
                  <p> {`Sub category : ${product.subcategory}`}</p>
                  <button onClick={() => {
                    checkIfAlreadyAddedToCart(product) ? removeFromCart(product) : addToCart(product)
                  }}>
                    {
                      checkIfAlreadyAddedToCart(product) ?
                        "remove from cart" : "add to cart"
                    }
                  </button>

                </div>
              )

            })
          }

          {
            isCart &&
            <div>

              {JSON.stringify(items)}



              {
                items?.length ?
                  <button onClick={savePurchase}>Create</button>
                  :
                  <h3>Empty Cart!</h3>
              }
            </div>
          }




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

export default Sales;
