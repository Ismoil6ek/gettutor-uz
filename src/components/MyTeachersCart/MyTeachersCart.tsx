import React, { useState, useEffect } from "react";
import { base_url } from "../../data";
import { useTranslation } from "react-i18next";

// link style folder
import "./myTeachersCart.scss";

// Local images
import StudentAvatar from "../../assets/images/student-avatar.jpg";
import EmptyAboutMeIcon from "../../assets/svg/empty_aboutMe_icon.svg";

// React Router DOM
import { Link } from "react-router-dom";
import { teachers } from "../../data/interfaces";

const MyTeachersCart = () => {
  const { t } = useTranslation();

  const [teacher, setTeacher] = useState<null | teachers[]>();

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
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="my-teachers-cart">
      {teacher && teacher.length ? (
        <div>
          <div className="my-teachers-cart-header">
            <h3 className="my-teachers-cart-title">
              {t("studentProfile.myTutors")}
            </h3>
            <Link to="/my-teachers">
              <button className="open-all-teachers-componenent-btn">
                {t("studentProfile.showAll")}
              </button>
            </Link>
          </div>
          <div className="my-teachers-avatars-wrapper">
            {teacher.map((item, index) => {
              return (
                <div key={index} className="my-teachers-avatar-item">
                  {item.image !== null ? (
                    <img
                      src={item.image}
                      alt="photoTeachers"
                      className="student-avatar-img"
                    />
                  ) : (
                    <img
                      src={StudentAvatar}
                      alt="photoTeachers"
                      className="student-avatar-img"
                    />
                  )}
                  {/* {item.is_online === 1 && <div className="status-live" />} */}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="no-teacher">
          <img src={EmptyAboutMeIcon} alt="" />
          <h2>{t("studentProfile.noAddedTeacher")}</h2>
        </div>
      )}
    </div>
  );
};

export default MyTeachersCart;
