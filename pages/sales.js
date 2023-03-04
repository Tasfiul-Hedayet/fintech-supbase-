import Select from "react-select";
import { supabase } from "@/lib/client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/sales.module.css";
import { useReactToPrint } from "react-to-print";

const PAGE_TYPES = {
  ADD: "ADD",
  LIST: "LIST",
  PRINT: "PRINT",
};

const Document = React.forwardRef(({ cart }, ref) => (
  <div ref={ref} className={styles["document"]}>
    <div className={styles["document-title"]}>
      <h1>payment invoice</h1>
    </div>
    <div className={styles["print-up"]}>
      <div>Date</div>
      <div>Time</div>
    </div>
    <div className={styles["print"]}>
      <div>{"Quantity"}</div>
      <div>{"Item Name"}</div>
      <div>{"Price"}</div>
      <div>{"Total Price"}</div>

      {cart.cart_items.map((item, index) => {
        return (
          <React.Fragment key={index}>
            <div>{item?.quantity}</div>
            <div>{item?.product}</div>
            <div>{item?.selling}</div>
            <div>{item?.selling * item?.quantity}</div>
          </React.Fragment>
        );
      })}
    </div>
    <div div className={styles["print-below"]}>
      <h3>{`Subtotal - ${cart?.subTotal}`}</h3>
      <h3>{`Caring cost - ${cart?.caring}`}</h3>
      <h3>{`Transportation cost - ${cart?.transportation}`}</h3>
      <h3>{`Discount - ${cart?.discount}`}</h3>

      <h3>{`Reference - ${cart?.reference}`}</h3>

      <h3>{`Signature - ${cart?.signature}`}</h3>

      <h3>{`Net Total: - ${cart?.total}`}</h3>
      <p className={styles['powered-by']}>Powered by - WHOAREWE, 017xxxxxxxx</p>
    </div>
  </div>
));

Document.displayName = "Document";

function Sales() {
  const [type, setType] = useState(PAGE_TYPES.ADD);

  const [invoice, setInvoice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selling, setSelling] = useState("");
  const [percentage, setPercentage] = useState("");
  const [total, setTotal] = useState("");
  const [signature, setSignature] = useState("");
  const [reference, SetReference] = useState("");

  const [isLoading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [isCart, setIsCart] = useState(false);

  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [caring, setCaring] = useState(0);
  const [transportation, setTransportation] = useState(0);
  const [cart, setCart] = useState("");

  function is_numeric(str) {
    return /^\d+$/.test(str);
  }

  function processCartData() {
    let cart_items = [];

    for (let i = 0; i < items?.length; i++) {
      let quantity = getQuantityOfProduct(items[i]);
      let cart_item = {
        ...items[i],
        quantity: quantity,
      };
      cart_items.push(cart_item);
    }

    const cartData = {
      cart_items: cart_items,
      total: calculateTotalOfCart(),
      subTotal: calculateSubTotalOfCart(),
      caring: caring,
      transportation: transportation,
      discount: discount,
      signature: signature,
      reference: reference,
    };

    console.log(cartData);
    return cartData;
  }

  function checkIfAlreadyAddedToCart(product) {
    let added = false;
    for (let i = 0; i < items?.length; i++) {
      if (items[i].ID === product?.ID) {
        added = true;
        break;
      }
    }
    return added;
  }

  const documentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => documentRef.current,
  });

  function getQuantityOfProduct(product) {
    let quantity = 0;

    for (let i = 0; i < quantities?.length; i++) {
      if (quantities[i].ID === product.ID) {
        quantity = quantities[i].quantity;
        break;
      }
    }

    return quantity;
  }

  async function fetchProducts() {
    let { data, error } = await supabase.from("product").select("*");
    if (data) {
      setProducts(data);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // useEffect(()=>{

  // }, [items]);

  // save in database later !!
  async function savePurchase() {
    setLoading(true);
    let cartData = JSON.stringify(processCartData());
    setCart(cartData);
    await supabase.from("sales").insert([{ cart: cartData }]);
    setLoading(false);
    setType(PAGE_TYPES.PRINT);
  }

  function calculateSubTotalOfCart() {
    let subTotal = 0.0;
    for (let i = 0; i < items?.length; i++) {
      subTotal += getProductPrice(items[i]);
    }
    return subTotal;
  }

  function calculateTotalOfCart() {
    let subTotal = calculateSubTotalOfCart();
    subTotal += caring;
    subTotal += transportation;
    subTotal -= discount;
    return subTotal;
  }

  function incrementQuantityToProduct(product) {
    let updatedQuantities = [];

    for (let i = 0; i < quantities?.length; i++) {
      if (quantities[i].ID === product.ID) {
        updatedQuantities.push({
          ID: quantities[i].ID,
          quantity: quantities[i].quantity + 1,
        });
      } else {
        updatedQuantities.push(quantities[i]);
      }
    }

    setQuantities(updatedQuantities);
  }

  function decrementQuantityToProduct(product) {
    let updatedQuantities = [];

    for (let i = 0; i < quantities?.length; i++) {
      if (quantities[i].ID === product.ID) {
        let updatedQuantityValue = quantities[i].quantity - 1;

        if (updatedQuantityValue < 1) {
          removeFromCart(product);
          alert("less than 1");
        } else {
          updatedQuantities.push({
            ID: quantities[i].ID,
            quantity: updatedQuantityValue,
          });
        }
      } else {
        updatedQuantities.push(quantities[i]);
      }
    }

    setQuantities(updatedQuantities);
  }

  function removeQuantityOfProduct(product) {
    let updatedQuantities = [];

    for (let i = 0; i < quantities?.length; i++) {
      if (quantities[i].ID === product.ID) {
        continue;
      } else {
        updatedQuantities.push(quantities[i]);
      }
    }

    setQuantities(updatedQuantities);
  }

  function getProductPrice(product) {
    let quantity = getQuantityOfProduct(product);
    let sellingPrice = parseFloat(product.selling);
    let price = quantity * sellingPrice;
    return price;
  }

  function addToCart(product) {
    let updatedItems = [...items, product];
    setItems(updatedItems);
    setQuantities([...quantities, { ID: product.ID, quantity: 1 }]);
  }

  function removeFromCart(product) {
    let updatedItems = [];

    for (let i = 0; i < items?.length; i++) {
      if (items[i].ID === product?.ID) continue;
      updatedItems.push(items[i]);
    }
    setItems(updatedItems);
    removeQuantityOfProduct(product);
  }

  if (isLoading) return <div>Loading ....</div>;

  return (
    <div className={styles["page"]}>
      <Sidebar />
      {type === PAGE_TYPES.ADD && (
        <div className={styles["box"]}>
          <div className={styles["select-container"]}>
            <div
              className={isCart ? styles["select"] : styles["active-select"]}
              onClick={() => setIsCart(false)}
            >
              Products
            </div>
            <div
              className={isCart ? styles["active-select"] : styles["select"]}
              onClick={() => setIsCart(true)}
            >
              Cart
            </div>
          </div>
          <h2 className={styles["h2"]}>Sales Invoice</h2>

          {!isCart && (
            <input
              type="text"
              placeholder="search product"
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
            />
          )}

          {!isCart &&
            products
              ?.filter(function (element) {
                // if (!keyword || keyword === '') return null;
                // else
                return element?.product
                  ?.toLowerCase()
                  .includes(keyword?.toLowerCase());
              })
              .map((product, index) => {
                return (
                  <div className={styles["product"]} key={product.ID}>
                    {/* {JSON.stringify(product)} */}
                    <h1> {`product Name : ${product.product}`}</h1>
                    <h2> {`Selling Pricec: ${product.selling} BDT`}</h2>
                    <h3> {`Category : ${product.category}`}</h3>
                    <p> {`Sub category : ${product.subcategory}`}</p>
                    <button
                      onClick={() => {
                        checkIfAlreadyAddedToCart(product)
                          ? removeFromCart(product)
                          : addToCart(product);
                      }}
                    >
                      {checkIfAlreadyAddedToCart(product)
                        ? "remove from cart"
                        : "add to cart"}
                    </button>
                  </div>
                );
              })}

          {isCart && (
            <div>
              {items?.map((item, key) => {
                return (
                  <div key={key} className={styles["item"]}>
                    <div className={styles["item-top"]}>
                      <p className={styles["item-name"]}>{item.product}</p>
                      <p className={styles["item-price"]}>
                        {` ${getQuantityOfProduct(item)} x ${item.selling
                          } = ${getProductPrice(item)} BDT`}
                      </p>
                      <div
                        className={styles["remove-item-button"]}
                        onClick={() => {
                          removeFromCart(item);
                        }}
                      ></div>
                    </div>

                    <div className={styles["item-bottom"]}>
                      <div
                        className={styles["decrement"]}
                        onClick={() => {
                          decrementQuantityToProduct(item);
                        }}
                      ></div>

                      <div className={styles["item-quantity"]}>
                        {getQuantityOfProduct(item)}
                      </div>

                      <div
                        className={styles["increment"]}
                        onClick={() => {
                          incrementQuantityToProduct(item);
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}

              {items?.length && items.length > 0 && (
                <div className={styles["cart-preview"]}>
                  <div className={styles["cart-subtotal"]}>
                    <p>{`subTotal : ${calculateSubTotalOfCart()}`}</p>
                  </div>
                  <div className={styles["cart-caring"]}>
                    <p>Caring Cost : </p>
                    <input
                      type="text"
                      placeholder="caring cost"
                      value={caring}
                      onChange={(e) => {
                        if (e.target.value === "") setCaring(0);
                        else if (is_numeric(e.target.value))
                          setCaring(parseFloat(e.target.value));
                      }}
                    />
                  </div>

                  <div className={styles["cart-transportation"]}>
                    <p>transportation Cost : </p>
                    <input
                      type="text"
                      placeholder="transportation cost"
                      value={transportation}
                      onChange={(e) => {
                        if (e.target.value === "") setTransportation(0);
                        else if (is_numeric(e.target.value))
                          setTransportation(parseFloat(e.target.value));
                      }}
                    />
                  </div>

                  <div className={styles["cart-discount"]}>
                    <p>discount : </p>
                    <input
                      type="text"
                      placeholder="discount cost"
                      value={discount}
                      onChange={(e) => {
                        if (e.target.value === "") setDiscount(0);
                        else if (is_numeric(e.target.value))
                          setDiscount(parseFloat(e.target.value));
                      }}
                    />
                  </div>

                  <div className={styles["cart-signature"]}>
                    <p>signature : </p>
                    <input
                      type="text"
                      placeholder="signature"
                      value={signature}
                      onChange={(e) => {
                        setSignature(e.target.value);
                      }}
                    />
                  </div>

                  <div className={styles["cart-reference"]}>
                    <p>reference : </p>
                    <input
                      type="text"
                      placeholder="references"
                      value={reference}
                      onChange={(e) => {
                        SetReference(e.target.value);
                      }}
                    />
                  </div>

                  <div className={styles["cart-total"]}>
                    <p>{`Total : ${calculateTotalOfCart()}`}</p>
                  </div>
                </div>
              )}

              {items?.length ? (
                <button onClick={savePurchase}>Next</button>
              ) : (
                <h2 className={styles["empty-cart"]}>Empty Cart!</h2>
              )}
            </div>
          )}
        </div>
      )}

      {type === PAGE_TYPES.PRINT && (
        <div className={styles["print-box"]}>
          <Document cart={JSON.parse(cart)} ref={documentRef} />

          <div className={styles["buttons"]}>
            <button
              onClick={() => {
                setType(PAGE_TYPES.ADD);
              }}
            >
              {" "}
              back{" "}
            </button>
            <button onClick={handlePrint}>Print</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sales;
