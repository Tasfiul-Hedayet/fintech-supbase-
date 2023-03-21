import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/manage-product.module.css";
import { useRouter } from "next/router";

const Customer = () => {
  const [products, setProducts] = useState([]);
  const [productRows, setProductRows] = useState([]);

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

  function initializeProductRows() {
    for (let i = 0; i < products.length; i++) {
      productRows.push({
        ...products[i],
        isEditing: false,
      });
    }
  }

  useEffect(() => {
    initializeProductRows();
  }, [products]);

  function setEditing(index, editing) {
    let rows = [];

    for (let i = 0; i < productRows.length; i++) {
      if (i === index) {
        productRows[i].isEditing = editing;
      }
      rows.push({ ...productRows[i] });
    }
    setProductRows(rows);
  }

  function checkIsEditing(index) {
    let isEditing = false;
    for (let i = 0; i < productRows.length; i++) {
      if (i === index) {
        isEditing = productRows[i].isEditing;
        break;
      }
    }

    return isEditing;
  }

  function changeCategory(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < productRows.length; i++) {
      if (i === index) {
        productRows[i].category = value;
      }
      rows.push({ ...productRows[i] });
    }
    setProductRows(rows);
  }

  function changeSubCategory(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < productRows.length; i++) {
      if (i === index) {
        productRows[i].subcategory = value;
      }
      rows.push({ ...productRows[i] });
    }
    setProductRows(rows);
  }

  function changeBrand(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < productRows.length; i++) {
      if (i === index) {
        productRows[i].brand = value;
      }
      rows.push({ ...productRows[i] });
    }
    setProductRows(rows);
  }

  function changeProduct(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < productRows.length; i++) {
      if (i === index) {
        productRows[i].product = value;
      }
      rows.push({ ...productRows[i] });
    }
    setProductRows(rows);
  }

  function changeQuantity(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < productRows.length; i++) {
      if (i === index) {
        productRows[i].quantity = value;
      }
      rows.push({ ...productRows[i] });
    }
    setProductRows(rows);
  }

  function changeUnit(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < productRows.length; i++) {
      if (i === index) {
        productRows[i].unit = value;
      }
      rows.push({ ...productRows[i] });
    }
    setProductRows(rows);
  }

  function changePurchase(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < productRows.length; i++) {
      if (i === index) {
        productRows[i].purchase = value;
      }
      rows.push({ ...productRows[i] });
    }
    setProductRows(rows);
  }

  function changeSelling(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < productRows.length; i++) {
      if (i === index) {
        productRows[i].selling = value;
      }
      rows.push({ ...productRows[i] });
    }
    setProductRows(rows);
  }

  async function updateProduct(product) {
    console.log(product);
    await supabase
      .from("product")
      .update({
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand,
        product: product.product,
        quantity: product.quantity,
        unit: product.unit,
        purchase: product.purchase,
        selling: product.selling,
      })
      .match({ ID: product.ID });
    router.reload();
  }

  async function deleteProduct(index) {
    let id = null;

    for (let i = 0; i < productRows.length; i++) {
      if (i === index) {
        id = productRows[i].ID;
        break;
      }
    }
    console.log(id);
    await supabase.from("product").delete().match({ ID: id });
    router.reload();
  }

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
        <button
          onClick={() => {
            router.push("/product-list");
          }}
        >
          Product List
        </button>
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

          <div>
            <h3>Edit </h3>
          </div>
          <div>
            <h3>Save</h3>
          </div>
          <div>
            <h3>Delete</h3>
          </div>
        </div>
        <div className={styles["show-list"]}>
        {JSON.stringify(productRows)}
        {console.log(productRows)}
          {productRows?.map((product, index) => {
            return (
              <React.Fragment key={index}>
                <div>
                  <p>{index + 1}</p>
                </div>
                <div>
                  <input
                    value={product.category}
                    onChange={(e) => {
                      changeCategory(e.target.value, index);
                    }}
                  />
                </div>
                <div>
                  <input
                    value={product.subcategory}
                    onChange={(e) => {
                      changeSubCategory(e.target.value, index);
                    }}
                  />
                </div>
                <div>
                  <input
                    value={product.brand}
                    onChange={(e) => {
                      changeBrand(e.target.value, index);
                    }}
                  />
                </div>
                <div>
                  <input
                    value={product.product}
                    onChange={(e) => {
                      changeProduct(e.target.value, index);
                    }}
                  />
                </div>
                <div>
                  <input
                    value={product.quantity}
                    onChange={(e) => {
                      changeQuantity(e.target.value, index);
                    }}
                  />
                </div>
                <div>
                  <input
                    value={product.unit}
                    onChange={(e) => {
                      changeUnit(e.target.value, index);
                    }}
                  />
                </div>
                <div>
                  <input
                    value={product.purchase}
                    onChange={(e) => {
                      changePurchase(e.target.value, index);
                    }}
                  />
                </div>
                <div>
                  <input
                    value={product.selling}
                    onChange={(e) => {
                      changeSelling(e.target.value, index);
                    }}
                  />
                </div>
                <div>
                  {checkIsEditing(index) && (
                    <button
                      onClick={() => {
                        setEditing(index, false);
                        router.reload();
                      }}
                    >
                      Discard
                    </button>
                  )}

                  {!checkIsEditing(index) && (
                    <button
                      onClick={() => {
                        setEditing(index, true);
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>
                <div>
                  <button
                    onClick={async () => {
                      updateProduct(product);
                      alert("Save");
                    }}
                  >
                    Save
                  </button>
                </div>
                <div>
                  <button
                    onClick={async () => {
                      await deleteProduct(index);
                    }}
                  >
                    Delete
                  </button>
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
