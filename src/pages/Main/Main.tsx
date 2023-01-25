import React, { useState, useEffect } from "react";
import { base_url, experiences } from "../../data";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/free-mode";
import "swiper/css";
import { Pagination, Navigation } from "swiper";
import "swiper/css/navigation";

import StarIcon from "@mui/icons-material/Star";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Dialog from "@mui/material/Dialog";

import { ReactComponent as SuccessSvg } from "../../assets/svg/successSent.svg";
import img2 from "../../assets/svg/search2.svg";
import mainImg from "../../assets/svg/img1.svg";
import mainImg2 from "../../assets/svg/Layer.svg";
import mainImg3 from "../../assets/svg/SubImg1.svg";
import mainImg4 from "../../assets/svg/defaultImg.png";
import mainImg5 from "../../assets/svg/OBJECTS.svg";
import mainImg6 from "../../assets/images/business-finance-girl 2.png";
import capabilities1 from "../../assets/svg/capabilities1.svg";
import capabilities2 from "../../assets/svg/capabilities2.svg";
import capabilities3 from "../../assets/svg/capabilities3.svg";
import capabilities4 from "../../assets/svg/capabilities4.svg";
import capabilities5 from "../../assets/svg/capabilities5.svg";
import capabilities6 from "../../assets/svg/capabilities6.svg";

import Footer from "../../components/Footer/Footer";

import "./main.scss";
import { changeFilter } from "../../redux/actions";
import { toast } from "react-toastify";
import { CountUp } from "countup.js";
import { Rating } from "@mui/material";
import {
  activeTutor,
  language,
  statistics,
  subjectItem,
} from "../../data/interfaces";
import { useAppSelector, useAppDispatch } from "../../hooks/useTypedSelector";
import Snowfall from "react-snowfall";

const Main = () => {
  const dispatch = useAppDispatch();
  const { filter, subjects, role } = useAppSelector((state) => state);
  const { t, i18n } = useTranslation();
  const [activeTutors, setActiveTutors] = useState<activeTutor[] | null>(null);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [open, setOpen] = React.useState(false);
  const [statistics, setStatistics] = React.useState<statistics | null>(null);
  //Contact Us
  const [faqQuestions, setFaqQuestions] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  const [contactName, setContactName] = useState<string>();
  const [contactPhone, setContactPhone] = useState<string>();
  const [contactMessage, setContactMessage] = useState<string>();
  const [prevEl, setPrevEl] = useState<HTMLDivElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLDivElement | null>(null);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const languageNames = [
    t("searchTutor.english"),
    t("searchTutor.russian"),
    t("searchTutor.uzbek"),
  ];

  const comments = [
    {
      name: "Shamsiyev Bekzod",
      img: mainImg4,
      rating_value: 5,
      comment:
        "Haqiqatda dolzarb va ayni bugungi kundagi eng kerakli servislardan biri bo’libdi. Men o’zim ham repetitorlik qilaman va farzandlarim uchun ham yaxshi repetitor doim axtaraman! Gettutor bilan endi bu muommolarim hal bo’ladigan bo’ldi, tashkilotchilarga rahmat! Omad yor bo’lsin!",
    },
    {
      name: "Alixo`jayev Islomxo`ja",
      img: mainImg4,
      rating_value: 5,
      comment:
        "3 nafar farzandim bor, bizdagi eng katta muommalardan biri, o’zimizning yashash joyimizga yaqin hududdan malakali repetitor topish edi. Bu servis orqali istalgan fandan repetitorlarni tanlab, saralab eng ma’qulini olish imkoniyati bor ekan. Mana bo’larkanu bizda ham shunaqa servislarni yaratsa! Barakalla, rahmat!",
    },
    {
      name: "Abdukhalilov Islom",
      img: mainImg4,
      rating_value: 5,
      comment:
        "Oliy toifali o’qituvchiman. Hozirda yosh farzandim borligi sababli ta’tildaman. Uyda utirib ham ishlab, ozgina bo’lsa ham daromad qilsam degandim. Gettutor platformasi ayni man istagan loyiha ekan. Saytda ro’yxatdan o’tib qo’ysangiz o’quvchilar o’zlari izlab toparkan, ularni soni ham ko’pligi esa quvonarli! Rahmat! ",
    },
  ];

  const capabilities = [
    {
      id: 1,
      img: capabilities1,
      title: t("main.freeReg"),
      info: t("main.freeReg#"),
    },
    {
      id: 2,
      img: capabilities2,
      title: t("main.verifiedTutors"),
      info: t("main.verifiedTutors#"),
    },
    {
      id: 3,
      img: capabilities3,
      title: t("main.learn"),
      info: t("main.learn#"),
    },
    {
      id: 4,
      img: capabilities4,
      title: t("main.earn"),
      info: t("main.earn#"),
    },
    {
      id: 5,
      img: capabilities5,
      title: t("main.rating"),
      info: t("main.rating#"),
    },
    {
      id: 6,
      img: capabilities6,
      title: t("main.searchOptions"),
      info: t("main.searchOptions#"),
    },
  ];

  useEffect(() => {
    fetch(`${base_url}/site/statistics/home`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((result) => {
        setStatistics(result.data[0] as statistics);
      })
      .catch((err) => {
        console.log(err);
      });
    if (statistics) {
      const subjectsCounter = new CountUp(
        "subjectsCounterID",
        statistics.subjects,
        {
          enableScrollSpy: true,
        }
      );
      subjectsCounter.start();
      const coursesCounter = new CountUp(
        "coursesCounterID",
        statistics.courses,
        {
          enableScrollSpy: true,
        }
      );
      coursesCounter.start();
      const usersCounterID = new CountUp("usersCounterID", statistics.users, {
        enableScrollSpy: true,
      });
      usersCounterID.start();
      const reviewsCounter = new CountUp(
        "reviewsCounterID",
        statistics.reviews,
        {
          enableScrollSpy: true,
        }
      );
      reviewsCounter.start();
    }
  }, []);

  useEffect(() => {
    fetch(`${base_url}/site/courses/popular`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((result) => {
        setActiveTutors(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleContact = () => {
    fetch(`${base_url}/site/contact/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: contactName,
        phone: `+998${contactPhone}`,
        message: contactMessage,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          setContactName("");
          setContactPhone("");
          setContactMessage("");
          handleClickOpen();
        }
      })
      .catch((err) => {
        toast.error(t("extra.error"));
      });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactPhone(e.target.value.replace(/\D/g, "").substring(0, 9));
    formatToPhone(e);
  };

  const formatToPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    // format for phone (+998) 99 9999999
    const input = e.target.value.replace(/\D/g, "").substring(0, 12); // First ten digits of input only
    const areaCode = input.substring(0, 3);
    const middle = input.substring(3, 5);
    const last = input.substring(5, 8);
    const double_first = input.substring(8, 10);
    const double_second = input.substring(10, 12);

    if (input.length > 10) {
      e.target.value = `(+${areaCode}) ${middle} ${last}-${double_first}-${double_second}`;
    } else if (input.length > 8) {
      e.target.value = `(+${areaCode}) ${middle} ${last}-${double_first}`;
    } else if (input.length > 5) {
      e.target.value = `(+${areaCode}) ${middle} ${last}`;
    } else if (input.length > 3) {
      e.target.value = `(+${areaCode}) ${middle}`;
    } else if (input.length > 0) {
      e.target.value = `(+${areaCode})`;
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const swiperConfig = {
    1440: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 2,
    },
    375: {
      slidesPerView: 1,
    },
  };

  return (
    <div
      className="main-container"
      itemScope
      itemType="https://schema.org/WebPage"
    >
      {window.innerWidth > 768 && (
        <Snowfall
          color="rgb(171, 220, 255)"
          style={{
            zIndex: 2,
            position: "fixed",
            width: "100vw",
            height: "100vh",
          }}
          snowflakeCount={100}
          speed={[0.5, 2]}
          wind={[-0.5, 0.5]}
        />
      )}

      <div className="main">
        <div
          className="main-info "
          data-aos={window.innerWidth > 767 ? "fade-right" : "fade-up"}
          data-aos-duration="1000"
        >
          <div className="main-info-title">{t("main.tutoringServices")}</div>
          <div className="main-info-p">
            <div>{t("main.mainTitle1")}</div>
            <div>{t("main.mainTitle2")}</div>
          </div>
          <div className="main-info-btns">
            <Link
              className="main-info-btn-1"
              to={
                role === "student" || role === "teacher"
                  ? "/tutors"
                  : "/registration"
              }
              style={{ color: "#fff" }}
            >
              {t("main.searchTutor")}
            </Link>
            {(role === null || role === "teacher") && (
              <Link
                to={
                  role === "teacher" ? "/teacher-profile-data" : "/registration"
                }
                className="main-info-btn"
              >
                {t("main.becomeTutor")}
              </Link>
            )}
          </div>
        </div>
        <div
          className="main-images"
          data-aos={window.innerWidth > 767 ? "fade-left" : "fade-up"}
          data-aos-duration="1000"
        >
          <img className="main-image" src={mainImg} alt="mainImg" />
        </div>
      </div>
      <div className="about " id="about">
        <div className="about-part">
          <img
            src={mainImg2}
            alt="mainImg2"
            className="about-img"
            data-aos={window.innerWidth > 1439 ? "fade-right" : "fade-up"}
            data-aos-duration="1000"
          />
          <div
            className="about-content"
            data-aos={window.innerWidth > 1439 ? "fade-left" : "fade-up"}
            data-aos-duration="1000"
          >
            <div className="about-content-title">{t("main.aboutProject")}</div>
            <div className="about-content-p">
              {t("main.aboutProject#1")}
              <br />
              <br /> {t("main.aboutProject#2")}
              <br />
              <br />
              {t("main.aboutProject#3")} <br />
              <br />
              {t("main.aboutProject#4")}
            </div>
          </div>
        </div>
        <div className="about-counts">
          {statistics && statistics.subjects && (
            <div
              className="about-count"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay={100}
            >
              <div className="about-count-h2">{statistics.subjects}</div>
              <div className="about-count-h3">{t("main.subject")}</div>
              <div className="about-count-p">{t("main.about#Subjects")}</div>
            </div>
          )}
          {statistics && statistics.courses && (
            <div
              className="about-count"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay={200}
            >
              <div className="about-count-h2">{statistics.courses}</div>
              <div className="about-count-h3">{t("main.tutors")}</div>
              <div className="about-count-p">{t("main.about#Tutors")}</div>
            </div>
          )}
          {statistics && statistics.users && (
            <div
              className="about-count"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay={300}
            >
              <div className="about-count-h2">{statistics.users}</div>
              <div className="about-count-h3">{t("main.students")}</div>
              <div className="about-count-p">{t("main.about#Pupil")}</div>
            </div>
          )}
          {statistics && statistics.reviews ? (
            <div
              className="about-count"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay={400}
            >
              <div className="about-count-h2">{statistics.reviews}</div>
              <div className="about-count-h3">{t("main.reviews")}</div>
              <div className="about-count-p">{t("main.about#Comment")}</div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="capabilities-container" id="capabilities-container">
        <div className="capabilities ">
          <div
            className="capabilities-title"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            {t("main.opportunities")}
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            className="capabilities-hr"
          >
            <hr />
          </div>
          <div className="capabilities-cards">
            {capabilities.map((el, index) => {
              return (
                <div
                  key={index}
                  className="capabilities-card"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay={(index + 1) * 100}
                >
                  <div className="capabilities-card-img">
                    <img src={el.img} alt="photoAlternative" />
                  </div>
                  <div className="capabilities-card-title">{el.title}</div>
                  <div className="capabilities-card-p">{el.info}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="subjects-container">
        <div className="subjects" id="subjects">
          <div
            className="subjects-title"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            {t("main.subjects")}
          </div>
          <div className="subjects-cards ">
            {subjects && subjects.is_homepage.length > 0
              ? subjects.is_homepage.map((el, index) => {
                  return (
                    <Link
                      key={index}
                      data-aos="fade-up"
                      data-aos-duration="1000"
                      data-aos-delay={(index + 1) * 100}
                      to={
                        role === "student" || role === "teacher"
                          ? `/tutors`
                          : "/registration"
                      }
                      onClick={() => {
                        dispatch(
                          changeFilter({
                            ...filter,
                            subject: {
                              ...filter.subject,
                              value: el.id,
                              isValid: true,
                              name: "index",
                            },
                          })
                        );
                      }}
                      className="subjects-card"
                    >
                      <img
                        src={el.icon ?? mainImg3}
                        alt="photoAlternative"
                        className="subjects-card-img"
                      />
                      <div className="subjects-card-info">
                        <div className="subjects-card-info-title">
                          {el.name[i18n.language as language]}
                        </div>
                        <div className="subjects-card-info-p">
                          {el.quantity}{" "}
                          {el.quantity === 1 || el.quantity === 0
                            ? t("main.tutor")
                            : t("main.tutors#2")}
                        </div>
                      </div>
                    </Link>
                  );
                })
              : null}
          </div>
          <div className="subjects-btn-div ">
            <Link
              className="subjects-btn button-hover"
              data-aos="fade-up"
              data-aos-duration="1000"
              to={"/subjects"}
            >
              {t("main.allSubjects")}
              <div className="subjects-btn-img"></div>
            </Link>
          </div>
        </div>
      </div>
      <div className="tutor-container">
        <div className="tutor">
          <div
            className="tutor-title"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            {t("main.activeTutors")}
          </div>
          <div className="tutor-slider ">
            {/* ___________________________________________ */}
            <Swiper
              spaceBetween={10}
              breakpoints={swiperConfig}
              className="mySwiper"
              pagination={{
                dynamicBullets: true,
              }}
              navigation={{ prevEl, nextEl }}
              modules={[Pagination, Navigation]}
            >
              {activeTutors
                ? activeTutors.map((el, index) => {
                    return (
                      <SwiperSlide key={index + 1}>
                        <div
                          className="tutor-slider-item"
                          data-aos="fade-up"
                          data-aos-duration="1000"
                          data-aos-delay={(index + 1) * 100}
                        >
                          <div className="tutor-slider-item-title">
                            {el?.file ? (
                              <img
                                src={el?.file}
                                alt="photoAlternative"
                                className="tutor-slider-item-title-img"
                              />
                            ) : (
                              <img
                                src={mainImg4}
                                alt="photoAlternative"
                                className="tutor-slider-item-title-img"
                              />
                            )}
                            <div className="tutor-slider-item-title-info">
                              <h2 className="tutor-slider-item-title-info-h2">
                                {el.teacher_name}
                                {el.verified_teacher && (
                                  <img src={img2} alt="img2" />
                                )}
                              </h2>
                              <p className="tutor-slider-item-title-info-p">
                                {t("viewTutor.certifiedTutor")}
                              </p>
                              <h3 className="tutor-slider-item-title-info-h3">
                                {t("searchTutor.rating")}
                                <StarIcon
                                  sx={{ fill: "#FFD700", width: "20px" }}
                                />
                                {Math.floor(el.rating * 10) / 10}
                              </h3>
                              <h4 className="tutor-slider-item-title-info-h4">
                                <StarIcon
                                  sx={{ fill: "#FFD700", width: "25px" }}
                                />
                                {Math.floor(el.rating * 10) / 10}
                              </h4>
                            </div>
                          </div>
                          <div className="tutor-slider-item-body">
                            <div className="tutor-slider-item-body-div">
                              <div className="tutor-slider-item-body-th">
                                {t("searchTutor.subject")}:
                              </div>
                              <div className="tutor-slider-item-body-tb">
                                {subjects && el.subject_id && subjects.isFetched
                                  ? subjects.allData.find(
                                      (item: subjectItem) =>
                                        item.id === el.subject_id
                                    )?.name[i18n.language as language]
                                  : null}
                              </div>
                            </div>
                            <div className="tutor-slider-item-body-div">
                              <div className="tutor-slider-item-body-th">
                                {t("searchTutor.workExperience")}:
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
                                {t("searchTutor.languages")}:
                              </div>
                              <div className="tutor-slider-item-body-tb">
                                {el.language_ids &&
                                  el.language_ids
                                    .map((item) => {
                                      return languageNames[item - 1];
                                    })
                                    .join(", ")}
                              </div>
                            </div>
                            <div className="tutor-slider-item-body-div">
                              <div className="tutor-slider-item-body-th">
                                {t("searchTutor.classes")}:
                              </div>
                              <div className="tutor-slider-item-body-tb">
                                {el.hourly_rate} <span></span>
                                {el.hourly_rate_type === 1
                                  ? t("searchTutor.pricePerHour2")
                                  : t("searchTutor.pricePerHour")}
                              </div>
                            </div>
                          </div>
                          <Link
                            to={
                              role === "student" || role === "teacher"
                                ? `/tutors/view/${el?.teacher_id}`
                                : "/registration"
                            }
                            className="tutor-slider-item-btn-div button-hover"
                          >
                            <div className="tutor-slider-item-btn">
                              {t("main.showProfile")}
                            </div>
                          </Link>
                        </div>
                      </SwiperSlide>
                    );
                  })
                : null}
            </Swiper>
            <div className="slider-btns">
              <div
                ref={(node) => setPrevEl(node)}
                className="swiper-button-prev"
              ></div>
              <div
                ref={(node) => setNextEl(node)}
                className="swiper-button-next"
              ></div>
            </div>

            {/* ___________________________________________ */}
          </div>
          <div className="tutor-btn-div">
            <Link
              to={
                role === "student" || role === "teacher"
                  ? "/tutors"
                  : "/registration"
              }
              className="tutor-btn button-hover "
            >
              {t("main.searchTutor")}
              <div className="tutor-btn-img"></div>
            </Link>
          </div>
        </div>
      </div>
      <div className="sugestion-container ">
        <div className="sugestion">
          <div
            className="sugestion-content"
            data-aos={window.innerWidth > 767 ? "fade-right" : "fade-up"}
            data-aos-duration="1000"
          >
            <div className="sugestion-content-h2">{t("main.inviteTutors")}</div>
            <div className="sugestion-content-p">{t("main.inviteTutors#")}</div>
            <Link
              to={
                role === "teacher"
                  ? "/teacher-profile-data"
                  : role === "student"
                  ? "/"
                  : "/registration"
              }
              onClick={() => {
                if (role === "student") {
                  toast.error(t("🤨 Siz o'qituvchi emassiz"));
                }
              }}
              className="sugestion-content-btn button-hover"
            >
              {t("main.becomeTutor")}
            </Link>
          </div>
          <img
            data-aos={window.innerWidth > 767 ? "fade-left" : "zoom"}
            data-aos-duration="1000"
            className="sugestion-img"
            src={mainImg6}
            alt="photoAlternative"
          />
        </div>
      </div>
      <div className="questions" itemType="https://schema.org/FAQPage">
        <div
          className="questions-title "
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay={100}
        >
          {t("main.FAQ")}
        </div>
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay={200}
          className="questions-content"
        >
          <div className="questions-content-div ">
            {faqQuestions &&
              faqQuestions
                .filter((el) => el <= 5)
                .map((el, index) => {
                  return (
                    <Accordion
                      key={index}
                      expanded={expanded === `panel${el}`}
                      onChange={handleChange(`panel${el}`)}
                      sx={{ margin: "10px !important" }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <div className="questions-content-div-icon">
                            <ExpandMoreIcon />
                          </div>
                        }
                        aria-controls={`panel${el}bh-content`}
                        id={`panel${el}bh-header`}
                      >
                        <Typography
                          sx={{
                            height: "64px",
                            display: "flex",
                            alignItems: "center",
                            marginLeft: "10px",
                            fontWeight: 600,
                            fontSize:
                              "clamp(0.875rem, 0.787rem + 0.3756vw, 1.125rem)",
                            lineHeight: "1.3",
                          }}
                        >
                          {t(`main.question#${el}`)}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          sx={{
                            fontWeight: "400",
                            fontSize:
                              "clamp(0.875rem, 0.809rem + 0.2817vw, 1.0625rem)",
                            lineHeight: "1.3",
                            display: "flex",
                            alignItems: "center",
                            color: "rgba(0, 0, 0, 0.68)",
                            marginLeft: "10px",
                          }}
                        >
                          {t(`main.question${el}`)}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
          </div>
          <div className="questions-content-div ">
            {faqQuestions &&
              faqQuestions
                .filter((el) => el <= 10 && el > 5)
                .map((el, index) => {
                  return (
                    <Accordion
                      key={index}
                      expanded={expanded === `panel${el}`}
                      onChange={handleChange(`panel${el}`)}
                      sx={{ margin: "10px !important" }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <div className="questions-content-div-icon">
                            <ExpandMoreIcon />
                          </div>
                        }
                        aria-controls={`panel${el}bh-content`}
                        id={`panel${el}bh-header`}
                      >
                        <Typography
                          sx={{
                            height: "64px",
                            display: "flex",
                            alignItems: "center",
                            marginLeft: "10px",
                            fontWeight: 600,
                            fontSize:
                              "clamp(0.875rem, 0.787rem + 0.3756vw, 1.125rem)",
                            lineHeight: "1.3",
                          }}
                        >
                          {t(`main.question#${el}`)}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          sx={{
                            fontWeight: "400",
                            fontSize:
                              "clamp(0.875rem, 0.809rem + 0.2817vw, 1.0625rem)",
                            lineHeight: "1.3",
                            display: "flex",
                            alignItems: "center",
                            color: "rgba(0, 0, 0, 0.68)",
                            marginLeft: "10px",
                          }}
                        >
                          {t(`main.question${el}`)}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
          </div>
        </div>
      </div>
      <div className="opinion-container ">
        <div className="opinion">
          <div
            className="opinion-title"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            {t("main.usersOpinion")}
          </div>
          <div className="opinion-slider">
            {/* ___________________________________________ */}
            <Swiper
              spaceBetween={5}
              breakpoints={swiperConfig}
              className="mySwiper"
              pagination={{
                dynamicBullets: true,
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
            >
              {comments.map((item, index) => {
                return (
                  <div className="container_image" key={index}>
                    <SwiperSlide key={index}>
                      <div
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay={(index + 1) * 100}
                        // onClick={handleView}
                        className="opinion-slider-item"
                        itemProp="review"
                        itemScope
                        itemType="https://schema.org/Review"
                      >
                        <div className="opinion-slider-item-title">
                          <img
                            src={item.img}
                            alt="photoAlternative"
                            className="opinion-slider-item-title-img"
                          />
                          <div className="opinion-slider-item-title-info">
                            <h2
                              itemProp="author"
                              className="opinion-slider-item-title-info-h2"
                            >
                              {item.name}
                            </h2>
                            {/* <h3 className="opinion-slider-item-title-info-h3">
                              ⭐️ ⭐️ ⭐️ ⭐️
                            </h3> Removed by Bekzod */}
                            <Rating
                              className="comment-rating"
                              value={item.rating_value}
                              readOnly
                              itemProp="reviewRating"
                            ></Rating>
                          </div>
                        </div>
                        <div
                          className="opinion-slider-item-body"
                          itemProp="reviewBody"
                        >
                          {item.comment}
                        </div>
                      </div>
                    </SwiperSlide>
                  </div>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
      <div className="contact ">
        <div
          className="contact-content "
          data-aos="fade-right"
          data-aos-duration="1000"
        >
          <div className="contact-title">
            <h2 className="contact-title-h2">{t("main.questions")}</h2>
            <p className="contact-title-p">{t("main.fillForm")}</p>
          </div>
          <div className="contact-body">
            <input
              value={contactName}
              onChange={(e) => {
                setContactName(e.target.value);
              }}
              type="text"
              className="contact-body-name"
              placeholder={String(t("main.yourName"))}
            />
            <div className="contact-body-phone">
              <span
                style={
                  contactPhone
                    ? { color: "black" }
                    : { color: "rgb(117 117 117)" }
                }
              >
                +998
              </span>
              <input
                value={contactPhone}
                required={true}
                onChange={(e) => {
                  handlePhoneChange(e);
                }}
                placeholder={String(t("main.typeNumber"))}
              />
            </div>

            <textarea
              value={contactMessage}
              onChange={(e) => {
                setContactMessage(e.target.value);
              }}
              className="contact-body-message"
              placeholder={String(t("main.message"))}
            />
          </div>
          <div className="contact-footer">
            <button
              className="contact-footer-btn button-hover"
              onClick={() => {
                if (contactName !== "" && contactMessage !== "") {
                  handleContact();
                } else {
                  toast.error("error");
                }
              }}
            >
              {t("main.send")}
            </button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <div className="success">
                <SuccessSvg />
                <h4>{t("main.sent")}</h4>
                <button onClick={() => setOpen(false)}>{t("main.good")}</button>
              </div>
            </Dialog>
          </div>
        </div>
        <img
          src={mainImg5}
          alt="photoAlternative"
          className="contact-img "
          data-aos="fade-left"
          data-aos-duration="1000"
        />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
