import React, { useState, useEffect } from "react";
import { base_url, experiences, months } from "../../data";
import { Link, useParams } from "react-router-dom";
import PopoverMessage from "./AboutTeacherMessage/AboutTeacherMessage";
import Footer from "../../components/Footer/Footer";
// import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import Loader from "../../components/Loader/Loader";

// Mui
import { Box } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import Dialog from "@mui/material/Dialog";
import StarIcon from "@mui/icons-material/Star";
import VisibilityIcon from "@mui/icons-material/Visibility";

// style
import "./aboutTeacher.scss";

// images
import { ReactComponent as Like } from "../../assets/svg/like.svg";
import Avatar from "../../assets/svg/defaultImg.png";
import tick from "../../assets/svg/doubletick.svg";
import save from "../../assets/svg/save.svg";
import share from "../../assets/svg/share.svg";
import img1 from "../../assets/svg/defaultImg.png";
import img2 from "../../assets/svg/search2.svg";
import sendBtn from "../../assets/svg/reportSendBtn.svg";
import tg from "../../assets/svg/tgVector.svg";
import fc from "../../assets/svg/facebookVector.svg";
import ins from "../../assets/svg/instagramVector.svg";
import { ReactComponent as File } from "../../assets/svg/fileVector.svg";
import closeImg from "../../assets/svg/close.svg";
import OBJECTS2 from "../../assets/svg/OBJECTS2.svg";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/useTypedSelector";
import {
  feedbackRatings,
  language,
  teacherReview,
  teacherReviews,
  teacherVeiw,
} from "../../data/interfaces";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 300 : 500],
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: theme.palette.mode === "light" ? "#007AFF" : "red",
  },
}));

const AboutTeacher = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const {
    role,
    subjects,
    languages,
    regions,
    certificates,
    studyTypes,
    degree,
    education,
  } = useAppSelector((state) => state);

  // __________________

  const [teacher, setTeacher] = useState<teacherVeiw>();
  const [courseId, setCourseId] = useState();
  const [comment, setComment] = useState("");
  const [rate, setRate] = useState<number>(0);
  const [review, setReview] = useState<teacherReview>();
  const [reviewMap, setReviewMap] = useState<teacherReviews[]>();
  const [reload, setReload] = useState(1);
  const [userId, setUserId] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [hover, setHover] = React.useState(-1);
  const [value, setValue] = useState(0);
  const [videoAll, setVideoAll] = useState(false);
  const [certificateImg, setCertificateImg] = useState<string>();
  const [feedbackRatings, setFeedbackRatings] = useState<feedbackRatings>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const pathName = document.URL.slice(document.URL.indexOf("gettutor.uz") + 1);

  useEffect(() => {
    if (role === null) {
      localStorage.setItem(
        "pathName",
        pathName.slice(pathName.indexOf(".uz") + 3)
      );
    }
  }, []);

  useEffect(() => {
    fetch(`${base_url}/site/users/${id}/view`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setTeacher(result.data);
        setCourseId(result.data.course_id);
        document.title = `Gettutor - ${result.data.firstname} ${result.data.lastname}`;
      })

      .catch((err) => {
        console.log(err);
      });

    fetch(`${base_url}/site/reviews/${id}/reviews`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setReview(result.data);

        let temp = {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        };

        result.data.reviews.map((el: teacherReviews) => {
          if (el.rate === 5) {
            temp[5]++;
          } else if (el.rate === 4) {
            temp[4]++;
          } else if (el.rate === 3) {
            temp[3]++;
          } else if (el.rate === 2) {
            temp[2]++;
          } else if (el.rate === 1) {
            temp[1]++;
          }
        });

        setFeedbackRatings(temp);
        setReviewMap(result.data.reviews.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, reload, userId]);

  const handleVideoView = () => {
    if (videoAll === true) {
      setVideoAll(false);
    } else {
      setVideoAll(true);
    }
  };

  const sendComment = () => {
    if (rate && comment) {
      fetch(`${base_url}/site/reviews/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          rate: rate,
          text: comment,
          user_id: id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success === true) {
            setRate(0);
            setComment("");
            if (reload === 1) {
              setReload(2);
            } else {
              setReload(1);
            }
            toast.success(t("extra.done"));
          }
        })
        .catch((err) => {
          toast.error(t("extra.error"));
        });
    } else {
      toast.info(t("extra.commentNotGiven"));
    }
  };

  const handleSave = (id: number) => {
    if (userId === true) {
      setUserId(false);
    } else {
      setUserId(true);
    }
    fetch(`${base_url}/site/courses/save`, {
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
        } else {
          toast.error(t("extra.error"));
        }
      })
      .catch((err) => {
        toast.error(t("extra.error"));
      });
  };

  const handleDelete = (id: number) => {
    if (userId === true) {
      setUserId(false);
    } else {
      setUserId(true);
    }
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

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
    setCopied(false);
  };
  const handleClickClose2 = () => {
    setOpen2(false);
  };

  type daysType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

  const days = {
    0: t("viewTutor.Monday"),
    1: t("viewTutor.Thuesday"),
    2: t("viewTutor.Wednesday"),
    3: t("viewTutor.Thursday"),
    4: t("viewTutor.Friday"),
    5: t("viewTutor.Saturday"),
    6: t("viewTutor.Sunday"),
  };

  type labelsType = 1 | 2 | 3 | 4 | 5;

  const labels = {
    1: t("viewTutor.notRecommend"),
    2: t("viewTutor.terrible"),
    3: t("viewTutor.notBad"),
    4: t("viewTutor.good"),
    5: t("viewTutor.excellent"),
  };

  function getLabelText(value: number) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${
      labels[value as labelsType]
    }`;
  }

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

  const studyTypesToString = (Array: number[]) => {
    let temp: string[] = [];

    if (studyTypes.length > 0) {
      Array.map((number) => {
        const found = studyTypes.find((item) => item.id === number)?.name[
          i18n.language as language
        ];

        if (found) {
          temp.push(found);
        }
      });
    }

    return temp.join(", ");
  };

  const handleTimeAgo = (created: number) => {
    const date = new Date(created * 1000);
    const day = date.getDate();
    const month = months[i18n.language as language][date.getMonth()].slice(
      0,
      3
    );
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${hour}:${minute} \xa0 ${day} ${month}, ${year}`;
  };
  return (
    <div className="about-teacher-main-container">
      {role === "teacher" || role === "student" ? (
        teacher ? (
          <div
            className="about-teacher-container"
            itemScope
            itemType="https://schema.org/Person"
          >
            <div
              className="about-teacher-site-way"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <Link to="/tutors">{t("viewTutor.findTutor")}</Link> /
              {teacher?.firstname + " " + teacher?.lastname}
            </div>
            <div className="about-teacher">
              <div className="main">
                {teacher ? (
                  <div
                    className="teacher-card-content"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                  >
                    <div className="teacher-card-content-img">
                      {teacher?.avatar_image ? (
                        <img src={teacher?.avatar_image} alt="" />
                      ) : (
                        <img src={img1} alt="" />
                      )}
                      {/* <div className="teacher-card-content-img-online">
                        {teacher?.is_online === "online" ? <div></div> : ""}{" "}
                        {t("searchTutor.online")}
                      </div> */}
                    </div>
                    <div className="teacher-card-content-info-container">
                      <div className="teacher-card-content-info">
                        <div className="teacher-card-content-info-name">
                          <span>
                            {teacher.firstname + " " + teacher.lastname + ""}
                          </span>
                          {teacher?.is_verified === true ? (
                            <img src={img2} alt="" />
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="teacher-card-content-info-lang certified-tutor">
                          <span>{t("viewTutor.certifiedTutor")}</span>
                          <span></span>
                        </div>
                        <div className="teacher-card-content-info-lang experience">
                          <span>{t("viewTutor.liveInCity")}</span>
                          <span itemProp="address">
                            {regions &&
                              teacher.country_id &&
                              regions[teacher.country_id].find(
                                (el) => el.id === teacher.region_id
                              )?.name[i18n.language as language]}
                          </span>
                        </div>
                        <div className="teacher-card-content-info-lang">
                          <span>{t("viewTutor.subject")}:</span>
                          <span itemProp="jobTitle">
                            {subjects &&
                            subjects.isFetched &&
                            teacher.subject_id
                              ? subjects.allData.find(
                                  (el) => el.id === teacher.subject_id
                                )?.name[i18n.language as language]
                              : null}
                          </span>
                        </div>
                        <div className="teacher-card-content-info-lang experience">
                          <span>{t("searchTutor.workExperience")}:</span>
                          <span>
                            {experiences
                              .filter((el) => teacher.experience === el.value)
                              .map((i) => {
                                return i.name + " " + t("searchTutor.year");
                              })}
                          </span>
                        </div>
                        <div className="teacher-card-content-info-age">
                          <span>{t("viewTutor.age")}:</span>
                          <span>
                            {teacher.age
                              ? teacher.age + " " + t("viewTutor.year2")
                              : ""}
                          </span>
                        </div>
                        <div className="teacher-card-content-info-lang">
                          <span>{t("viewTutor.knowLanguage")}:</span>
                          <span>
                            {teacher?.language_ids.length > 0
                              ? languagesToString(teacher.language_ids)
                              : "-"}
                          </span>
                        </div>
                        <div className="teacher-card-content-info-lang study-type">
                          <span>{t("viewTutor.typeOfEducation")}:</span>
                          <span>
                            {teacher && teacher?.study_type_id
                              ? studyTypesToString(teacher?.study_type_id)
                              : "-"}
                          </span>
                        </div>

                        <div className="teacher-card-content-info-lang lesson-price">
                          <span>{t("viewTutor.price")}:</span>
                          <span style={{ color: "#34C759" }}>
                            {teacher?.hourly_rate}
                            <span> </span>
                            {teacher.hourly_rate_type === 1
                              ? t("searchTutor.pricePerHour2")
                              : t("searchTutor.pricePerHour")}
                          </span>
                        </div>
                        <div className="test-lesson">
                          {teacher?.test_lesson === true ? (
                            <div>
                              <img src={tick} alt="" />
                              {t("viewTutor.freeTrialLesson")}
                            </div>
                          ) : (
                            <div>{t("viewTutor.noFreeLessons")}</div>
                          )}
                        </div>
                        <div className="techer-card-content-rate-btns-1">
                          <Link
                            className="button-hover"
                            to=""
                            onClick={() => {
                              teacher?.saved === true
                                ? handleDelete(teacher?.course_id)
                                : teacher?.saved === false
                                ? handleSave(teacher?.course_id)
                                : handleRefresh();
                            }}
                          >
                            {teacher?.saved === true ? (
                              <Like style={{ fill: "#051c78" }} />
                            ) : teacher?.saved === false ? (
                              <Like style={{ fill: "grey" }} />
                            ) : (
                              ""
                            )}
                            {t("viewTutor.save")}
                          </Link>
                          <Link
                            className="button-hover"
                            onClick={handleClickOpen}
                            to=""
                          >
                            <img src={share} alt="" />
                            {t("viewTutor.share")}
                          </Link>
                          <Dialog
                            open={open}
                            onClose={handleClickClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <div className="share">
                              <div className="share-title">
                                <h2>{t("viewTutor.share")}</h2>
                                <div
                                  className="share-title-close"
                                  onClick={() => handleClickClose()}
                                ></div>
                              </div>
                              <div className="share-link">
                                {`gettutor.uz/tutors/view/${id}`}
                                <div className="share-link-btn">
                                  <div
                                    className=""
                                    onClick={async () => {
                                      await navigator.clipboard.writeText(
                                        `gettutor.uz/tutors/view/${id}`
                                      );
                                    }}
                                  >
                                    <File
                                      onClick={() => setCopied(true)}
                                      fill={copied ? "blue" : "grey"}
                                    />
                                  </div>
                                  {/* <CopyToClipboard
                                    text={`gettutor.uz/tutors/view/${id}`}
                                  >
                                    <File
                                      onClick={() => setCopied(true)}
                                      fill={copied ? "blue" : "grey"}
                                    />
                                  </CopyToClipboard> */}
                                </div>
                              </div>
                              <div className="share-social-media">
                                <a
                                  href={`https://telegram.me/share/url?url=gettutor.uz/tutors/view/${id}`}
                                  target="_blank"
                                  className="social-media"
                                >
                                  <img src={tg} alt="" />
                                  <div className="name">Telegram</div>
                                </a>
                                <a
                                  href={`https://www.facebook.com/share.php?u=gettutor.uz/tutors/view/${id}`}
                                  target="_blank"
                                  className="social-media"
                                >
                                  <img src={fc} alt="" />
                                  <div className="name">Facebook</div>
                                </a>
                                <a
                                  href="https://www.instagram.com/direct/new/"
                                  target="_blank"
                                  className="social-media"
                                >
                                  <img src={ins} alt="" />
                                  <div className="name">Instagram</div>
                                </a>
                              </div>
                              {/* <div className="share-btns">
                            <button className="share-btn-send">
                              {t("viewTutor.send")}
                            </button>
                            <button
                              className="share-btn-cancel"
                              onClick={() => handleClickClose()}
                            >
                              {t("viewTutor.cancel")}
                            </button>
                          </div> */}
                            </div>
                          </Dialog>
                          <div className="request">
                            {role === "student" && courseId !== undefined && (
                              <div
                                style={
                                  teacher?.my_teacher === true
                                    ? { display: "none" }
                                    : { display: "block" }
                                }
                                className="request-button"
                              >
                                <PopoverMessage
                                  courseId={courseId}
                                  img={teacher?.avatar_image}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="techer-card-content-rate-btns-2">
                          <Link
                            to=""
                            onClick={() => {
                              teacher?.saved === true
                                ? handleDelete(teacher?.course_id)
                                : teacher?.saved === false
                                ? handleSave(teacher?.course_id)
                                : handleRefresh();
                            }}
                          >
                            {teacher?.saved === true ? (
                              <Like style={{ fill: "blue" }} />
                            ) : teacher?.saved === false ? (
                              <Like style={{ fill: "grey" }} />
                            ) : (
                              ""
                            )}
                          </Link>
                          <Link onClick={handleClickOpen} to="">
                            <img src={share} alt="" />
                          </Link>
                          <Dialog
                            open={open}
                            onClose={handleClickClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <div className="share">
                              <div className="share-title">
                                <h2>{t("viewTutor.share")}</h2>
                                <div
                                  className="share-title-close"
                                  onClick={() => handleClickClose()}
                                ></div>
                              </div>
                              <div className="share-link">
                                {`gettutor.uz/tutors/view/${id}`}
                                <div className="share-link-btn">
                                  <div
                                    className=""
                                    onClick={async () => {
                                      await navigator.clipboard.writeText(
                                        `gettutor.uz/tutors/view/${id}`
                                      );
                                    }}
                                  >
                                    <File
                                      onClick={() => setCopied(true)}
                                      fill={copied ? "blue" : "grey"}
                                    />
                                  </div>
                                  {/* <CopyToClipboard
                                    text={`gettutor.uz/tutors/view/${id}`}
                                  >
                                    <File
                                      onClick={() => setCopied(true)}
                                      fill={copied ? "blue" : "grey"}
                                    />
                                  </CopyToClipboard> */}
                                </div>
                              </div>
                              <div className="share-social-media">
                                <a
                                  href={`https://telegram.me/share/url?url=gettutor.uz/tutors/view/${id}`}
                                  target="_blank"
                                  className="social-media"
                                >
                                  <img src={tg} alt="" />
                                  <div className="name">Telegram</div>
                                </a>
                                <a
                                  href={`https://www.facebook.com/share.php?u=gettutor.uz/tutors/view/${id}`}
                                  target="_blank"
                                  className="social-media"
                                >
                                  <img src={fc} alt="" />
                                  <div className="name">Facebook</div>
                                </a>
                                <a
                                  href="https://www.instagram.com/direct/new/"
                                  target="_blank"
                                  className="social-media"
                                >
                                  <img src={ins} alt="" />
                                  <div className="name">Instagram</div>
                                </a>
                              </div>
                              {/* <div className="share-btns">
                            <button className="share-btn-send">
                              {t("viewTutor.send")}
                            </button>
                            <button
                              className="share-btn-cancel"
                              onClick={() => handleClickClose()}
                            >
                              {t("viewTutor.cancel")}
                            </button>
                          </div> */}
                            </div>
                          </Dialog>
                          <div className="request">
                            {role === "student" && courseId !== undefined && (
                              <div
                                style={
                                  teacher?.my_teacher === true
                                    ? { display: "none" }
                                    : { display: "block" }
                                }
                                className="request-button"
                              >
                                <PopoverMessage
                                  courseId={courseId}
                                  img={teacher?.avatar_image}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="about-content-right-side">
                        <div className="techer-card-content-rate">
                          <h2>
                            {t("viewTutor.rating")}{" "}
                            {Math.floor(teacher.rate * 10) / 10}
                          </h2>
                          <div className="reviews-score-rating">
                            <Rating
                              name="read-only"
                              value={teacher.rate}
                              readOnly
                            />
                          </div>
                          <h3>
                            {teacher.followers} {t("viewTutor.students")}
                          </h3>
                        </div>
                        <div className="techer-card-content-rate-btns">
                          <Link
                            className="button-hover"
                            to=""
                            onClick={() => {
                              teacher?.saved === true
                                ? handleDelete(teacher?.course_id)
                                : teacher?.saved === false
                                ? handleSave(teacher?.course_id)
                                : handleRefresh();
                            }}
                          >
                            {teacher?.saved === true ? (
                              <Like style={{ fill: "#051c78" }} />
                            ) : teacher?.saved === false ? (
                              <Like style={{ fill: "grey" }} />
                            ) : (
                              ""
                            )}
                            {t("viewTutor.save")}
                          </Link>
                          <Link
                            className="button-hover"
                            onClick={handleClickOpen}
                            to=""
                          >
                            <img src={share} alt="" />
                            {t("viewTutor.share")}
                          </Link>
                          <Dialog
                            open={open}
                            onClose={handleClickClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <div className="share">
                              <div className="share-title">
                                <h2>{t("viewTutor.share")}</h2>
                                <div
                                  className="share-title-close"
                                  onClick={() => handleClickClose()}
                                ></div>
                              </div>
                              <div className="share-link">
                                {`gettutor.uz/tutors/view/${id}`}
                                <div className="share-link-btn">
                                  <div
                                    className=""
                                    onClick={async () => {
                                      await navigator.clipboard.writeText(
                                        `gettutor.uz/tutors/view/${id}`
                                      );
                                    }}
                                  >
                                    <File
                                      onClick={() => setCopied(true)}
                                      fill={copied ? "blue" : "grey"}
                                    />
                                  </div>
                                  {/* <CopyToClipboard
                                    text={`gettutor.uz/tutors/view/${id}`}
                                  >
                                    <File
                                      onClick={() => setCopied(true)}
                                      fill={copied ? "blue" : "grey"}
                                    />
                                  </CopyToClipboard> */}
                                </div>
                              </div>
                              <div className="share-social-media">
                                <a
                                  href={`https://telegram.me/share/url?url=gettutor.uz/tutors/view/${id}`}
                                  target="_blank"
                                  className="social-media"
                                >
                                  <img src={tg} alt="" />
                                  <div className="name">Telegram</div>
                                </a>
                                <a
                                  href={`https://www.facebook.com/share.php?u=gettutor.uz/tutors/view/${id}`}
                                  target="_blank"
                                  className="social-media"
                                >
                                  <img src={fc} alt="" />
                                  <div className="name">Facebook</div>
                                </a>
                                <a
                                  href="https://www.instagram.com/direct/new/"
                                  target="_blank"
                                  className="social-media"
                                >
                                  <img src={ins} alt="" />
                                  <div className="name">Instagram</div>
                                </a>
                              </div>
                              {/* <div className="share-btns">
                            <button className="share-btn-send">
                              {t("viewTutor.send")}
                            </button>
                            <button
                              className="share-btn-cancel"
                              onClick={() => handleClickClose()}
                            >
                              {t("viewTutor.cancel")}
                            </button>
                          </div> */}
                            </div>
                          </Dialog>
                          <div className="request">
                            {role === "student" && courseId !== undefined && (
                              <div
                                style={
                                  teacher?.my_teacher === true
                                    ? { display: "none" }
                                    : { display: "block" }
                                }
                                className="request-button"
                              >
                                <PopoverMessage
                                  courseId={courseId}
                                  img={teacher?.avatar_image}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  "not found"
                )}
                <div
                  className="schedules"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  <div className="schedules-title">
                    {t("viewTutor.classSchedules")}
                  </div>
                  <div className="schedules-body">
                    {teacher?.schedule &&
                      teacher?.schedule.map((item, index) => {
                        return item.is_valid === true ? (
                          <div key={index} className="schedules-card">
                            <div className="schedules-body-content">
                              <h2>{days[index as daysType]}</h2>
                              {item?.firstTime?.beginHour && (
                                <p>{`${item?.firstTime?.beginHour}:${item?.firstTime.beginMinute} - ${item?.firstTime.finishHour}:${item?.firstTime.finishMinute}`}</p>
                              )}
                              {item?.secondTime?.beginHour && (
                                <p>{`${item?.secondTime?.beginHour}:${item?.secondTime.beginMinute} - ${item?.secondTime.finishHour}:${item?.secondTime.finishMinute}`}</p>
                              )}
                            </div>
                            <div className="schedules-body-img">
                              <img src={save} alt="" />
                            </div>
                          </div>
                        ) : (
                          ""
                        );
                      })}
                  </div>
                </div>
                <div
                  className="profile-content"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  <div className="about-me">
                    <h3 className="about-me-title">
                      {t("viewTutor.aboutTutor")}
                    </h3>
                    <p className="about-me-content">{teacher?.about}</p>
                    <br />
                    {/* place */}
                    {window.innerWidth > 1439 && (
                      <div className="about-content">
                        <div style={{ color: "black", fontSize: "20px" }}>
                          {`${t("viewTutor.typeOfEducation")}`}
                        </div>
                        <div style={{ color: "#ff9500" }}>
                          {teacher && teacher?.study_type_id
                            ? ` ${studyTypesToString(teacher?.study_type_id)}`
                            : "-"}
                        </div>
                      </div>
                    )}

                    <div className="subjects">
                      <h3 className="subjects-title">
                        {t("viewTutor.subject")}
                      </h3>

                      <span className="subject-item">
                        {subjects && subjects.isFetched && teacher.subject_id
                          ? subjects.allData.find(
                              (el) => el.id === teacher.subject_id
                            )?.name[i18n.language as language]
                          : null}
                      </span>
                    </div>
                  </div>

                  {teacher.certificates &&
                    teacher.certificates.length !== 0 && (
                      <div className="certificates-content">
                        <h3 className="certificates-title">
                          {t("viewTutor.certificate")}
                        </h3>
                        <div className="certificate-item-wrapper">
                          {teacher.certificates.map((item, index) => {
                            return (
                              <div
                                key={index}
                                onClick={() => {
                                  setOpen2(true);
                                  setCertificateImg(item.file.link);
                                }}
                                className="certificate-item"
                              >
                                <div className="certificate-img-wrapper">
                                  <img
                                    src={item.file?.link}
                                    alt="certificate"
                                    className="certificate-image"
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  {item.type_id !== null ? (
                                    <span className="certificate-name">
                                      {
                                        certificates.find(
                                          (el) => el.id === item.type_id
                                        )?.name
                                      }{" "}
                                      {
                                        certificates.find(
                                          (el) => el.id === item.type_id
                                        )?.values[Number(item.grade_id) - 1]
                                      }
                                    </span>
                                  ) : (
                                    <span>{item.name}</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <Dialog
                          open={open2}
                          onClose={handleClickClose2}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <div className="certificate">
                            <img
                              onClick={() => {
                                setOpen2(false);
                              }}
                              className="close-img"
                              src={closeImg}
                              alt=""
                            />
                            <div className="certificate-img">
                              <img src={certificateImg} alt="" />
                            </div>
                          </div>
                        </Dialog>
                      </div>
                    )}
                </div>
                {teacher && teacher.videos && (
                  <div
                    className="study-materials-content"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                  >
                    <div className="study-materials-header">
                      <h3 className="study-materials-titl">
                        {t("viewTutor.textbooks")}
                      </h3>
                    </div>
                    <div
                      className="study-materials-body"
                      style={
                        videoAll === false
                          ? { maxHeight: "250px" }
                          : { maxHeight: "600px" }
                      }
                    >
                      {teacher &&
                        teacher.videos.map((el, index) => {
                          return (
                            <div key={index} className="study-material-video">
                              {el.video_link?.split(".").pop() === "mp4" ? (
                                <video src={el.video_link} controls></video>
                              ) : (
                                <div key={index} className="document">
                                  <iframe
                                    className="document"
                                    src={el.video_link}
                                  ></iframe>
                                </div>
                              )}

                              <div className="video-name">
                                {el.video_name}
                                {el.video_link?.split(".").pop() !== "mp4" && (
                                  <a
                                    className="visibility-icon"
                                    href={el.video_link}
                                    target="_blank"
                                  >
                                    <VisibilityIcon className="icon" />
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {teacher && teacher.videos.length > 3 ? (
                      <hr style={{ marginBlock: "10px" }} />
                    ) : (
                      ""
                    )}
                    {teacher && teacher.videos.length > 3 ? (
                      <button
                        className="show-more-study-materials-btn"
                        onClick={() => {
                          handleVideoView();
                        }}
                      >
                        {videoAll === false
                          ? t("viewTutor.showMore")
                          : t("profile.showLess")}

                        <ArrowDownwardIcon
                          style={
                            videoAll === true
                              ? { transform: "rotate(180deg)" }
                              : {}
                          }
                          className="show-more-study-materials-btn-icon"
                        />
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                )}

                {reviewMap && reviewMap.length > 0 ? (
                  <div
                    className="my-reviews-content"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                  >
                    {reviewMap && reviewMap.length > 0 ? (
                      <div>
                        <h3 className="my-reviews-content-title">
                          {t("viewTutor.reviewsOfStudents")}
                        </h3>
                        <div className="reviews-rating-content">
                          <div className="reviews-score-content">
                            <h3 className="reviews-score-number">
                              {review && review.average?.toFixed(1)}
                            </h3>
                            <div className="reviews-score-rating">
                              <Rating
                                name="read-only"
                                value={
                                  review
                                    ? Number(Math.floor(review.average))
                                    : 0
                                }
                                readOnly
                              />
                            </div>
                            <h4 className="reviews-count">
                              {review && review.reviews.length}{" "}
                              {t("viewTutor.reviews")}
                            </h4>
                          </div>
                          <div className="reviewers-progress-by-rating">
                            <div className="reviewers-progress-item">
                              <Box sx={{ flexGrow: 1 }}>
                                <BorderLinearProgress
                                  className="progress-mobile"
                                  variant="determinate"
                                  value={
                                    review
                                      ? Math.floor(
                                          (feedbackRatings[5] /
                                            review.reviews.length) *
                                            100
                                        )
                                      : 0
                                  }
                                />
                              </Box>
                              <Rating name="read-only" value={5} readOnly />
                              <span className="progress-value">
                                {review && review.reviews.length !== 0
                                  ? Math.floor(
                                      (feedbackRatings[5] /
                                        review.reviews.length) *
                                        100
                                    )
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="reviewers-progress-item">
                              <Box sx={{ flexGrow: 1 }}>
                                <BorderLinearProgress
                                  className="progress-mobile"
                                  variant="determinate"
                                  value={
                                    review && review.reviews.length !== 0
                                      ? Math.floor(
                                          (feedbackRatings[4] /
                                            review?.reviews?.length) *
                                            100
                                        )
                                      : 0
                                  }
                                />
                              </Box>
                              <Rating name="read-only" value={4} readOnly />
                              <span className="progress-value">
                                {review && review.reviews.length !== 0
                                  ? Math.floor(
                                      (feedbackRatings[4] /
                                        review?.reviews?.length) *
                                        100
                                    )
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="reviewers-progress-item">
                              <Box sx={{ flexGrow: 1 }}>
                                <BorderLinearProgress
                                  className="progress-mobile"
                                  variant="determinate"
                                  value={
                                    review && review.reviews.length !== 0
                                      ? Math.floor(
                                          (feedbackRatings[3] /
                                            review?.reviews?.length) *
                                            100
                                        )
                                      : 0
                                  }
                                />
                              </Box>
                              <Rating name="read-only" value={3} readOnly />
                              <span className="progress-value">
                                {review && review.reviews.length !== 0
                                  ? Math.floor(
                                      (feedbackRatings[3] /
                                        review?.reviews?.length) *
                                        100
                                    )
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="reviewers-progress-item">
                              <Box sx={{ flexGrow: 1 }}>
                                <BorderLinearProgress
                                  className="progress-mobile"
                                  variant="determinate"
                                  value={
                                    review && review.reviews.length !== 0
                                      ? Math.floor(
                                          (feedbackRatings[2] /
                                            review?.reviews?.length) *
                                            100
                                        )
                                      : 0
                                  }
                                />
                              </Box>
                              <Rating name="read-only" value={2} readOnly />
                              <span className="progress-value">
                                {review && review.reviews.length !== 0
                                  ? Math.floor(
                                      (feedbackRatings[2] /
                                        review?.reviews?.length) *
                                        100
                                    )
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="reviewers-progress-item">
                              <Box sx={{ flexGrow: 1 }}>
                                <BorderLinearProgress
                                  className="progress-mobile"
                                  variant="determinate"
                                  value={
                                    review && review.reviews.length !== 0
                                      ? Math.floor(
                                          (feedbackRatings[1] /
                                            review?.reviews?.length) *
                                            100
                                        )
                                      : 0
                                  }
                                />
                              </Box>
                              <Rating name="read-only" value={1} readOnly />
                              <span className="progress-value">
                                {review && review.reviews.length !== 0
                                  ? Math.floor(
                                      (feedbackRatings[1] /
                                        review?.reviews?.length) *
                                        100
                                    )
                                  : 0}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {reviewMap && reviewMap.length ? (
                      <div className="review-contents-wrapper">
                        {reviewMap &&
                          reviewMap.map((el, index) => (
                            <div
                              key={index}
                              className="reviewer-content-item"
                              itemProp="review"
                              itemScope
                              itemType="https://schema.org/Review"
                            >
                              {el.sender_image ? (
                                <img
                                  className="reviewer-image"
                                  src={el.sender_image}
                                  alt="avatar"
                                />
                              ) : (
                                <img
                                  className="reviewer-image"
                                  src={Avatar}
                                  alt="avatar"
                                />
                              )}
                              <div className="reviewer-comment">
                                <h3
                                  className="reviewer-comment-title"
                                  itemProp="author"
                                >
                                  {el.sender_name}
                                </h3>
                                <div className="reviewer-rating-for-tutor">
                                  <Rating
                                    itemProp="reviewRating"
                                    name="read-only"
                                    value={el.rate}
                                    readOnly
                                    className="rating"
                                  />
                                  <h4
                                    className="reviewer-coment-time-ago"
                                    itemProp="datePublished"
                                  >
                                    {handleTimeAgo(Number(el.created_at))}
                                  </h4>
                                </div>
                                <p
                                  className="reviewer-comment-text"
                                  itemProp="reviewBody"
                                >
                                  {el.text}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : null}

                    {role === "student" ? (
                      <div className="review-rate">
                        <h2>{t("viewTutor.rateTutor")}</h2>
                        <Box
                          sx={{
                            marginTop: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                          onKeyDown={(
                            event: React.KeyboardEvent<HTMLInputElement>
                          ) => {
                            if (event.key === "Enter") {
                              sendComment();
                            }
                          }}
                        >
                          <Rating
                            size="large"
                            name="hover-feedback"
                            value={rate}
                            precision={1}
                            getLabelText={getLabelText}
                            onChange={(event, newValue) => {
                              setRate(Number(newValue));
                            }}
                            onChangeActive={(event, newHover) => {
                              setHover(newHover);
                            }}
                            emptyIcon={
                              <StarIcon
                                style={{ opacity: 0.45 }}
                                fontSize="inherit"
                              />
                            }
                          />
                          {value !== null && (
                            <div className="rating-word">
                              {
                                labels[
                                  hover !== -1
                                    ? (hover as labelsType)
                                    : (value as labelsType)
                                ]
                              }
                            </div>
                          )}
                        </Box>
                      </div>
                    ) : null}

                    {role === "student" ? (
                      <div className="my-review-send">
                        <input
                          value={comment}
                          onChange={(e) => {
                            setComment(e.target.value);
                          }}
                          placeholder={String(t("viewTutor.writeReview"))}
                          type="text"
                          className="my-review-input"
                          onKeyDown={(
                            event: React.KeyboardEvent<HTMLInputElement>
                          ) => {
                            if (event.key === "Enter") {
                              sendComment();
                            }
                          }}
                        />
                        <div className="send-btn">
                          <img
                            onClick={() => {
                              sendComment();
                            }}
                            src={sendBtn}
                            alt="send"
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className="aside">
                <div
                  className="prices"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  {/* price */}
                  <div className="prices-content">
                    <div>{t("viewTutor.price")}</div>
                    <div style={{ color: "#34C759" }}>
                      {teacher?.hourly_rate}
                      <span> </span>
                      {teacher.hourly_rate_type === 1
                        ? t("searchTutor.pricePerHour2")
                        : t("searchTutor.pricePerHour")}
                    </div>
                  </div>

                  {/* free lesson */}
                  <hr />
                  <div className="prices-content">
                    {teacher?.test_lesson === true ? (
                      <div>
                        <img src={tick} alt="" />
                        {t("viewTutor.freeTrialLesson")}
                      </div>
                    ) : (
                      <div>{t("viewTutor.noFreeLessons")}</div>
                    )}
                  </div>

                  {/* education */}
                  <hr />
                  <div className="prices-content">
                    <div>{t("form.education")}</div>
                    <div>
                      {education &&
                        education
                          .filter((item) => item.id === teacher.education_id)
                          .map((item) => {
                            return item.name[i18n.language as language];
                          })}
                    </div>
                  </div>
                  {/* degree */}
                  <hr />
                  <div className="prices-content">
                    <div>{t("form.category2")}</div>
                    <div>
                      {degree &&
                        degree
                          .filter((item) => item.id === teacher.degree_id)
                          .map((item) => {
                            return item.name[i18n.language as language];
                          })}
                    </div>
                  </div>

                  <div
                    style={
                      teacher?.my_teacher === true
                        ? { display: "none" }
                        : { display: "block" }
                    }
                  >
                    {role === "student" && <hr />}
                    {role === "student" && courseId !== undefined && (
                      <div className="prices-btn">
                        <PopoverMessage
                          courseId={courseId}
                          img={teacher?.avatar_image}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="schedules"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  <div className="schedules-title">
                    {t("viewTutor.classSchedules")}
                  </div>
                  {teacher?.schedule &&
                    teacher?.schedule
                      .filter((el) => el.is_valid)
                      .map((item, index) => {
                        return (
                          <div key={index} className="schedules-body">
                            <div className="schedules-body-content">
                              <h2>{days[index as daysType]}</h2>
                              {item?.firstTime?.beginHour && (
                                <p>{`${item?.firstTime?.beginHour}:${item?.firstTime.beginMinute} - ${item?.firstTime.finishHour}:${item?.firstTime.finishMinute}`}</p>
                              )}
                              {item?.secondTime?.beginHour && (
                                <p>{`${item?.secondTime?.beginHour}:${item?.secondTime.beginMinute} - ${item?.secondTime.finishHour}:${item?.secondTime.finishMinute}`}</p>
                              )}
                            </div>
                            <div className="schedules-body-img">
                              <img src={save} alt="" />
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="loader">
            <Loader />
          </div>
        )
      ) : (
        <div className="please-register">
          <h2>{t("extra.regiterBeforeIt")}</h2>
          <img src={OBJECTS2} alt="" />
          <div>
            <Link to="/registration" className="no-avatar-reg-btn">
              <div className="no-avatar-reg-btn-icon"></div>
              {t("header.regist")}
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AboutTeacher;
