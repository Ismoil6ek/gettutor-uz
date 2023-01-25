import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import defaultImg from "../../assets/svg/defaultImg.png";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  TextField,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useTranslation } from "react-i18next";
import { base_url, MenuProps } from "../../data";
import { Link, useNavigate } from "react-router-dom";
import CropEasy from "../../components/CropImage/cropEasy";
import { menuItemStyle, selectStyle, textFieldStyle } from "../../data/styles";
import { useAppSelector } from "../../hooks/useTypedSelector";
import { language, pupilData } from "../../data/interfaces";
import { fileUpload, timeHandler } from "../../utils";
import "./pupilProfileData.scss";

const TODAY = new Date();
const DAY_IN_MILLISECONDS = 1 * 24 * 3600 * 1000;
const MAXDATE = new Date(TODAY.getTime() - 5 * 365 * DAY_IN_MILLISECONDS);

const PupilProfileData = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const { user, countries, regions, languages } = useAppSelector(
    (state) => state
  );

  const [userData, setUserData] = useState<pupilData>({
    avatar_image: "",
    firstname: "",
    lastname: "",
    email: "",
    birthday: "",
    country_id: "",
    region_id: "",
    gender: "",
    languages: [],
    about: "",
  });

  useEffect(() => {
    if (user) {
      setUserData((init) => {
        return {
          ...init,
          avatar_image: user?.avatar_image ?? "",
          firstname: user?.firstname ?? "",
          lastname: user?.lastname ?? "",
          email: user?.email ?? "",
          birthday: user?.birthday
            ? (timeHandler({
                returnType: "time",
                parameter: user.birthday,
              }) as string)
            : "",
          country_id: user?.country_id ?? "",
          region_id: user?.region_id ?? "",
          gender: user?.gender ?? "",
          languages: user?.language_ids ?? [],
          about: user?.about ?? "",
        };
      });
    }
  }, [user]);

  const updateUserData = (imageFileID?: number) => {
    let body = {
      ...userData,
      birthday: timeHandler({
        returnType: "timestamp",
        parameter: userData.birthday!,
      }),
      file_id: imageFileID !== undefined ? imageFileID : null,
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
      .then((data) => {
        setUserData((init) => {
          return {
            ...init,
            ...data.data,
            birthday: timeHandler({
              returnType: "time",
              parameter: data.data.birthday,
            }),
            avatar_image: data.data.avatar_image,
          };
        });
        navigate("/pupil-profile");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (file && file.name) {
      await fileUpload(file).then(updateUserData);
    } else {
      updateUserData();
    }
  };

  return (
    <div className="pupil-profile-data-container">
      <form className="pupil-profile-data" onSubmit={handleFormSubmit}>
        <h1 className="pupil-profile-data-title">{t("studentForm.form")}</h1>
        {/* Image section */}
        <div className="pupil-profile-data-image-content-wrapper">
          <div className="pupil-profile-data-avatar-wrapper">
            <img
              className="pupil-profile-data-avatar-image"
              src={userData.avatar_image ? userData.avatar_image : defaultImg}
              alt="user_image"
            />
          </div>
          <div className="pupil-profile-data-image-status">
            <h3 className="pupil-profile-data-image-status-title">
              {t("studentForm.profilePhoto")}
            </h3>
            <p className="pupil-profile-data-image-status-content">
              {t("studentForm.maxSize")}
            </p>
            <label htmlFor="upload-img" className="upload-user-image">
              {t("studentForm.choose")}
            </label>
            <input
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0]); // send image file to the upload API
                  setUserData((init) => {
                    return {
                      ...init,
                      avatar_image: URL.createObjectURL(e.target.files![0]),
                    };
                  }); // state to put image locally
                }
              }}
              accept="image/png, image/gif, image/jpeg"
              style={{ display: "none" }}
              type="file"
              name=""
              id="upload-img"
            />
          </div>
          {/* Easy Crop */}
          {file ? (
            <CropEasy
              photoURL={userData.avatar_image!}
              files={file}
              setFile={(BlobFile) => {
                setFile(new File([BlobFile], "filename"));
              }}
              setPhotoURL={(e) => {
                setUserData((init) => {
                  return {
                    ...init,
                    avatar_image: e,
                  };
                });
              }}
            />
          ) : (
            ""
          )}
        </div>

        {/* Inputs section */}
        <div className="pupil-profile-enter-datas-wrapper">
          <div className="pupil-profile-personal-info-wrapper">
            <h3 className="pupil-profile-personal-info-title">
              {t("studentForm.personalInfo")}
            </h3>
            <div className="pupil-profile-personal-info-inputs-wrapper">
              {/* Name */}
              <TextField
                sx={textFieldStyle}
                label={t("form.yourName")}
                id="outlined-basic"
                variant="outlined"
                type="text"
                required
                value={userData.firstname}
                onChange={(e) => {
                  setUserData((init) => {
                    return { ...init, firstname: e.target.value };
                  });
                }}
              />

              {/* Surname */}
              <TextField
                sx={textFieldStyle}
                label={t("form.yourSurname")}
                id="outlined-basic"
                variant="outlined"
                required
                type="text"
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

              {/* Gmail */}
              <TextField
                sx={textFieldStyle}
                label={"E-mail"}
                id="outlined-basic"
                variant="outlined"
                value={userData.email}
                type="email"
                onChange={(e) => {
                  setUserData((init) => {
                    return {
                      ...init,
                      email: e.target.value,
                    };
                  });
                }}
              />

              {/* Birthday */}
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

              {/* Country */}
              <FormControl required>
                <InputLabel>{t("form.country")}</InputLabel>
                <Select
                  sx={selectStyle}
                  labelId="country"
                  id="country"
                  label={t("form.country")}
                  IconComponent={KeyboardArrowUpIcon}
                  value={userData.country_id}
                  onChange={(e) => {
                    setUserData((init) => {
                      return {
                        ...init,
                        country_id: Number(e.target.value),
                        region_id: "",
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
              <FormControl required>
                <InputLabel>{t("form.region")}</InputLabel>
                <Select
                  sx={selectStyle}
                  labelId="region"
                  id="region"
                  label={t("form.region")}
                  value={userData.region_id}
                  onChange={(e) => {
                    setUserData((init) => {
                      return { ...init, region_id: Number(e.target.value) };
                    });
                  }}
                  IconComponent={KeyboardArrowUpIcon}
                >
                  {regions && userData.country_id !== null
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
                  IconComponent={KeyboardArrowUpIcon}
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
                  IconComponent={KeyboardArrowUpIcon}
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
            </div>

            {/* Autobiography */}
            <div className="about-me">
              <h3 className="about-me-title">
                {t("studentForm.writeYourself")}
              </h3>
              <FormControl fullWidth>
                <TextField
                  sx={textFieldStyle}
                  id="outlined-multiline-static"
                  value={userData.about}
                  onChange={(e) => {
                    setUserData((init) => {
                      return {
                        ...init,
                        about: e.target.value,
                      };
                    });
                  }}
                  multiline
                  rows={8}
                />
              </FormControl>
            </div>
          </div>
        </div>

        <div className="save-cancel">
          <button type="submit" className="save-btn">
            {t("studentForm.save")}
          </button>

          <Link to="/profile" className="cancel-btn">
            {t("studentForm.cancel")}
          </Link>
        </div>
      </form>

      <Footer />
    </div>
  );
};

export default PupilProfileData;
