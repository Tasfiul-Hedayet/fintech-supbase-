import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/supplier.module.css";

const SHOW_TYPES = {
  ADD: "ADD",
  LIST: "LIST",
};

const supplier = () => {
  const [showType, setShowtype] = useState(SHOW_TYPES.ADD);
  const [suppliers, setSuppliers] = useState([]);
  const [updatedSuppliers, setUpdatedSuppliers] = useState([]);

  const options = [
    { value: SHOW_TYPES.ADD, label: "add supplier" },
    { value: SHOW_TYPES.LIST, label: "show supplier list" },
  ];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setLoading] = useState(false);

  async function saveSupplier() {
    console.log(address, name, phone, description);

    setLoading(true);
    // let { data, error } = await supabase.from('users').select('*').match({ username: username, password: password });
    await supabase
      .from("suppliers")
      .insert([{ name, phone, address, description }]);
    // clear input after submit
    setLoading(false);
    setName("");
    setAddress("");
    setPhone("");
    setDescription("");
  }

  function onChangeForSupplierListName(e, index) {
    let newSuppliers = [];
    for (let i = 0; i < updatedSuppliers.length; i++) {
      if (i === index) {
        newSuppliers.push({
          ID: updatedSuppliers[i].ID,
          name: e.target.value,
          phone: updatedSuppliers[i].phone,
          address: updatedSuppliers[i].address,
          description: updatedSuppliers[i].description,
        });
      } else {
        newSuppliers.push(updatedSuppliers[i]);
      }
    }
    setUpdatedSuppliers(newSuppliers);
  }




  function onChangeForSupplierListPhone(e, index) {
    let newSuppliers = [];
    for (let i = 0; i < updatedSuppliers.length; i++) {
      if (i === index) {
        newSuppliers.push({
          ID: updatedSuppliers[i].ID,
          name: updatedSuppliers[i].name,
          phone: e.target.value,
          address: updatedSuppliers[i].address,
          description: updatedSuppliers[i].description,
        });
      } else {
        newSuppliers.push(updatedSuppliers[i]);
      }
    }

    setUpdatedSuppliers(newSuppliers);
  }

  function onChangeForSupplierListAddress(e, index) {
    let newSuppliers = [];
    for (let i = 0; i < updatedSuppliers.length; i++) {
      if (i === index) {
        newSuppliers.push({
          ID: updatedSuppliers[i].ID,
          name: updatedSuppliers[i].name,
          phone: updatedSuppliers[i].phone,
          address: e.target.value,
          description: updatedSuppliers[i].address,
        });
      } else {
        newSuppliers.push(updatedSuppliers[i]);
      }
    }

    setUpdatedSuppliers(newSuppliers);
  }



  function onChangeForSupplierListDescription(e, index) {
    let newSuppliers = [];
    for (let i = 0; i < updatedSuppliers.length; i++) {
      if (i === index) {
        newSuppliers.push({
          ID: updatedSuppliers[i].ID,
          name: updatedSuppliers[i].name,
          phone: updatedSuppliers[i].phone,
          address: updatedSuppliers[i].address,
          description: e.target.value,
        });
      } else {
        newSuppliers.push(updatedSuppliers[i]);
      }
    }

    setUpdatedSuppliers(newSuppliers);
  }

  async function fetchSuppliers() {
    let { data, error } = await supabase.from("suppliers").select("*");
    if (data) {
      setSuppliers(data);
      setUpdatedSuppliers(data);
    }
  }


  async function updateSupplier(index) {
    setLoading(true);
    console.log(updatedSuppliers[index]);
    await supabase.from('suppliers').update({
      name: updatedSuppliers[index].name,
      phone: updatedSuppliers[index].phone,
      address: updatedSuppliers[index].address,
      description: updatedSuppliers[index].description,
    }).match({ ID: updatedSuppliers[index]?.ID })
    await fetchSuppliers();
    setLoading(false);

  }

  async function deleteSupplier(index) {
    setLoading(true);
    console.log(updatedSuppliers[index]);
    await supabase.from('suppliers').delete().match({ ID: updatedSuppliers[index]?.ID })
    await fetchSuppliers();
    setLoading(false);

  }


  useEffect(() => {
    fetchSuppliers();
  }, []);

  if (isLoading) return <div>Loading ....</div>;

  return (
    <div className={styles["page"]}>
      <Sidebar />
      {showType === SHOW_TYPES.ADD && (
        <div className={styles["add-box"]}>
          <Select
            className={styles['select']}
            onChange={(currentOption) => {
              console.log(currentOption.value);
              setShowtype(currentOption.value);
            }}
            options={options}
          />
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
            placeholder="Name"
          ></input>
          <input
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            type="text"
            placeholder="Phone Number"
          ></input>
          <input
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            type="text"
            placeholder="Address"
          ></input>
          <input
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            type="text"
            placeholder="Description"
          ></input>

          <button onClick={saveSupplier}>Add</button>
        </div>
      )}

      {showType === SHOW_TYPES.LIST && (
        <div>
          <Select
            className={styles['select']}
            onChange={(currentOption) => {
              console.log(currentOption.value);
              setShowtype(currentOption.value);
            }}
            options={options}
          />
          <div className={styles['suppliers']}>
            {suppliers.map((supplier, index) => {
              return (
                <div key={index} className={styles['supplier']}>
                  <input
                    value={updatedSuppliers[index]?.name}
                    onChange={(e) => {
                      onChangeForSupplierListName(e, index);
                    }}
                    type="text"
                    placeholder="Name"
                  ></input>
                  <input
                    value={updatedSuppliers[index]?.phone}
                    onChange={(e) => {
                      onChangeForSupplierListPhone(e, index);
                    }}
                    type="text"
                    placeholder="Phone Number"
                  ></input>
                  <input
                    value={updatedSuppliers[index]?.address}
                    onChange={(e) => {
                      onChangeForSupplierListAddress(e, index);
                    }}
                    type="text"
                    placeholder="Address"
                  ></input>
                  <input
                    value={updatedSuppliers[index]?.description}
                    onChange={(e) => {
                      onChangeForSupplierListDescription(e, index);
                    }}
                    type="text"
                    placeholder="Description"
                  ></input>

                  <div className={styles['buttons']}>
                    <button onClick={() => { updateSupplier(index) }}>Update</button>
                    <button onClick={() => { deleteSupplier(index) }}>Delete</button>
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

export default supplier;
