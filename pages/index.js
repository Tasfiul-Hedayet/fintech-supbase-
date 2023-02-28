import Login from "@/components/Auth";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import { supabase } from "@/lib/client";

//   let [state, setState] = useState([]);
//   async  function fetchData()
//   {
//     let { data, error } =  await supabase.from('test').select('*');
//     setState(data);
//     console.log(data);
//     console.log(error);
//   }

//   useEffect(() => {
//     fetchData();
//   }, [])

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // check if is logged in
    // if looged in, send to dashboard
    // else do nothing
    let isLoggedIn = JSON.parse(localStorage.getItem("user"));
    if (isLoggedIn) router.push("/dashboard");
  }, []);

  return <Login />;
}
