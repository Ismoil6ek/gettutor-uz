import React, { useState, useRef, useMemo } from "react";
// import TextareaAutosize from "react-autosize-textarea";
import { useTranslation } from "react-i18next";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { Box, Dialog, Popover, TextareaAutosize } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

import Visa from "../../assets/svg/visa.svg";
import MasterCard from "../../assets/svg/mastercard.svg";
import Oson from "../../assets/svg/oson.svg";
import Click from "../../assets/svg/click.svg";
import Payme from "../../assets/svg/payme2.svg";
import defaultImg from "../../assets/svg/defaultImg.png";
import EmptyCommentsICon from "../../assets/svg/empty_comment_icon.svg";
import EmptyAboutMeIcon from "../../assets/svg/empty_aboutMe_icon.svg";

import StudyMaterialsTabPupil from "../StudyMaterialsTabPupil/StudyMaterialsTabPupil";
import { useEffect } from "react";
import { base_url, months } from "../../data";
import CurrentTariff from "../CurrentTariff/CurrentTariff";
import MyStudentsList from "../../pages/MyStudentsList/MyStudentsList";
import MyTeachersList from "../../pages/MyTeachersList/MyTeachersList";
import StudyMaterialsTabTeacher from "../StudyMaterialsTabTeacher/StudyMaterialsTabTeacher";

// import sass
import "./tab.scss";
import { useAppSelector } from "../../hooks/useTypedSelector";
import {
  feedbackRatings,
  labels,
  language,
  review,
  Tariffs,
  UserSubscription,
} from "../../data/interfaces";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
const tabItems = [
  "studentProfile.profile",
  "studentProfile.textbooks",
  "studentProfile.myReviews",
  {
    teacher: "profile.myStudents",
    student: "studentProfile.myTutors",
  },
  "profile.mySubscription",
];

const Tab = ({
  setShow,
  tabId,
  setTabId,
  className,
}: {
  setShow: (show: boolean) => void;
  tabId: number;
  setTabId: (id: number) => void;
  className: string;
}) => {
  // const [renderVideo, setRenderVideo] = useState(false);

  const { t, i18n } = useTranslation();
  const { user, role, certificates, subjects, languages } = useAppSelector(
    (state) => state
  );
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
  const [tempCommentText, setTempCommentText] = useState(""); // to ref
  const [anchorHandleComment, setAnchorHandleComment] =
    useState<Element | null>(null);
  const [tempCommentId, settempCommentId] = useState<number | null>(null);
  const [anchorHandleTariff, setAnchorHandleTariff] = useState<boolean | null>(
    null
  );
  const [value, setValue] = useState(0);
  const [ratingValue, setRatingValue] = useState(2);
  const [hover, setHover] = useState(-1);
  const [feedbackRatings, setFeedbackRatings] = useState<feedbackRatings>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [feedbacks, setFeedbacks] = useState<review[]>();
  const [tariffs, setTatiffs] = useState<Tariffs[]>([]);
  const textareaAutoResize = useRef<HTMLTextAreaElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [userSubscription, setUserSubscription] =
    React.useState<UserSubscription | null>(null);
  const [subscription_id, setSubscription_id] = React.useState<number | null>(
    null
  );
  const paymentName = ["visa", "masterCard", "oson", "click", "payme"];
  const [price, setPrice] = React.useState<any>();

  const average = useMemo(() => {
    return (
      Object.values(feedbackRatings).reduce(
        (acc, cur, index) => (cur !== 0 ? acc + cur * (index + 1) : acc),
        0
      ) / Object.values(feedbackRatings).reduce((acc, cur) => acc + cur, 0)
    );
  }, [role, feedbacks]);

  const labels: labels = {
    1: t("viewTutor.notRecommend"),
    2: t("viewTutor.terrible"),
    3: t("viewTutor.notBad"),
    4: t("viewTutor.good"),
    5: t("viewTutor.excellent"),
  };

  useEffect(() => {
    fetch(`${base_url}/site/subscription/index`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setTatiffs(data.data))
      .catch((err) => console.log(err));

    fetch(`${base_url}/site/subscription/get-subscription`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserSubscription(data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (user) {
      if (role === "teacher") {
        fetch(`${base_url}/site/reviews/${user.id}/reviews`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setFeedbackRatings({
              1: 0,
              2: 0,
              3: 0,
              4: 0,
              5: 0,
            });
            setFeedbacks(data.data.reviews);
            for (let rate of data.data.reviews) {
              setFeedbackRatings((prevState) => {
                let copy = { ...prevState };
                ++copy[rate.rate];
                return copy;
              });
            }
          })
          .catch((err) => console.log(err));
      } else if (role === "student") {
        fetch(`${base_url}/site/reviews/index`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) => setFeedbacks(data.data))
          .catch((err) => console.log(err));
      }
    }
    // eslint-disable-next-line
  }, [user, role]);

  function getLabelText(value: number) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }

  const sendUpdatedComment = () => {
    fetch(`${base_url}/site/reviews/${tempCommentId}/update`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        text: tempCommentText,
        rate: ratingValue,
      }),
    })
      .then((response) => response.json())
      .then((data) => window.location.reload())
      .catch((err) => console.log(err));
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

  const handleSubject = (id: number) => {
    const subjectItem = subjects?.allData.filter((item: any) => item.id === id);

    if (subjectItem) {
      return subjectItem[0].name[i18n.language as language];
    }

    return "";
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

  const changeTabItem = (state: number) => {
    switch (state) {
      case 0:
        // Profile tab content
        return (
          <div className="profile-content">
            {user?.about ? (
              <div className="content-wrapper">
                <div className="about-me">
                  <h3 className="about-me-title">{t("profile.aboutMe")}</h3>
                  {user?.about ? (
                    <p className="about-me-content">{user.about}</p>
                  ) : (
                    <p className="about-me-content">{t("header.noYet")}</p>
                  )}

                  {user?.role === "student" ? (
                    <div className="subjects">
                      <h3 className="subjects-title">
                        {t("studentProfile.knowLanguage")} :
                      </h3>
                      {user.language_ids.length > 0
                        ? languagesToString(user.language_ids)
                        : t("extra.pleaseFillInfo")}
                    </div>
                  ) : (
                    <div className="subjects">
                      <h3 className="subjects-title">
                        {t("profile.subject")} :
                      </h3>
                      <span className="subject-item">
                        {subjects && subjects.isFetched && user.subject_id
                          ? subjects.allData.find(
                              (el) => el.id === user.subject_id
                            )?.name[i18n.language as language]
                          : null}
                      </span>
                    </div>
                  )}
                </div>
                {/* Add certificate if user is teacher */}
                {role === "teacher" && user.certificates.length ? (
                  <div className="certificates-content">
                    <h3 className="certificates-title">
                      {t("profile.certificate")}
                    </h3>
                    <div className="certificate-items-wrapper">
                      {user.certificates.map((item, index) => {
                        return (
                          <div key={index} className="certificate-item">
                            <img
                              src={item.link}
                              alt="certificate-img"
                              className="certificate-img"
                            />
                            <span className="certificate-name">
                              {item && item.name
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
            ) : (
              <div className="empty-materials">
                <img src={EmptyAboutMeIcon} alt="empty_material_icon" />
                <div className="empty-materials-content">
                  <span className="empty-materials-description">
                    {t("profile.writeAboutYouAndComplite")}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      case 1:
        // Study materials tab content for teachers
        return role === "teacher" ? (
          <StudyMaterialsTabTeacher />
        ) : (
          // Study materials tab content for pupils
          <StudyMaterialsTabPupil />
        );
      case 2:
        // Reviews tab content
        return (
          <div className="my-reviews-content">
            {role === "teacher" && feedbacks ? (
              feedbacks.length ? (
                <div>
                  <h3 className="my-reviews-content-title">
                    {t("profile.studentsReviews")}
                  </h3>
                  <div className="reviews-rating-content">
                    <div className="reviews-score-content">
                      <h3 className="reviews-score-number">
                        {feedbacks && average.toFixed(1)}
                      </h3>
                      <div className="reviews-score-rating">
                        <Rating
                          name="read-only"
                          value={Math.round(average)}
                          readOnly
                        />
                      </div>
                      <h4 className="reviews-count">
                        {feedbacks.length} {t("profile.Reviews")}
                      </h4>
                    </div>
                    <div className="reviewers-progress-by-rating">
                      <div className="reviewers-progress-item">
                        <Box sx={{ flexGrow: 1 }}>
                          <BorderLinearProgress
                            className="progress-mobile"
                            variant="determinate"
                            value={Math.floor(
                              (feedbackRatings[5] / feedbacks.length) * 100
                            )}
                          />
                        </Box>
                        <Rating name="read-only" value={5} readOnly />
                        <span className="progress-value">
                          {Math.floor(
                            (feedbackRatings[5] / feedbacks.length) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="reviewers-progress-item">
                        <Box sx={{ flexGrow: 1 }}>
                          <BorderLinearProgress
                            className="progress-mobile"
                            variant="determinate"
                            value={Math.floor(
                              (feedbackRatings[4] / feedbacks.length) * 100
                            )}
                          />
                        </Box>
                        <Rating name="read-only" value={4} readOnly />
                        <span className="progress-value">
                          {Math.floor(
                            (feedbackRatings[4] / feedbacks.length) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="reviewers-progress-item">
                        <Box sx={{ flexGrow: 1 }}>
                          <BorderLinearProgress
                            className="progress-mobile"
                            variant="determinate"
                            value={Math.floor(
                              (feedbackRatings[3] / feedbacks.length) * 100
                            )}
                          />
                        </Box>
                        <Rating name="read-only" value={3} readOnly />
                        <span className="progress-value">
                          {Math.floor(
                            (feedbackRatings[3] / feedbacks.length) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="reviewers-progress-item">
                        <Box sx={{ flexGrow: 1 }}>
                          <BorderLinearProgress
                            className="progress-mobile"
                            variant="determinate"
                            value={Math.floor(
                              (feedbackRatings[2] / feedbacks.length) * 100
                            )}
                          />
                        </Box>
                        <Rating name="read-only" value={2} readOnly />
                        <span className="progress-value">
                          {Math.floor(
                            (feedbackRatings[2] / feedbacks.length) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="reviewers-progress-item">
                        <Box sx={{ flexGrow: 1 }}>
                          <BorderLinearProgress
                            className="progress-mobile"
                            variant="determinate"
                            value={Math.floor(
                              (feedbackRatings[1] / feedbacks.length) * 100
                            )}
                          />
                        </Box>
                        <Rating name="read-only" value={1} readOnly />
                        <span className="progress-value">
                          {Math.floor(
                            (feedbackRatings[1] / feedbacks.length) * 100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-materials">
                  <img src={EmptyCommentsICon} alt="empty_material_icon" />
                  <div className="empty-materials-content">
                    <h3 className="empty-materials-title">
                      {t("profile.myReviews")}
                    </h3>
                    <span className="empty-materials-description">
                      {t("profile.noAddedReviews")}
                    </span>
                  </div>
                </div>
              )
            ) : null}

            {role === "teacher" ? (
              <div className="review-contents-wrapper">
                {feedbacks?.map((el, index) => {
                  return (
                    <div key={index} className="reviewer-content-item">
                      {el.sender_image ? (
                        <img
                          className="reviewer-image"
                          src={el.sender_image}
                          alt="avatar"
                        />
                      ) : (
                        <img
                          className="reviewer-image"
                          src={defaultImg}
                          alt="avatar"
                        />
                      )}
                      <div className="reviewer-comment">
                        <h3 className="reviewer-comment-title">
                          {el.sender_name}
                        </h3>
                        <div className="reviewer-rating-for-tutor">
                          <Rating
                            name="read-only"
                            value={el.rate}
                            readOnly
                            className="rating"
                          />
                          <h4 className="reviewer-coment-time-ago">
                            {handleTimeAgo(el.created_at)}
                          </h4>
                        </div>
                        <p className="reviewer-comment-text">{el.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : feedbacks?.length ? (
              <div className="pupil-comments-wrapper">
                {feedbacks?.map((el, index) => {
                  return (
                    <div key={index} className="pupil-comments-item">
                      <img
                        className="receiver-image"
                        src={el.receiver_image ? el.receiver_image : defaultImg}
                        alt="avatar"
                      />
                      <div className="pupil-comment-body">
                        <div className="comment-header">
                          <div className="name-period-wrapper">
                            <h3 className="receiver-name">
                              {el.receiver_name}
                            </h3>
                            <span className="period">
                              {handleTimeAgo(el.created_at)}
                            </span>
                          </div>

                          <button
                            onClick={(event) =>
                              openHandleCommentPopover(event, el.id)
                            }
                            className="change-comment-btn"
                          >
                            {t("studentProfile.edit")}
                          </button>
                        </div>
                        <h3 className="receiver-subject">
                          {t("profile.subject")}: {handleSubject(el.subject_id)}
                        </h3>
                        <p className="comment-content">{el.text}</p>
                        <div className="rating">
                          <span className="rating-title">
                            {t("studentProfile.yourRate")}
                          </span>
                          <div>
                            <Rating name="read-only" value={el.rate} readOnly />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Popover
                  // style={{ width: "900px" }}
                  className="comment-popover"
                  open={Boolean(anchorHandleComment)}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "center",
                  }}
                >
                  <div className="comment-popover-header">
                    <h2 className="comment-popover-title">
                      {t("profile.myReviews")}
                    </h2>
                    <CloseIcon
                      onClick={() => closeHandleComment()}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  <div className="comment-popover-body">
                    <TextareaAutosize
                      ref={textareaAutoResize}
                      className="textarea-auto-size"
                      onChange={(e) => setTempCommentText(e.target.value)}
                      value={tempCommentText}
                      placeholder={t("viewTutor.writeReview") as string}
                    />
                  </div>
                  <div className="comment-popover-footer">
                    <h3 className="comment-rating-title">
                      {t("studentProfile.yourRate")}
                    </h3>
                    <Box
                      sx={{
                        marginTop: 1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Rating
                        size="large"
                        name="hover-feedback"
                        value={ratingValue}
                        precision={1}
                        getLabelText={getLabelText}
                        onChange={(event, value: number | null) => {
                          if (value !== null) setRatingValue(value);
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
                          {labels[hover !== -1 ? hover : value]}
                        </div>
                      )}
                    </Box>
                    <div className="confirm-comment-btn-wrapper">
                      <button
                        className="send-comment-btn"
                        onClick={sendUpdatedComment}
                      >
                        {t("studentProfile.send")}
                      </button>
                      <button className="cancel-change-comment-btn">
                        {t("profile.cancel")}
                      </button>
                    </div>
                  </div>
                </Popover>
              </div>
            ) : (
              <div className="empty-materials">
                <img src={EmptyCommentsICon} alt="empty_material_icon" />
                <div className="empty-materials-content">
                  <h3 className="empty-materials-title">
                    {t("profile.myReviews")}
                  </h3>
                  <span className="empty-materials-description">
                    {t("profile.noAddedReviews")}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        // mypupils & mystudents list
        return role === "teacher" ? <MyStudentsList /> : <MyTeachersList />;
      case 4:
        // My subscription tab content
        return role === "teacher" ? (
          <div className="subscription-content">
            {userSubscription == null ? (
              <h3 className="subscription-title">{t("profile.tariffs")}</h3>
            ) : (
              <h3 className="current-tariff-title">
                {t("profile.currentTariff")}
              </h3>
            )}
            {/* <div className="promocode">
              <input
                className="input-promocode"
                type="text"
                placeholder={t("profile.typePromocode") as string}
              />
              <button className="confirm-promocode-btn">
                {t("profile.verify")}
              </button>
            </div> */}
            {userSubscription ? (
              <CurrentTariff userSubscription={userSubscription} />
            ) : (
              <div className="subscription-items-wrapper">
                <div className="subscription-item">
                  <form className="radio-btns">
                    {tariffs &&
                      tariffs.map((el, index) => {
                        return (
                          <div key={index} className="radio-btn">
                            <span className="radio">
                              <input
                                name="price"
                                type="radio"
                                value={el.id}
                                onChange={(e) => {
                                  setPrice(e.target.value);
                                }}
                              />
                              {el.name[i18n.language as language]}
                            </span>
                            <span>{`${el.price} ${t("extra.sum")}`}</span>
                          </div>
                        );
                      })}
                  </form>
                  <div className="subscription-opportunity">
                    <div className="subscription-convenience-item">
                      <DoneAllIcon className="done-icon" />
                      <span className="convenience-type-content">
                        {t("profile.tarrifOpp#1")}
                      </span>
                    </div>
                    <div className="subscription-convenience-item">
                      <DoneAllIcon className="done-icon" />
                      <span className="convenience-type-content">
                        {t("profile.tarrifOpp#2")}
                      </span>
                    </div>
                    <div className="subscription-convenience-item">
                      <DoneAllIcon className="done-icon" />
                      <span className="convenience-type-content">
                        {t("profile.tarrifOpp#3")}
                      </span>
                    </div>
                    <div className="subscription-convenience-item">
                      <DoneAllIcon className="done-icon" />
                      <span className="convenience-type-content">
                        {t("profile.tarrifOpp#4")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="subscription-btn">
                  <div
                    className="btn"
                    onClick={() => {
                      handleOpen();
                    }}
                  >
                    {t("profile.buy")}
                  </div>
                </div>
              </div>
            )}

            {/* Popup for buy tariff */}
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <div className="payment-popover">
                <div className="upolad-popover-header">
                  <h2 className="upolad-popover-title">
                    {t("profile.paymentSystem")}
                  </h2>
                  <CloseIcon
                    onClick={() => handleClose()}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="payment-popover-body">
                  <div className="payment-methods">
                    {/* <div
                      onClick={() => setPaymentMethodId(1)}
                      className={`payment-method-item ${
                        paymentMethodId === 1 ? "active" : ""
                      }`}
                    >
                      <img src={Visa} alt="visa" />
                    </div>
                    <div
                      onClick={() => setPaymentMethodId(2)}
                      className={`payment-method-item ${
                        paymentMethodId === 2 ? "active" : ""
                      }`}
                    >
                      <img src={MasterCard} alt="mastercard" />
                    </div>
                    <div
                      onClick={() => setPaymentMethodId(3)}
                      className={`payment-method-item ${
                        paymentMethodId === 3 ? "active" : ""
                      }`}
                    >
                      <img src={Oson} alt="oson" />
                    </div> */}
                    <div
                      onClick={() => setPaymentMethodId(4)}
                      className={`payment-method-item ${
                        paymentMethodId === 4 ? "active" : ""
                      }`}
                    >
                      <img src={Click} alt="click" />
                    </div>
                    <div
                      onClick={() => setPaymentMethodId(5)}
                      className={`payment-method-item ${
                        paymentMethodId === 5 ? "active" : ""
                      }`}
                    >
                      <img src={Payme} alt="payme" />
                    </div>
                  </div>
                </div>
                <div className="payment-popover-footer">
                  <h3 className="offer">
                    {t("profile.agreement")}
                    <span>{t("profile.publicOffer")}</span>
                  </h3>
                  <div className="confirm-subscription-btn-wrapper">
                    <div
                      // target="blank"
                      // href={paymentMethodId ? `https://www.google.com/` : ""}
                      onClick={() => {
                        handleSubscriptionPay();
                      }}
                      className="subscribe-tariff-btn"
                    >
                      {t("profile.payment")}
                    </div>
                    <button
                      onClick={closeHandleTariff}
                      className="cancel-subscribtion-tariff-btn"
                    >
                      {t("profile.cancel")}
                    </button>
                  </div>
                </div>
              </div>
            </Dialog>
          </div>
        ) : (
          ""
        );
      default:
        return null;
    }
  };

  const openHandleCommentPopover = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    setAnchorHandleComment(event.currentTarget);
    setTempCommentText(
      feedbacks?.find((item) => item.id === id)?.text ?? "Comment"
    );
    setRatingValue(feedbacks?.find((item) => item.id === id)?.rate ?? 5);
    settempCommentId(id);
  };

  const closeHandleComment = () => {
    setAnchorHandleComment(null);
  };

  const closeHandleTariff = () => {
    setAnchorHandleTariff(false);
  };

  const handleSubscriptionPay = () => {
    if (price && paymentMethodId && paymentName) {
      fetch(`${base_url}/site/subscription/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          subscription_id: price,
          provider: paymentName[paymentMethodId - 1],
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success === true) {
            handleClose();
            result.data && window.open(result.data[0].link, "_blank")?.focus();
          } else {
            setTabId(0);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSubscription_id(null);
    setPaymentMethodId(null);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className="tab">
      <div className="tab-menu">
        {tabItems
          .filter(
            (item, index) =>
              (index !== 4 && role === "student") ||
              (role === "teacher" && index !== 4)
          )
          .map((item, index) => (
            <button
              key={index}
              className={`tab-menu-item-btn ${
                tabId === index && "active-btn"
              } ${index === 3 && "tab-item-for-mobile-tablet"}`}
              onClick={() => {
                setTabId(index);
              }}
            >
              {index === 3 && role
                ? t(
                    role === "student"
                      ? "studentProfile.myTutors"
                      : "profile.myStudents"
                  )
                : t(item as string)}
            </button>
          ))}
      </div>
      <div className="tab-content">{changeTabItem(tabId)}</div>
    </div>
  );
};

export default Tab;
