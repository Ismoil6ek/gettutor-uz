import React from "react";
import Dialog from "@mui/material/Dialog";
import { base_url } from "../../../data";
import { useTranslation } from "react-i18next";

// style
import "./aboutTeacherMessage.scss";

// images
import { ReactComponent as Success } from "../../../assets/svg/successSent.svg";
import popupImg from "../../../assets/svg/defaultImg.png";
import illustration from "../../../assets/svg/Illustration.svg";
import close from "../../../assets/svg/close.svg";
import { toast } from "react-toastify";

const AboutTeacherMessage = ({
  courseId,
  img,
}: {
  courseId: number;
  img: string;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [messageEntered, setMessageEntered] = React.useState<string>();
  const [success, setSuccess] = React.useState(false);
  const [accepted, setAccepted] = React.useState(null);

  interface styleType {
    borderRadius: string;
    color: string;
    hideProgressBar: boolean;
  }

  const handleMessage = () => {
    fetch(`${base_url}/site/courses/${courseId}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        comment: messageEntered,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          setSuccess(true);
          setTimeout(() => {
            setOpen(false);
          }, 1000);
        } else if (result.message === "Already sent!") {
          toast.info(t("main.sent2"), {
            icon: "⏳",
            style: {
              borderRadius: "10px",
              color: "#fff",
              hideProgressBar: true,
            } as styleType,
          });

          setMessageEntered("");
          setOpen(false);
        }
      })
      .catch((err) => {
        toast.error("error");
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button onClick={handleClickOpen} className="btn button-hover">
        {t("viewTutor.sendRequest")}
      </button>
      {accepted === null ? (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {success === false ? (
            <div className="tutor-message-popup">
              <div className="tutor-message">
                <div className="popup-img">
                  {img ? (
                    <img src={img} alt="foto" />
                  ) : (
                    <img src={popupImg} alt="foto" />
                  )}
                </div>
                <div>
                  <h1 className="message-title">
                    {t("viewTutor.sendRequest")}
                  </h1>
                  <p className="message-paragraph">
                    {t("viewTutor.writeAboutYou")}
                  </p>
                  <h3 className="message-input-title">
                    {t("viewTutor.WhatAreYouPreparingFor")}
                  </h3>
                  <textarea
                    className="message-textarea"
                    id="w3review"
                    name="w3review"
                    placeholder={String(t("viewTutor.writeYourMessage"))}
                    value={messageEntered}
                    onChange={(e) => {
                      setMessageEntered(e.target.value);
                    }}
                  ></textarea>
                  <button
                    className="message-btn"
                    onClick={() => {
                      messageEntered ? handleMessage() : toast.error("error");
                    }}
                  >
                    {t("viewTutor.send")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="success">
              <Success />
              <h4>{t("viewTutor.sent")}</h4>
              <button onClick={() => setOpen(false)}>
                {t("viewTutor.goood")}
              </button>
            </div>
          )}
        </Dialog>
      ) : accepted === false ? (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className="popup-sent">
            <div className="title">
              <img onClick={() => setOpen(false)} src={close} alt="" />
            </div>
            <img src={illustration} alt="" />
            <h2>{t("viewTutor.sent")}</h2>
          </div>
        </Dialog>
      ) : (
        toast.error("Error 404 !")
      )}
    </>
  );
};

export default AboutTeacherMessage;
