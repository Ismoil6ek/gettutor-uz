import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { useTranslation } from "react-i18next";
import defaultImg from "../../assets/svg/defaultImg.png";

import "./pupilProfile.scss";
import { useAppSelector } from "../../hooks/useTypedSelector";
import { language } from "../../data/interfaces";

const PupilProfile = () => {
  const { t, i18n } = useTranslation();
  const { countries, regions, user } = useAppSelector((state) => state);
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      const birthDate = user.birthday ? new Date(user.birthday * 1000) : 0;
      const currenDate = new Date();

      setAge(
        birthDate ? currenDate.getFullYear() - birthDate.getFullYear() : null
      );
    }
  }, [user]);

  const languages = () => {
    let temp: string[] = [];
    user?.languages?.forEach((item) => {
      temp.push(item);
    });
    return temp.join(", ");
  };

  return (
    <div className="pupil-profile-container">
      <div className="pupil-profile">
        <h1 className="pupil-profile-title">{t("studentForm.form")}</h1>
        <div className="pupil-profile-image-content-wrapper">
          <div className="pupil-profile-avatar-wrapper">
            <img
              className="pupil-profile-avatar-image"
              src={user && user.avatar_image ? user.avatar_image : defaultImg}
              alt="user_image"
            />
          </div>
          <div className="pupil-profile-image-status">
            <h3 className="pupil-profile-image-status-title">
              {t("studentForm.profilePhoto")}
            </h3>
            <p className="pupil-profile-image-status-content">
              {t("studentForm.visibleImage")}
            </p>
            <Link to="/pupil-profile-data">
              <button className="change-pupil-data-btn">
                {t("studentForm.editForm")}
              </button>
            </Link>
          </div>
        </div>
        <div className="autobiography">
          <h2 className="autobiography-title">
            {t("studentForm.personalInfo")}
          </h2>
          <div className="fname">
            <h3 className="fname-title">{t("studentForm.yourName")}</h3>
            <span className="fname-value">{user?.firstname}</span>
          </div>
          <div className="lname">
            <h3 className="lname-title">{t("studentForm.yourSurname")}</h3>
            <span className="lname-value">{user?.lastname}</span>
          </div>
          <div className="age">
            <h3 className="age-title">{t("studentForm.age")}</h3>
            <span className="age-value">
              {age ? (
                <span>
                  {age} {t("searchTutor.year")}
                </span>
              ) : (
                ""
              )}
            </span>
          </div>
          <div className="gender">
            <h3 className="gender-title">{t("studentForm.gender")}</h3>
            <span className="gender-value">
              {user && user.gender === "m"
                ? t("searchTutor.male")
                : t("searchTutor.female")}
            </span>
          </div>
          <div className="country">
            <h3 className="country-title">{t("studentForm.country")}</h3>
            <span className="country-value">
              {user?.country_id &&
                countries &&
                countries.find((el) => el.id === user.country_id)?.name[
                  i18n.language as language
                ]}
            </span>
          </div>
          <div className="region">
            <h3 className="region-title">{t("studentForm.region")}</h3>
            <span className="region-value">
              {user?.region_id &&
                regions &&
                user.country_id &&
                regions[user.country_id].find((el) => el.id === user.region_id)
                  ?.name[i18n.language as language]}
            </span>
          </div>
          <div className="languages">
            <h3 className="languages-title">{t("studentForm.languages")}</h3>
            <span className="languages-value">
              {user && user.languages?.length > 0 && languages()}
            </span>
          </div>
        </div>
        <div className="about-me">
          <h3 className="about-me-title">{t("studentForm.aboutMe")}</h3>
          <p className="about-me-content">{user?.about}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PupilProfile;
