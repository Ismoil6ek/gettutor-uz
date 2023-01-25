import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base_url, experiences } from "../../data";
import { useTranslation } from "react-i18next";

// Style
import "./saved.scss";

// Image
import mainImg4 from "../../assets/svg/defaultImg.png";
import { ReactComponent as Like } from "../../assets/svg/like.svg";
import img2 from "../../assets/svg/search2.svg";
import noSaved from "../../assets/svg/noSaved.svg";
import Star from "@mui/icons-material/Star";

// components
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/useTypedSelector";
import { language, savedTeachers } from "../../data/interfaces";

const Saved = () => {
  const { t, i18n } = useTranslation();
  const { languages, subjects } = useAppSelector((state) => state);
  const [teachers, setTeachers] = useState<savedTeachers[] | null>(null);
  const [userId, setUserId] = useState(false);

  useEffect(() => {
    fetch(`${base_url}/site/courses/saved`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          setTeachers(result.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line
  }, [userId]);

  const handleDelete = (id: number) => {
    setUserId(!userId);

    fetch(`${base_url}/site/courses/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        course_id: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
        }
      })
      .catch((err) => {
        toast.error(t("extra.error"));
      });
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

  return (
    <div className="saved-container">
      {teachers?.length !== 0 ? (
        teachers ? (
          <div className="saved">
            <h2 className="saved-title">{t("saved.saved")}</h2>
            <div className="saved-teachers">
              {teachers &&
                teachers.map((el, index) => {
                  return (
                    <Link
                      key={index}
                      data-aos="fade-up"
                      data-aos-duration="1000"
                      data-aos-delay={(index + 1) * 100}
                      to={`/tutors/view/${el?.teacher_id}`}
                      className="tutor-slider-item"
                    >
                      <div className="tutor-slider-item-title">
                        {el.file ? (
                          <img
                            src={el.file}
                            alt=""
                            className="tutor-slider-item-title-img"
                          />
                        ) : (
                          <img
                            src={mainImg4}
                            alt=""
                            className="tutor-slider-item-title-img"
                          />
                        )}
                        <div className="tutor-slider-item-title-info">
                          <h2 className="tutor-slider-item-title-info-h2">
                            {el.teacher_name}
                            {/* {el.verified_teacher === true ? (
                              <img src={img2} alt="verify" />
                            ) : null} */}
                          </h2>
                          <p className="tutor-slider-item-title-info-p">
                            {t("saved.certifiedTutor")}
                          </p>
                          <h3 className="tutor-slider-item-title-info-h3">
                            {t("saved.rating")}
                            <Star
                              sx={{
                                fill: "#ffe942",
                              }}
                            />
                            {Math.floor(el?.rating * 10) / 10}
                          </h3>
                        </div>
                      </div>
                      <div className="tutor-slider-item-body">
                        <div className="tutor-slider-item-body-div">
                          <div className="tutor-slider-item-body-th">
                            {t("saved.subject")}:
                          </div>
                          <div className="tutor-slider-item-body-tb">
                            {subjects && subjects.isFetched && el.subject_id
                              ? subjects.allData.find(
                                  (item) => item.id === el.subject_id
                                )?.name[i18n.language as language]
                              : null}
                          </div>
                        </div>
                        <div className="tutor-slider-item-body-div">
                          <div className="tutor-slider-item-body-th">
                            {t("saved.experience")}:
                          </div>
                          <div className="tutor-slider-item-body-tb">
                            {experiences
                              .filter((i) => el.experience === i.value)
                              .map((i) => {
                                return i.name + " " + t("searchTutor.year");
                              })}
                          </div>
                        </div>
                        <div className="tutor-slider-item-body-div">
                          <div className="tutor-slider-item-body-th">
                            {t("saved.languages")}:
                          </div>
                          <div className="tutor-slider-item-body-tb">
                            {el?.language_ids.length > 0
                              ? languagesToString(el.language_ids)
                              : "-"}
                          </div>
                        </div>
                        <div className="tutor-slider-item-body-div">
                          <div className="tutor-slider-item-body-th">
                            {t("saved.classes")}:
                          </div>
                          <div className="tutor-slider-item-body-tb">
                            {el?.hourly_rate}
                            {el.hourly_rate_type === 1
                              ? t("searchTutor.pricePerHour2")
                              : t("searchTutor.pricePerHour")}
                          </div>
                        </div>
                      </div>
                      <div className="tutor-slider-item-btn-div">
                        <Link
                          to=""
                          onClick={() => handleDelete(el.course_id)}
                          className="tutor-slider-item-btn button-hover"
                        >
                          <Like style={{ fill: "#051c78" }} />
                          {t("saved.remove")}
                        </Link>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="loader">
            <Loader />
          </div>
        )
      ) : (
        <div className="no-saved">
          <img src={noSaved} alt="" />
          <h2>{t("saved.empty")} </h2>
          <h3>{t("saved.noAdded")}</h3>
          <Link to="/tutors">{t("saved.searchTutor")}</Link>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Saved;
