import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/product.module.css";

const product = () => {
  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [unit, setUnit] = useState("");
  const [purchase, setPurchase] = useState("");
  const [selling, setSelling] = useState("");
  const [isLoading, setLoading] = useState(false);

  async function saveProduct() {
    console.log(category, subcategory, brand, product, unit, purchase, selling);

    setLoading(true);
    // let { data, error } = await supabase.from('users').select('*').match({ username: username, password: password });
    await supabase
      .from("product")
      .insert([
        { category, subcategory, brand, product, unit, purchase, selling },
      ]);
    // clear input after submit
    setLoading(false);
    setCategory;
    setSubCategory;
    setBrand;
    setProduct;
    setUnit;
    setPurchase;
    setSelling;
  }

  if (isLoading) return <div>Loading ....</div>;

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["box"]}>
      <h2 className={styles["h2"]}>Product</h2>
        <input
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          type="text"
          placeholder="Category"
        ></input>
        <input
          value={subcategory}
          onChange={(e) => {
            setSubCategory(e.target.value);
          }}
          type="text"
          placeholder="Sub-Category"
        ></input>
        <input
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
          }}
          type="text"
          placeholder="Brand"
        ></input>
        <input
          value={product}
          onChange={(e) => {
            setProduct(e.target.value);
          }}
          type="text"
          placeholder="Product Name"
        ></input>
        <input
          value={unit}
          onChange={(e) => {
            setUnit(e.target.value);
          }}
          type="text"
          placeholder="Unit/Quantity"
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
          value={selling}
          onChange={(e) => {
            setSelling(e.target.value);
          }}
          type="text"
          placeholder="Selling Price"
        ></input>
        <button onClick={saveProduct}>Add</button>
      </div>
    </div>
  );
};

export default product;
