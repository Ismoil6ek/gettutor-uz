import React, { useState, useEffect } from "react";
import { base_url } from "../../data";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

// connect style
import "./myStudentsList.scss";

// svg icons
import Slash from "../../assets/svg/slash.svg";
import deleteUser from "../../assets/svg/deleteUser.svg";
import sendMessage from "../../assets/svg/sendMessage.svg";
import cancel from "../../assets/svg/cancel.svg";
import { ReactComponent as Phone } from "../../assets/svg/phone-call-svgrepo-com.svg";
import EmptyAboutMeIcon from "../../assets/svg/empty_aboutMe_icon.svg";

// mui
import Dialog from "@mui/material/Dialog";

// Local images
import studentAvatar from "../../assets/svg/defaultImg.png";
import {
  changeOurMessage,
  changeSelectedUser,
  changeSelectedUserId,
  changeShowPage,
  changeStateAction,
} from "../../redux/actions";
import { myStudentsList } from "../../data/interfaces";
import Loader from "../../components/Loader/Loader";

const MyStudentsList = () => {
  const { t } = useTranslation();
  const [student, setStudent] = useState<myStudentsList[]>();
  const [studentId, setStudentId] = useState<number | null>(null);
  const [reload, setReload] = useState(true);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${base_url}/site/users/students`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setStudent(result.data);
        setLoader(false);
      })

      .catch((err) => {
        console.log(err);
      });
  }, [reload]);

  function handleSelectTeacher(item: myStudentsList) {
    fetch(`${base_url}/site/chats/${item.user_id}/messages`, {
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

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleDeleteStudent = () => {
    fetch(`${base_url}/site/courses/${studentId}/unregister`, {
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

  return loader ? (
    <Loader height="50vh" width="100%" />
  ) : (
    <div className="my-students-list">
      <div className="short-links">
        <Link to="/" className="my-students-list-short-link-to-main">
          {t("profile.main")}
        </Link>
        <img src={Slash} alt="slash" />
        <Link to="/profile" className="my-students-list-short-link-to-profile">
          {t("profile.profile")}
        </Link>
      </div>
      <h1 className="my-students-list-title">{t("profile.students")}</h1>
      {student ? (
        <div className="my-students-avatars-wrapper">
          {student &&
            student.map((el, index) => (
              <div className="my-students-list-avatar-item">
                <Link to="" className="avatar-image-wrapper">
                  {el.image ? (
                    <div className="student-img-wrapper">
                      <img
                        src={el.image}
                        alt="student_avatar"
                        className="student-avatar-img"
                      />
                      {/* <div className="status-live"></div> */}
                    </div>
                  ) : (
                    <div className="student-img-wrapper">
                      <img
                        src={studentAvatar}
                        alt="student_avatar"
                        className="student-avatar-img"
                      />
                      {/* <div className="status-live"></div> */}
                    </div>
                  )}
                </Link>
                <div className="my-students-list-datas">
                  <h3 className="my-students-list-item-name">{el.name}</h3>
                  <div className="my-students-list-item-name-btn">
                    <div
                      onClick={() => handleSelectTeacher(el)}
                      className="my-students-list-item-name-btn-write"
                    >
                      <img
                        className="message-icon"
                        src={sendMessage}
                        alt="message-icon"
                      />
                      <span className="send-message-title">
                        {t("profile.write")}
                      </span>
                    </div>
                    <img
                      onClick={() => {
                        setStudentId(el.user_id);
                        handleOpen();
                      }}
                      src={deleteUser}
                      alt="delete"
                      className="delete-icon"
                    />
                  </div>
                  <div className="my-students-list-item-name-btn">
                    <a
                      href={`tel:${el?.phone}`}
                      className="my-students-list-item-name-btn-write"
                    >
                      <Phone fill="#3bb3bd" className="phone-img" />
                      <span className="send-message-title">{el?.phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="empty-materials">
          <img src={EmptyAboutMeIcon} alt="empty_material_icon" />
          <h3>{t("profile.noAddedStudents")}</h3>
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
              alt=""
              className="handle-close"
            />
          </div>
          <div className="body">
            <h2>{t("extra.deleteFromContact")}</h2>
            <p>{t("extra.contactSure")}</p>
          </div>
          <div className="btns">
            <button
              className="btn-delete"
              onClick={() => handleDeleteStudent()}
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

export default MyStudentsList;
