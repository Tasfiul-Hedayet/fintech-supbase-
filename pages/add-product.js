import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/add-product.module.css";
import { useRouter } from "next/router";

function SupplierDropDown({
  isOpen,
  suppliers,
  keyword,
  setSelectedSupplier,
  setIsOpen,
}) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className={styles["supplier-dropdown"]}>
      {suppliers
        .filter(
          (item) =>
            item?.name.toLowerCase().includes(keyword.toLowerCase())
        )
        ?.map((supplier, index) => {
          return (
            <div
              key={index}
              className={styles["supplier-preview"]}
              onClick={() => {
                setSelectedSupplier(supplier);
                setIsOpen(false);
              }}
            >
              <h3>{supplier?.name}</h3>
              <p>{supplier?.phone}</p>
            </div>
          );
        })}
    </div>
  );
}

const Product = () => {
  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchase, setPurchase] = useState("");
  const [selling, setSelling] = useState("");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [IsSupplierDropDownOpen, setIsSupplierDropDownOpen] = useState(false);
  const [supplierSearchKeyword, setSupplierSearchKeyword] = useState("");

  async function fetchSuppliers() {
    let { data, error } = await supabase.from("suppliers").select("*");
    if (data) {
      setSuppliers(data);
    }
  }

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function saveProduct() {
    console.log(
      category,
      subcategory,
      brand,
      product,
      quantity,
      unit,
      purchase,
      selling
    );

    setLoading(true);
    // let { data, error } = await supabase.from('users').select('*').match({ username: username, password: password });
    await supabase.from("product").insert([
      {
        category,
        subcategory,
        brand,
        product,
        quantity,
        unit,
        purchase,
        selling,
      },
    ]);
    // clear input after submit
    setLoading(false);
    setCategory("");
    setSubCategory("");
    setBrand("");
    setProduct("");
    setQuantity("");
    setUnit("");
    setPurchase("");
    setSelling("");
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
        <button onClick={() => {
            router.push("/manage-products");
          }}>
          Manage List
        </button>
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


        <div className={styles["sales-top"]}>
          <div className={styles["sales-supplier"]}>
          <p>Select Supplier</p>
            <div >
              <input 
              className={styles["supplier-search"]}
              value={supplierSearchKeyword}
                type="text"
                placeholder="search supplier"
                onClick={(e) => {
                  setIsSupplierDropDownOpen(true);
                }}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setIsSupplierDropDownOpen(false);
                    setSupplierSearchKeyword(e.target.value);
                  } else {
                    setIsSupplierDropDownOpen(true);
                    setSupplierSearchKeyword(e.target.value);
                  }
                }}
              />
              <SupplierDropDown
                isOpen={IsSupplierDropDownOpen}
                suppliers={suppliers}
                keyword={supplierSearchKeyword}
                setSelectedSupplier={setSelectedSupplier}
                setIsOpen={setIsSupplierDropDownOpen}
              />
            </div>
            {selectedSupplier && (
              <div className={styles["sales-supplier-details"]}>
                <p>{`Name: ${selectedSupplier?.name}`}</p>
                <button
                  onClick={() => {
                    setSelectedSupplier(null);
                    setSupplierSearchKeyword("");
                  }}
                >
                  x
                </button>
              </div>
            )}

          </div>
         
        </div>

 
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
            <label for="unit">Unit:</label>
            <input
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
              }}
              type="text"
              placeholder="Unit"
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
            <label for="Qauntity">Qauntity:</label>
            <input
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
              value={quantity}
              type="text"
              placeholder="Quantity"
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
            <label for="Selling">Selling Price:</label>
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
