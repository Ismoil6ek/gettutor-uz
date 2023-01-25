import React from "react";

import "./pageNoteFound.scss";

import img from "../../assets/svg/OBJECTS2.svg";
import { Link } from "react-router-dom";
import { t } from "i18next";

const PageNotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <div>
        <img src={img} alt="OBJECTS2" />
      </div>
      <div>{t("extra.pageNotFound")}</div>
      <Link to="/">{t("extra.goBack")}</Link>
    </div>
  );
};

export default PageNotFound;
