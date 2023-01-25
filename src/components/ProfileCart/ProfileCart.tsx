import React from "react";
import { useTranslation } from "react-i18next";
// Mui icon
import GppGoodIcon from "@mui/icons-material/GppGood";

// import css
import "./profileCart.scss";

// import Image
import Location from "../../assets/svg/location.svg";
import defaultImg from "../../assets/svg/defaultImg.png";

// React Router
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useTypedSelector";
import { language } from "../../data/interfaces";

const ProfileCart = () => {
  const { t, i18n } = useTranslation();
  const { role, user, regions } = useAppSelector((state) => state);
  const navigate = useNavigate();

  const logOut = () => {
    navigate("/");
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="profile-cart">
      <div className="profile-cart-avatar">
        <img
          src={user?.avatar_image !== null ? user?.avatar_image : defaultImg}
          alt="profile-img"
        />
      </div>
      <div className="user-datas">
        <p className="user-role">{t(`extra.${user?.role}`)}</p>
        <div className="user-name-badge">
          <h1 className="user-name">{`${user?.firstname ? user?.firstname : ""}  ${user?.lastname ? user?.lastname : ''} `}</h1>
          {/* <GppGoodIcon className="badge" /> */}
        </div>
        {/* <span className="user-status">{t("studentProfile.online")}</span> */}
      </div>
      {role === "teacher" ? (
        <div className="user-activity">
          <div
            className={
              i18n.language === "uz"
                ? "reverse study-material"
                : "study-material"
            }
          >
            <span className="count">
              {user?.videos_count ? user?.videos_count : 0}
            </span>
            <span className="material-title">{t("profile.textbooks")}</span>
          </div>
          <div
            className={
              i18n.language === "uz"
                ? "reverse total-students"
                : "total-students"
            }
          >
            <span className="count">
              {user?.followers ? user?.followers : 0}
            </span>
            <span className="total-students-title">{t("profile.student")}</span>
          </div>
          <div
            className={i18n.language === "uz" ? "reverse comments" : "comments"}
          >
            <span className="count">
              {user?.comment_count ? user?.comment_count : 0}
            </span>
            <span className="comments-title">{t("profile.reviews")}</span>
          </div>
        </div>
      ) : (
        <div className="user-activity">
          <div className="study-material">
            <img src={Location} alt="location-logo" />
            <span className="material-title">
              {regions && user && user.region_id && user.country_id
                ? regions[user.country_id]?.find(
                    (el) => el.id === user.region_id
                  )?.name[i18n.language as language]
                : "Tashkent"}
            </span>
          </div>
          <div className="total-students">
            <span className="count">
              {user?.followers ? user?.followers : 0}
            </span>
            <span className="total-students-title">{t("profile.tutor")}</span>
          </div>
        </div>
      )}
      <div className="enter-logout-btn-wrapper">
        <Link
          to={
            role === "teacher" ? "/teacher-profile-data" : "/pupil-profile-data"
          }
        >
          <button className="questionnaire-btn">{t("profile.myForm")}</button>
        </Link>
        <button onClick={logOut} className="logout-btn">
          {t("extra.logOut")}
        </button>
      </div>
    </div>
  );
};

export default ProfileCart;
