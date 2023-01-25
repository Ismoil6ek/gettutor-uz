import React from "react";
import "./loader.scss";

const Loader = ({ width = "100%", height = "100%" }) => {
  return (
    <div className="preloader-dots" style={{ width: width, height: height }}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

export default Loader;
