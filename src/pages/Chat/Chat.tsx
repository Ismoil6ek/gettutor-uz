import React, { useEffect, useState, useMemo } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import telegramLogo from "../../assets/svg/telegram.svg";
import file from "../../assets/svg/enter-file.svg";
import micro from "../../assets/svg/microphone.svg";
import { base_url } from "../../data";
import { changeShowPage, changeStateAction } from "../../redux/actions";
import InnerLoader from "../../components/InnerLoader/InnerLoader";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { chatUser, message } from "../../data/interfaces";
import Message from "./components/Message";
import "./chat.scss";

const Chat = () => {
  const { t } = useTranslation();
  const { user, showPage } = useAppSelector((state) => state);
  const [chatAllUsers, setChatAllUsers] = useState<chatUser[]>([]);
  const [smsValue, setSmsValue] = useState("");
  const [newMessage, setNewMessage] = useState(false);
  const [messages, setMessages] = useState<message[]>([]);
  const [chatUser, setChatUser] = useState<chatUser | null>(null);
  const [searchedValue, setSearchedValue] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!searchedValue.length) {
      fetch(`${base_url}/site/chats/index`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setChatAllUsers(result.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      fetch(`${base_url}/site/chats/search?key=${searchedValue}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setChatAllUsers(result.data);
        });
    }
  }, [searchedValue]);

  const channel = useMemo(() => {
    if (chatUser) {
      return window.Echo.private(`chat.${chatUser.id}`);
    }
  }, [chatUser]);

  useEffect(() => {
    if (channel) {
      channel
        .subscribed(() => {
          console.log("subscribed!");
        })
        .listen(".private-message", (event: message) => {
          setTimeout(() => setNewMessage(false), 1000);

          setMessages((init) => {
            return [...init, event];
          });
        });
    }
  }, [channel]);

  const handleSelectUser = (item: chatUser) => {
    setChatUser(item);
    fetch(`${base_url}/site/chats/${item.from_user_id}/messages`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch(changeStateAction(Math.random()));
        setMessages(result.data);
        dispatch(changeShowPage(true));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickSendMessage = () => {
    if (!chatUser) return;

    fetch(`${base_url}/site/chats/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        message: smsValue,
        to_user_id: chatUser.from_user_id,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setNewMessage(true);
        dispatch(changeStateAction(Math.random()));
        setSmsValue("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBack = () => {
    setChatUser(null);
    dispatch(changeShowPage(false));
  };

  return user ? (
    <div className="chat-main-container">
      <div
        className={`chat-user-list ${
          !chatUser ? "active-grid" : "enactive-grid"
        }`}
      >
        <div className="chat-header">
          <h2 className="chat-title">{t("chat.Message")}</h2>
          <div className="chat-search">
            <input
              type="text"
              className="user-search-input"
              placeholder="Search users"
              onChange={(e) => setSearchedValue(e.target.value)}
              value={searchedValue}
            />
            <p
              className="input-search-cancel"
              onClick={() => setSearchedValue("")}
            >
              {t("chat.Cancel")}
            </p>
          </div>
        </div>
        <div className="chat-users">
          {chatAllUsers?.length
            ? chatAllUsers.map((item, index) => (
                <div
                  key={index}
                  className={`chat-user ${
                    chatUser &&
                    chatUser.from_user_id === item.from_user_id &&
                    `btn-active`
                  }`}
                  onClick={() => handleSelectUser(item)}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt="user"
                      className="chat-user-img"
                    />
                  ) : (
                    <p className="user-name-firstlatter">
                      {item.name?.substring(0, 1)}
                    </p>
                  )}
                  <div className={`chat-user-names`}>
                    <b className="user-name">{item.name}</b>
                    <p className="user-desc">{t("chat.ifYouWontToTolk")}</p>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>

      {chatUser ? (
        <div
          className={`chat-sms-section ${
            chatUser ? "active-grid" : "enactive-grid"
          }`}
        >
          <div className="chat-header-right">
            <ArrowBackIosIcon
              className="chat-back-icon"
              onClick={() => handleBack()}
            />
            <div className="chat-sms-header">
              <div>
                <h3 className="chat-sms-user-name">
                  {chatUser ? chatUser.name : ""}
                </h3>
              </div>
              {window.innerWidth < 1024 &&
                (chatUser.image ? (
                  <img
                    src={chatUser.image}
                    alt="chat"
                    className="chat-header-image"
                  />
                ) : (
                  <p className="user-name-firstlatter">
                    {chatUser.name?.substring(0, 1)}
                  </p>
                ))}
            </div>
          </div>
          <ul className={`chat-body ${newMessage ? "new-message" : ""}`}>
            {showPage ? (
              messages.length > 0 ? (
                messages
                  .slice(0)
                  .reverse()
                  .map((message, index, arr) => {
                    return (
                      <Message
                        newMessage={newMessage}
                        message={message}
                        chatUser={chatUser}
                        index={index}
                      />
                    );
                  })
              ) : null
            ) : (
              <InnerLoader />
            )}
          </ul>
          <div className="chat-enter-message">
            <img src={file} alt="file" className="chat-message-icon" />
            <input
              value={smsValue}
              onChange={(e) => setSmsValue(e.target.value)}
              type="text"
              className="chat-message-input"
              placeholder={t("chat.writeYourmessage") as string}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleClickSendMessage();
                }
              }}
            />
            {smsValue.length ? (
              <img
                onClick={handleClickSendMessage}
                src={telegramLogo}
                alt="post-sms-logo"
                className="chat-message-icon"
              />
            ) : (
              <img src={micro} alt="file" className="chat-message-icon" />
            )}
          </div>
        </div>
      ) : window.innerWidth > 1439 ? (
        <div className="chat-empty-section">
          <p className="chat-empty-message">{t("chat.chooseWhoWant")}</p>
        </div>
      ) : (
        ""
      )}
    </div>
  ) : null;
};

export default Chat;
