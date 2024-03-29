import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/client";
import formatDate from "@/utils/formatDateFromTimeStamp";
import is_numeric from "@/utils/isNumeric";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "../styles/new-sales.module.css";
import { toast } from "react-toastify";

function CustomerDropDown({
  isOpen,
  customers,
  keyword,
  setSelectedCustomer,
  setIsOpen,
}) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className={styles["customer-dropdown"]}>
      {customers
        .filter(
          (item) =>
            item?.phone.includes(keyword) ||
            item?.name.toLowerCase().includes(keyword.toLowerCase())
        )
        ?.map((customer, index) => {
          return (
            <div
              key={index}
              className={styles["customer-preview"]}
              onClick={() => {
                setSelectedCustomer(customer);
                setIsOpen(false);
              }}
            >
              <h3>{customer?.name}</h3>
              <p>{customer?.phone}</p>
              <p>{customer?.balance}</p>
            </div>
          );
        })}
    </div>
  );
}

function ProductDropDown({
  products,
  productRows,
  setProductID,
  closeDropDown,
  dropDownIndex,
}) {
  let isOpen = false;
  let keyword = "";

  for (let i = 0; i < productRows.length; i++) {
    if (i === dropDownIndex) {
      isOpen = productRows[i].isOpen;
      keyword = productRows[i].keyword;
      break;
    }
  }
  if (!isOpen) return null;
  return (
    <div className={styles["product-dropdown"]}>
      {products
        .filter((item) =>
          item?.product?.toLowerCase().includes(keyword?.toLowerCase())
        )
        ?.map((product, index) => {
          return (
            <div
              key={index}
              className={styles["product-preview"]}
              onClick={() => {
                // setSelectedCustomer(customer);
                console.log(product.ID);
                setProductID(product.ID, dropDownIndex);
                closeDropDown(dropDownIndex);
              }}
            >
              <h3>{product?.product}</h3>
            </div>
          );
        })}
    </div>
  );
}

const Sales = () => {
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [timestamp, setTimestamp] = useState(null);

  const [isCustomerDropDownOpen, setIsCustomerDropDownOpen] = useState(false);
  const [customerSearchKeyword, setCustomerSearchKeyword] = useState("");

  const [salesDiscount, setSalesDiscount] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [ledger, setLedger] = useState(null);
  
  let soldQuantity = 0;

  const [productRows, setProductRows] = useState([
    {
      productID: null,
      availableQuantity: null,
      unit: null,
      quantity: 0,
      rate: 0,
      discount: 0,
      isOpen: false,
      keyword: "",
    },
  ]);

  function paidInFull() {
    let total = calculateGrandTotal();
    setPaidAmount(total);
  }

  function UniqueSalesID() {
    let timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
    let uuid = Math.random().toString(16).substr(2, 8);
    return `${timestamp}${uuid}`.toUpperCase();
  }

  function reduceQuantity(availableQuantity, soldQuantity)
  {
    return availableQuantity-soldQuantity;
  } 

  async function saveSalesInvoice() {
    const products = [];

    for (let i = 0; i < productRows.length; i++) {
      let productFromDB = getProductById(productRows[i]?.productID);
      if (!productFromDB) continue;

      let total =
        productFromDB.selling * productRows[i].quantity -
        (productFromDB.selling *
          productRows[i].quantity *
          productRows[i].discount) /
          100;

      let remainingProduct = productFromDB.quantity-productRows[i].quantity;
      console.log(typeof(productFromDB.ID));

      const { data, error } = await supabase
            .from('product')
            .update({ quantity: remainingProduct })
            .eq('ID', productFromDB?.ID)

            if (error) {
            console.error(error);
            }

            console.log('Update successful:', data);

      let product = {
        ID: productFromDB.ID,
        name: productFromDB.product,
        quantity: productRows[i].quantity,
        unit: productFromDB.unit,
        rate: productFromDB.selling,
        discount: productRows[i].discount,
        total: total,
      };

      products.push(product);
    }

    let due =
      paidAmount < calculateGrandTotal()
        ? calculateGrandTotal() - paidAmount
        : 0;
    let grandTotal = calculateGrandTotal();
    let salesID = UniqueSalesID();
    let data = {
      Array: products,
      salesDiscount: salesDiscount,
      totalDiscount: totalDiscount,
      totalTax: totalTax,
      shippingCost: shippingCost,
      grandTotal: grandTotal,
      paidAmount: paidAmount,
      due: due,
      customer: selectedCustomer,
      date: Date.now(),
    };

    let savedData = {
      ID: salesID,
      data: JSON.stringify(data),
    };

    // save data to database here
    setLoading(true);
    await supabase.from("invoice").upsert([savedData]);

    let credit = 0,
      balance = 0,
      debit = 0,
      description = "";

    balance = selectedCustomer ? selectedCustomer.balance : 0;
    let subtotal = grandTotal - balance;

    if (paidAmount > subtotal) {
      let extraPaid = paidAmount - subtotal;
      if (balance > 0) {
        debit = 0;
        credit = paidAmount;
        balance = balance - extraPaid;
        description = `credit for invoice : ${salesID} `;
      }
    } else {
      let lessPaid = subtotal - paidAmount;
      debit = lessPaid;
      credit = paidAmount;
      description = `debit for invoice : ${salesID} `;
      balance = balance + lessPaid;
    }

    let date = Date.now();

    let customerLedger = {
      description: "debit for invoice : " + salesID + "",
      invoice: salesID,
      debit: subtotal,
      credit: 0,
      balance: selectedCustomer?.balance + debit,
      date: date,
    };

    // add the ledger to database
    await supabase.from("customer_ledger").upsert([customerLedger]);

    customerLedger = {
      description: description,
      invoice: salesID,
      debit: debit,
      credit: credit,
      balance: balance,
      date: date,
      customer_id: selectedCustomer?.ID,
    };

    // add the ledger to database
    await supabase.from("customer_ledger").upsert([customerLedger]);

    // update the customer balance
    await supabase
      .from("customers")
      .update({ balance: balance })
      .eq("ID", selectedCustomer?.ID);

      let salesLedgerBalance = ledger[ledger.length-1]?.balance;
      let salesLedgerCredit = grandTotal - selectedCustomer?.balance;
      let newSalesLedgerBalance = salesLedgerCredit + salesLedgerBalance;

    // add the paidAmount to the cash ledger
    let cashLedger = {
      incoming: paidAmount,
      outgoing: 0,
      date: date,
      invoice: salesID,
      balance: ledger[ledger.length-1]?.balance + paidAmount,
    };
    await supabase.from("cash_ledger").upsert([cashLedger]);
    // add the sales to the sales ledger

    // get from sales table
    // let { data: storeData, error } = await supabase
    //   .from("store")
    //   .select("*")
    //   .eq("ID", "store");
    // let store = storeData[0];
    // let salesLedgerBalance = store?.store_balance;
    // let salesLedgerCredit = grandTotal - selectedCustomer?.balance;
    // let newSalesLedgerBalance = salesLedgerCredit + salesLedgerBalance;

    // await supabase
    //   .from("store")
    //   .update({ store_balance: newSalesLedgerBalance })
    //   .eq("ID", "store");

    let salesLedger = {
      debit: 0,
      credit: salesLedgerCredit,
      balance: newSalesLedgerBalance,
      date: date,
      invoice: salesID,
    };
    
    // alert("Data Inserted.")
    toast.success("Data Inserted");
    await supabase.from("sales_ledger").upsert([salesLedger]);

    

    let print = confirm("Do you want to print?");
    setLoading(false);
    if (print)
    {
      router.push(`/print/${salesID}`);
    } else {
      router.reload();
    }
  }

  function getProductById(ID) {
    for (let i = 0; i < products?.length; i++) {
      if (products[i]?.ID === ID) {
        return products[i];
      }
    }
    return null;
  }

  async function fetchProducts() {
    let { data, error } = await supabase.from("product").select("*");
    if (data) {
      setProducts(data);
    }
    if(error){
      console.log(error);
    }
  }

  async function fetchCustomers() {
    let { data, error } = await supabase.from("customers").select("*");
    if (data) {
      setCustomers(data);
    }
    if(error){
      console.log(error);
    }
  }

  async function fetchCashLedger() {
    let { data, error } = await supabase.from("cash_ledger").select("*");
    if (data) {
      setLedger(data);
      // console.log(data[]);
    }
    if(error){
      console.log(error);
    }
  }

  function openDropDown(index) {
    let newRows = [];
    for (let i = 0; i < productRows?.length; i++) {
      if (i === index) {
        let newRow = productRows[i];
        newRow.isOpen = true;
        newRows.push(newRow);
      } else newRows.push(productRows[i]);
    }
    setProductRows(newRows);
  }

  function closeDropDown(index) {
    let newRows = [];
    for (let i = 0; i < productRows?.length; i++) {
      if (i === index) {
        let newRow = productRows[i];
        newRow.isOpen = false;
        newRows.push(newRow);
      } else newRows.push(productRows[i]);
    }
    setProductRows(newRows);
  }

  function addProductRow() {
    setProductRows([
      ...productRows,
      {
        productID: null,
        availableQuantity: null,
        unit: null,
        quantity: 0,
        rate: 0,
        discount: 0,
        isOpen: false,
        keyword: "",
      },
    ]);
  }

  function removeProductRow(index) {
    if (productRows?.length <= 1) {
      // alert("Can't delete default row");
      toast.warn("Can't delete default row");
      return;
    }

    let newRows = [];
    for (let i = 0; i < productRows?.length; i++) {
      if (i === index) continue;
      else newRows.push(productRows[i]);
    }
    setProductRows(newRows);
  }

  function changeKeyword(value, index) {
    let newRows = [];
    for (let i = 0; i < productRows?.length; i++) {
      if (i === index) {
        let newRow = productRows[i];
        newRow.keyword = value;
        newRows.push(newRow);
      } else newRows.push(productRows[i]);
    }
    setProductRows(newRows);
  }

  function changeQuantity(value, index) {
    let newRows = [];
    for (let i = 0; i < productRows?.length; i++) {
      if (i === index) {
        let newRow = productRows[i];
        newRow.quantity = value;
        soldQuantity = newRow.quantity;
        newRows.push(newRow);
      } else newRows.push(productRows[i]);
    }

    console.log("new", newRows);
    setProductRows(newRows);
  }

  function changeDiscount(value, index) {
    let newRows = [];
    for (let i = 0; i < productRows?.length; i++) {
      if (i === index) {
        let newRow = productRows[i];
        newRow.discount = value;
        newRows.push(newRow);
      } else newRows.push(productRows[i]);
    }
    setProductRows(newRows);
  }

  function setProductID(ID, index) {
    let newRows = [];
    for (let i = 0; i < productRows?.length; i++) {
      if (i === index) {
        let newRow = productRows[i];
        newRow.productID = ID;
        newRows.push(newRow);
      } else newRows.push(productRows[i]);
    }
    setProductRows(newRows);
  }

  function getKeyword(index) {
    let keyword = "";
    for (let i = 0; i < productRows?.length; i++) {
      if (i === index) {
        keyword = productRows[i]?.keyword;
        break;
      }
    }
    return keyword;
  }

  function getQuantity(index) {
    let quantity = "";
    for (let i = 0; i < productRows?.length; i++) {
      if (i === index) {
        quantity = productRows[i]?.quantity;
        break;
      }
    }
    return quantity;
  }
  function getDiscount(index) {
    let discount = "";
    for (let i = 0; i < productRows?.length; i++) {
      if (i === index) {
        discount = productRows[i]?.discount;
        break;
      }
    }
    return discount;
  }

  function calculateTotal(selling, quantity, index) {
    if (!selling) return 0;
    let total = 0;
    selling = parseFloat(selling);
    total = selling * quantity;
    let discount = getDiscount(index);
    total = total - (total * discount) / 100;
    return total;
  }

  function calculateGrandTotal() {
    let grandTotal = 0;
    for (let i = 0; i < productRows?.length; i++) {
      let product = getProductById(productRows[i]?.productID);
      let selling = product?.selling;
      let total = calculateTotal(selling, productRows[i].quantity, i);
      grandTotal += total;
    }

    grandTotal = grandTotal + (grandTotal * totalTax) / 100;
    if (selectedCustomer) {
      grandTotal += selectedCustomer.balance;
    }
    grandTotal = grandTotal - salesDiscount;
    grandTotal = grandTotal + shippingCost;

    return grandTotal;
  }

  function calculateTotalDiscount() {
    let totalPercentageDiscount = 0;
    for (let i = 0; i < productRows?.length; i++) {
      let product = getProductById(productRows[i]?.productID);
      if (!product) continue;
      let selling = product?.selling;
      let quantity = productRows[i].quantity;
      let discount = productRows[i].discount;
      let totalSellingPrice = selling * quantity;
      let percentageDiscount = (totalSellingPrice * discount) / 100;
      totalPercentageDiscount += percentageDiscount;
      console.log("prod", product);
    }
    let total = totalPercentageDiscount + salesDiscount;
    setTotalDiscount(total);
  }

  useEffect(() => {
    calculateTotalDiscount();
  }, [productRows, salesDiscount]);

  useEffect(() => {
    setTimestamp(Date.now());
    fetchProducts();
    fetchCustomers();
    fetchCashLedger();
  }, []);

  function getSelectedCustomerBalance() {
    console.log("balance koi", selectedCustomer);
    return selectedCustomer?.balance;
  }

  if (isLoading) return <div>Loading ....</div>;

  return (
    <div className={styles["page"]}>
      <Sidebar />
      <div className={styles["top-bar"]}>
        <div className={styles["top-title"]}>
          <div></div>
          <h1>Sales</h1>
        </div>
        <div className={styles["nav-status"]}>Home/Sales/New Sales</div>
      </div>

      <div className={styles["nav-button"]}>
        <button>Add Sales</button>
        <button
          onClick={() => {
            router.push("/sales-list");
          }}
        >
          List Sales
        </button>
      </div>
      <div className={styles["sales-box"]}>
        <h1>New Sales</h1>
        <div className={styles["sales-top"]}>
          <div className={styles["sales-customer"]}>
            <p>Select Customer</p>
            <div>
              <input
                className={styles["customer-search"]}
                value={customerSearchKeyword}
                type="text"
                placeholder="search customer"
                onClick={(e) => {
                  setIsCustomerDropDownOpen(true);
                }}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setIsCustomerDropDownOpen(false);
                    setCustomerSearchKeyword(e.target.value);
                  } else {
                    setIsCustomerDropDownOpen(true);
                    setCustomerSearchKeyword(e.target.value);
                  }
                }}
              />
              <CustomerDropDown
                isOpen={isCustomerDropDownOpen}
                customers={customers}
                keyword={customerSearchKeyword}
                setSelectedCustomer={setSelectedCustomer}
                setIsOpen={setIsCustomerDropDownOpen}
              />
            </div>
            {selectedCustomer && (
              <div className={styles["sales-customer-details"]}>
                <p>{`Name: ${selectedCustomer?.name}`}</p>
                <p>{`Phone: ${selectedCustomer?.phone}`}</p>
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setCustomerSearchKeyword("");
                  }}
                >
                  x
                </button>
              </div>
            )}

            <button
              className={styles["add-customer-button"]}
              onClick={() => {
                router.push("/add-customer");
              }}
            >
              +
            </button>
          </div>
          <div className={styles["payment"]}>
            <p>Payment</p>
            <input type="text" placeholder="by cash / by bank" />
          </div>
          <div className={styles["date"]}>
            <p>Date : </p>
            <p>{formatDate(timestamp)}</p>
          </div>
        </div>

        <div className={styles["sales-main"]}>
          <div className={styles["sales-products-titles"]}>
            <div className={styles["title-box"]}>
              <p>Item Information</p>
            </div>
            <div className={styles["title-box"]}>
              <p>Available Quantity</p>
            </div>
            <div className={styles["title-box"]}>
              <p>Unit</p>
            </div>
            <div className={styles["title-box"]}>
              <p>Quantity</p>
            </div>
            <div className={styles["title-box"]}>
              <p>Rate</p>
            </div>
            <div className={styles["title-box"]}>
              <p>{`Discount (%)`}</p>
            </div>
            <div className={styles["title-box"]}>
              <p>Total</p>
            </div>
            <div className={styles["title-box"]}>
              <p>Action</p>
            </div>
          </div>

          <div className={styles["sales-products"]}>
            {productRows?.map((row, index) => {
              return (
                <div key={index} className={styles["product-row"]}>
                  <div
                    className={`${styles["product-info-box"]} ${styles["product-selector"]}`}
                  >
                    {row?.productID && (
                      <input
                        value={getProductById(row?.productID)?.product}
                        placeholder="select product"
                        onClick={() => {
                          setProductID(null, index);
                          openDropDown(index);
                        }}
                      />
                    )}
                    {!row?.productID && (
                      <input
                        value={`${getKeyword(index)}`}
                        placeholder="select product"
                        on={() => {
                          closeDropDown(index);
                        }}
                        onClick={() => {
                          openDropDown(index);
                        }}
                        onChange={(e) => {
                          changeKeyword(e.target.value, index);
                          openDropDown(index);
                        }}
                      />
                    )}
                    {row?.isOpen && (
                      <ProductDropDown
                        products={products}
                        productRows={productRows}
                        setProductID={setProductID}
                        dropDownIndex={index}
                        closeDropDown={closeDropDown}
                      />
                    )}
                  </div>
                  <div className={styles["product-info-box"]}>
                    <p>{getProductById(row?.productID)?.quantity}</p>
                  </div>
                  <div className={styles["product-info-box"]}>
                    <p>{getProductById(row?.productID)?.unit}</p>
                  </div>
                  <div className={styles["product-info-box"]}>
                    <input
                      placeholder="Quantity"
                      value={`${getQuantity(index)}`}
                      onChange={(e) => {
                        if (e.target.value === "") {
                          changeQuantity(0, index);
                        } else {
                          if (is_numeric(e.target.value))
                            changeQuantity(parseFloat(e.target.value), index);
                        }
                      }}
                    />
                  </div>
                  <div className={styles["product-info-box"]}>
                    <p>{getProductById(row?.productID)?.selling}</p>
                  </div>
                  <div className={styles["product-info-box"]}>
                    <input
                      placeholder="Discount"
                      value={`${getDiscount(index)}`}
                      onChange={(e) => {
                        if (e.target.value === "") {
                          changeDiscount(0, index);
                        } else {
                          if (is_numeric(e.target.value))
                            changeDiscount(parseFloat(e.target.value), index);
                        }
                      }}
                    />
                  </div>
                  <div className={styles["product-info-box"]}>
                    <p>{`${calculateTotal(
                      getProductById(row?.productID)?.selling,
                      getQuantity(index),
                      index
                    )}`}</p>
                  </div>
                  <div className={styles["product-info-box"]}>
                    <button
                      className={styles["remove-row"]}
                      onClick={() => {
                        removeProductRow(index);
                      }}
                    ></button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles["sales-bottom"]}>
            <div className={styles["bottom-row"]}>
              <p>Flat Discount:</p>
              <input
                placeholder="0.00"
                value={salesDiscount}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setSalesDiscount(0);
                  } else {
                    if (is_numeric(e.target.value))
                      setSalesDiscount(parseFloat(e.target.value));
                  }
                }}
              />
              <button
                className={styles["add-row"]}
                onClick={() => {
                  addProductRow();
                }}
              ></button>
            </div>

            <div className={styles["bottom-row"]}>
              <p>Total Discount: </p>
              <input placeholder="0.00" value={totalDiscount} />
            </div>

            <div className={styles["bottom-row"]}>
              <p>Total Tax (%): </p>
              <input
                placeholder="0.00"
                value={totalTax}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setTotalTax(0);
                  } else {
                    if (is_numeric(e.target.value))
                      setTotalTax(parseFloat(e.target.value));
                  }
                }}
              />
            </div>

            <div className={styles["bottom-row"]}>
              <p>Shipping Cost: </p>
              <input
                placeholder="0.00"
                value={shippingCost}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setShippingCost(0);
                  } else {
                    if (is_numeric(e.target.value))
                      setShippingCost(parseFloat(e.target.value));
                  }
                }}
              />
            </div>
            {selectedCustomer && (
              <div className={styles["bottom-row"]}>
                <p>Previous: </p>
                <input
                  placeholder="0.00"
                  onChange={() => {}}
                  value={`${selectedCustomer?.balance}`}
                />
              </div>
            )}

            <div className={styles["bottom-row"]}>
              <p>Grand Total: </p>
              <input placeholder="0.00" value={`${calculateGrandTotal()}`} />
            </div>

            {/* <div className={styles["bottom-row"]}>
              <p>Previous: </p>
              <input placeholder="0.00" />
            </div>

            <div className={styles["bottom-row"]}>
              <p>Net Total: </p>
              <input placeholder="0.00" />
            </div> */}

            <div className={styles["bottom-row"]}>
              <p>Paid Amount: </p>
              <input
                value={paidAmount}
                placeholder="0.00"
                onChange={(e) => {
                  if (e.target.value === "") {
                    setPaidAmount(0);
                  } else {
                    if (is_numeric(e.target.value))
                      setPaidAmount(parseFloat(e.target.value));
                  }
                }}
              />
            </div>

            <div className={styles["bottom-row"]}>
              <p>Due: </p>
              <input
                placeholder="0.00"
                value={`${
                  paidAmount < calculateGrandTotal()
                    ? calculateGrandTotal() - paidAmount
                    : 0
                }`}
              />
            </div>

            <div className={styles["bottom-row"]}>
              <p>Change: </p>
              <input
                placeholder="0.00"
                value={`${
                  paidAmount > calculateGrandTotal()
                    ? paidAmount - calculateGrandTotal()
                    : 0
                }`}
              />
            </div>
          </div>

          <div className={styles["buttons"]}>
            <button
              onClick={() => {
                paidInFull();
              }}
            >
              Full Paid
            </button>

            <button
              onClick={async () => {
                await saveSalesInvoice();
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
