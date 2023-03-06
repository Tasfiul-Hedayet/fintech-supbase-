import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/add-product.module.css";
import { useRouter } from "next/router";

const Product = () => {
  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [unit, setUnit] = useState("");
  const [purchase, setPurchase] = useState("");
  const [selling, setSelling] = useState("");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

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
    setCategory('');
    setSubCategory('');
    setBrand('');
    setProduct('');
    setUnit('');
    setPurchase('');
    setSelling('');
  }

  if (isLoading) return <div>Loading ....</div>;

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["top-bar"]}>
        <div className={styles["top-title"]}>
          <div></div>
          <h1>Product</h1>
        </div>
        <div className={styles["nav-status"]}>Home/Product/Add Product</div>
      </div>

      <div className={styles["nav-button"]}>
        <button>Add Product</button>
        <button>Manage Product</button>
        <button
          onClick={() => {
            router.push("/product-list");
          }}
        >
          List Product
        </button>
      </div>
      <div className={styles["add-box"]}>
        <h1>Add Product</h1>
        <div className={styles["add-input"]}>
          <div>
            <label for="Category">Category:</label>
            <input
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              type="text"
              placeholder="Category"
            ></input>
          </div>

          <div>
            <label for="Sub-Category">Sub-Category:</label>
            <input
              value={subcategory}
              onChange={(e) => {
                setSubCategory(e.target.value);
              }}
              type="text"
              placeholder="Sub-Category"
            ></input>
          </div>

          <div>
            <label for="Brand">Brand:</label>
            <input
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
              }}
              type="text"
              placeholder="Brand"
            ></input>
          </div>

          <div>
            <label for="Product">Product Name:</label>
            <input
              value={product}
              onChange={(e) => {
                setProduct(e.target.value);
              }}
              type="text"
              placeholder="Product Name"
            ></input>
          </div>

          <div>
            <label for="unit">Unit:</label>
            <input
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
              }}
              type="text"
              placeholder="Unit/Quantity"
            ></input>
          </div>

          <div>
            <label for="Purchase">Purchasing Price:</label>
            <input
              value={purchase}
              onChange={(e) => {
                setPurchase(e.target.value);
              }}
              type="text"
              placeholder="Purchasing Price"
            ></input>
          </div>

          <div>
            <label for="Selling">Selling:</label>
            <input
              value={selling}
              onChange={(e) => {
                setSelling(e.target.value);
              }}
              type="text"
              placeholder="Selling Price"
            ></input>
          </div>
        </div>
        <div className={styles["save-button"]}>
          <button onClick={saveProduct}>Save</button>
          <button onClick={saveProduct}> Save and add Another</button>
        </div>
      </div>
    </div>
  );
};

export default Product;
