import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/product.module.css";

const SHOW_TYPES = {
  ADD: "ADD",
  LIST: "LIST",
};

const Product = () => {
  const [showType, setShowtype] = useState(SHOW_TYPES.ADD);
  const [products, setProducts] = useState([]);
  const [updatedProducts, setUpdatedProducts] = useState([]);

  const options = [
    { value: SHOW_TYPES.ADD, label: "add Product" },
    { value: SHOW_TYPES.LIST, label: "show Product list" },
  ];

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

  function onChangeForProductListCategory(e, index) {
    let newProducts = [];
    for (let i = 0; i < updatedProducts.length; i++) {
      if (i === index) {
        newProducts.push({
          ID: updatedProducts[i].ID,
          category: e.target.value,
          subcategory: updatedProducts[i].subcategory,
          brand: updatedProducts[i].brand,
          product: updatedProducts[i].product,
          unit: updatedProducts[i].unit,
          purchase: updatedProducts[i].purchase,
          selling: updatedProducts[i].selling,
        });
      } else {
        newProducts.push(updatedProducts[i]);
      }
    }
    setUpdatedProducts(newProducts);
  }

  function onChangeForProductListSubCategory(e, index) {
    let newProducts = [];
    for (let i = 0; i < updatedProducts.length; i++) {
      if (i === index) {
        newProducts.push({
          ID: updatedProducts[i].ID,
          category: updatedProducts[i].category,
          subcategory: e.target.value,
          brand: updatedProducts[i].brand,
          product: updatedProducts[i].product,
          unit: updatedProducts[i].unit,
          purchase: updatedProducts[i].purchase,
          selling: updatedProducts[i].selling,
        });
      } else {
        newProducts.push(updatedProducts[i]);
      }
    }
    setUpdatedProducts(newProducts);
  }

  function onChangeForProductListBrand(e, index) {
    let newProducts = [];
    for (let i = 0; i < updatedProducts.length; i++) {
      if (i === index) {
        newProducts.push({
          ID: updatedProducts[i].ID,
          category: updatedProducts[i].category,
          subcategory: updatedProducts[i].setCategory,
          brand: e.target.value,
          product: updatedProducts[i].product,
          unit: updatedProducts[i].unit,
          purchase: updatedProducts[i].purchase,
          selling: updatedProducts[i].selling,
        });
      } else {
        newProducts.push(updatedProducts[i]);
      }
    }
    setUpdatedProducts(newProducts);
  }

  function onChangeForProductListProduct(e, index) {
    let newProducts = [];
    for (let i = 0; i < updatedProducts.length; i++) {
      if (i === index) {
        newProducts.push({
          ID: updatedProducts[i].ID,
          category: updatedProducts[i].category,
          subcategory: updatedProducts[i].setCategory,
          brand: updatedProducts[i].brand,
          product: e.target.value,
          unit: updatedProducts[i].unit,
          purchase: updatedProducts[i].purchase,
          selling: updatedProducts[i].selling,
        });
      } else {
        newProducts.push(updatedProducts[i]);
      }
    }
    setUpdatedProducts(newProducts);
  }

  function onChangeForProductListUnit(e, index) {
    let newProducts = [];
    for (let i = 0; i < updatedProducts.length; i++) {
      if (i === index) {
        newProducts.push({
          ID: updatedProducts[i].ID,
          category: updatedProducts[i].category,
          subcategory: updatedProducts[i].setCategory,
          brand: updatedProducts[i].brand,
          product: updatedProducts[i].product,
          unit: e.target.value,
          purchase: updatedProducts[i].purchase,
          selling: updatedProducts[i].selling,
        });
      } else {
        newProducts.push(updatedProducts[i]);
      }
    }
    setUpdatedProducts(newProducts);
  }




  function onChangeForProductListPurchase(e, index) {
    let newProducts = [];
    for (let i = 0; i < updatedProducts.length; i++) {
      if (i === index) {
        newProducts.push({
          ID: updatedProducts[i].ID,
          category: updatedProducts[i].category,
          subcategory: updatedProducts[i].setCategory,
          brand: updatedProducts[i].brand,
          product: updatedProducts[i].product,
          unit: updatedProducts[i].unit,
          purchase: e.target.value,
          selling: updatedProducts[i].selling,
        });
      } else {
        newProducts.push(updatedProducts[i]);
      }
    }
    setUpdatedProducts(newProducts);
  }



  function onChangeForProductListSelling(e, index) {
    let newProducts = [];
    for (let i = 0; i < updatedProducts.length; i++) {
      if (i === index) {
        newProducts.push({
          ID: updatedProducts[i].ID,
          category: updatedProducts[i].category,
          subcategory: updatedProducts[i].setCategory,
          brand: updatedProducts[i].brand,
          product: updatedProducts[i].product,
          unit: updatedProducts[i].unit,
          purchase: updatedProducts[i].purchase,
          selling: e.target.value,
        });
      } else {
        newProducts.push(updatedProducts[i]);
      }
    }
    setUpdatedProducts(newProducts);
  }

  async function fetchProducts() {
    let { data, error } = await supabase.from("product").select("*");
    if (data) {
      setProducts(data);
      setUpdatedProducts(data);
    }
  }



  
  async function updatedProduct(index) {
    setLoading(true);
    await supabase
      .from("product")
      .update({
        category: updatedProducts[index].category,
        subcategory: updatedProducts[index].subcategory,
        brand: updatedProducts[index].brand,
        product: updatedProducts[index].product,
        unit: updatedProducts[index].unit,
        purchase: updatedProducts[index].purchase,
        selling: updatedProducts[index].selling,
      }).match({ ID: updatedProducts[index]?.ID });
    await fetchProducts();
    setLoading(false);
  }




  async function deleteProduct(index) {
    setLoading(true);
    console.log(updatedProducts[index]);
    await supabase
      .from("product")
      .delete()
      .match({ ID: updatedProducts[index]?.ID });
    await fetchProducts();
    setLoading(false);
  }



  useEffect(() => {
    fetchProducts();
  }, []);

  if (isLoading) return <div>Loading ....</div>;

  return (
    <div className={styles["page"]}>
      <Sidebar />
      {showType === SHOW_TYPES.ADD && (
        <div className={styles["add-box"]}>
          <Select
            className={styles["select"]}
            onChange={(currentOption) => {
              console.log(currentOption.value);
              setShowtype(currentOption.value);
            }}
            options={options}
          />

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
      )}

      {/* show list view */}

      {showType === SHOW_TYPES.LIST && (
        <div>
          <Select
            className={styles["select"]}
            onChange={(currentOption) => {
              console.log(currentOption.value);
              setShowtype(currentOption.value);
            }}
            options={options}
          />
          <div className={styles["products"]}>
            {products.map((product, index) => {
              return (

                <div key={index} className={styles["product"]}>

                  <input
                    value={updatedProducts[index]?.category}
                    onChange={(e) => {
                      onChangeForProductListCategory(e, index);
                    }}
                    type="text"
                    placeholder="Category"
                  ></input>

                  <input
                    value={updatedProducts[index]?.subcategory}
                    onChange={(e) => {
                      onChangeForProductListSubCategory(e, index);
                    }}
                    type="text"
                    placeholder="Sub Category"
                  ></input>

                  <input
                    value={updatedProducts[index]?.brand}
                    onChange={(e) => {
                      onChangeForProductListBrand(e, index);
                    }}
                    type="text"
                    placeholder="Brand"
                  ></input>

                  <input
                    value={updatedProducts[index]?.product}
                    onChange={(e) => {
                      onChangeForProductListProduct(e, index);
                    }}
                    type="text"
                    placeholder="Product"
                  ></input>

                  <input
                    value={updatedProducts[index]?.unit}
                    onChange={(e) => {
                      onChangeForProductListUnit(e, index);
                    }}
                    type="text"
                    placeholder="Quantity/Unit"
                  ></input>

                  <input
                    value={updatedProducts[index]?.purchase}
                    onChange={(e) => {
                      onChangeForProductListPurchase(e, index);
                    }}
                    type="text"
                    placeholder="Purchasing Price"
                  ></input>

                  <input
                    value={updatedProducts[index]?.selling}
                    onChange={(e) => {
                      onChangeForProductListSelling(e, index);
                    }}
                    type="text"
                    placeholder="Selling Price"
                  ></input>

                <div className={styles['buttons']}>
                    <button onClick={() => { updatedProduct(index) }}>Update</button>
                    <button onClick={() => { deleteProduct(index) }}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
