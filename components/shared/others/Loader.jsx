/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from 'styles/Loader.module.css';

export default function Loader() {
  return (
    <div className={styles.loaderBody}>
      <div className={styles.pageLoader}>
        <span>
          <img src="/govt2.png" width="150px" height="150px" style={{ marginTop: '30px' }} alt="" />
        </span>
      </div>
    </div>
  );
}
