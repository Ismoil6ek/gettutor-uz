import React, { useEffect, useState, useMemo } from "react";
import Echo from "laravel-echo";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Popover } from "@mui/material";
import popupImg from "../../assets/svg/defaultImg.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import TextsmsIcon from "@mui/icons-material/Textsms";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { base_url } from "../../data";
import { changeNotice, changeNotifications } from "../../redux/actions";
import NoticePopup from "../StudentNoticePopup/NoticePopup";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";

const NotificationPopupTeacher = () => {
  window.Pusher = require("pusher-js");
  const [popover2, setPopover2] = useState(false);
  const [popover2Anchor, setPopover2Anchor] = useState<Element | null>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const [tabId, setTabId] = useState(0);
  const [isAllText, setIsAllText] = useState<number | null>(null);

  const [state, setState] = useState<number>(0);
  const { notifications, notice, user } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      window.Echo = new Echo({
        broadcaster: "pusher",
        authEndpoint: "http://api.gettutor.uz/api/broadcasting/auth",
        key: "b941ed184fa80082bae2",
        auth: {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
        cluster: "ap2",
        forseTLS: false,
        wsHost: "api.gettutor.uz",
        wsPort: 6001,
        encrypted: false,
        disableStats: true,
        enabledTransports: ["ws"],
      });

      const channel = window.Echo.channel(`notification`);
      channel
        .subscribed(() => {})
        .listen(".message", (event: any) => {
          setState(Math.random());
        });
    }
  }, [user]);

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
        console.log(err);
      });

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
      .catch((err) => {
        console.log({ err });
      });
  }, [state]);

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

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    switch (id) {
      case 2: {
        setPopover2(true);
        setPopover2Anchor(event.currentTarget);
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleClickOpen = (e: number) => {
    setIndex(e);
    setOpen(true);
  };

  const handleClose = () => {
    setPopover2(false);
  };

  const changeStatusNotification = (id: number | null) => {
    setIsAllText(id);
  };
  return (
    <div className="nav-notification-items">
      <button
        aria-describedby={"2"}
        onClick={(event) => {
          handleClick(event, 2);
        }}
      >
        {notice?.length !== 0 || notifications.length !== 0 ? (
          <NotificationsActiveIcon
            className="notification-icon"
            sx={{ fill: "blue" }}
          />
        ) : (
          <NotificationsIcon className="notification-icon" />
        )}
      </button>
      <Popover
        id="simple-popover"
        open={popover2}
        anchorEl={popover2Anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="notifications-popover">
          <p className="notifications-title">{t("notification.request")}</p>

          {notice?.length ? (
            <div className="notifications-popover-cards">
              {notice?.map((el, index) => {
                return (
                  <div key={index} className="notifications-popover-item">
                    <h2 className="new">{el.created_at}</h2>
                    <div className="content">
                      {el.student_image ? (
                        <img
                          className="content-img"
                          src={el.student_image}
                          alt="phot"
                        />
                      ) : (
                        <img
                          className="content-img"
                          src={popupImg}
                          alt="phot"
                        />
                      )}

                      <div className="content-info">
                        <div className="content-name">{el.student_name}</div>
                        <div
                          className="content-view"
                          onClick={() => handleClickOpen(index)}
                        >
                          {t("header.view")}
                        </div>
                      </div>
                    </div>
                    <hr />
                    <h2 className="notifications-title">
                      {t("header.notice")}
                    </h2>
                    {el.comment.length < 100 ? (
                      <p className="notifications-text">{el.comment}</p>
                    ) : (
                      <p className="notifications-text">
                        {isAllText === el.id
                          ? el.comment
                          : `${el.comment.substring(0, 100)}...`}
                        {isAllText !== el.id ? (
                          <span
                            className="notification-span"
                            onClick={() => changeStatusNotification(el.id)}
                          >
                            {t("show_more")}
                          </span>
                        ) : (
                          <span
                            className="notification-span show-less"
                            onClick={() => changeStatusNotification(null)}
                          >
                            {t("show_less")}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <p className="notification-title">
                {t("notification.request_not_found")}
              </p>
              <hr />
            </>
          )}

          <p className="notifications-title">
            {t("notification.notification")}
          </p>
          {notifications.length ? (
            <div className="notification-all">
              {notifications.map((item, index) => {
                return (
                  <div key={index} className="notifications-card-body">
                    <h3 className="notification-card-title">{item.title}</h3>
                    {item.body.length < 30 ? (
                      <p className="notifications-text">{item.body}</p>
                    ) : (
                      <p className="notifications-text">
                        {isAllText === item.id
                          ? item.body
                          : `${item.body.substring(0, 30)}...`}
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
              })}
            </div>
          ) : (
            <p className="notification-title">
              {t("notification.notification_not_found")}
            </p>
          )}
        </div>
      </Popover>

      {index !== null ? (
        <NoticePopup
          open={open}
          setOpen={setOpen}
          index={index}
          tabId={tabId}
          setTabId={setTabId}
        />
      ) : null}

      <Link to="/saved" className="saved-icon">
        <FavoriteIcon />
      </Link>
      <Link to="/chat" className="chat-icon">
        <TextsmsIcon />
      </Link>
    </div>
  );
};

export default NotificationPopupTeacher;
