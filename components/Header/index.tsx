"use client";

import React from "react";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Tab Tracker</h1>
    </div>
  );
};

export default Header;
