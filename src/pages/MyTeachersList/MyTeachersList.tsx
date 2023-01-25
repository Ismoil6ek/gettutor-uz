import React, { useState, useEffect } from "react";
import { base_url } from "../../data";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// connect style
import "./myTeachersList.scss";

// svg icons
import Slash from "../../assets/svg/slash.svg";
import deleteUser from "../../assets/svg/deleteUser.svg";
import sendMessage from "../../assets/svg/sendMessage.svg";
import cancel from "../../assets/svg/cancel.svg";
import { ReactComponent as Phone } from "../../assets/svg/phone-call-svgrepo-com.svg";
// mui
import Dialog from "@mui/material/Dialog";

// Local images
import EmptyAboutMeIcon from "../../assets/svg/empty_aboutMe_icon.svg";
import teacherAvatar from "../../assets/images/student-avatar.jpg";
import { Link, useNavigate } from "react-router-dom";
import {
  changeOurMessage,
  changeSelectedUser,
  changeSelectedUserId,
  changeShowPage,
  changeStateAction,
} from "../../redux/actions";
import { myTeachersList } from "../../data/interfaces";
import Loader from "../../components/Loader/Loader";

const MyTeachersList = () => {
  const { t } = useTranslation();
  const [teacher, setTeacher] = useState<myTeachersList[]>();
  const [teacherId, setTeacherId] = useState<number>();
  const [open, setOpen] = React.useState(false);
  const [reload, setReload] = useState(true);
  const [loader, setLoader] = useState(true);

  const navigate = useNavigate();

  //redux
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`${base_url}/site/users/teachers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setTeacher(result.data);
        setLoader(false);
      })

      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line
  }, [reload]);

  function handleSelectTeacher(item: myTeachersList) {
    fetch(`${base_url}/site/chats/${item.teacher_id}/messages`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch(changeStateAction(Math.random()));
        dispatch(changeOurMessage(result?.data));
        dispatch(changeShowPage(true));
        navigate("/chat");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleDeleteTeacher = () => {
    fetch(`${base_url}/site/courses/${teacherId}/unregister`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          toast.success(t("extra.done"));
          handleClose();
          if (reload === true) {
            setReload(false);
          } else {
            setReload(true);
          }
        } else if (result.success === false) {
          toast.error("Error!");
        }
      })
      .catch((err) => {
        toast.error(t("extra.error"));
      });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (e: number) => {
    setTeacherId(e);
    setOpen(true);
  };

  return loader ? (
    <Loader height="50vh" width="100%" />
  ) : (
    <div className="my-teachers-list">
      <div className="short-links">
        <Link to="/" className="my-teachers-list-short-link-to-main">
          {t("profile.main")}
        </Link>
        <img src={Slash} alt="slash" />
        <Link to="/profile" className="my-teachers-list-short-link-to-profile">
          {t("profile.profile")}
        </Link>
      </div>
      <h1 className="my-teachers-list-title">{t("searchTutor.tutors")}</h1>
      {teacher?.length ? (
        <div className="my-teachers-avatars-wrapper">
          {teacher?.map((el, index) => {
            return (
              <div key={index} className="my-teachers-list-avatar-item">
                <Link
                  to={`/tutors/view/${el?.teacher_id}`}
                  className="avatar-image-wrapper"
                >
                  {el.image !== null ? (
                    <div className="teacher-img-wrapper">
                      <img
                        src={el.image}
                        alt="avatar"
                        className="teacher-avatar-img"
                      />
                      {/* <div className="status-live"></div> */}
                    </div>
                  ) : (
                    <div className="teacher-img-wrapper">
                      <img
                        src={teacherAvatar}
                        alt="avatar"
                        className="teacher-avatar-img"
                      />
                      {/* <div className="status-live"></div> */}
                    </div>
                  )}
                </Link>
                <div className="my-teachers-list-datas">
                  <Link
                    to={`/tutors/view/${el?.teacher_id}`}
                    className="my-teachers-list-item-name"
                  >
                    {el.teacher_name}
                  </Link>
                  {/* <h3 className="my-teachers-list-item-subject">{el.subject}</h3> */}
                  <div className="my-students-list-datas">
                    <div className="my-students-list-item-name-btn">
                      <div
                        onClick={() => handleSelectTeacher(el)}
                        className="my-students-list-item-name-btn-write"
                      >
                        <img src={sendMessage} alt="sender_message" />
                        <span className="send-message-title">
                          {t("profile.write")}
                        </span>
                      </div>
                      <img
                        onClick={() => handleOpen(el.teacher_id)}
                        src={deleteUser}
                        alt="delete teacher icon"
                      />
                    </div>
                    <div className="my-students-list-item-name-btn">
                      {el?.phone && (
                        <a
                          href={`tel:${el?.phone}`}
                          className="my-students-list-item-name-btn-write"
                        >
                          <Phone fill="#3bb3bd" className="phone-img" />
                          <span className="send-message-title">
                            {el?.phone}
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-teacher">
          <img src={EmptyAboutMeIcon} alt="" />
          <h3>{t("studentProfile.noAddedTeacher")}</h3>
        </div>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="user-delete">
          <div className="title">
            <img
              onClick={() => handleClose()}
              src={cancel}
              className="handle-close"
              alt="closer"
            />
          </div>
          <div className="body">
            <h2>{t("extra.deleteFromContact")}</h2>
            <p>{t("extra.contactSure2")}</p>
          </div>
          <div className="btns">
            <button
              className="btn-delete"
              onClick={() => handleDeleteTeacher()}
            >
              {t("extra.Delete")}
            </button>
            <button onClick={() => handleClose()} className="btn-cancel">
              {t("extra.Cancel")}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default MyTeachersList;
