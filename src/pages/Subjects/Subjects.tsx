import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { useTranslation } from "react-i18next";

// images
import mainImg3 from "../../assets/svg/SubImg1.svg";

// mui
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

//  style
import "./subjects.scss";
import { changeFilter } from "../../redux/actions";
import { useAppSelector } from "../../hooks/useTypedSelector";
import { language } from "../../data/interfaces";
import { useAppDispatch } from "../../configStore";

const Subjects = () => {
  const { subjects, role, filter } = useAppSelector((state) => state);
  const { t, i18n } = useTranslation();
  const [subjectsId, setSubjectsId] = useState<number>(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const dispatch = useAppDispatch();

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="subjects-container">
      <div className="subjects">
        <div
          className="subjects-title"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {t("main.subjects")}
        </div>
        <div
          className="subjects-sort"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div className="subjects-title">{t("main.subjects")}</div>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="demo-simple-select-standard-label">
              {t("viewTutor.sort")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Age"
              onChange={(e: SelectChangeEvent) => {
                setSubjectsId(Number(e.target.value));
              }}
            >
              <MenuItem sx={{ borderRadius: "5px", margin: "5px" }} value={0}>
                {t("main.allSubjects")}
              </MenuItem>
              {subjects ? Object.values(subjects.byCategory).map((el, index) => {
                return (
                  <MenuItem
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "20px",
                      borderRadius: "5px",
                      margin: "5px",
                    }}
                    value={el.id}
                  >
                    <div>{el.name[i18n.language as language]}</div>
                    <div>{el.quantity}</div>
                  </MenuItem>
                );
              }) : null}
            </Select>
          </FormControl>
        </div>
        <div className="subjects-container">
          {subjects && subjects.isFetched
            ? Object.values(subjects.byCategory)
              .filter((element) => element.quantity > 0)
              .filter((el) => {
                if (subjectsId === 0) {
                  return el;
                } else if (subjectsId === el.id) {
                  return el;
                }
              })
              .map((item, index) => {
                return (
                  <div key={index}>
                    <h2
                      className="subjects-name"
                      data-aos="fade-up"
                      data-aos-duration="1000"
                    >
                      {item.name[i18n.language as language]}
                    </h2>
                    <div className="subjects-cards">
                      {item?.data.map((element, index) => {
                        return (
                          <Link
                            key={index}
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            data-aos-delay={(index + 1) * 100}
                            className="subjects-card"
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
                                    value: element.id,
                                    isValid: true,
                                    name: "index",
                                  },
                                })
                              );
                            }}
                          >
                            <img
                              src={element.icon ?? mainImg3}
                              alt="subject"
                              className="subjects-card-img"
                            />
                            <div className="subjects-card-info">
                              <div className="subjects-card-info-title">
                                {element.name[i18n.language as language]}
                              </div>
                              <div className="subjects-card-info-p">
                                {element.quantity === 1 ||
                                  element.quantity === 0
                                  ? `${element.quantity} ${t("main.tutor")}`
                                  : `${element.quantity} ${t(
                                    "main.tutors#2"
                                  )}`}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Subjects;
