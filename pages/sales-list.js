import { supabase } from '@/lib/client'
import React, { useEffect, useState } from 'react'

const SalesList = () => {

  let [sales, setSales] = useState([]);

  async function fetchSales() {
    let { data, error } = await supabase.from('invoice').select("*");
    let salesData = [];
    for (let i = 0; i < data?.length; i++) {
      salesData.push({
        salesID: data[i]?.salesID,
        data: JSON.parse(data[i]?.data)
      })
    }
    setSales(salesData);
  }

  useEffect(() => {
    fetchSales()
  }, [])
  
  return (
    <div>
      {
        sales.map((sale, index) => {
          return (
            <p key={index}>
              {JSON.stringify(sale)}
            </p>
          )
        })
      }
    </div>

  )
}

export default SalesList