import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// import sass
import "./ad.scss";

// MUI icons
import ClearIcon from "@mui/icons-material/Clear";

const Ad = ({ show, setShow, setTabId  }: {show: boolean, setShow: (newValue: boolean) => void, setTabId: (newValue: number) => void }) => {
  const { t } = useTranslation();
  const [remove, setRemove] = useState(false);

  return (
    <div
      className={
        show ? (remove ? "ad remove" : "ad") : remove ? "ad remove" : "ad hide"
      }
    >
      <div className="ad-header">
        <p className="ad-content">{t("profile.tutorPlus")}</p>
        <ClearIcon
          onClick={() => {
            setShow(false);
            setRemove(true);
          }}
          className="remove-icon"
        />
      </div>
      <button 
        className="buy-subscription-btn"
        onClick={() => {
          setTabId(3);
          setRemove(true);
          setShow(false);
        }}
      >
        {t("profile.buySubscription")}
      </button>
    </div>
  );
};

export default Ad;
