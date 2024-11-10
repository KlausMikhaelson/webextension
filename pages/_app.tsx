import React from "react";
import "../styles/globals.css";

export const backendUrl = `http://localhost:3000`;
export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
