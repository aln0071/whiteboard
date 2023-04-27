import * as React from "react";
import "./loader.css";
import { useSelector } from "react-redux";

export default function Loader() {
  const showLoader = useSelector((state) => state.loader);
  if (showLoader) {
    return (
      <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  } else {
    return "";
  }
}
