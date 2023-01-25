import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { base_url } from "../../data";
import { changeNotice, changeNotifications } from "../../redux/actions";
import "./style.scss";
import NoticePopup from "../../components/StudentNoticePopup/NoticePopup";

import student_image from "../../assets/svg/defaultImg.png";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/useTypedSelector";
const NotificationPage = () => {
  const { notifications, socketUrl, notice, role } = useAppSelector(
    (state) => state
  );
  const [tabId, setTabId] = useState(1);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const [isAllText, setIsAllText] = useState<number | null>(null);
  const [tabModaId, setTabModaId] = useState(1);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { lastMessage, sendMessage } = useWebSocket(socketUrl);

  useEffect(() => {
    sendMessage(
      JSON.stringify({
        event: "pusher:subscribe",
        data: { auth: "", channel: "my-channel2" },
      })
    );
  }, []);

  useEffect(() => {
    fetch(`${base_url}/site/courses/requests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          dispatch(changeNotice(result.data));
        }
      })
      .catch((err) => {
        // console.log(err);
      });

    if (lastMessage) {
      let newData = JSON.parse(lastMessage.data);
      if (newData.event === "notification") {
      }
    }
    fetch(`${base_url}/site/notifications/index`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          dispatch(changeNotifications(result.data.reverse()));
        }
      })
      .catch((err) => {});
  }, [lastMessage]);

  function changeReadStatus(id: number) {
    fetch(`${base_url}/site/notifications/${id}/read`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result && result.success) {
          dispatch(
            changeNotifications(notifications.filter((item) => item.id !== id))
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
          window.location.reload();
        }
      })
      .catch((err) => {
        toast.error(t("extra.error"));
      });
  };

  //helper functions
  const changeStatusNotification = (id: number | null) => {
    setIsAllText(id);
  };

  const handleClickOpen = (e: number) => {
    setOpen(true);
    setIndex(e);
  };

  const TabWrapper = () => {
    if (tabId === 1) {
      return (
        <div className="notification-items">
          {notifications?.length ? (
            notifications.map((item, index) => {
              return (
                <div className="notification-item" key={index}>
                  <h3 className="notification-item-title">{item.title}</h3>
                  {item.body.length < 100 ? (
                    <p className="notification-item-desc">{item.body}</p>
                  ) : (
                    <p className="notification-item-desc">
                      {isAllText === item.id
                        ? item.body
                        : `${item.body.substring(0, 100)}...`}
                      {isAllText !== item.id ? (
                        <span
                          className="notification-span"
                          onClick={() => changeStatusNotification(item.id)}
                        >
                          {t("notification.show_more")}
                        </span>
                      ) : (
                        <span
                          className="notification-span show-less"
                          onClick={() => changeStatusNotification(null)}
                        >
                          {t("notification.show_less")}
                        </span>
                      )}
                    </p>
                  )}
                  <VisibilityOffIcon
                    onClick={() => changeReadStatus(item.id)}
                    className="remove-icon"
                  />
                </div>
              );
            })
          ) : (
            <p className="noticification-not-found">
              {t("notification.notification_not_found")}
            </p>
          )}
        </div>
      );
    } else {
      return (
        <div className="notice-items">
          {notice?.length ? (
            notice.map((item, index) => {
              return (
                <div className="notice-item" key={index}>
                  {item?.student_image ? (
                    <img className="notice-img" src={item.student_image} />
                  ) : (
                    <img className="notice-img" src={student_image} />
                  )}
                  <div className="notice-info">
                    <h3 className="notice-title">{item.student_name}</h3>
                    {item.comment.length < 100 ? (
                      <p className="notice-desc">{item.comment}</p>
                    ) : (
                      <p className="notice-desc">
                        {isAllText === item.id
                          ? item.comment
                          : `${item.comment.substring(0, 100)}...`}
                        {isAllText !== item.id ? (
                          <span
                            className="notification-span"
                            onClick={() => changeStatusNotification(item.id)}
                          >
                            {t("notification.show_more")}
                          </span>
                        ) : (
                          <span
                            className="notification-span show-less"
                            onClick={() => changeStatusNotification(null)}
                          >
                            {t("notification.show_less")}
                          </span>
                        )}
                      </p>
                    )}
                    <div className="notice-action-buttons">
                      <button
                        className="notice-button"
                        onClick={() => handleResponse(item.id)}
                      >
                        {t("notification.accept")}
                      </button>
                      <button
                        className="notice-button reject-btn"
                        onClick={() => handleClickOpen(index)}
                      >
                        {t("notification.reject")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="noticification-not-found">
              {t("notification.request_not_found")}
            </p>
          )}
          <NoticePopup
            open={open}
            setOpen={setOpen}
            index={Number(index)}
            tabId={tabModaId}
            setTabId={setTabModaId}
            type="media"
          />
        </div>
      );
    }
  };

  return (
    <div className="notification">
      <div className="notification-wrapper">
        {role === "teacher" ? (
          <div className="notification-btns">
            <button
              className={`notification-tab-btn ${tabId === 1 && "active"}`}
              onClick={() => setTabId(1)}
            >
              {t("notification.notification")}
              {notifications?.length ? <div className="notice"></div> : null}
            </button>
            <button
              className={`notification-tab-btn ${tabId === 2 && "active"}`}
              onClick={() => setTabId(2)}
            >
              {t("notification.request")}
              {notice?.length ? <div className="notice"></div> : null}
            </button>
          </div>
        ) : (
          <h2 className="notification-page-title">
            {t("notification.notification")}
          </h2>
        )}
        <TabWrapper />
      </div>
    </div>
  );
};

export default NotificationPage;
