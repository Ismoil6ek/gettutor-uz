import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { base_url } from "../../../data";

import "./extraInfo.scss";

import Footer from "../../../components/Footer/Footer";
import InnerLoader from "../../../components/InnerLoader/InnerLoader";

import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { useAppSelector } from "../../../hooks/useTypedSelector";

const ExtraInfo = () => {
  const { t } = useTranslation();
  const { role, user } = useAppSelector((state) => state);
  const [purpose, setPurpose] = useState(null);
  const [array, setArray] = useState<number[]>([]);
  const [questions, setQuestions] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${base_url}/site/purposes/index`, {
      method: "GET",
      headers: {},
    })
      .then((res) => res.json())
      .then((result) => {
        setPurpose(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handlePurpose = () => {
    fetch(`${base_url}/site/purposes/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        purposes: array,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true && (role === "teacher" || role === null)) {
          navigate("/teacher-profile-data");
        } else if (result.success === true && role !== "teacher") {
          navigate("/");
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCheck = (e: number, type: boolean) => {
    if (e && type === true) {
      // arr.push(e);
      setArray([...array, e]);
    } else if (type === false) {
      let newArr = array.filter((el) => el !== e);
      setArray(newArr);
    }
  };

  useEffect(() => {
    for (let i = 1; i <= 15; i++) {
      let temp = questions;
      questions.push(i);
      setQuestions(temp);
    }
  }, []);

  return (
    <div className="info-container">
      <div className="info">
        <div className="info-title">{t("authentication.yourIntentions")}</div>
        <div className="info-forms">
          {role === "teacher" ? (
            <FormGroup>
              {questions &&
                questions
                  .filter((el) => el <= 7)
                  .map((el, index) => {
                    return (
                      <div className="info-form">
                        <Checkbox
                          value={el}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            handleCheck(
                              Number(e.target.value),
                              e.target.checked
                            );
                          }}
                        />
                        <span className="info-form-span">
                          {t(`authentication.question#${el}`)}
                        </span>
                      </div>
                    );
                  })}
            </FormGroup>
          ) : role === "student" ? (
            <FormGroup>
              {questions &&
                questions
                  .filter((el) => el <= 15 && el > 7)
                  .map((el, index) => {
                    return (
                      <div key={index} className="info-form">
                        <Checkbox
                          value={el}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            handleCheck(
                              Number(e.target.value),
                              e.target.checked
                            );
                          }}
                        />
                        <span className="info-form-span">
                          {t(`authentication.question#${el}`)}
                        </span>
                      </div>
                    );
                  })}
            </FormGroup>
          ) : (
            <InnerLoader />
          )}
        </div>
        <div className="info-btn">
          <button
            onClick={() => {
              handlePurpose();
            }}
            className="info_btn"
          >
            {t("main.send")}
          </button>
        </div>
      </div>{" "}
      <Footer />
    </div>
  );
};

export default ExtraInfo;
