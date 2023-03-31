import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/client';
import { useReactToPrint } from "react-to-print";
import styles from '../../styles/print.module.css'


const Document = React.forwardRef(({ sale }, ref) => (

    <div ref={ref} className={styles["document"]}>
        {
            console.log('ah', sale)
        }
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

            {sale?.data?.products.map((item, index) => {
                return (
                    <React.Fragment key={index}>
                        <div>{item?.name}</div>
                        <div>{item?.quantity}</div>
                        <div>{item?.unit}</div>
                        <div>{item?.rate}</div>
                        <div>{item?.discount}</div>
                        <div>{item?.total}</div>
                    </React.Fragment>
                );
            })}
        </div>
        <div div className={styles["print-below"]}>
            <h3>{`Subtotal - ${sale?.data?.subTotal}`}</h3>
            <h3>{`Caring cost - ${sale?.data?.caring}`}</h3>
            <h3>{`Transportation cost - ${sale?.data?.transportation}`}</h3>
            <h3>{`Discount - ${sale?.data?.discount}`}</h3>

            <h3>{`Reference - ${sale?.data?.reference}`}</h3>

            <h3>{`Signature - ${sale?.data?.signature}`}</h3>

            <h3>{`Net Total: - ${sale?.data?.total}`}</h3>
            <p className={styles['powered-by']}>Powered by - WHOAREWE, 017xxxxxxxx</p>
        </div>
    </div>
));

Document.displayName = "Document";


const Print = () => {
    const router = useRouter()
    const { sales_id } = router.query;
    const [sales, setSales] = useState(null)

    const documentRef = useRef();

    async function fetchSales(saleID) {
        let { data, error } = await supabase.from("invoice").select("*").match({ ID: sales_id });
        if (data) setSales(data);
    }
    useEffect(() => {
        if (sales_id) {
            fetchSales()
        }
    }, [sales_id])

    const handlePrint = useReactToPrint({
        content: () => documentRef.current,
    });

    return (
        <div>
            <p>
                Print {JSON.stringify(sales_id)}
            </p>
            <p>
                {JSON.stringify(sales)}
            </p>
            <div className={styles["print-box"]}>
                <Document sale={sales} ref={documentRef} />

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

        </div>
    )
}

export default Print