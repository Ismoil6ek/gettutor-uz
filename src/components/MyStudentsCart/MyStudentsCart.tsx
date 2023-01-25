import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { base_url } from "../../data";
import { useSelector } from "react-redux";

// link style folder
import "./myStudentsCart.scss";

// Local images
import StudentAvatar from "../../assets/svg/defaultImg.png";
import EmptyAboutMeIcon from "../../assets/svg/empty_aboutMe_icon.svg";

// React Router DOM
import { Link } from "react-router-dom";
import { students } from "../../data/interfaces";

const MyStudentsCart = () => {
  const { t } = useTranslation();
  const [student, setStudent] = useState<null | students[]>(null);

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
      })

      .catch((err) => {
        //console.log(err);
      });
  }, []);

  return (
    <div className="my-students-cart">
      {student && student.length ? (
        <div>
          <div className="my-students-cart-header">
            <h3 className="my-students-cart-title">
              {t("profile.myStudents")}
            </h3>
            <Link to="/my-students">
              <button className="open-all-students-componenent-btn">
                {t("profile.showAll")}
              </button>
            </Link>
          </div>
          <div className="my-students-avatars-wrapper">
            {student?.map((el, index) => {
              return (
                <div key={index} className="my-students-avatar-item">
                  <img
                    src={el.image ?? StudentAvatar}
                    alt="student-avatar"
                    className="student-avatar-img"
                  />
                  {/* {el.is_online === 1 ? <div className="status-live" /> : null} */}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="no-teacher">
          <img src={EmptyAboutMeIcon} alt="" />
          <h2>{t("profile.noAddedStudents")}</h2>
        </div>
      )}
    </div>
  );
};

export default MyStudentsCart;
