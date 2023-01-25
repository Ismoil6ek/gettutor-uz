import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import { Link, useNavigate } from "react-router-dom";
import { base_url } from "../../data";
import { useTranslation } from "react-i18next";
import { GoogleLogin } from "react-google-login";
import { getRole } from "../../redux/actions";

// Companents
import Footer from "../../components/Footer/Footer";
// Style
import "./registration.scss";
import strelka from "../../assets/svg/strelka.svg";
import { useDispatch } from "react-redux";
import { role } from "../../data/interfaces";
// state for change tab components
const Registration = () => {
  const { t } = useTranslation();
  const [tabId, setTabId] = useState(2);
  const [registAs, setRegistAs] = useState(0);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState<string>("");
  const [role, setRole] = useState<role>("teacher");
  const [code, setCode] = useState("");
  const [isCode, setIsCode] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [isCodeDisabled, setIsCodeDisabled] = useState(false);
  const [phoneColor, setPhoneColor] = useState("default");
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const clientId =
    "855022301005-d508bini407afago3inee0ffhgfl05au.apps.googleusercontent.com";

  useEffect(() => {
    const initClient = () => {
      gapi.auth2.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  });

  const handleSignUp = () => {
    if (phone && surname !== "" && name !== "" && !code) {
      fetch(`${base_url}/site/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: name,
          lastname: surname,
          phone: `+998${phone}`,
          role: role,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success === true) {
            setTabId(3);
            setIsActive(true);
            setSeconds(60);
          } else {
            setTabId(0);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (phone && code) {
      fetch(`${base_url}/site/users/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: `+998${phone}`,
          code: code,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success === true) {
            localStorage.setItem("token", result.data.token);
            navigate("/extra-info");
            setIsCode(true);
            window.location.reload();
          } else {
            setIsCode(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSignIn = async () => {
    if (phone.length === 9) {
      if (phone && !code) {
        await fetch(`${base_url}/site/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: `+998${phone}`,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.success === true) {
              setTabId(1);
              setIsActive(true);
              setSeconds(60);
            } else {
              setTabId(2);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (phone && code) {
        await fetch(`${base_url}/site/users/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: `+998${phone}`,
            code: code,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.success === true) {
              localStorage.setItem("token", result.data.token);
              const pathName = localStorage.getItem("pathName");
              if (pathName) {
                window.location.reload();
                navigate(localStorage.getItem("pathName")!);
                localStorage.removeItem("pathName");
              } else {
                navigate("/");
                window.location.reload();
              }
            } else {
              setIsCode(false);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
  // timer counter from 60 to 0
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
      if (seconds <= 0) {
        setIsCodeDisabled(true);
        clearInterval(interval);
        setIsActive(false);
      }
    }
    return () => clearInterval(interval as NodeJS.Timeout);
  }, [isActive, seconds]);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.replace(/\D/g, "").length === 9) {
      setPhoneColor("success");
    } else {
      setPhoneColor("default");
    }
    setPhone(event.target.value.replace(/\D/g, "").substring(0, 9));
    formatToPhone(event);
  };

  const formatToPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    // format for phone (+998) 99 9999999
    const input = event.target.value.replace(/\D/g, "").substring(0, 9); // First ten digits of input only
    const areaCode = input.substring(0, 3);
    const middle = input.substring(3, 5);
    const last = input.substring(5, 8);
    const double_first = input.substring(8, 10);
    const double_second = input.substring(7, 9);

    if (input.length > 7) {
      event.target.value = `(+${areaCode}) ${middle} ${last}-${double_first}-${double_second}`;
      if (input.length === 9) {
        setPhoneColor("success");
      }
    } else if (input.length > 8) {
      event.target.value = `(+${areaCode}) ${middle} ${last}-${double_first}`;
    } else if (input.length > 5) {
      event.target.value = `(+${areaCode}) ${middle} ${last}`;
    } else if (input.length > 3) {
      event.target.value = `(+${areaCode}) ${middle}`;
    } else if (input.length > 0) {
      event.target.value = `(+${areaCode})`;
    }
  };

  // __________________________Google Login
  const handleFailure = (result: any) => {
    console.log(result);
  };

  const handleVerify = (googleData: any) => {
    setToken(googleData.accessToken);
    fetch(`${base_url}/site/social/google/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: googleData.accessToken,
      }),
    })
      .then((data) => data.json())
      .then((result) => {
        if (result.success) {
          localStorage.setItem("token", result.data.token);
          navigate("/");
          window.location.reload();
        } else {
          setTabId(4);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleLogin = () => {
    fetch(`${base_url}/site/social/google/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        role: role,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        navigate("/extra-info");
        dispatch(getRole(role));
        localStorage.setItem("token", data.data.token);
      });
  };

  const changeTabItem = (state: number) => {
    switch (state) {
      case 0:
        return (
          <div className="registration">
            <div
              className={
                tabId === 2
                  ? "registration-btns left"
                  : "registration-btns right"
              }
            >
              <button className="registration-btn" onClick={() => setTabId(2)}>
                {t("authentication.registiration")}
              </button>
              <button
                onClick={() => {
                  setTabId(0);
                }}
                className="registration-btn"
              >
                {t("authentication.signIn")}
              </button>
            </div>
            <div className="registration-hr">
              <hr />
            </div>
            <div className="registration-div">
              <div className="registration-div-inputs">
                <div
                  className="registration-div-input"
                  style={
                    phoneColor === "success"
                      ? { border: "1px solid #0023B8" }
                      : {}
                  }
                >
                  <span>+998</span>
                  <div className="line"></div>
                  <input
                    autoFocus
                    placeholder={String(t("authentication.phoneNumber"))}
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      handlePhoneChange(event);
                    }}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        handleSignIn();
                      }
                    }}
                  ></input>
                </div>
              </div>
              <div className="registration-submit-btns">
                <button
                  className="registration-submit-btn-enter button-hover"
                  onClick={() => {
                    if (phone.length === 9) {
                      handleSignIn();
                    }
                  }}
                >
                  {t("authentication.signIn")}
                </button>
                <div className="arrow">
                  <img src={strelka} alt="photo" />
                  <hr />
                </div>

                <GoogleLogin
                  clientId={clientId}
                  onSuccess={handleVerify}
                  onFailure={handleFailure}
                  className="registration-submit-btn-reg"
                >
                  <span>
                    {t("authentication.google")}
                  </span>
                </GoogleLogin>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="registration-div-verify">
            <h1 className="title">{t("authentication.verify")}</h1>
            <div className="registration-hr">
              <hr />
            </div>
            <div className="content-title">{t("authentication.codeSent")}</div>
            <div className="registration-div-inputs">
              <input
                className="registration-div-input-number"
                placeholder={String(t("authentication.phoneNumber"))}
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                }}
                type="text"
              ></input>
              <input
                autoFocus
                value={code}
                disabled={seconds === 0 ? true : false}
                onChange={(event) => {
                  setCode(event.target.value);
                }}
                className="registration-div-input"
                placeholder={String(t("authentication.code"))}
                type="number"
                style={
                  isCode === false
                    ? {
                        border: "1px solid red",
                      }
                    : { border: "1px solid grey" }
                }
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    if (code !== "") {
                      handleSignIn();
                    }
                  }
                }}
              ></input>
              <div className="seconds">
                <div>{seconds}</div> | {t("authentication.second")}
              </div>
            </div>
            <div className="registration-submit-btns">
              <button
                style={
                  seconds === 0
                    ? { background: "grey", cursor: "not-allowed" }
                    : {}
                }
                onClick={() => {
                  if (code !== "" && seconds > 0) {
                    handleSignIn();
                  }
                }}
                className="registration-submit-btn-enter button-hover"
              >
                {t("authentication.confirm")}
              </button>
              <button
                onClick={() => {
                  if (phone.length === 9 && seconds === 0) {
                    handleSignIn();
                  }
                }}
                className="registration-submit-btn-reg"
                style={
                  seconds === 0
                    ? { border: "1px solid blue", color: "black" }
                    : {
                        border: "1px solid grey",
                        color: "grey",
                        cursor: "not-allowed",
                      }
                }
              >
                {t("authentication.again")}
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="registration">
            <div
              className={
                tabId === 2
                  ? "registration-btns left"
                  : "registration-btns right"
              }
            >
              <button className="registration-btn" onClick={() => setTabId(2)}>
                {t("authentication.registiration")}
              </button>
              <button
                onClick={() => {
                  setTabId(0);
                }}
                className="registration-btn"
              >
                {t("authentication.signIn")}
              </button>
            </div>
            <div className="registration-hr">
              <hr />
            </div>
            <div className="registration-div">
              <div className="registration-div-inputs">
                <input
                  autoFocus
                  className="registration-div-input"
                  placeholder={String(t("authentication.yourName"))}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  style={name !== "" ? { border: "1px solid #0023b8" } : {}}
                  type="text"
                ></input>
                <input
                  className="registration-div-input"
                  onChange={(event) => {
                    setSurname(event.target.value);
                  }}
                  value={surname}
                  placeholder={String(t("authentication.yourSurname"))}
                  type="text"
                  style={surname !== "" ? { border: "1px solid #0023b8" } : {}}
                ></input>
                <div
                  className="registration-div-input"
                  style={
                    phoneColor === "success"
                      ? { border: "1px solid #0023B8" }
                      : {}
                  }
                >
                  <span>+998</span>
                  <div className="line"></div>
                  <input
                    placeholder={String(t("authentication.phoneNumber"))}
                    value={phone}
                    onChange={(event) => {
                      handlePhoneChange(event);
                    }}
                    onKeyDown={(
                      event: React.KeyboardEvent<HTMLInputElement>
                    ) => {
                      if (event.key === "Enter") {
                        handleSignIn();
                      }
                    }}
                  ></input>
                </div>
              </div>
              <div className="registration-div-as-title">
                {t("authentication.register")}
              </div>
              <div className="wrapper">
                <div
                  className={
                    registAs === 0
                      ? "registration-div-as left"
                      : "registration-div-as right"
                  }
                >
                  <div
                    className={
                      registAs === 0
                        ? "registration-div-role registration-active"
                        : "registration-div-role"
                    }
                    onClick={() => {
                      setRegistAs(0);
                      setRole("teacher");
                    }}
                  >
                    <div className="registration-div-role-img"></div>
                    {t("authentication.asTutor")}
                  </div>
                  <div
                    className={
                      registAs === 1
                        ? "registration-div-role registration-active"
                        : "registration-div-role"
                    }
                    onClick={() => {
                      setRegistAs(1);
                      setRole("student");
                    }}
                  >
                    <div className="registration-div-as-pupil-img"></div>
                    {t("authentication.asStudent")}
                  </div>
                </div>
              </div>

              <div className="registration-submit-btns">
                <button
                  onClick={() => {
                    if (phone.length === 9 && surname !== "" && name !== "") {
                      handleSignUp();
                    }
                  }}
                  className="registration-submit-btn-enter button-hover"
                >
                  {t("authentication.register")}
                </button>
                <div className="arrow">
                  <img src={strelka} alt="arrow" />
                  <hr />
                </div>
                <GoogleLogin
                  clientId={clientId}
                  onSuccess={handleVerify}
                  onFailure={handleFailure}
                  className="registration-submit-btn-reg"
                >
                  <span>
                    {t("authentication.google")}
                  </span>
                </GoogleLogin>
              </div>
              <div className="registration-terms">
                <p className="registration-terms-p">
                  {t("authentication.agree")}
                </p>
                <div className="registration-terms-links">
                  <Link to="/terms-of-use" className="registration-terms-link">
                    {t("authentication.termsofUse")}
                  </Link>
                  {t("authentication.and")}
                  <Link to="/confidencial" className="registration-terms-link">
                    {t("authentication.privacyPolicy")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="registration-div-verify">
            <h1 className="title">{t("authentication.verify")}</h1>
            <div className="registration-hr">
              <hr />
            </div>
            <div className="content-title">{t("authentication.codeSent")}</div>
            <div className="registration-div-inputs">
              <input
                className="registration-div-input-number"
                placeholder={String(t("authentication.phoneNumber"))}
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                }}
                type="text"
              ></input>
              <input
                autoFocus
                value={code}
                disabled={seconds === 0 ? true : false}
                onChange={(event) => {
                  setCode(event.target.value);
                }}
                className="registration-div-input"
                placeholder={String(t("authentication.code"))}
                type="number"
                style={
                  isCode === false
                    ? {
                        border: "1px solid red",
                      }
                    : { border: "1px solid grey" }
                }
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    if (code !== "") {
                      handleSignUp();
                    }
                  }
                }}
              ></input>
              <div className="seconds">
                <div>{seconds}</div> | {t("authentication.second")}
              </div>
            </div>
            <div className="registration-submit-btns">
              <button
                style={
                  seconds === 0
                    ? { background: "grey", cursor: "not-allowed" }
                    : {}
                }
                onClick={() => {
                  if (code !== "" && seconds > 0) {
                    handleSignUp();
                  }
                }}
                className="registration-submit-btn-enter button-hover"
              >
                {t("authentication.confirm")}
              </button>
              <button
                onClick={() => {
                  if (phone.length === 9 && seconds === 0) {
                    handleSignUp();
                  }
                }}
                className="registration-submit-btn-reg"
                style={
                  seconds === 0
                    ? { border: "1px solid blue", color: "black" }
                    : {
                        border: "1px solid grey",
                        color: "grey",
                        cursor: "not-allowed",
                      }
                }
              >
                {t("authentication.again")}
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="registration">
            <h3 className="h1">{t("extra.pleaseSelectRole")}</h3>
            <div className="wrapper">
              <div
                className={
                  registAs === 0
                    ? "registration-div-as left"
                    : "registration-div-as right"
                }
              >
                <div
                  className={
                    registAs === 0
                      ? "registration-div-role registration-active"
                      : "registration-div-role"
                  }
                  onClick={() => {
                    setRegistAs(0);
                    setRole("teacher");
                  }}
                >
                  <div className="registration-div-role-img"></div>
                  {t("authentication.asTutor")}
                </div>
                <div
                  className={
                    registAs === 1
                      ? "registration-div-role registration-active"
                      : "registration-div-role"
                  }
                  onClick={() => {
                    setRegistAs(1);
                    setRole("student");
                  }}
                >
                  <div className="registration-div-as-pupil-img"></div>
                  {t("authentication.asStudent")}
                </div>
              </div>
            </div>
            <button
              className="registration-submit-btn-enter"
              onClick={() => {
                handleLogin();
              }}
            >
              {t("authentication.signIn")}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="registration-container">
      <div className="ragistration-page">{changeTabItem(tabId)}</div>
      <Footer />
    </div>
  );
};

export default Registration;
