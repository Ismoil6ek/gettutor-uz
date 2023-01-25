import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer/Footer";
// import styles
import "./teacherProfileData.scss";
// import Image
import defaultImg from "../../assets/svg/defaultImg.png";
// MUI
import {
  Box,
  FormGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Backdrop,
  Modal,
  Fade,
  Button,
  Popover,
  OutlinedInput,
  FormHelperText,
  TextField,
  Dialog,
} from "@mui/material";
// MUI icon
import {
  Add,
  KeyboardArrowUp,
  InsertDriveFile,
  Close,
} from "@mui/icons-material";

import DoublePoint from "../../assets/svg/double-point.svg";
import Cancel from "../../assets/svg/cancel.svg";
import { base_url, MenuProps } from "../../data";
// import required modules
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { changeUser } from "../../redux/actions";
import CropEasy from "../../components/CropImage/cropEasy";
import { menuItemStyle, selectStyle, textFieldStyle } from "../../data/styles";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { language, teacherData, user } from "../../data/interfaces";
import { fileUpload, timeHandler } from "../../utils";

const TODAY = new Date();
const DAY_IN_MILLISECONDS = 1 * 24 * 3600 * 1000;
const MAXDATE = new Date(TODAY.getTime() - 5 * 365 * DAY_IN_MILLISECONDS);

const TeacherProfileData = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const useLabel = useRef<HTMLLabelElement | null>(null);

  const [userData, setUserData] = useState<teacherData>({
    avatar_image: "",
    file_id: null,
    firstname: "",
    lastname: "",
    birthday: null,
    gender: "",
    country_id: 1,
    region_id: null,
    education_id: null,
    degree_id: null,
    experience: null,
    subject_id: null,
    languages: [],
    about: "",
    study_type_id: [],
    hourly_rate: "",
    hourly_rate_type: 0,
    test_lesson: false,
    email: null,
  });

  const [schedule, setSchedule] = useState(
    Array(7).fill({
      firstTime: {
        beginHour: "",
        beginMinute: "",
        finishHour: "",
        finishMinute: "",
      },
      secondTime: {
        beginHour: "",
        beginMinute: "",
        finishHour: "",
        finishMinute: "",
      },
      is_valid: false,
    })
  );

  const [renderCert, setRenderCert] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const [isCertificate, setIsCertificate] = useState(false);
  const [typeCertificate, setTypeCertificate] = useState<string | null>("");
  const [scoreCertificate, setScoreCertificate] = useState<number | null>(null);

  const [certificate, setCertificate] = useState<File | null>(null);
  const [certificateId, setcertificateId] = useState(null);
  const [certificateName, setCertificateName] = useState("");
  const [errorInput, setErrorInput] = useState<boolean>(false);

  const [anchorHandleCertificate, setAnchorHandleCertificate] =
    useState<Element | null>(null);

  const openHandleCertificatePopover = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorHandleCertificate(event.currentTarget);
  };

  const closeHandleCertificatePopover = () => {
    setAnchorHandleCertificate(null);
    setValue(0);
    setCertificateName("");
  };

  const [anchorUploadCertificate, setAnchorUploadCertificate] =
    useState<boolean>(false);

  const openUploadCertificatePopover = () => {
    setAnchorUploadCertificate(true);
  };

  const closeUploadCertificatePopover = () => {
    setAnchorUploadCertificate(false);
  };

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

  useEffect(() => {
    if (certificate) {
      closeHandleCertificatePopover();
      openUploadCertificatePopover();
    }
  }, [certificate]);

  const uploadCertificate = () => {
    if (useLabel.current && useLabel.current.style) {
      useLabel.current.style.display = "none";
    }

    if (
      (!isCertificate && certificateName.length > 0 && certificate !== null) ||
      (isCertificate &&
        Number.isInteger(typeCertificate) &&
        Number.isInteger(scoreCertificate))
    ) {
      const formDataCertificate = new FormData();
      formDataCertificate.append("file", certificate!, certificate!.name);

      axios
        .request({
          method: "POST",
          url: `${base_url}/site/files/upload`,
          data: formDataCertificate,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          onUploadProgress: function (progressEvent) {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              setValue(percentCompleted);
            }
          },
        })
        .then((response) => response)
        .then((data) => {
          setcertificateId(data.data.data.id);
          closeUploadCertificatePopover();
          return data;
        })
        .catch((err) => console.log(err));
    } else {
      setErrorInput(true);
    }
  };

  const [value, setValue] = useState(0);

  useEffect(() => {
    if (certificateId) {
      fetch(`${base_url}/site/certificate/upload`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          file_id: certificateId,
          name: certificateName,
          type_id: typeCertificate,
          grade_id: scoreCertificate,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          updateUserData().then(() => {
            setRenderCert((init) => !init);
            setcertificateId(null);
            setTypeCertificate(null);
            setScoreCertificate(null);
          }); // !!! temporary shitty fix
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line
  }, [certificateId, renderCert]);

  useEffect(() => {
    if (user) {
      setUserData((init) => {
        return {
          ...init,
          avatar_image: user.avatar_image ?? null,
          file_id: user.file_id ?? null,
          firstname: user.firstname ?? null,
          lastname: user.lastname ?? null,
          birthday: user?.birthday
            ? (timeHandler({
                returnType: "time",
                parameter: user.birthday,
              }) as string)
            : "",
          gender: user.gender ?? null,
          country_id: user.country_id ?? null,
          region_id: user.region_id ?? null,
          education_id: user.education_id ?? null,
          degree_id: user.degree_id ?? null,
          experience: user.experience ?? null,
          subject_id: user.subject_id ?? null,
          languages: user.language_ids ?? [],
          study_type_id: user?.study_type_id ?? [],
          about: user.about ?? null,
          hourly_rate: user.hourly_rate ?? "",
          hourly_rate_type: user.hourly_rate_type ?? null,
          test_lesson: user.test_lesson ?? false,
        };
      });
      user?.schedule !== null &&
        user?.schedule !== undefined &&
        setSchedule([...user?.schedule]);
    }

    // eslint-disable-next-line
  }, [user]);

  const [dayIndex, setDayIndex] = useState(0);

  const updateUserData = async (imageFileID?: number) => {
    let body = {
      ...userData,
      schedule: schedule,
      birthday: timeHandler({
        returnType: "timestamp",
        parameter: userData.birthday!,
      }),
      file_id: imageFileID ? imageFileID : userData.file_id,
    };

    fetch(`${base_url}/site/users/update`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((err) => console.log(err));
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "max-content",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const [showSecondTime, setShowSecondTime] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const fBeginHourRef = useRef<HTMLInputElement>(null);
  const fBeginMinRef = useRef<HTMLInputElement>(null);
  const fFinishHourRef = useRef<HTMLInputElement>(null);
  const fFinishMinRef = useRef<HTMLInputElement>(null);

  const sBeginHourRef = useRef<HTMLInputElement>(null);
  const sBeginMinRef = useRef<HTMLInputElement>(null);
  const sFinishHourRef = useRef<HTMLInputElement>(null);
  const sFinishMinRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setShowSecondTime(false);
    setOpen(false);
    setDayIndex(0);
  };

  const checkHourValues = () => {
    const check = (times: string[]) => {
      times.forEach((lessonName) => {
        let time = schedule[dayIndex][lessonName];
        if (
          time.finishHour > time.beginHour ||
          (time.finishHour === time.beginHour &&
            time.finishMinute > time.beginMinute)
        ) {
          setOpen(false);
          handleClose();
        } else if (
          schedule[dayIndex]["firstTime"].finishHour === "" &&
          schedule[dayIndex]["firstTime"].finishMinute === "" &&
          schedule[dayIndex]["firstTime"].beginHour === "" &&
          schedule[dayIndex]["firstTime"].beginMinute === "" &&
          schedule[dayIndex]["secondTime"].finishHour === "" &&
          schedule[dayIndex]["secondTime"].finishMinute === "" &&
          schedule[dayIndex]["secondTime"].beginHour === "" &&
          schedule[dayIndex]["secondTime"].beginMinute === ""
        ) {
          const clone = [...schedule];
          clone[dayIndex].is_valid = false;
          setSchedule(clone);
          handleClose();
        } else {
          toast.error(t("extra.pleaseCheck"));
        }
      });
    };

    showSecondTime ? check(["firstTime", "secondTime"]) : check(["firstTime"]);
  };

  const weekNames = [
    t("extra.Mon"),
    t("extra.Tue"),
    t("extra.Wed"),
    t("extra.Thu"),
    t("extra.Fri"),
    t("extra.Su"),
    t("extra.Sun"),
  ];

  const setFocus = () => {
    if (
      fBeginHourRef.current !== undefined &&
      fBeginMinRef.current !== undefined &&
      fFinishHourRef.current !== undefined &&
      fFinishMinRef.current !== undefined
    ) {
      if (fBeginHourRef.current?.value.length === 2) {
        fBeginMinRef.current?.focus();
      } else return 0;

      if (fBeginMinRef.current?.value.length === 2) {
        fFinishHourRef.current?.focus();
      } else return 0;

      if (fFinishHourRef.current?.value.length === 2) {
        fFinishMinRef.current?.focus();
      } else return 0;
    }
  };

  const secondSetFocus = () => {
    if (
      sBeginHourRef.current !== undefined &&
      sBeginMinRef.current !== undefined &&
      sFinishHourRef.current !== undefined &&
      sFinishMinRef.current !== undefined
    ) {
      if (sBeginHourRef.current?.value.length === 2) {
        sBeginMinRef.current?.focus();
      } else return 0;

      if (sBeginMinRef.current?.value.length === 2) {
        sFinishHourRef.current?.focus();
      } else return 0;

      if (sFinishHourRef.current?.value.length === 2) {
        sFinishMinRef.current?.focus();
      } else return 0;
    }
  };

  const onButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setShowSecondTime(true);
  };

  const [openCertDialog, setOpenCertDialog] = React.useState(false);
  const [tempId, setTempId] = useState<number | null>(null);

  const handleClickOpenCertDialog = (id: number) => {
    setTempId(id);
    setOpenCertDialog(true);
  };

  const handleCloseCertDialog = () => {
    setOpenCertDialog(false);
  };

  const removeCertificate = async () => {
    fetch(`${base_url}/site/certificate/${tempId}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        updateUserData().then(() => {
          setRenderCert((init) => !init);
          handleCloseCertDialog();
        }); // !!! temporary shitty fix
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch(`${base_url}/site/users/about-me`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch(changeUser(result.data));
        if (result.message === "Unauthenticated.") {
          localStorage.removeItem("token");
          localStorage.removeItem("pathName");
        }
      })
      .catch((err) => {
        localStorage.removeItem("token");
        localStorage.removeItem("pathName");
        console.log({ err });
      });
    // eslint-disable-next-line
  }, [renderCert]);

  const handleTimeChange = (
    time: number,
    timeName: string,
    lessonNo: string,
    weekIndex: number
  ) => {
    const old = schedule[weekIndex];

    const updated = {
      ...old,
      [lessonNo]: {
        ...old[lessonNo],
        [timeName]: String(("0" + time).slice(-2)),
      },
    };

    const clone = [...schedule];
    clone[weekIndex] = updated;
    clone[weekIndex].is_valid = true;

    setSchedule(clone);
  };

  const uploadAvatarImg = (e: any) => {
    if (e !== null && e.size > 2097152 * 5) {
      // 2 MiB for bytes.
      toast.error("Fayl hajmi 10MB dan oshmasligi kerak!");
      return;
    } else if (e !== null) {
      setFile(e); // send image file to the upload API
      setUserData((init) => {
        console.log(e);
        return {
          ...init,
          avatar_image: e ? URL.createObjectURL(e) : "",
        };
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (file && file.name) {
      await fileUpload(file)
        .then(updateUserData)
        .then(() => {
          navigate("/teacher-profile");
          window.location.reload();
        });
    } else {
      updateUserData().then(() => {
        navigate("/teacher-profile");
        window.location.reload();
      });
    }
  };

  return user ? (
    <div
      className="teacher-profile-data-container"
      data-aos="fade-up"
      data-aos-duration="100"
    >
      <form
        className="teacher-profile-data"
        onSubmit={handleFormSubmit}
        autoComplete="off"
      >
        <h1 className="teacher-profile-data-title">{t("form.form")}</h1>

        {/* Image section */}
        <div className="teacher-profile-data-image-content-wrapper">
          <div className="teacher-profile-data-avatar-wrapper">
            <img
              className="teacher-profile-data-avatar-image"
              src={userData.avatar_image ? userData.avatar_image : defaultImg}
              alt="user_image"
            />
          </div>

          <div className="teacher-profile-data-image-status">
            <h3 className="teacher-profile-data-image-status-title">
              {t("form.profilePhoto")}
            </h3>
            <p className="teacher-profile-data-image-status-content">
              {t("form.maxSize")}
            </p>
            <label
              htmlFor="upload-img"
              className={
                userData.avatar_image === defaultImg
                  ? "upload-user-image set-red"
                  : "upload-user-image"
              }
            >
              {t("form.choose")}
            </label>
            <input
              onChange={(e) => {
                if (e.target.files) {
                  uploadAvatarImg(e.target.files[0]);
                }
              }}
              accept="image/png, image/gif, image/jpeg"
              style={{ display: "none" }}
              type="file"
              id="upload-img"
            />

            {userData.avatar_image === defaultImg && (
              <FormHelperText
                className={
                  userData.avatar_image === defaultImg ? "set-red-text" : ""
                }
              >
                Shaxsiy rasm kiritish shart!
              </FormHelperText>
            )}
          </div>

          {/* Easy Crop */}
          {file && userData.avatar_image !== null ? (
            <CropEasy
              photoURL={userData.avatar_image}
              files={file}
              setPhotoURL={(e) => {
                setUserData((init) => {
                  return {
                    ...init,
                    avatar_image: e,
                  };
                });
              }}
              setFile={(BlobFile) => {
                setFile(new File([BlobFile], "filename"));
              }}
            />
          ) : (
            ""
          )}
        </div>

        {/* Inputs section */}
        <div className="teacher-profile-enter-datas-wrapper">
          <div className="teacher-profile-personal-info-wrapper">
            <h3 className="teacher-profile-personal-info-title">
              {t("form.personalInfo")}
            </h3>
            <div className="teacher-profile-personal-info-inputs-wrapper">
              {/* Name */}
              <TextField
                sx={textFieldStyle}
                label={t("form.yourName")}
                id="outlined-basic"
                variant="outlined"
                type="text"
                required
                value={userData.firstname ?? ""}
                onChange={(e) => {
                  setUserData((init) => {
                    return { ...init, firstname: e.target.value };
                  });
                }}
              />

              {/* Surname */}
              <TextField
                label={t("form.yourSurname")}
                id="outlined-basic"
                variant="outlined"
                required
                type="text"
                sx={textFieldStyle}
                value={userData.lastname}
                onChange={(e) => {
                  setUserData((init) => {
                    return {
                      ...init,
                      lastname: e.target.value,
                    };
                  });
                }}
              />

              {/* Birth Date */}
              <input
                required
                type="date"
                name="date"
                value={userData.birthday ? userData.birthday : ""}
                onChange={(e) => {
                  setUserData((init) => {
                    return {
                      ...init,
                      birthday: e.target.value,
                    };
                  });
                }}
                max={String(MAXDATE.toISOString().slice(0, 10))}
                className={`${userData.birthday !== "" ? "valid" : ""}`}
                placeholder={"Enter your birth date"}
              />

              {/* Gender */}
              <FormControl required>
                <InputLabel>{t("form.gender")}</InputLabel>
                <Select
                  sx={selectStyle}
                  labelId="gender"
                  id="gender"
                  label={t("form.gender")}
                  value={userData.gender}
                  onChange={(e) => {
                    setUserData((init) => {
                      return {
                        ...init,
                        gender: e.target.value,
                      };
                    });
                  }}
                  IconComponent={KeyboardArrowUp}
                  className="gender-selector"
                >
                  <MenuItem sx={menuItemStyle} value={"m"}>
                    {t("searchTutor.male")}
                  </MenuItem>
                  <MenuItem sx={menuItemStyle} value={"f"}>
                    {t("searchTutor.female")}
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Country */}
              <FormControl required>
                <InputLabel>{t("form.country")}</InputLabel>
                <Select
                  sx={selectStyle}
                  labelId="country"
                  id="country"
                  label={t("form.country")}
                  IconComponent={KeyboardArrowUp}
                  value={userData.country_id}
                  onChange={(e) => {
                    setUserData((init) => {
                      return {
                        ...init,
                        country_id: Number(e.target.value),
                        // region_id: null,
                      };
                    });
                  }}
                >
                  {countries
                    ? countries.map((element, index) => {
                        return (
                          <MenuItem
                            sx={menuItemStyle}
                            key={index}
                            value={element.id}
                          >
                            {element.name[i18n.language as language]}
                          </MenuItem>
                        );
                      })
                    : null}
                </Select>
              </FormControl>

              {/* Region */}
              <FormControl required disabled={!Boolean(userData.country_id)}>
                <InputLabel>{t("form.region")}</InputLabel>
                <Select
                  sx={selectStyle}
                  labelId="region"
                  id="region"
                  label={t("form.region")}
                  value={userData.region_id ?? ""}
                  onChange={(e) => {
                    setUserData((init) => {
                      return { ...init, region_id: Number(e.target.value) };
                    });
                  }}
                  IconComponent={KeyboardArrowUp}
                >
                  {regions && userData.country_id
                    ? regions[userData.country_id]?.map((element, index) => {
                        return (
                          <MenuItem
                            sx={menuItemStyle}
                            key={index}
                            value={element.id}
                          >
                            {element.name[i18n.language as language]}
                          </MenuItem>
                        );
                      })
                    : null}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="teacher-profile-education-info-wrapper">
            <h3 className="teacher-profile-education-info-title">
              {t("form.education")}
            </h3>
            <div className="teacher-profile-education-info-inputs-wrapper">
              {/* Education */}
              <FormControl required>
                <InputLabel>{t("form.education")}</InputLabel>
                <Select
                  sx={selectStyle}
                  labelId="education"
                  id="education"
                  label={t("form.education")}
                  value={userData.education_id ?? ""}
                  onChange={(e) => {
                    setUserData((init) => {
                      return {
                        ...init,
                        education_id: Number(e.target.value),
                      };
                    });
                  }}
                  IconComponent={KeyboardArrowUp}
                >
                  {education &&
                    education.map((item) => {
                      return (
                        <MenuItem
                          sx={menuItemStyle}
                          key={item.id}
                          value={item.id}
                        >
                          {item.name[i18n.language as language]}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>

              {/* Degree, if user has higher education */}
              {userData.education_id === 3 && (
                <FormControl data-aos="fade-left">
                  <InputLabel>{t("form.category")}</InputLabel>
                  <Select
                    sx={selectStyle}
                    labelId="degree"
                    id="degree"
                    label={t("form.category")}
                    value={userData.degree_id}
                    onChange={(e) => {
                      setUserData((init) => {
                        return {
                          ...init,
                          degree_id: Number(e.target.value),
                        };
                      });
                    }}
                    IconComponent={KeyboardArrowUp}
                  >
                    {degree &&
                      degree.map((item) => {
                        return (
                          <MenuItem
                            sx={menuItemStyle}
                            key={item.id}
                            value={item.id}
                          >
                            {item.name[i18n.language as language]}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              )}

              {/* Experience */}
              <FormControl required>
                <InputLabel>{t("form.workExperience")}</InputLabel>
                <Select
                  sx={selectStyle}
                  label={t("form.workExperience")}
                  id="experience"
                  value={userData.experience ?? ""}
                  onChange={(e) => {
                    setUserData((init) => {
                      return {
                        ...init,
                        experience: Number(e.target.value),
                      };
                    });
                  }}
                  IconComponent={KeyboardArrowUp}
                >
                  <MenuItem sx={menuItemStyle} value={1}>
                    1 - 3 {t("searchTutor.year")}
                  </MenuItem>
                  <MenuItem sx={menuItemStyle} value={2}>
                    3 - 5 {t("searchTutor.year")}
                  </MenuItem>
                  <MenuItem sx={menuItemStyle} value={3}>
                    5 - 10 {t("searchTutor.year")}
                  </MenuItem>
                  <MenuItem sx={menuItemStyle} value={4}>
                    10 + {t("searchTutor.year")}
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Subjects */}
              <FormControl required>
                <InputLabel>{t("form.teachingSubject")}</InputLabel>
                <Select
                  sx={selectStyle}
                  labelId="teachingSubject"
                  id="subjects"
                  value={userData.subject_id ?? ""}
                  label={t("form.teachingSubject")}
                  onChange={(e) => {
                    setUserData((init) => {
                      return {
                        ...init,
                        subject_id: Number(e.target.value),
                      };
                    });
                  }}
                  IconComponent={KeyboardArrowUp}
                >
                  {subjects
                    ? subjects.allData.map((item, index) => {
                        return (
                          <MenuItem
                            sx={menuItemStyle}
                            key={index}
                            value={item.id}
                          >
                            {item.name[i18n.language as language]}
                          </MenuItem>
                        );
                      })
                    : null}
                </Select>
              </FormControl>

              {/* Languages */}
              <FormControl required>
                <InputLabel>{t("searchTutor.teachingLanguage")}</InputLabel>
                <Select
                  sx={selectStyle}
                  label={t("searchTutor.teachingLanguage")}
                  id="languages"
                  multiple
                  value={userData.languages}
                  onChange={(event) => {
                    const {
                      target: { value },
                    } = event;

                    setUserData((init) => {
                      return {
                        ...init,
                        languages: value
                          ? typeof value === "string"
                            ? [Number(value)]
                            : value.sort((a, b) => a - b)
                          : [],
                      };
                    });
                  }}
                  input={
                    <OutlinedInput label={t("searchTutor.teachingLanguage")} />
                  }
                  IconComponent={KeyboardArrowUp}
                  MenuProps={MenuProps}
                >
                  {languages?.map((item, index) => {
                    return (
                      <MenuItem sx={menuItemStyle} key={index} value={item.id}>
                        {item.name[i18n.language as language]}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              {/* Study type */}
              <FormControl required>
                <InputLabel>{t("form.placeYouWant")}</InputLabel>
                <Select
                  sx={selectStyle}
                  labelId="studyType"
                  id="studyType"
                  multiple
                  label={t("form.placeYouWant")}
                  value={userData.study_type_id}
                  onChange={(event) => {
                    const {
                      target: { value },
                    } = event;

                    setUserData((init) => {
                      return {
                        ...init,
                        study_type_id: value
                          ? typeof value === "string"
                            ? [Number(value)]
                            : value.sort((a, b) => a - b)
                          : [],
                      };
                    });
                  }}
                  IconComponent={KeyboardArrowUp}
                >
                  {studyTypes.map((item, index) => {
                    return (
                      <MenuItem sx={menuItemStyle} key={index} value={item.id}>
                        {item.name[i18n.language as language]}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Autobiography */}
          <div className="about-me">
            <h3 className="about-me-title">{t("studentForm.writeYourself")}</h3>
            <FormControl fullWidth required>
              <TextField
                sx={textFieldStyle}
                id="outlined-multiline-static"
                label="Matn minimum hajmi 150 ta harfdan iborat bo`lishi kerak."
                value={userData.about ?? ""}
                onChange={(e) => {
                  setUserData((init) => {
                    return {
                      ...init,
                      about: e.target.value,
                    };
                  });
                }}
                InputProps={{ inputProps: { minLength: 150 } }}
                multiline
                rows={8}
              />
            </FormControl>
          </div>
        </div>

        {/* Cost lesson per hour */}
        <div className="cost-lesson">
          <h3 className="cost-lesson-title">{t("form.costClass")}</h3>
          <div className="cost-wrapper">
            <TextField
              sx={textFieldStyle}
              label={"Enter cost"}
              id="outlined-basic"
              variant="outlined"
              type="number"
              required
              value={userData.hourly_rate}
              onChange={(e) => {
                setUserData((init) => {
                  return { ...init, hourly_rate: e.target.value };
                });
              }}
            />

            {/* Currency */}
            <FormControl>
              <InputLabel>{t("extra.Currency")}</InputLabel>
              <Select
                required
                sx={selectStyle}
                label="Currency"
                labelId="Currency"
                id="currency"
                value={
                  userData.hourly_rate_type === null
                    ? 0
                    : userData.hourly_rate_type
                }
                onChange={(e) => {
                  setUserData((init) => {
                    return {
                      ...init,
                      hourly_rate_type: e.target.value as number,
                    };
                  });
                }}
                IconComponent={KeyboardArrowUp}
              >
                <MenuItem sx={menuItemStyle} value={0}>
                  UZS
                </MenuItem>
                <MenuItem sx={menuItemStyle} value={1}>
                  USD
                </MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Free lesson */}
          <FormGroup className="free-lesson-form-group">
            <FormControlLabel
              className="free-lesson-form-control-label"
              control={
                <input
                  checked={Boolean(userData.test_lesson)}
                  type="checkbox"
                  className="free-lesson-checkbox"
                  onChange={() =>
                    setUserData((init) => {
                      return {
                        ...init,
                        test_lesson: !Boolean(userData.test_lesson),
                      };
                    })
                  }
                />
              }
              label={t("form.freeTrial")}
            />
          </FormGroup>
        </div>

        {/* Classess Schedule */}
        <div className="schedule-classes">
          <h3 className="schedule-classes-title">{t("form.schedule")}</h3>

          <div className="schedules">
            {schedule.map((weekDay, index) => {
              return (
                <div
                  key={index}
                  className={weekDay.is_valid ? "schedule active" : "schedule"}
                  onClick={() => {
                    setDayIndex(index);
                    handleOpenModal();
                  }}
                >
                  <span className="day">{weekNames[index]}</span>
                  <div className="time">
                    {weekDay.is_valid ? (
                      <>
                        {weekDay.firstTime?.beginHour}.
                        {weekDay.firstTime?.beginMinute} -
                        {weekDay.firstTime?.finishHour}.
                        {weekDay.firstTime?.finishMinute} <br />
                        {weekDay.secondTime?.beginHour?.length > 0 &&
                          `${weekDay.secondTime?.beginHour}.
                        ${weekDay.secondTime?.beginMinute} -
                        ${weekDay.secondTime?.finishHour}.
                        ${weekDay.secondTime?.finishMinute}`}
                      </>
                    ) : (
                      t("extra.time")
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Supporting documents */}
        <div className="supporting-documents">
          <h3 className="supporting-documents-title">
            {t("form.confirmDocument")}
          </h3>

          <div className="documents">
            <div className="certificates">
              {/* popover place for handle file */}
              <Button
                style={{
                  padding: "0",
                }}
                className="upload-popup-btn"
                variant="contained"
                onClick={openHandleCertificatePopover}
              >
                <label className="image-uploader-label">
                  <Add />
                  {t("form.add")}
                </label>
              </Button>

              {certificates &&
                user.certificates?.map((item, index) => {
                  return (
                    <div key={index} className="preview-document">
                      <div className="certificate-image-wrapper">
                        <div
                          onClick={() => handleClickOpenCertDialog(item.id)}
                          className="remove-image"
                        >
                          <Close />
                        </div>
                        <img
                          src={item.link}
                          alt="certificate-img"
                          className="preview-document-image"
                        />
                      </div>
                      <div className="document-name">
                        <h4 className="preview-document-title">
                          {item.grade_id === null || item.type_id === null
                            ? item.name
                            : certificates
                            ? `${certificates[item.type_id - 1]?.name} ${
                                certificates[item.type_id - 1]?.values[
                                  item.grade_id
                                ]
                              }`
                            : null}
                        </h4>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Dialog for remove certificate */}
            <Dialog
              open={openCertDialog}
              onClose={handleCloseCertDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <div className="dialog-content">
                <h3 className="dialog-title">{t("extra.AreYouSure")}</h3>
                <button
                  onClick={removeCertificate}
                  className="confirm-command-btn"
                >
                  {t("extra.Delete")}
                </button>
                <button onClick={handleCloseCertDialog} className="cancel-btn">
                  {t("extra.Cancel")}
                </button>
              </div>
            </Dialog>

            <div className="upload-image">
              <Popover
                className="upload-popover"
                open={Boolean(anchorHandleCertificate)}
                anchorEl={anchorHandleCertificate}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
              >
                <div className="upolad-popover-header">
                  <h2 className="upolad-popover-title">
                    {t("extra.download")}
                  </h2>
                  <Close
                    onClick={() => closeHandleCertificatePopover()}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="upload-popover-body">
                  <h3 className="upload-file-title">
                    {t("extra.typeOfDownload")}
                  </h3>
                  <label
                    onClick={() => setIsCertificate(false)}
                    className="upload-document-btn"
                    htmlFor="upload-image"
                  >
                    {t("extra.document")}
                  </label>
                  <label
                    onClick={() => setIsCertificate(true)}
                    className="upload-document-btn"
                    htmlFor="upload-image"
                  >
                    {t("extra.certificate")}
                  </label>
                  <input
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        setCertificate(e.target.files[0]);
                      }
                    }}
                    type="file"
                    name="upload-image-input"
                    id="upload-image"
                    className="image-uploader"
                  />
                </div>
              </Popover>

              {/* Popover for upload */}
              <Popover
                className="upload-popover"
                open={Boolean(anchorUploadCertificate)}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
              >
                <div className="upolad-popover-header">
                  <h2 className="upolad-popover-title">
                    {t("profile.addMaterial")}
                  </h2>
                  <Close
                    onClick={() => closeUploadCertificatePopover()}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                <div className="upload-popover-body">
                  <h3 className="body-title">{t("form.startDownload")}</h3>
                  <div className="upload-file">
                    <div className="file-logo">
                      <InsertDriveFile />
                    </div>
                    <div className="file-data">
                      <div className="name-upload-proccess">
                        <h4 className="file-name">{certificate?.name}</h4>
                        {value > 0 && (
                          <label
                            className="upload-proccess"
                            htmlFor="progress-bar"
                          >
                            {value}%
                          </label>
                        )}
                      </div>
                      {value > 0 && (
                        <div className="progress-file">
                          <progress
                            id="progress-bar"
                            value={value}
                            max={100}
                          ></progress>
                        </div>
                      )}
                    </div>
                    <label
                      className="change-file"
                      ref={useLabel}
                      htmlFor="cancel"
                    >
                      <img src={Cancel} alt="cancel-btn" />
                      <input
                        accept="image/*"
                        className="image-uploader"
                        type="file"
                        onChange={(e) => {
                          if (e.target.files) {
                            setCertificate(e.target.files[0]);
                          }
                        }}
                        name="upload-image-input"
                        id="cancel"
                      />
                    </label>
                  </div>

                  {isCertificate ? (
                    <div className="certificate-name-score-wrapper">
                      {/* Type Certificate */}
                      <FormControl className="form-control" size="small">
                        <InputLabel
                          className="input-label"
                          id="type-certificate"
                        >
                          {t("extra.typeOfCertificate")}
                        </InputLabel>

                        <Select
                          labelId="type-certificate"
                          id="type-certificate"
                          label="type-certificate"
                          IconComponent={KeyboardArrowUp}
                          onChange={(event) => {
                            setTypeCertificate(event.target.value);
                          }}
                          value={typeCertificate}
                        >
                          {certificates.map((element, index) => {
                            return (
                              <MenuItem
                                sx={menuItemStyle}
                                key={index}
                                value={element.id}
                              >
                                {element.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>

                      {/* Score Certificate */}
                      <FormControl className="form-control" size="small">
                        <InputLabel
                          className="input-label"
                          id="score-certificate"
                        >
                          {t("extra.Score")}
                        </InputLabel>

                        <Select
                          sx={selectStyle}
                          labelId="score-certificate"
                          id="score-certificate"
                          label="score-certificate"
                          value={scoreCertificate}
                          onChange={(event) => {
                            if (typeof event.target.value === "number") {
                              setScoreCertificate(event.target.value);
                            }
                          }}
                          IconComponent={KeyboardArrowUp}
                        >
                          {certificates &&
                            certificates
                              .find((el) => el.id === Number(typeCertificate))
                              ?.values.map((item, index) => {
                                return (
                                  <MenuItem
                                    sx={menuItemStyle}
                                    key={index}
                                    value={index}
                                  >
                                    {item}
                                  </MenuItem>
                                );
                              })}
                        </Select>
                      </FormControl>
                    </div>
                  ) : (
                    <input
                      value={certificateName}
                      onChange={(e) => {
                        setCertificateName(e.target.value);
                      }}
                      type="text"
                      className="enter-file-name"
                      placeholder={t("extra.fileName") as string}
                    />
                  )}
                  {errorInput && (
                    <span className="error" style={{ color: "red" }}>
                      {t("extra.pleaseFillTheInput")}
                    </span>
                  )}
                  <div className="add-cancel-btn-wrapper">
                    <button
                      className="add-certificate"
                      onClick={uploadCertificate}
                    >
                      {t("profile.add")}
                    </button>
                    <button
                      onClick={() => closeUploadCertificatePopover()}
                      className="cancel-action"
                    >
                      {t("profile.toCancel")}
                    </button>
                  </div>
                </div>
              </Popover>
            </div>
          </div>
        </div>

        {/* save and cancel buttons */}
        <div className="save-cancel">
          <div className="wrapper">
            <button className="save-btn">{t("form.save")}</button>
          </div>

          <Link to="/teacher-profile" className="cancel-btn">
            {t("profile.toCancel")}
          </Link>
        </div>
      </form>

      {/* Schedule time modal */}
      <Modal
        className="modal"
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style} className="box-modal">
            {dayIndex >= 0 && (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    checkHourValues();
                  }}
                  className="modal-content"
                >
                  <div className="modal-header">
                    <h3 className="modal-title">{t("form.specifyTime")}</h3>
                    <Close
                      onClick={() => handleClose()}
                      className="close-modal-icon"
                    />
                  </div>

                  {/* first time */}
                  <div className="modal-time">
                    <div className="beginning-time">
                      <h4 className="beginning-time-title">
                        {t("form.begin")}
                      </h4>
                      <div className="beginning-time-inputs">
                        {/* begin hour */}
                        <input
                          required
                          type="number"
                          pattern="\d*"
                          min={0}
                          maxLength={2}
                          max={23}
                          ref={fBeginHourRef}
                          className="beginning-time-hour-input"
                          defaultValue={schedule[dayIndex].firstTime?.beginHour}
                          onChange={(e) => {
                            handleTimeChange(
                              Number(e.target.value),
                              "beginHour",
                              "firstTime",
                              dayIndex
                            );
                            setFocus();
                          }}
                        />

                        <img src={DoublePoint} alt="double-point" />

                        {/* begin minute */}
                        <input
                          required
                          type="number"
                          pattern="\d*"
                          min={0}
                          maxLength={2}
                          max={59}
                          ref={fBeginMinRef}
                          className="beginning-time-minute-input"
                          defaultValue={
                            schedule[dayIndex].firstTime?.beginMinute
                          }
                          onChange={(e) => {
                            handleTimeChange(
                              Number(e.target.value),
                              "beginMinute",
                              "firstTime",
                              dayIndex
                            );
                            setFocus();
                          }}
                        />
                      </div>
                    </div>
                    <div className="finishing-time">
                      <h4 className="finishing-time-title">{t("form.end")}</h4>
                      <div className="finishing-time-inputs">
                        {/* finish hour */}
                        <input
                          required
                          type="number"
                          pattern="\d*"
                          min={0}
                          maxLength={2}
                          max={23}
                          ref={fFinishHourRef}
                          className="finishing-time-hour-input"
                          defaultValue={
                            schedule[dayIndex].firstTime?.finishHour
                          }
                          onChange={(e) => {
                            handleTimeChange(
                              Number(e.target.value),
                              "finishHour",
                              "firstTime",
                              dayIndex
                            );
                            setFocus();
                          }}
                        />

                        <img src={DoublePoint} alt="double-point" />

                        {/* finish minute */}
                        <input
                          required
                          type="number"
                          pattern="\d*"
                          min={0}
                          maxLength={2}
                          max={59}
                          ref={fFinishMinRef}
                          className="finishing-time-minute-input"
                          defaultValue={
                            schedule[dayIndex].firstTime?.finishMinute
                          }
                          onChange={(e) => {
                            handleTimeChange(
                              Number(e.target.value),
                              "finishMinute",
                              "firstTime",
                              dayIndex
                            );
                            setFocus();
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* second time */}
                  {showSecondTime && (
                    <div className="modal-time">
                      <div className="beginning-time">
                        <h4 className="beginning-time-title">
                          {t("form.begin")}
                        </h4>
                        <div className="beginning-time-inputs">
                          {/* begin hour */}
                          <input
                            required
                            type="number"
                            pattern="\d*"
                            min={0}
                            maxLength={2}
                            max={23}
                            ref={sBeginHourRef}
                            className="beginning-time-hour-input"
                            defaultValue={
                              schedule[dayIndex].secondTime?.beginHour
                            }
                            onChange={(e) => {
                              handleTimeChange(
                                Number(e.target.value),
                                "beginHour",
                                "secondTime",
                                dayIndex
                              );
                              secondSetFocus();
                            }}
                          />

                          <img src={DoublePoint} alt="double-point" />

                          {/* begin minute */}
                          <input
                            required
                            type="number"
                            pattern="\d*"
                            min={0}
                            maxLength={2}
                            max={59}
                            ref={sBeginMinRef}
                            className="beginning-time-minute-input"
                            defaultValue={
                              schedule[dayIndex].secondTime?.beginMinute
                            }
                            onChange={(e) => {
                              handleTimeChange(
                                Number(e.target.value),
                                "beginMinute",
                                "secondTime",
                                dayIndex
                              );
                              secondSetFocus();
                            }}
                          />
                        </div>
                      </div>
                      <div className="finishing-time">
                        <h4 className="finishing-time-title">
                          {t("form.end")}
                        </h4>
                        <div className="finishing-time-inputs">
                          {/* finish hour */}
                          <input
                            required
                            type="number"
                            pattern="\d*"
                            min={0}
                            maxLength={2}
                            max={23}
                            ref={sFinishHourRef}
                            className="finishing-time-hour-input"
                            defaultValue={
                              schedule[dayIndex].secondTime?.finishHour
                            }
                            onChange={(e) => {
                              handleTimeChange(
                                Number(e.target.value),
                                "finishHour",
                                "secondTime",
                                dayIndex
                              );
                              secondSetFocus();
                            }}
                          />

                          <img src={DoublePoint} alt="double-point" />

                          {/* finish minute */}
                          <input
                            required
                            type="number"
                            pattern="\d*"
                            min={0}
                            maxLength={2}
                            max={59}
                            ref={sFinishMinRef}
                            className="finishing-time-minute-input"
                            defaultValue={
                              schedule[dayIndex].secondTime?.finishMinute
                            }
                            onChange={(e) => {
                              handleTimeChange(
                                Number(e.target.value),
                                "finishMinute",
                                "secondTime",
                                dayIndex
                              );
                              secondSetFocus();
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="modal-buttons">
                    <button type="submit" className="save-modal-btn">
                      {t("form.save")}
                    </button>

                    {!showSecondTime ? (
                      <button
                        className="add-modal-time-btn"
                        onClick={(event) => {
                          onButtonClick(event);
                        }}
                      >
                        {t("form.addTime")}
                      </button>
                    ) : null}
                  </div>
                </form>
              </>
            )}
          </Box>
        </Fade>
      </Modal>

      <Footer />
    </div>
  ) : (
    <Loader width="100%" height="100vh" />
  );
};

export default TeacherProfileData;
