import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/product-list.module.css";
import { useRouter } from "next/router";

const Customer = () => {
    const [products, setProducts] = useState([]);
  const router = useRouter();

  async function fetchProducts() {
    let { data, error } = await supabase.from("product").select("*");
    if (data) {
      setProducts(data);
    }
  }


  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["top-bar"]}>
        <div className={styles["top-title"]}>
          <div></div>
          <h1>Product</h1>
        </div>
        <div className={styles["nav-status"]}>Home/Product/Product list</div>
      </div>

      <div className={styles["nav-button"]}>
        <button
          onClick={() => {
            router.push("/add-product");
          }}
        >
          Add Product{" "}
        </button>
        <button>Manage Product</button>
        <button>List Product</button>
      </div>
      <div className={styles["add-box"]}>
        <h1>Product list</h1>
        <div className={styles["label"]}>
          <div>
            <h3>Sl</h3>
          </div>
          <div>
            <h3>Category</h3>
          </div>
          <div>
            <h3>Sub Category</h3>
          </div>
          <div>
            <h3>Brand</h3>
          </div>
          <div>
            <h3>Product Name</h3>
          </div>
          <div>
            <h3>Quantity</h3>
          </div>
          <div>
            <h3>Unit</h3>
          </div>
          <div>
            <h3>Purchasing Price</h3>
          </div>
          <div>
            <h3>Selling Price</h3>
          </div>


        </div>
        <div className={styles["show-list"]}>
          {products?.map((product, index) => {
            return (
              <React.Fragment  key={index}>
                <div>
                  <p>{index + 1}</p>
                </div>
                <div>
                  <p>{product.category}</p>
                </div>
                <div>
                  <p>{product.subcategory}</p>
                </div>
                <div>
                  <p>{product.brand}</p>
                </div>
                <div>
                  <p>{product.product}</p>
                </div>
                <div>
                  <p>{product.quantity}</p>
                </div>
                <div>
                  <p>{product.unit}</p>
                </div>
                <div>
                  <p>{product.purchase}</p>
                </div>
                <div>
                  <p>{product.selling}</p>
                </div>

              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Customer;
