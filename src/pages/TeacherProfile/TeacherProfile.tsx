import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import defaultImg from "../../assets/svg/defaultImg.png";
import { experiences } from "../../data";
import { useTranslation } from "react-i18next";

// sass
import "./teacherProfile.scss";
// SVG
import Badge from "../../assets/svg/badge.svg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Loader from "../../components/Loader/Loader";
import { useAppSelector } from "../../hooks/useTypedSelector";
import { daysList, language } from "../../data/interfaces";

const TeacherProfile = () => {
  const { t, i18n } = useTranslation();
  const {
    user,
    certificates,
    languages,
    subjects,
    countries,
    regions,
    studyTypes,
    degree,
    education,
  } = useAppSelector((state) => state);
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      const birthDate = user?.birthday ? new Date(user.birthday * 1000) : 0;
      const currenDate = new Date();

      setAge(
        birthDate ? currenDate.getFullYear() - birthDate.getFullYear() : null
      );
    }
  }, [user]);

  const days: daysList = {
    0: t("viewTutor.Monday"),
    1: t("viewTutor.Thuesday"),
    2: t("viewTutor.Wednesday"),
    3: t("viewTutor.Thursday"),
    4: t("viewTutor.Friday"),
    5: t("viewTutor.Saturday"),
    6: t("viewTutor.Sunday"),
  };

  const languagesToString = (languageArray: number[]) => {
    let temp: string[] = [];

    if (languages.length > 0) {
      languageArray.forEach((number) => {
        const foundLang = languages.find((item) => item.id === number)?.name[
          i18n.language as language
        ];

        if (foundLang !== undefined) {
          temp.push(foundLang);
        }
      });
    }

    return temp.join(", ");
  };

  const studyTypesToString = (studyTypeArray: number[]) => {
    let temp: string[] = [];

    if (studyTypes.length > 0) {
      studyTypeArray?.forEach((item) => {
        const foundType = studyTypes.find((element) => element.id === item)
          ?.name[i18n.language as language];
        if (foundType !== undefined) {
          temp.push(foundType);
        }
      });
    }

    return temp.join(", ");
  };

  return user ? (
    <div
      className="teacher-profile-container"
      // data-aos="fade-up"
      // data-aos-duration="100%"
    >
      <div className="teacher-profile">
        <h1 className="teacher-profile-title">{t("form.form")}</h1>
        <div className="teacher-profile-image-content-wrapper">
          <div className="teacher-profile-avatar-wrapper">
            <img
              className="teacher-profile-avatar-image"
              src={user?.avatar_image ? user.avatar_image : defaultImg}
              alt="user_image"
            />
          </div>
          <div className="teacher-profile-image-status">
            <h3 className="teacher-profile-image-status-title">
              {t("form.profilePhoto")}
            </h3>
            <p className="teacher-profile-image-status-content">
              {t("form.visibleImage")}
            </p>
            <Link to="/teacher-profile-data">
              <button className="change-teacher-data-btn">
                {t("form.editForm")}
              </button>
            </Link>
          </div>
        </div>
        <div className="autobiography">
          <h2 className="autobiography-title">{t("form.personalInfo")}</h2>
          <div className="fname">
            <h3 className="fname-title">{t("form.yourName")}</h3>
            <span className="fname-value">{user && user.firstname}</span>
          </div>
          <div className="lname">
            <h3 className="lname-title">{t("form.yourSurname")}</h3>
            <span className="lname-value">{user && user.lastname}</span>
          </div>
          <div className="age">
            <h3 className="age-title">{t("form.age")}</h3>
            <span className="age-value">
              {age ? (
                <span>
                  {age} {t("viewTutor.year2")}
                </span>
              ) : (
                ""
              )}
            </span>
          </div>
          <div className="gender">
            <h3 className="gender-title">{t("form.gender")}</h3>
            <span className="gender-value">
              {user && user.gender === "m"
                ? t("searchTutor.male")
                : t("searchTutor.female")}
            </span>
          </div>
          <div className="country">
            <h3 className="country-title">{t("form.country")}</h3>
            <span className="country-value">
              {user?.country_id &&
                countries &&
                countries.find((el) => el.id === user.country_id)?.name[
                  i18n.language as language
                ]}
            </span>
          </div>
          <div className="region">
            <h3 className="region-title">{t("form.region")}</h3>
            <span className="region-value">
              {regions && user.country_id
                ? regions[user.country_id].find(
                    (el) => el.id === user.region_id
                  )?.name[i18n.language as language]
                : null}
            </span>
          </div>
        </div>
        <div className="education">
          <h2 className="education-title">{t("form.education")}</h2>
          <div className="university">
            <h3 className="university-title">{t("form.education")}</h3>
            <span className="university-value">
              {education && user.education_id
                ? education.find((el) => el.id === user.education_id)?.name[
                    i18n.language as language
                  ]
                : null}
            </span>
          </div>
          <div className="degree">
            <h3 className="degree-title">{t("form.category")}</h3>
            <span className="degree-value">
              {degree && user.degree_id
                ? degree.find((el) => el.id === user.degree_id)?.name[
                    i18n.language as language
                  ]
                : null}
            </span>
          </div>
          <div className="languages">
            <h3 className="languages-title">{t("form.languages")}</h3>
            <span className="languages-value">
              {user?.language_ids?.length > 0 &&
                languagesToString(user.language_ids)}
            </span>
          </div>
          <div className="experience">
            <h3 className="experience-title">{t("form.workExperience")}</h3>
            <span className="experience-value">
              {user?.experience === 0 ? (
                t("extra.inexperienced")
              ) : (
                <span>
                  {experiences &&
                    user &&
                    experiences
                      .filter((el) => user?.experience === el.value)
                      .map((i) => {
                        return i.name + " " + t("searchTutor.year");
                      })}
                </span>
              )}
            </span>
          </div>
          <div className="subject">
            <h3 className="subject-title">{t("form.subject")}</h3>
            <span className="subject-value">
              {user &&
                subjects &&
                subjects.allData.find((el) => el.id === user.subject_id)?.name[
                  i18n.language as language
                ]}
            </span>
          </div>
          <div className="type-study">
            <h3 className="type-study-title">{t("form.place")}</h3>
            <span className="type-study-value">
              {user &&
                studyTypes.length > 0 &&
                studyTypesToString(user?.study_type_id)}
            </span>
          </div>
          <div className="cost">
            <h3 className="cost-title">{t("form.price")}</h3>
            <div className="cost-wrapper">
              <span className="cost-value">
                {user && user.hourly_rate && user.hourly_rate.toLocaleString()}
              </span>
              <span className="cost-value">
                {user && user.hourly_rate_type === 0
                  ? t("searchTutor.pricePerHour")
                  : t("searchTutor.pricePerHour2")}
              </span>
            </div>
          </div>
          <div className="trial">
            <h3 className="trial-title">{t("form.trialLesson")}</h3>
            <span className="trial-value">
              {user && user.test_lesson ? t("extra.has") : t("extra.hasn't")}
            </span>
          </div>
        </div>
        <div className="schedule">
          {user?.schedule && (
            <h3 className="schedule-title">{t("form.schedule")}</h3>
          )}
          <div className="schedule-days">
            {user?.schedule &&
              user.schedule
                .filter((el) => el.is_valid)
                .map((item, index) => {
                  return (
                    <div key={index} className="schedule-item">
                      <div className="schedule-item-header">
                        <p className="schedule-item-title">{days[index]}</p>
                        <img src={Badge} alt="badge" />
                      </div>
                      <div className="schedule-time">
                        {item.firstTime.beginHour && (
                          <span>{`${item.firstTime.beginHour}:${item.firstTime.beginMinute} - ${item.firstTime.finishHour}:${item.firstTime.finishMinute}`}</span>
                        )}
                        {item.secondTime.beginHour && (
                          <span>{`${item.secondTime.beginHour}:${item.secondTime.beginMinute} - ${item.secondTime.finishHour}:${item.secondTime.finishMinute}`}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
        {user && user.certificates.length > 0 && certificates.length > 0 ? (
          <div className="certificates">
            <h3 className="certificates-title">{t("form.confirmDocument")}</h3>
            <div className="certificates">
              {user.certificates.map((item, index) => {
                return (
                  <div key={index} className="certificate-item">
                    <img
                      src={item.link}
                      alt="certificate"
                      className="certificate-img"
                    />
                    <span className="certificate-name">
                      {item
                        ? item.grade_id === null
                          ? item.name
                          : `${certificates[item.type_id! - 1].name} ${
                              certificates[item.type_id! - 1].values[
                                item.grade_id
                              ]
                            }`
                        : null}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  ) : (
    <Loader width="100%" height="100vh" />
  );
};

export default TeacherProfile;
