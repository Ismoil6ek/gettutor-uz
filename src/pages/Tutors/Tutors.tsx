import React, { useState, useEffect } from "react";
import { base_url, experiences } from "../../data";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Mui
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Select,
  Rating,
  Dialog,
  Box,
  Slider,
  Popover,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
// Components
import Footer from "../../components/Footer/Footer";
import Pagination from "../../components/Pagination/Pagination";

// style
import "./tutors.scss";

// images
import { ReactComponent as Like } from "../../assets/svg/like.svg";
import img1 from "../../assets/svg/defaultImg.png";
import img2 from "../../assets/svg/search2.svg";
import x from "../../assets/svg/x.svg";
import searchIcon from "../../assets/svg/searchIcon.svg";
import notFound from "../../assets/svg/magnifying-glass.svg";
import searchArrow from "../../assets/svg/down-arrow-svgrepo-com.svg";
import experienceTick from "../../assets/svg/experienceTick.svg";
import InnerLoader from "../../components/Loader/Loader";
import { changeFilter } from "../../redux/actions";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import {
  language,
  languages,
  tutor,
  pagination,
  priceValue,
} from "../../data/interfaces";

const AboutTeacher = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    filter,
    languages,
    subjects,
    countries,
    regions,
    studyTypes,
    education,
    degree,
    certificates,
  } = useAppSelector((state) => state);
  const { id } = useParams();
  const [openn, setOpenn] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const [priceValues, setPriceValues] = React.useState<priceValue | null>(null);
  const [price, setPrice] = useState<number[]>([]);
  // ______________________________________________
  const [tutor, setTutor] = useState<tutor[] | null>(null);
  const [searchSubject, setSearchSubject] = useState("");
  const [userId, setUserId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<pagination | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const weeksArr = [
    { name: t("extra.Mon"), id: 0 },
    { name: t("extra.Tue"), id: 1 },
    { name: t("extra.Wed"), id: 2 },
    { name: t("extra.Thu"), id: 3 },
    { name: t("extra.Fri"), id: 4 },
    { name: t("extra.Su"), id: 5 },
    { name: t("extra.Sun"), id: 6 },
  ];

  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 20000,
      label: "20000",
    },
    {
      value: 50000,
      label: "50000",
    },
    {
      value: 70000,
      label: "70000",
    },
  ];

  useEffect(() => {
    fetch(`${base_url}/site/courses/value`, {
      method: "GET",
      headers: {
        "Accept-Language": "uz",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          setPriceValues(result.data);
        }
        if (result.length === 0) {
          setLoading(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    let url = `${base_url}/site/courses/search?page=${currentPage}&perPage=10&price_type=${filter.currency.value}`;

    for (const [key, element] of Object.entries(filter)) {
      type Key = keyof typeof filter;
      if (filter[key as Key].isValid) {
        if (
          key === "byPrice" ||
          key === "byEducation" ||
          key === "byDegree" ||
          key === "weekArray"
        ) {
          url += element.url;
        } else if (key === "experience") {
          url += element.url + element.value + element.url + element.value;
        } else {
          url += element.url + element.value;
        }
      }
    }
    console.log(url);

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          setTutor(result.data);
          setLoading(true);
          setPagination(result._meta);
        }
        if (result.length === 0) {
          setLoading(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // eslint-disable-next-line
  }, [filter, userId, currentPage, filter.search.value]);

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
    setOpenn(true);
  };

  const handleClose = () => {
    setOpenn(false);
  };
  const handleFilterResultView = () => {
    setOpenn(false);
    if (price.length !== 0) {
      dispatch(
        changeFilter({
          ...filter,
          byPrice: {
            ...filter.byPrice,
            value: price,
            name: `${price[0]} - ${price[1]} ${
              filter.currency.value === 0 ? t("searchTutor.sum") : "USD"
            }`,
            isValid: true,
            url: `&price[]=${price[0]}&price[]=${price[1]}`,
          },
        })
      );
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseClick = () => {
    setAnchorEl(null);
  };

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked === true) {
      dispatch(
        changeFilter({
          ...filter,
          byEducation: {
            value: [...filter.byEducation.value, Number(e.target.value)],
            url: [...filter.byEducation.value, e.target.value]
              .map((el) => `&education[]=${el}`)
              .join(""),
            isValid: true,
          },
        })
      );
    } else {
      dispatch(
        changeFilter({
          ...filter,
          byEducation: {
            value: filter.byEducation.value.filter(
              (el) => el !== Number(e.target.value)
            ),
            url: filter.byEducation.value
              .filter((el) => el !== Number(e.target.value))
              .map((el) => `&education[]=${el}`)
              .join(""),
            isValid: filter.byEducation.value.length > 1,
          },
        })
      );
    }
  };

  const handleDegreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked === true) {
      dispatch(
        changeFilter({
          ...filter,
          byDegree: {
            value: [...filter.byDegree.value, Number(e.target.value)],
            url: [...filter.byDegree.value, e.target.value]
              .map((el) => `&degree[]=${el}`)
              .join(""),
            isValid: true,
          },
        })
      );
    } else {
      dispatch(
        changeFilter({
          ...filter,
          byDegree: {
            value: filter.byDegree.value.filter(
              (el) => el !== Number(e.target.value)
            ),
            url: filter.byDegree.value
              .filter((el) => el !== Number(e.target.value))
              .map((el) => `&degree[]=${el}`)
              .join(""),
            isValid: filter.byDegree.value.length > 0 ? true : false,
          },
        })
      );
    }
  };

  useEffect(() => {
    if (filter.byEducation.value.length === 0) {
      dispatch(
        changeFilter({
          ...filter,
          byDegree: { ...filter.byDegree, value: [], url: "", isValid: false },
        })
      );
    }
    // eslint-disable-next-line
  }, [filter.byEducation]);

  const handleChangeWeek = (weekId: number) => {
    if (filter.weekArray.value.includes(weekId)) {
      dispatch(
        changeFilter({
          ...filter,
          weekArray: {
            ...filter.weekArray,
            value: filter.weekArray.value.filter((item) => item !== weekId),
            url: filter.weekArray.value
              .filter((item) => item !== weekId)
              .map((item) => `&schedule[]=${item}`)
              .join(""),
            isValid: true,
          },
        })
      );
    } else {
      dispatch(
        changeFilter({
          ...filter,
          weekArray: {
            ...filter.weekArray,
            value: [...filter.weekArray.value, weekId],
            url: [...filter.weekArray.value, weekId]
              .map((item) => `&schedule[]=${item}`)
              .join(""),
            isValid: [...filter.weekArray.value, weekId].length > 0,
          },
        })
      );
    }
  };

  const open = Boolean(anchorEl);

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
      Array.forEach((number) => {
        const found = studyTypes.find((item) => item.id === number)?.name[
          i18n.language as language
        ];

        if (found !== undefined) {
          temp.push(found);
        }
      });
    }

    return temp.join(", ");
  };

  const checkFilterActive = () => {
    let isActive = false;

    // eslint-disable-next-line
    for (const [_, value] of Object.entries(filter)) {
      if (value.isValid) {
        isActive = true;
        continue;
      }
    }

    return isActive;
  };

  return (
    <div className="tutors-container">
      <div className="tutors-title">
        <div className="tutors-title-h2">{t("searchTutor.tutors")}</div>
        <div className="advanced-search-container">
          <div
            className="advanced-search"
            onClick={() => {
              handleClickOpen();
            }}
          >
            {t("searchTutor.advancedOptions")}
          </div>
        </div>

        <div className="advanced-search-2">
          <input
            className="tutors-nav-search"
            type="search"
            value={filter.search.value}
            onChange={(e) => {
              dispatch(
                changeFilter({
                  ...filter,
                  search: {
                    ...filter.search,
                    value: e.target.value,
                    isValid: Boolean(e.target.value),
                  },
                })
              );
            }}
            placeholder={String(t("searchTutor.searchByName"))}
          />
          <div
            className={
              checkFilterActive()
                ? "advanced-search-2-btn active"
                : "advanced-search-2-btn"
            }
            onClick={() => {
              handleClickOpen();
            }}
          >
            <div> </div>
            {t("extra.filter")}
          </div>
        </div>
        <Dialog
          open={openn}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className="advanced-search-popup">
            <div className="title">
              <h2 className="title-h2">{t("searchTutor.advancedOptions")}</h2>
              <div
                onClick={() => setOpenn(false)}
                className="title-close"
              ></div>
            </div>
            <div className="categories">
              <div className="tutors-searh-filter">
                {filter.subject.value && (
                  <div className="tutors-searh-filter-item">
                    {subjects &&
                      subjects.allData
                        .filter((el) => el.id === filter.subject.value)
                        .map((el) => {
                          return el.name[i18n.language as language];
                        })}
                    <img
                      src={x}
                      alt="clear"
                      onClick={() => {
                        dispatch(
                          changeFilter({
                            ...filter,
                            subject: {
                              ...filter.subject,
                              isValid: false,
                              name: "",
                              value: "",
                            },
                          })
                        );
                      }}
                    />
                  </div>
                )}
                {filter.gender.value ? (
                  <div className="tutors-searh-filter-item">
                    {t(filter.gender.name)}
                    <img
                      src={x}
                      alt="clear"
                      onClick={() => {
                        dispatch(
                          changeFilter({
                            ...filter,
                            gender: {
                              ...filter.gender,
                              value: "",
                              name: "",
                              isValid: false,
                            },
                          })
                        );
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
                {filter.studyType.value !== "" && (
                  <div className="tutors-searh-filter-item">
                    {studyTypes.length > 0 &&
                      studyTypes
                        .filter((item) => {
                          return (
                            item.id === filter.studyType.value &&
                            item.name[i18n.language as language]
                          );
                        })
                        .map((item) => {
                          return item.name[i18n.language as language];
                        })}
                    <img
                      src={x}
                      alt="clear"
                      onClick={() => {
                        dispatch(
                          changeFilter({
                            ...filter,
                            studyType: {
                              ...filter.studyType,
                              value: "",
                              name: "",
                              isValid: false,
                            },
                          })
                        );
                      }}
                    />
                  </div>
                )}
                {filter.experience.value && (
                  <div className="tutors-searh-filter-item">
                    {experiences
                      .filter((el) => filter.experience.value === el.value)
                      .map((i) => {
                        return i.name + " " + t("searchTutor.year");
                      })}
                    <img
                      src={x}
                      alt="clear"
                      onClick={() =>
                        dispatch(
                          changeFilter({
                            ...filter,
                            experience: {
                              ...filter.experience,
                              value: "",
                              isValid: false,
                            },
                          })
                        )
                      }
                    />
                  </div>
                )}
                {filter.byLanguage.value !== "" && (
                  <div className="tutors-searh-filter-item">
                    {languages
                      ? languages
                          .filter((el) => filter.byLanguage.value === el.id)
                          .map((item) => {
                            return item.name[i18n.language as language];
                          })
                      : ""}
                    <img
                      src={x}
                      alt="clear"
                      onClick={() => {
                        dispatch(
                          changeFilter({
                            ...filter,
                            byLanguage: {
                              ...filter.byLanguage,
                              value: "",
                              isValid: false,
                            },
                          })
                        );
                      }}
                    />
                  </div>
                )}
                {filter.byCountry.value !== "" && (
                  <div className="tutors-searh-filter-item">
                    {t(
                      `location.location#${filter.byCountry.value}.location#${filter.byCountry.value}`
                    )}
                    <img
                      src={x}
                      alt="clear"
                      onClick={() => {
                        dispatch(
                          changeFilter({
                            ...filter,
                            byRegion: {
                              ...filter.byRegion,
                              isValid: false,
                              value: "",
                            },
                            byCountry: {
                              ...filter.byCountry,
                              isValid: false,
                              value: "",
                            },
                          })
                        );
                      }}
                    />
                  </div>
                )}
                {filter.byRegion.value !== "" &&
                  filter.byCountry.value !== null && (
                    <div className="tutors-searh-filter-item">
                      {t(
                        `location.location#${filter.byCountry.value}.location#${filter.byCountry.value}#${filter.byRegion.value}`
                      )}
                      <img
                        src={x}
                        alt="clear"
                        onClick={() => {
                          dispatch(
                            changeFilter({
                              ...filter,
                              byRegion: {
                                ...filter.byRegion,
                                isValid: false,
                                value: "",
                              },
                            })
                          );
                        }}
                      />
                    </div>
                  )}
                {filter.byPrice.url !== "" && (
                  <div className="tutors-searh-filter-item">
                    {filter.byPrice.name}
                    <img
                      src={x}
                      alt="clear"
                      onClick={() => {
                        setPrice([]);
                        dispatch(
                          changeFilter({
                            ...filter,
                            byPrice: {
                              ...filter.byPrice,
                              value: [0, 0],
                              name: "",
                              isValid: false,
                              url: "",
                            },
                          })
                        );
                      }}
                    />
                  </div>
                )}
                {filter.byEducation.url !== "" && (
                  <div className="tutors-searh-filter-item">
                    {t("form.education")}
                    <img
                      src={x}
                      alt="clear"
                      onClick={() => {
                        dispatch(
                          changeFilter({
                            ...filter,
                            byEducation: {
                              ...filter.byEducation,
                              url: "",

                              isValid: false,
                              value: [],
                            },
                          })
                        );
                      }}
                    />
                  </div>
                )}
                {filter.byDegree.url !== "" && (
                  <div className="tutors-searh-filter-item">
                    {t("form.category2")}
                    <img
                      src={x}
                      alt="clear"
                      onClick={() => {
                        dispatch(
                          changeFilter({
                            ...filter,
                            byDegree: {
                              ...filter.byDegree,
                              url: "",
                              value: [],
                              isValid: false,
                            },
                          })
                        );
                      }}
                    />
                  </div>
                )}
                {filter.weekArray.value.length > 0 && (
                  <div className="tutors-searh-filter-item">
                    {t("extra.SchoolDays")}
                    <img
                      src={x}
                      alt="clear"
                      onClick={() => {
                        dispatch(
                          changeFilter({
                            ...filter,
                            weekArray: {
                              ...filter.weekArray,
                              value: [],
                              url: "",
                              isValid: false,
                            },
                          })
                        );
                      }}
                    />
                  </div>
                )}
                {filter.certificateName.value !== "" && (
                  <div className="tutors-searh-filter-item">
                    {certificates &&
                      certificates
                        .filter((el) => el.id === filter.certificateName.value)
                        .map(
                          (el) =>
                            `${el.name} ${
                              filter.certificateScore.value !== null
                                ? el.values[filter.certificateScore.value]
                                : ""
                            }`
                        )}
                    <img
                      src={x}
                      alt="clear"
                      onClick={() => {
                        dispatch(
                          changeFilter({
                            ...filter,
                            certificateName: {
                              ...filter.certificateName,
                              value: "",
                              isValid: false,
                            },
                            certificateScore: {
                              ...filter.certificateScore,
                              value: null,
                              isValid: false,
                            },
                          })
                        );
                      }}
                    />
                  </div>
                )}
              </div>
              <hr />
              <div className="by-subject">
                <div className="subject">
                  <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-filled-label">
                      {t("searchTutor.subject")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={filter.subject.value}
                      onChange={(e) => {
                        dispatch(
                          changeFilter({
                            ...filter,
                            subject: {
                              ...filter.subject,
                              value: e.target.value,
                              isValid: true,
                            },
                            certificateName: {
                              ...filter.certificateName,
                              value: "",
                              isValid: false,
                            },
                            certificateScore: {
                              ...filter.certificateScore,
                              value: null,
                              isValid: false,
                            },
                          })
                        );
                      }}
                    >
                      {subjects &&
                        subjects.allData.map((el, index) => {
                          return (
                            <MenuItem key={index} value={el?.id}>
                              {el?.name[i18n.language as language]}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </div>
                <div className="by-certificate">
                  <FormControl
                    variant="filled"
                    sx={{
                      m: 1,
                      maxWidth:
                        "clamp(9.875rem, 2.7629rem + 30.3448vw, 12.625rem)",
                      width: "100%",
                    }}
                  >
                    <InputLabel id="demo-simple-select-filled-label">
                      {t("extra.typeOfCertificate")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={filter.certificateName.value}
                      sx={{ maxHeight: "60vh" }}
                      onChange={(e) => {
                        dispatch(
                          changeFilter({
                            ...filter,
                            certificateName: {
                              ...filter.certificateName,
                              value: e.target.value,
                              isValid: true,
                            },
                            certificateScore: {
                              ...filter.certificateScore,
                              value: null,
                              isValid: false,
                            },
                          })
                        );
                      }}
                    >
                      {certificates.map((el, index) => {
                        return (
                          <MenuItem key={index} value={el.id}>
                            {el?.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl
                    variant="filled"
                    sx={{
                      m: 1,
                      maxWidth:
                        "clamp(9.875rem, 2.7629rem + 30.3448vw, 12.625rem)",
                      width: "100%",
                    }}
                  >
                    <InputLabel id="demo-simple-select-filled-label">
                      {t("extra.Score")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={filter.certificateScore.value}
                      onChange={(e) => {
                        dispatch(
                          changeFilter({
                            ...filter,
                            certificateScore: {
                              ...filter.certificateScore,
                              value: Number(e.target.value),
                              isValid: true,
                            },
                          })
                        );
                      }}
                    >
                      {certificates
                        ? certificates
                            .find(
                              (el) => el.id === filter.certificateName.value
                            )
                            ?.values.map((el, index) => {
                              return (
                                <MenuItem key={index} value={index}>
                                  {el}
                                </MenuItem>
                              );
                            })
                        : ""}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <hr />
              <div className="by-week">
                <h2>{t("extra.SchoolDays")}</h2>
                <div className="schedules">
                  {weeksArr.map((item, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => handleChangeWeek(item.id)}
                        className={
                          filter.weekArray.value.includes(item.id)
                            ? "schedule active"
                            : "schedule"
                        }
                      >
                        <span className="day">{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <hr />
              <div className="by-language">
                <h2>{t("searchTutor.teachingLanguage")}</h2>
                <div className="languages">
                  {languages &&
                    languages.map((el, index) => {
                      return (
                        <div
                          key={index}
                          className={
                            filter.byLanguage.value === el.id
                              ? "language-active"
                              : "language"
                          }
                          onClick={() => {
                            dispatch(
                              changeFilter({
                                ...filter,
                                byLanguage: {
                                  ...filter.byLanguage,
                                  value: el.id,
                                  isValid: true,
                                },
                              })
                            );
                          }}
                        >
                          {el.name[i18n.language as language]}
                        </div>
                      );
                    })}
                </div>
              </div>
              <hr />
              <div className="by-experience">
                <h2>{t("searchTutor.workExperience")}</h2>
                <div className="experiences">
                  {experiences.map((el) => {
                    return (
                      <div
                        className="experience"
                        onClick={() => {
                          dispatch(
                            changeFilter({
                              ...filter,
                              experience: {
                                ...filter.experience,
                                isValid: true,
                                value: el.value,
                              },
                            })
                          );
                        }}
                      >
                        <div className="info">{`${el?.name} ${t(
                          "searchTutor.year"
                        )}`}</div>
                        <div
                          className={
                            filter.experience.value === el.value
                              ? "tick active"
                              : "tick"
                          }
                        >
                          <img src={experienceTick} alt="img" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <hr />
              <div className="by-place">
                <h2>{t("searchTutor.studyPlace")}</h2>
                <div className="places">
                  {studyTypes &&
                    studyTypes.map((el, index) => {
                      return (
                        <div
                          key={index}
                          className="place"
                          onClick={() => {
                            dispatch(
                              changeFilter({
                                ...filter,
                                studyType: {
                                  ...filter.studyType,
                                  value: el.id,
                                  isValid: true,
                                },
                              })
                            );
                          }}
                        >
                          <div
                            className={
                              filter.studyType.value === el.id
                                ? "tick active"
                                : "tick"
                            }
                          >
                            <img src={experienceTick} alt="img" />
                          </div>
                          <div className="info">
                            {el.name[i18n.language as language]}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <hr />
              <div className="by-gender">
                <h2 className="by-gender-title">{t("searchTutor.gender")}</h2>
                <div className="select-gender">
                  <div
                    className="male"
                    onClick={() => {
                      dispatch(
                        changeFilter({
                          ...filter,
                          gender: {
                            ...filter.gender,
                            value: "m",
                            name: "searchTutor.male",
                            isValid: true,
                          },
                        })
                      );
                    }}
                    style={
                      filter.gender.value === "m"
                        ? {
                            color: "#fff",
                            background: "#007AFF",
                          }
                        : {}
                    }
                  >
                    {t("searchTutor.male")}
                  </div>
                  <div
                    className="female"
                    onClick={() => {
                      dispatch(
                        changeFilter({
                          ...filter,
                          gender: {
                            ...filter.gender,
                            value: "f",
                            name: "searchTutor.female",
                            isValid: true,
                          },
                        })
                      );
                    }}
                    style={
                      filter.gender.value === "f"
                        ? {
                            color: "#fff",
                            background: "#007AFF",
                          }
                        : {}
                    }
                  >
                    {t("searchTutor.female")}
                  </div>
                </div>
              </div>
              <hr />
              <div className="by-regions">
                <h2 className="title">{t("form.country")}</h2>
                <div className="places">
                  {countries &&
                    countries.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="place"
                          onClick={() => {
                            dispatch(
                              changeFilter({
                                ...filter,
                                byCountry: {
                                  ...filter.byCountry,
                                  isValid: true,
                                  value: item.id,
                                },
                                byRegion: {
                                  ...filter.byRegion,
                                  isValid: false,
                                  value: "",
                                },
                              })
                            );
                          }}
                        >
                          <div
                            className={
                              filter.byCountry.value === item.id
                                ? "tick active"
                                : "tick"
                            }
                          >
                            <img src={experienceTick} alt="img" />
                          </div>
                          <div className="info">
                            {item.name[i18n.language as language]}
                          </div>
                        </div>
                      );
                    })}
                </div>
                <hr
                  style={
                    filter.byCountry.value !== ""
                      ? { display: "block" }
                      : { display: "none" }
                  }
                />
                <h2
                  style={
                    filter.byCountry.value !== ""
                      ? { display: "block" }
                      : { display: "none" }
                  }
                  className="title"
                >
                  {t("extra.Countries")}
                </h2>
                <div className="regions">
                  {filter.byCountry.value !== "" &&
                    regions &&
                    regions[filter.byCountry.value].map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={
                            filter.byRegion.value === item.id
                              ? "region-active"
                              : "region"
                          }
                          onClick={() => {
                            dispatch(
                              changeFilter({
                                ...filter,
                                byRegion: {
                                  ...filter.byRegion,
                                  isValid: true,
                                  value: item.id,
                                },
                              })
                            );
                          }}
                        >
                          {item.name[i18n.language as language]}
                        </div>
                      );
                    })}
                </div>
              </div>
              <hr />
              <div className="by-cost">
                <h2 className="title">{t("searchTutor.priceLesson")}</h2>
                <Box className="range-box" sx={{ width: "98%" }}>
                  <Slider
                    className="slider-range"
                    aria-label="Always visible"
                    defaultValue={filter.byPrice.value}
                    onChange={(e, newValue) => {
                      dispatch(
                        changeFilter({
                          ...filter,
                          byPrice: {
                            ...filter.byPrice,
                            value: [0, 0],
                            name: "",
                            isValid: false,
                            url: "",
                          },
                        })
                      );
                      setPrice(
                        Array.isArray(newValue) ? newValue : [0, newValue]
                      );
                    }}
                    step={filter.currency.value === 0 ? 1000 : 1}
                    valueLabelDisplay="on"
                    min={
                      filter.currency.value === 0
                        ? priceValues?.min_uzs
                        : priceValues?.min_usd
                    }
                    max={
                      filter.currency.value === 0
                        ? priceValues?.max_uzs
                        : priceValues?.max_usd
                    }
                  />
                  <Select
                    displayEmpty
                    value={filter.currency.value}
                    onChange={(e) => {
                      dispatch(
                        changeFilter({
                          ...filter,
                          currency: {
                            ...filter.currency,
                            value: Number(e.target.value),
                          },
                        })
                      );
                    }}
                    sx={{ border: "none" }}
                  >
                    <MenuItem value={0}>UZS</MenuItem>
                    <MenuItem value={1}>USD</MenuItem>
                  </Select>
                </Box>
              </div>
              <hr />
              <div className="by-education">
                <h2>{t("form.education")}</h2>
                <div className="info-forms">
                  {education &&
                    education.map((el, index) => {
                      return (
                        <div className="info-form" key={index}>
                          <input
                            style={{ width: "23px", height: "23px" }}
                            value={el.id}
                            type="checkbox"
                            onChange={(e) => {
                              handleEducationChange(e);
                            }}
                          />
                          <span className="info-form-span">
                            {el?.name[i18n.language as language]}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
              <hr />
              <div
                // style={
                //   filter.byEducation.url ? { opacity: "1" } : { opacity: "0.5" }
                // }
                className="by-education"
              >
                <h2>{t("form.category2")}</h2>
                <div
                  className="info-forms"
                  style={
                    filter.byEducation.url
                      ? { opacity: "1" }
                      : { opacity: "0.5" }
                  }
                >
                  {degree &&
                    degree.map((el, index) => {
                      return (
                        <div className="info-form" key={index}>
                          <input
                            disabled={filter.byEducation.url ? false : true}
                            style={{ width: "23px", height: "23px" }}
                            value={el?.id}
                            checked={filter.byDegree.value.includes(el.id)}
                            type="checkbox"
                            onChange={(e) => {
                              handleDegreeChange(e);
                            }}
                          />
                          <span className="info-form-span">
                            {el.name[i18n.language as language]}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
              <hr />
            </div>
            <button
              onClick={() => handleFilterResultView()}
              className="category-button"
            >
              {t("searchTutor.showResult")}
            </button>
          </div>
        </Dialog>
      </div>
      <div className="tutors-nav">
        <input
          className="tutors-nav-search"
          type="search"
          value={filter.search.value}
          onChange={(e) => {
            dispatch(
              changeFilter({
                ...filter,
                search: {
                  ...filter.search,
                  value: e.target.value,
                  isValid: Boolean(e.target.value),
                },
              })
            );
          }}
          placeholder={t("searchTutor.searchByName") as string}
        />
        <div className="tutors-nav-items">
          <div
            className="sort-by-subject"
            aria-describedby={id}
            onClick={handleClick}
          >
            {filter.subject.value
              ? subjects &&
                subjects.allData
                  .filter((el) => el.id === filter.subject.value)
                  ?.map((el) => {
                    return el.name[i18n.language as language];
                  })
              : t("searchTutor.subject")}
            <img
              className={
                anchorEl !== null ? "sort-by-img active" : "sort-by-img"
              }
              src={searchArrow}
              alt="anchor"
            />
          </div>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleCloseClick}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <div className="sort-by-subjects">
              <div className="sort-by-subjects-input">
                <img src={searchIcon} alt="searchIcon" />
                <input
                  value={searchSubject}
                  onChange={(e) => setSearchSubject(e.target.value)}
                  type="search"
                  placeholder={String(t("searchTutor.subject"))}
                />
              </div>
              <div className="subjects">
                {subjects &&
                  subjects.allData
                    .filter((el) => {
                      if (searchSubject.length > 0) {
                        if (
                          el.name[i18n.language as language]
                            .toLowerCase()
                            .indexOf(searchSubject.toLowerCase()) > -1
                        ) {
                          return el;
                        }
                      } else {
                        return el;
                      }
                    })
                    .map((el, index) => {
                      return (
                        <div
                          key={index}
                          className="subject"
                          onClick={() => {
                            dispatch(
                              changeFilter({
                                ...filter,
                                subject: {
                                  ...filter.subject,
                                  value: el.id,
                                  name: index,
                                  isValid: true,
                                },
                              })
                            );
                            setAnchorEl(null);
                          }}
                        >
                          {el.name[i18n.language as language]}
                        </div>
                      );
                    })}
              </div>
            </div>
          </Popover>
          <div className="verical-border"> </div>
          <Select
            displayEmpty
            value={filter.gender.value}
            onChange={(e) => {
              dispatch(
                changeFilter({
                  ...filter,
                  gender: {
                    ...filter.gender,
                    value: e.target.value,
                    isValid: true,
                  },
                })
              );
            }}
          >
            <MenuItem disabled value="" sx={{ display: "none" }}>
              {t("searchTutor.gender")}
            </MenuItem>
            <MenuItem value="m">{t("searchTutor.male")}</MenuItem>
            <MenuItem value="f">{t("searchTutor.female")}</MenuItem>
          </Select>
          <div className="verical-border"> </div>
          <Select
            displayEmpty
            value={filter.studyType.value}
            onChange={(e) => {
              dispatch(
                changeFilter({
                  ...filter,
                  studyType: {
                    ...filter.studyType,
                    value: e.target.value,
                    isValid: true,
                  },
                })
              );
            }}
          >
            <MenuItem disabled value="" sx={{ display: "none" }}>
              {t("searchTutor.studyPlace")}
            </MenuItem>
            {studyTypes &&
              studyTypes.map((el, index) => (
                <MenuItem key={index} value={el.id}>
                  {el.name[i18n.language as language]}
                </MenuItem>
              ))}
          </Select>
          <div className="verical-border"> </div>
          <Select
            displayEmpty
            value={filter.experience.value}
            onChange={(e) => {
              dispatch(
                changeFilter({
                  ...filter,
                  experience: {
                    ...filter.experience,
                    value: e.target.value,
                    isValid: true,
                  },
                })
              );
            }}
          >
            <MenuItem disabled value="" sx={{ display: "none" }}>
              {t("searchTutor.experience")}
            </MenuItem>
            {experiences.map((el, index) => {
              return (
                <MenuItem key={index} value={el.value}>
                  {el.name} {t("searchTutor.year")}
                </MenuItem>
              );
            })}
          </Select>
          <div className="verical-border"> </div>
          <Select
            displayEmpty
            value={filter.byLanguage.value}
            onChange={(e) =>
              dispatch(
                changeFilter({
                  ...filter,
                  byLanguage: {
                    ...filter.byLanguage,
                    value: e.target.value,
                    isValid: true,
                  },
                })
              )
            }
          >
            <MenuItem disabled value="" sx={{ display: "none" }}>
              {t("searchTutor.teachingLanguage")}
            </MenuItem>
            {languages.map((el, index) => {
              return (
                <MenuItem key={index} value={el.id}>
                  {el.name[i18n.language as language]}
                </MenuItem>
              );
            })}
          </Select>
        </div>
      </div>
      <div className="tutors-searh-filter">
        <h2 className="tutors-searh-filter-h2">
          {t("searchTutor.sortResults")}:
        </h2>
        {filter.subject.value && (
          <div className="tutors-searh-filter-item">
            {subjects &&
              subjects.allData
                .filter((el) => el.id === filter.subject.value)
                .map((el) => {
                  return el.name[i18n.language as language];
                })}
            <img
              src={x}
              alt="clear"
              onClick={() => {
                dispatch(
                  changeFilter({
                    ...filter,
                    subject: {
                      ...filter.subject,
                      isValid: false,
                      name: "",
                      value: "",
                    },
                  })
                );
              }}
            />
          </div>
        )}
        {filter.gender.value !== "" ? (
          <div className="tutors-searh-filter-item">
            {filter.gender.value === "m"
              ? t("searchTutor.male")
              : t("searchTutor.female")}
            <img
              src={x}
              alt="clear"
              onClick={() => {
                dispatch(
                  changeFilter({
                    ...filter,
                    gender: {
                      ...filter.gender,
                      value: "",
                      name: "",
                      isValid: false,
                    },
                  })
                );
              }}
            />
          </div>
        ) : (
          ""
        )}
        {filter.studyType.value !== "" && (
          <div className="tutors-searh-filter-item">
            {studyTypes.length > 0 &&
              studyTypes
                .filter((el) => {
                  return (
                    el.id === filter.studyType.value &&
                    el.name[i18n.language as language]
                  );
                })
                .map((item) => {
                  return item.name[i18n.language as language];
                })}
            <img
              src={x}
              alt="clear"
              onClick={() => {
                dispatch(
                  changeFilter({
                    ...filter,
                    studyType: {
                      ...filter.studyType,
                      value: "",
                      name: "",
                      isValid: false,
                    },
                  })
                );
              }}
            />
          </div>
        )}
        {filter.experience.value && (
          <div className="tutors-searh-filter-item">
            {experiences
              .filter((el) => filter.experience.value === el.value)
              .map((i) => {
                return i.name + " " + t("searchTutor.year");
              })}
            <img
              src={x}
              alt="clear"
              onClick={() =>
                dispatch(
                  changeFilter({
                    ...filter,
                    experience: {
                      ...filter.experience,
                      value: "",
                      isValid: false,
                    },
                  })
                )
              }
            />
          </div>
        )}
        {filter.byLanguage.value !== "" && (
          <div className="tutors-searh-filter-item">
            {languages
              .filter((el) => filter.byLanguage.value === el.id)
              .map((item) => {
                return item.name[i18n.language as language];
              })}
            <img
              src={x}
              alt="clear"
              onClick={() => {
                dispatch(
                  changeFilter({
                    ...filter,
                    byLanguage: {
                      ...filter.byLanguage,
                      value: "",
                      isValid: false,
                    },
                  })
                );
              }}
            />
          </div>
        )}
        {filter.byCountry.value !== "" && (
          <div className="tutors-searh-filter-item">
            {t(
              `location.location#${filter.byCountry.value}.location#${filter.byCountry.value}`
            )}
            <img
              src={x}
              alt="clear"
              onClick={() => {
                dispatch(
                  changeFilter({
                    ...filter,
                    byRegion: {
                      ...filter.byRegion,
                      isValid: false,
                      value: "",
                    },
                    byCountry: {
                      ...filter.byCountry,
                      isValid: false,
                      value: "",
                    },
                  })
                );
              }}
            />
          </div>
        )}
        {filter.byRegion.value !== "" && filter.byCountry.value !== null && (
          <div className="tutors-searh-filter-item">
            {t(
              `location.location#${filter.byCountry.value}.location#${filter.byCountry.value}#${filter.byRegion.value}`
            )}
            <img
              src={x}
              alt="clear"
              onClick={() => {
                dispatch(
                  changeFilter({
                    ...filter,
                    byRegion: {
                      ...filter.byRegion,
                      isValid: false,
                      value: "",
                    },
                  })
                );
              }}
            />
          </div>
        )}
        {filter.byPrice.url !== "" && (
          <div className="tutors-searh-filter-item">
            {filter.byPrice.name}
            <img
              src={x}
              alt="clear"
              onClick={() => {
                setPrice([]);
                dispatch(
                  changeFilter({
                    ...filter,
                    byPrice: {
                      ...filter.byPrice,
                      value: [0, 0],
                      name: "",
                      isValid: false,
                      url: "",
                    },
                  })
                );
              }}
            />
          </div>
        )}
        {filter.byEducation.url !== "" && (
          <div className="tutors-searh-filter-item">
            {t("form.education")}
            <img
              src={x}
              alt="clear"
              onClick={() => {
                dispatch(
                  changeFilter({
                    ...filter,
                    byEducation: {
                      ...filter.byEducation,
                      url: "",
                      value: [],
                      isValid: false,
                    },
                  })
                );
              }}
            />
          </div>
        )}
        {filter.byDegree.url !== "" && (
          <div className="tutors-searh-filter-item">
            {t("form.category2")}
            <img
              src={x}
              alt="clear"
              onClick={() => {
                dispatch(
                  changeFilter({
                    ...filter,
                    byDegree: {
                      ...filter.byDegree,
                      url: "",
                      value: [],
                      isValid: false,
                    },
                  })
                );
              }}
            />
          </div>
        )}
        {filter.weekArray.value.length > 0 && (
          <div className="tutors-searh-filter-item">
            {t("extra.SchoolDays")}
            <img
              src={x}
              alt="clear"
              onClick={() => {
                dispatch(
                  changeFilter({
                    ...filter,
                    weekArray: {
                      ...filter.weekArray,
                      value: [],
                      url: "",
                      isValid: false,
                    },
                  })
                );
              }}
            />
          </div>
        )}
        {filter.certificateName.value !== "" && (
          <div className="tutors-searh-filter-item">
            {certificates &&
              certificates
                .filter((el) => el.id === filter.certificateName.value)
                .map(
                  (el) =>
                    `${el.name} ${
                      filter.certificateScore.value !== null
                        ? el.values[filter.certificateScore.value]
                        : ""
                    }`
                )}
            <img
              src={x}
              alt="clear"
              onClick={() => {
                dispatch(
                  changeFilter({
                    ...filter,
                    certificateName: {
                      ...filter.certificateName,
                      value: "",
                      isValid: false,
                    },
                    certificateScore: {
                      ...filter.certificateScore,
                      value: null,
                      isValid: false,
                    },
                  })
                );
              }}
            />
          </div>
        )}
      </div>
      <div className="tutors">
        {loading ? (
          <div className="main">
            {tutor && tutor.length !== 0 ? (
              tutor.map((el, index) => {
                return (
                  <div data-aos="fade-up" data-aos-duration="1000">
                    <div className="teacher-card-content">
                      <div className="teacher-card-content-img">
                        {el?.file ? (
                          <img src={el?.file} alt="img" />
                        ) : (
                          <img src={img1} alt="img" />
                        )}
                      </div>
                      <div className="teacher-card-content-info-container">
                        <div className="teacher-card-content-info">
                          <div className="teacher-card-content-info-name">
                            {el.teacher_name}
                            {el?.verified_teacher && (
                              <img src={img2} alt="img2" />
                            )}
                          </div>
                          <div className="teacher-card-content-info-lang">
                            <span>{t("searchTutor.subject")}:</span>
                            <span>
                              {subjects &&
                                subjects.allData.find(
                                  (item) => item.id === el.subject_id
                                )?.name[i18n.language as language]}
                            </span>
                          </div>
                          <div className="teacher-card-content-info-age">
                            <span>{t("searchTutor.workExperience")}:</span>
                            <span>
                              {experiences
                                .filter(
                                  (item) =>
                                    item.value === el.experience && item.name
                                )
                                .map(
                                  (el) => `${el.name} ${t("searchTutor.year")}`
                                )}
                            </span>
                          </div>
                          <div className="teacher-card-content-info-lang">
                            <span>{t("searchTutor.languages")}:</span>
                            <span>
                              {el?.language_ids?.length > 0 // !!!
                                ? languagesToString(el.language_ids)
                                : "-"}
                            </span>
                          </div>
                          <div className="teacher-card-content-info-lang">
                            <span>{t("searchTutor.studyPlace")}:</span>
                            <span>
                              {el?.study_type_id?.length > 0
                                ? studyTypesToString(el.study_type_id)
                                : "-"}
                            </span>
                          </div>
                          <div className="teacher-card-content-info-btns">
                            <Link
                              className="button-hover info-btn"
                              to={`/tutors/view/${el?.teacher_id}`}
                              style={{
                                background: "#051c78",
                                color: "#fff",
                              }}
                            >
                              <VisibilityIcon sx={{ fill: "#fff" }} />
                              {t("searchTutor.look")}
                            </Link>
                            <div
                              className="button-hover info-btn"
                              onClick={() => {
                                el.saved === true
                                  ? handleDelete(el.course_id)
                                  : el.saved === false
                                  ? handleSave(el.course_id)
                                  : handleRefresh();
                              }}
                            >
                              {el.saved === true ? (
                                <Like style={{ fill: "#051c78" }} />
                              ) : el.saved === false ? (
                                <Like style={{ fill: "grey" }} />
                              ) : (
                                ""
                              )}
                              {t("searchTutor.save")}
                            </div>
                          </div>
                        </div>
                        <div className="techer-card-content-rate">
                          <h3>{t("searchTutor.classes")}:</h3>
                          <h4>
                            {el.hourly_rate} <span></span>
                            {el.hourly_rate_type === 1
                              ? t("searchTutor.pricePerHour2")
                              : t("searchTutor.pricePerHour")}
                          </h4>
                          <h2>
                            {t("searchTutor.rating")}{" "}
                            {Math.floor(el.rating * 10) / 10}
                          </h2>
                          <div className="reviews-score-rating">
                            <Rating
                              name="read-only"
                              value={el.rating}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/tutors/view/${el?.teacher_id}`}
                      className="teacher-card-content-2"
                    >
                      <div className="teacher-card-content-img">
                        {el?.file ? (
                          <img src={el?.file} alt="el?.file" />
                        ) : (
                          <img src={img1} alt="img1" />
                        )}
                        <StarIcon sx={{ fill: "#FFD700" }} />
                        {Math.floor(el.rating * 10) / 10}
                      </div>
                      <div className="teacher-card-content-info-container">
                        <div className="teacher-card-content-info">
                          <div className="teacher-card-content-info-name">
                            {el.teacher_name}
                            {el?.verified_teacher && (
                              <img src={img2} alt="img2" />
                            )}
                          </div>
                          <div className="teacher-card-content-info-lang">
                            <span>{t("searchTutor.subject")}:</span>
                            <span>{el.subject}</span>
                          </div>
                          <div className="teacher-card-content-info-lang">
                            <span>{t("searchTutor.languages")}:</span>
                            <span>
                              {el?.language_ids?.length > 0 // !!!
                                ? languagesToString(el.language_ids)
                                : "-"}
                            </span>
                          </div>
                          <div className="teacher-card-content-info-lang">
                            <span>{t("searchTutor.classes")}:</span>
                            <span>
                              {el.hourly_rate ? el.hourly_rate : "-"}
                              {el.hourly_rate_type === 1
                                ? t("searchTutor.pricePerHour2")
                                : t("searchTutor.pricePerHour")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="not-found-tutor">
                <img src={notFound} alt="notFound" className="not-found-img" />
                <div className="not-found-content">
                  <div className="not-found-title">
                    {t("searchTutor.sortResults")}:
                  </div>
                  <div className="not-foun-p">{t("searchTutor.notFound")}</div>
                </div>
              </div>
            )}

            {pagination && pagination.pageCount >= 10 && (
              <div className="pagination">
                <Pagination
                  className="pagination-bar"
                  currentPage={pagination.currentPage}
                  totalCount={pagination.totalCount}
                  pageSize={10}
                  onPageChange={(page: number) => {
                    setCurrentPage(page);
                  }}
                />
                <div className="page-amount">
                  {currentPage}/{pagination.pageCount}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="loader">
            <InnerLoader />
          </div>
        )}
        {/* <div className="aside">Реклама</div> */}
      </div>
      <Footer />
    </div>
  );
};

export default AboutTeacher;
