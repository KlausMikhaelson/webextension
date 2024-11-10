"use client";

import React from "react";
import styles from "./Header.module.css";
import NextIcon from "../../public/icons/next-svgrepo-com.svg";

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.dashboar_link}>
        <h3>Go To Dashboard</h3>
        <svg
          className={styles.next_icon}
          fill="#000000"
          height="800px"
          width="800px"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 55.752 55.752"
        >
          <g>
            <path
              d="M43.006,23.916c-0.28-0.282-0.59-0.52-0.912-0.727L20.485,1.581c-2.109-2.107-5.527-2.108-7.637,0.001
		c-2.109,2.108-2.109,5.527,0,7.637l18.611,18.609L12.754,46.535c-2.11,2.107-2.11,5.527,0,7.637c1.055,1.053,2.436,1.58,3.817,1.58
		s2.765-0.527,3.817-1.582l21.706-21.703c0.322-0.207,0.631-0.444,0.912-0.727c1.08-1.08,1.598-2.498,1.574-3.912
		C44.605,26.413,44.086,24.993,43.006,23.916z"
            />
          </g>
        </svg>
      </div>
      <div>
        <svg
          className={styles.profile_icon}
          viewBox="0 0 36 36"
          fill="none"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
        >
          <mask
            id=":r7:"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="36"
            height="36"
          >
            <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
          </mask>
          <g mask="url(#:r7:)">
            <rect width="36" height="36" fill="#ff005b"></rect>
            <rect
              x="0"
              y="0"
              width="36"
              height="36"
              transform="translate(0 0) rotate(324 18 18) scale(1)"
              fill="#ffb238"
              rx="36"
            ></rect>
            <g transform="translate(-4 -4) rotate(-4 18 18)">
              <path
                d="M15 19c2 1 4 1 6 0"
                stroke="#000000"
                fill="none"
                stroke-linecap="round"
              ></path>
              <rect
                x="10"
                y="14"
                width="1.5"
                height="2"
                rx="1"
                stroke="none"
                fill="#000000"
              ></rect>
              <rect
                x="24"
                y="14"
                width="1.5"
                height="2"
                rx="1"
                stroke="none"
                fill="#000000"
              ></rect>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Header;
