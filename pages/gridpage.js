import React from "react";
import styles from "../styles/gridpage.module.css";

const gridpage = () => {
  return (
    <div className={styles["page"]}>
      <div className={styles["box"]}>
        <div>
          <label for="Name">Name:</label>
          <input type="text" placeholder="Name"></input>
        </div>
        <div>
          <label for="Phone">Phone:</label>
          <input type="text" placeholder="Phone Number"></input>
        </div>
        <div>
        
          <label for="Address">Address:</label>
          <input type="text" placeholder="Address"></input>
        </div>
        <div>
          <label for="Description">Description:</label>
          <input type="text" placeholder="Description"></input>
        </div>
      </div>
    </div>
  );
};

export default gridpage;
