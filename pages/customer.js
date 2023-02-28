import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import styles from "../styles/customer.module.css";

const SHOW_TYPES = {
  ADD: "ADD",
  LIST: "LIST",
};

const Customer = () => {
  const [showType, setShowtype] = useState(SHOW_TYPES.ADD);
  const [customers, setCustomers] = useState([]);
  const [updatedCustomers, setUpdatedCustomers] = useState([]);

  const options = [
    { value: SHOW_TYPES.ADD, label: "add Customer" },
    { value: SHOW_TYPES.LIST, label: "show Customer list" },
  ];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setLoading] = useState(false);



  async function fetchCustomers() {
    let { data, error } = await supabase.from("customers").select("*");
    if (data) {
      setCustomers(data);
      setUpdatedCustomers(data);
    }
  }


  async function saveCustomer() {
    console.log(name, phone, address, description);

    setLoading(true);
    // let { data, error } = await supabase.from('users').select('*').match({ username: username, password: password });
    await supabase
      .from("customers")
      .insert([{ name, phone, address, description }]);
    // clear input after submit

    await fetchCustomers();
    setLoading(false);
    setName("");
    setAddress("");
    setPhone("");
    setDescription("");
  }

  function onChangeForCustomerListName(e, index) {
    let newCustomers = [];
    for (let i = 0; i < updatedCustomers.length; i++) {
      if (i === index) {
        newCustomers.push({
          ID: updatedCustomers[i].ID,
          name: e.target.value,
          phone: updatedCustomers[i].phone,
          address: updatedCustomers[i].address,
          description: updatedCustomers[i].description,
        });
      } else {
        newCustomers.push(updatedCustomers[i]);
      }
    }
    setUpdatedCustomers(newCustomers);
  }

  function onChangeForCustomerListPhone(e, index) {
    let newCustomers = [];
    for (let i = 0; i < updatedCustomers.length; i++) {
      if (i === index) {
        newCustomers.push({
          ID: updatedCustomers[i].ID,
          name: updatedCustomers[i].name,
          phone: e.target.value,
          address: updatedCustomers[i].address,
          description: updatedCustomers[i].description,
        });
      } else {
        newCustomers.push(updatedCustomers[i]);
      }
    }

    setUpdatedCustomers(newCustomers);
  }

  function onChangeForCustomerListAddress(e, index) {
    let newCustomers = [];
    for (let i = 0; i < updatedCustomers.length; i++) {
      if (i === index) {
        newCustomers.push({
          ID: updatedCustomers[i].ID,
          name: updatedCustomers[i].name,
          phone: updatedCustomers[i].phone,
          address: e.target.value,
          description: updatedCustomers[i].description,
        });
      } else {
        newCustomers.push(updatedCustomers[i]);
      }
    }

    setUpdatedCustomers(newCustomers);
  }

  function onChangeForCustomerListDescription(e, index) {
    let newCustomers = [];
    for (let i = 0; i < updatedCustomers.length; i++) {
      if (i === index) {
        newCustomers.push({
          ID: updatedCustomers[i].ID,
          name: updatedCustomers[i].name,
          phone: updatedCustomers[i].phone,
          address: updatedCustomers[i].address,
          description: e.target.value,
        });
      } else {
        newCustomers.push(updatedCustomers[i]);
      }
    }

    setUpdatedCustomers(newCustomers);
  }






  async function updateCustomer(index) {
    setLoading(true);
    console.log(updatedCustomers[index]);
    await supabase
      .from("customers")
      .update({
        name: updatedCustomers[index].name,
        phone: updatedCustomers[index].phone,
        address: updatedCustomers[index].address,
        description: updatedCustomers[index].description,
      })
      .match({ ID: updatedCustomers[index]?.ID });
    await fetchCustomers();
    setLoading(false);
  }





  async function deleteCustomer(index) {
    setLoading(true);
    console.log(updatedCustomers[index]);
    await supabase
      .from("customers")
      .delete()
      .match({ ID: updatedCustomers[index]?.ID });
    await fetchCustomers();
    setLoading(false);
  }



  useEffect(() => {
    fetchCustomers();
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

          <button onClick={saveCustomer}>Add</button>
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
          <div className={styles["customers"]}>
            {customers.map((customer, index) => {
              return (
                <div key={index} className={styles["customer"]}>
                  <input
                    value={updatedCustomers[index]?.name}
                    onChange={(e) => {
                      onChangeForCustomerListName(e, index);
                    }}
                    type="text"
                    placeholder="Name"
                  ></input>

                  <input
                    value={updatedCustomers[index]?.phone}
                    onChange={(e) => {
                      onChangeForCustomerListPhone(e, index);
                    }}
                    type="text"
                    placeholder="Phone Number"
                  ></input>
                  <input
                    value={updatedCustomers[index]?.address}
                    onChange={(e) => {
                      onChangeForCustomerListAddress(e, index);
                    }}
                    type="text"
                    placeholder="Address"
                  ></input>
                  <input
                    value={updatedCustomers[index]?.description}
                    onChange={(e) => {
                      onChangeForCustomerListDescription(e, index);
                    }}
                    type="text"
                    placeholder="Description"
                  ></input>

                  <div className={styles["buttons"]}>
                    <button
                      onClick={() => {
                        updateCustomer(index);
                      }}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        deleteCustomer(index);
                      }}
                    >
                      Delete
                    </button>
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

export default Customer;
