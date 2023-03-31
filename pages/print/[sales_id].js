import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/client';
import { useReactToPrint } from "react-to-print";
import styles from '../../styles/print.module.css'


const Document = React.forwardRef(({ sale }, ref) => (

    <div ref={ref} className={styles["document"]}>
        
        <div className={styles["document-title"]}>
            <h1>payment invoice</h1>
        </div>
        <div className={styles["print-up"]}>
            <div>Date</div>
            <div>Time</div>
        </div>
        <div className={styles["print"]}>
            <div>{"name"}</div>
            <div>{"quantity"}</div>
            <div>{"unit"}</div>
            <div>{"rate"}</div>
            <div>{"discount"}</div>
            <div>{"total"}</div>

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
        {/* salesDiscount":0,"totalDiscount":0,"shippingCost":0,"grandTotal":0,"paidAmount":0,"due":0} */}
        <div className={styles["print-below"]}>
            <h3>{`sales discount - ${sale?.data?.salesDiscount}`}</h3>
            <h3>{`total discount - ${sale?.data?.totalDiscount}`}</h3>
            <h3>{`shipping cost - ${sale?.data?.shippingCost}`}</h3>
            <h3>{`grand total - ${sale?.data?.grandTotal}`}</h3>
            <h3>{`paid amount - ${sale?.data?.paidAmount}`}</h3>
            <h3>{`due - ${sale?.data?.due}`}</h3>

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
        if (data[0]) {
            let main_data = JSON.parse(data[0]?.data);
            let newData = {
                salesID: data[0]?.salesID,
                data: main_data
            }
            setSales(newData)
        }
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