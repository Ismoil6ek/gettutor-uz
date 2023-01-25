import { Dialog, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React, { useState } from "react";
import { base_url } from "../../data";
import strelka2 from "../../assets/svg/strelka2.svg";
import popupImg from "../../assets/svg/defaultImg.png";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/useTypedSelector";

const NoticePopup = ({
  open,
  setOpen,
  index,
  tabId,
  setTabId,
  type,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  index: number;
  tabId: number;
  setTabId: (value: number) => void;
  type?: string;
}) => {
  const [cause, setCause] = useState(1);
  const { notice } = useAppSelector((state) => state);
  const { t } = useTranslation();

  const handleClose2 = () => {
    setOpen(false);
  };

  const handleResponse = (indx: number) => {
    fetch(`${base_url}/site/courses/${indx}/response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          toast.success(t("extra.done"));
          handleClose2();
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else if (result.success === false) {
          toast.error("Error!");
        }
      })
      .catch((err) => {
        toast.error(t("extra.error"));
      });
  };

  const handleCouseSubmit = (indx: number) => {
    fetch(`${base_url}/site/courses/${indx}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        reason_id: cause,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          window.location.reload();
        } else {
          toast.error(t("extra.error"));
        }
      })
      .catch((err) => {
        toast.error(t("extra.error"));
      });
  };

  const handleRadio = (e: number) => {
    setCause(e);
  };

  console.log(index);

  return (
    <Dialog
      open={open}
      onClose={handleClose2}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {tabId === 0 ? (
        <div className="notification-popup">
          {index !== null ? (
            <div className="tutors-message-popup">
              <div className="tutors-message">
                <div className="popup-img">
                  {notice?.[index].student_image ? (
                    // <img src={notice?.[index].student_image} alt="foto" />
                    <img src={popupImg} alt="foto" />
                  ) : (
                    <img src={popupImg} alt="foto" />
                  )}
                </div>
                <div>
                  <h1 className="message-title">
                    {notice?.[index].student_name}
                  </h1>
                  <h2 className="message-h2">{t("header.message")}</h2>
                  <p className="message-text">{notice?.[index].comment}</p>

                  <button
                    className="message-btn"
                    onClick={() => handleResponse(notice[index].id)}
                  >
                    {t("header.accept")}
                  </button>
                  <button
                    className="message-cancel"
                    onClick={() => setTabId(1)}
                  >
                    {t("header.send")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : tabId === 1 ? (
        <div className="notification-cancel">
          <div className="title">
            {type !== "media" && (
              <img src={strelka2} alt="phot" onClick={() => setTabId(0)} />
            )}
            <span>{t("header.reason")}</span>
          </div>
          <RadioGroup
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
            aria-labelledby="demo-controlled-radio-buttons-group"
            value={cause}
            name="controlled-radio-buttons-group"
            onChange={(e) => handleRadio(Number(e.target.value))}
          >
            <FormControlLabel
              value={1}
              control={<Radio />}
              label={t("header.full")}
            />
            <FormControlLabel
              value={2}
              control={<Radio />}
              label={t("header.notFull")}
            />
            <FormControlLabel
              value={3}
              control={<Radio />}
              label={t("header.ill")}
            />
            <FormControlLabel
              value={4}
              control={<Radio />}
              label={t("header.businessTrip")}
            />
          </RadioGroup>
          <button
            onClick={() => handleCouseSubmit(notice[index].id)}
            className="button"
          >
            {t("header.send")}
          </button>
        </div>
      ) : (
        t("header.noYet")
      )}
    </Dialog>
  );
};

export default NoticePopup;
