import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/manage-supplier.module.css";
import { useRouter } from "next/router";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersRows, setSuppliersRows] = useState([]);

  const [recalculate, toggleRecalculate] = useState(false);

  const router = useRouter();

  async function fetchProducts() {
    let { data, error } = await supabase.from("suppliers").select("*");
    if (data) {
      setSuppliers(data);
      toggleRecalculate(!recalculate);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function initializeProductRows() {
    let rows = [];
    for (let i = 0; i < suppliers.length; i++) {
      rows.push({
        ...suppliers[i],
        isEditing: false,
      });
    }
    setSuppliersRows(rows);
  }

  useEffect(() => {
    console.log('ran');
    initializeProductRows();
  }, [suppliers, recalculate]);

  function setEditing(index, editing) {
    let rows = [];

    for (let i = 0; i < suppliersRows.length; i++) {
      if (i === index) {
        suppliersRows[i].isEditing = editing;
      }
      rows.push({ ...suppliersRows[i] });
    }
    setSuppliersRows(rows);
  }

  function checkIsEditing(index) {
    let isEditing = false;
    for (let i = 0; i < suppliersRows.length; i++) {
      if (i === index) {
        isEditing = suppliersRows[i].isEditing;
        break;
      }
    }

    return isEditing;
  }

  function changeName(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < suppliersRows.length; i++) {
      if (i === index) {
        suppliersRows[i].name = value;
      }
      rows.push({ ...suppliersRows[i] });
    }
    setSuppliersRows(rows);
  }

  function changePhone(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < suppliersRows.length; i++) {
      if (i === index) {
        suppliersRows[i].phone = value;
      }
      rows.push({ ...suppliersRows[i] });
    }
    setSuppliersRows(rows);
  }

  function changeAddress(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < suppliersRows.length; i++) {
      if (i === index) {
        suppliersRows[i].address = value;
      }
      rows.push({ ...suppliersRows[i] });
    }
    setSuppliersRows(rows);
  }

  function changeDescription(value, index) {
    if (!checkIsEditing(index)) return;
    let rows = [];
    for (let i = 0; i < suppliersRows.length; i++) {
      if (i === index) {
        suppliersRows[i].description = value;
      }
      rows.push({ ...suppliersRows[i] });
    }
    setSuppliersRows(rows);
  }



  async function updateSuppliers(suppliers) {
    console.log(suppliers);
    await supabase
      .from("suppliers")
      .update({
        name: suppliers.name,
        phone: suppliers.phone,
        address: suppliers.address,
        description: suppliers.description,
      })
      .match({ ID: suppliers.ID });
    router.reload();
  }

  async function deleteSuppliers(index) {
    let id = null;

    for (let i = 0; i < suppliersRows.length; i++) {
      if (i === index) {
        id = suppliersRows[i].ID;
        break;
      }
    }
    console.log(id);
    await supabase.from("suppliers").delete().match({ ID: id });
    router.reload();
  }

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["top-bar"]}>
        <div className={styles["top-title"]}>
          <div></div>
          <h1>Supplier</h1>
        </div>
        <div className={styles["nav-status"]}>Home/Supplier/Manage Supplier</div>
      </div>

      <div className={styles["nav-button"]}>
        <button
          onClick={() => {
            router.push("/add-supplier");
          }}
        >
          Add Supplier{" "}
        </button>
        <button>Manage Supplier</button>
        <button
          onClick={() => {
            router.push("/supplier-list");
          }}
        >
          Supplier List
        </button>
      </div>
      <div className={styles["add-box"]}>
        <h1>Supplier list</h1>
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
          {suppliersRows?.map((suppliers, index) => {
            return (
              <React.Fragment key={index}>
                <div>
                  <p>{index + 1}</p>
                </div>
                <div>
                  <input
                    value={suppliers.name}
                    onChange={(e) => {
                      changeName(e.target.value, index);
                    }}
                  />
                </div>
                <div>
                  <input
                    value={suppliers.phone}
                    onChange={(e) => {
                      changePhone(e.target.value, index);
                    }}
                  />
                </div>
                <div>
                  <input
                    value={suppliers.address}
                    onChange={(e) => {
                      changeAddress(e.target.value, index);
                    }}
                  />
                </div>
                <div>
                  <input
                    value={suppliers.description}
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
                      updateSuppliers(suppliers);
                      alert("Save");
                    }}
                  >
                    Save
                  </button>
                </div>
                <div>
                  <button
                    onClick={async () => {
                      await deleteSuppliers(index);
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
