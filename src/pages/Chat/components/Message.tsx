import React from "react";
import { chatUser, message } from "../../../data/interfaces";
import { useAppSelector } from "../../../hooks/useTypedSelector";

export default function Message({
  message,
  index,
  newMessage,
  chatUser,
}: {
  newMessage: boolean;
  message: message;
  index: number;
  chatUser: chatUser;
}) {
  const { user } = useAppSelector((state) => state);
  return user ? (
    <li
      onTransitionEnd={() => {
        console.log("transition");
      }}
      className={`${index === 0 && newMessage ? "last" : ""} ${
        message.from_user_id === user.id ? "mine-sms" : ""
      } chat-body-sms`}
    >
      {message.from_user_id === user.id ? (
        user ? (
          user?.avatar_image ? (
            <img
              src={user?.avatar_image}
              alt="chat"
              className="chat-body-image"
            />
          ) : (
            <p className="user-name-firstlatter">
              {user.firstname?.substring(0, 1)}
            </p>
          )
        ) : null
      ) : chatUser.image ? (
        <img src={chatUser.image} alt="chat" className="chat-body-image" />
      ) : (
        <p className="user-name-firstlatter">
          {chatUser.name?.substring(0, 1)}
        </p>
      )}
      <p className="chat-sms-desc">
        {message.message}
        <span>{new Date(message.created_at).toLocaleTimeString("en-US")}</span>
      </p>
    </li>
  ) : null;
}
