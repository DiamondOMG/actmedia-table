"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Loader.module.css";

const Loader: React.FC = () => {
  const isMounted = useRef(true);
  const [show, setShow] = useState(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ถ้ามี logic async → ตรวจว่า isMounted ก่อน set
  // เช่น setTimeout(() => { if (isMounted.current) setShow(false); }, 1000);

  return (
    <div className={styles.loader}>
      <div className={`${styles.inner} ${styles.one}`} />
      <div className={`${styles.inner} ${styles.two}`} />
      <div className={`${styles.inner} ${styles.three}`} />
    </div>
  );
};

export default Loader;
