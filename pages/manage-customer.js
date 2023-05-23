import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/manage-customers.module.css";
import { useRouter } from "next/router";

const Supplier = () => {
  const [customers, setCustomers] = useState([]);
  const [customersRows, setCustomersRows] = useState([]);
  const [recalculate, toggleRecalculate] = useState(false);
  const router = useRouter();

  async function fetchProducts() {
    let { data, error } = await supabase.from("customers").select("*");
    if (data) {
      setCustomers(data);
      toggleRecalculate(!recalculate);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function initializeProductRows() {
    let rows = [];
    for (let i = 0; i < customers.length; i++) {
      rows.push({
        ...customers[i],
        isEditing: false,
      });
    }
    setCustomersRows(rows);
  }

  useEffect(() => {
    console.log('ran');
    initializeProductRows();
  }, [customers, recalculate]);

  function setEditing(index, editing) {
    let rows = [];

    for (let i = 0; i < customersRows.length; i++) {
      if (i === index) {
        customersRows[i].isEditing = editing;
      }
      rows.push({ ...customersRows[i] });
    }
    setCustomersRows(rows);
  }

  function checkIsEditing(index) {
    let isEditing = false;
    for (let i = 0; i < customersRows.length; i++) {
      if (i === index) {
        isEditing = customersRows[i].isEditing;
        break;
      }
    }
    return isEditing;
  }

  function changeName(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < customersRows.length; i++) {
      if (i === index) {
        customersRows[i].name = value;
      }
      rows.push({ ...customersRows[i] });
    }
    setCustomersRows(rows);
  }

  function changePhone(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < customersRows.length; i++) {
      if (i === index) {
        customersRows[i].phone = value;
      }
      rows.push({ ...customersRows[i] });
    }
    setCustomersRows(rows);
  }

  function changeAddress(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < customersRows.length; i++) {
      if (i === index) {
        customersRows[i].address = value;
      }
      rows.push({ ...customersRows[i] });
    }
    setCustomersRows(rows);
  }

  function changeDescription(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < customersRows.length; i++) {
      if (i === index) {
        customersRows[i].description = value;
      }
      rows.push({ ...customersRows[i] });
    }
    setCustomersRows(rows);
  }

  
  async function updateCustomers(customers) {
    console.log(customers);
    await supabase
      .from("customers")
      .update({
        name: customers.name,
        phone: customers.phone,
        address: customers.address,
        description: customers.description,
      })
      .match({ ID: customers.ID });
    router.reload();
  }

  async function deleteCustomers(index) {
    let id = null;

    for (let i = 0; i < customersRows.length; i++) {
      if (i === index) {
        id = customersRows[i].ID;
        break;
      }
    }
    console.log(id);
    await supabase.from("customers").delete().match({ ID: id });
    router.reload();
  }

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["top-bar"]}>
        <div className={styles["top-title"]}>
          <h1>Customers</h1>
        </div>
        <div className={styles["nav-status"]}>Home/Customers/Manage Customers</div>
      </div>

      <div className={styles["nav-button"]}>
        <button
          onClick={() => {
            router.push("/add-customer");
          }}
        >
          Add Customers{" "}
        </button>
        <button>Manage Customers</button>
        <button
          onClick={() => {
            router.push("/customer-list");
          }}
        >
          Customers List
        </button>
      </div>
      <div className={styles["add-box"]}>
        <h1>Customers list</h1>
        <div className={styles["label"]}>
          <div>
            <h3>Sl</h3>
          </div>
          <div>
            <h3>Name</h3>
          </div>
          <div>
            <h3>Phone</h3>
          </div>
          <div>
            <h3>Address</h3>
          </div>
          <div>
            <h3>Description</h3>
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
          {customersRows?.map((customers, index) => {
            return (
              <React.Fragment key={index}>
                <div>
                  <p>{index + 1}</p>
                </div>
                <div>
                  <input
                    value={customers.name}
                    onChange={(e) => {
                      changeName(e.target.value, index);
                    }}
                  />
                </div>
                <div>
                  <input
                    value={customers.phone}
                    onChange={(e) => {
                      changePhone(e.target.value, index);
                    }}
                  />
                </div>
                <div>
                  <input
                    value={customers.address}
                    onChange={(e) => {
                      changeAddress(e.target.value, index);
                    }}
                  />
                </div>
                <div>
                  <input
                    value={customers.description}
                    onChange={(e) => {
                      changeDescription(e.target.value, index);
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
                      updateCustomers(customers);
                      alert("Save");
                    }}
                  >
                    Save
                  </button>
                </div>
                <div>
                  <button
                    onClick={async () => {
                      await deleteCustomers(index);
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

export default Supplier;
