import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getRole } from "../../redux/actions";

import "./navbar.scss";

// Images
import Logo from "../../assets/images/logo.svg";
import burger from "../../assets/svg/eva_menu-outline.svg";
import burgerClose from "../../assets/svg/burgerClose.svg";

// Material UI
import Divider from "@mui/material/Divider";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import PersonIcon from "@mui/icons-material/Person";
import { useTranslation } from "react-i18next";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import NotificationPopupTeacher from "../NotificationPopup/NotificationPopupTeacher";
import NotificationPopupStudent from "../NotificationPopup/NotificationPopupStudent";
import { menuItemStyle, selectStyle } from "../../data/styles";
import { useAppSelector } from "../../hooks/useTypedSelector";
import { useAppDispatch } from "../../configStore";
import { language } from "../../data/interfaces";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const [shadow, setShadow] = useState<boolean | null>(null);
  const [burgerOpen, setBurgerOpen] = React.useState(false);
  // state for check teacher or student
  const { role, notifications, notice, user } = useAppSelector(
    (state) => state
  );
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (user) {
      dispatch(getRole(user.role));
    }
    // eslint-disable-next-line
  }, [user]);

  const changeLanguage = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value as string);
    localStorage.setItem("lang", event.target.value);
  };

  // ________________________________Burger Menu

  const toggleDrawer = (open: boolean) => {
    setBurgerOpen(open);
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      scrollFunction();
    });

    return () => {
      window.removeEventListener("scroll", () => {
        scrollFunction();
      });
    };
  }, []);

  function scrollFunction() {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      setShadow(true);
    } else {
      setShadow(false);
    }
  }

  return (
    <div
      className={
        shadow === true
          ? "navbar-container active"
          : shadow === false
          ? "navbar-container inActive"
          : "navbar-container"
      }
    >
      <div className="navbar">
        <Link to="/" className="logo">
          <img src={Logo} alt="logo" />
        </Link>
        <div className="navbar-inner">
          {role === "teacher" ? (
            <div className="nav-menu-items">
              <div className="na-menu-items-links">
                <Link className="nav-menu-item" to="/">
                  {t("header.mainTitle")}
                </Link>
                <Link className="nav-menu-item" to="/#capabilities-container">
                  {t("header.opportunities")}
                </Link>
              </div>
              <div className="nav-additional-items">
                <Select
                  className="select"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={i18n.language as language}
                  onChange={changeLanguage}
                  sx={selectStyle}
                >
                  <MenuItem sx={menuItemStyle} value={"ru"}>
                    Русский
                  </MenuItem>
                  <MenuItem sx={menuItemStyle} value={"en"}>
                    English
                  </MenuItem>
                  <MenuItem sx={menuItemStyle} value={"uz"}>
                    O'zbekcha
                  </MenuItem>
                </Select>

                <NotificationPopupTeacher />
              </div>
            </div>
          ) : role === "student" ? (
            <div className="nav-menu-items">
              <div className="na-menu-items-links">
                <Link className="nav-menu-item" to="/subjects">
                  {t("header.subjects")}
                </Link>
                <Link className="nav-menu-item" to="/tutors">
                  {t("header.findTutor")}
                </Link>
              </div>
              <div className="nav-additional-items">
                <Select
                  className="select"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={i18n.language as language}
                  onChange={changeLanguage}
                  sx={selectStyle}
                >
                  <MenuItem sx={menuItemStyle} value={"uz"}>
                    Oʻzbekcha
                  </MenuItem>
                  <MenuItem sx={menuItemStyle} value={"ru"}>
                    Русский
                  </MenuItem>
                  <MenuItem sx={menuItemStyle} value={"en"}>
                    English
                  </MenuItem>
                </Select>
                <NotificationPopupStudent />
              </div>
            </div>
          ) : (
            <div className="nav-menu-items">
              <div className="na-menu-items-links">
                <Link className="nav-menu-item" to="/">
                  {t("header.mainTitle")}
                </Link>
                <Link className="nav-menu-item" to="/#about">
                  {t("header.aboutProject")}
                </Link>
                <Link className="nav-menu-item" to="/#subjects">
                  {t("header.subjects")}
                </Link>
                <Link className="nav-menu-item" to="/#capabilities-container">
                  {t("header.opportunities")}
                </Link>
              </div>
              <div className="nav-additional-items">
                <Select
                  className="select"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={i18n.language as language}
                  onChange={changeLanguage}
                  sx={selectStyle}
                >
                  <MenuItem sx={menuItemStyle} value={"uz"}>
                    Oʻzbekcha
                  </MenuItem>
                  <MenuItem sx={menuItemStyle} value={"ru"}>
                    Русский
                  </MenuItem>
                  <MenuItem sx={menuItemStyle} value={"en"}>
                    English
                  </MenuItem>
                </Select>
              </div>
            </div>
          )}
        </div>
        <button className="nav-user-avatar">
          {!token ? (
            <Link to="/registration" className="no-avatar-reg-btn">
              <div className="no-avatar-reg-btn-icon"></div>
              {t("header.regist")}
            </Link>
          ) : (
            <Link to="/profile" className="avatar-reg-btn">
              {user?.avatar_image ? (
                <div className="avatar-reg-btn-img">
                  <img src={user?.avatar_image} alt="ava" />
                  {/* <div className="avatar-reg-btn-online"></div> */}
                </div>
              ) : (
                <div className="avatar-reg-btn__">
                  <PersonIcon /> {t("header.myProfile")}
                </div>
              )}
            </Link>
          )}
        </button>
        <div className="burger-menu">
          <React.Fragment>
            <div className="burger-logo-wrapper">
              <img
                onClick={() => toggleDrawer(true)}
                src={burger}
                alt="burger-menu"
              />
              {notifications?.length || notice?.length ? (
                <div className="burger-notice"></div>
              ) : (
                ""
              )}
            </div>
            <SwipeableDrawer
              anchor="right"
              open={burgerOpen}
              onClose={() => toggleDrawer(false)}
              onOpen={() => toggleDrawer(true)}
            >
              <div className="burger">
                <div className="up-site">
                  <div className="burger-title">
                    <img
                      onClick={() => toggleDrawer(false)}
                      src={burgerClose}
                      alt="burgerClose"
                    />
                    <Select
                      className="burger-language"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={i18n.language as language}
                      onChange={changeLanguage}
                      sx={selectStyle}
                    >
                      <MenuItem value={"uz"}>Uzbek</MenuItem>
                      <MenuItem value={"ru"}>Русский</MenuItem>
                      <MenuItem value={"en"}>English</MenuItem>
                    </Select>
                  </div>
                  {role === "student" ? (
                    <div className="burger-links">
                      <Link
                        onClick={() => toggleDrawer(false)}
                        className="burger-link"
                        to="/"
                      >
                        {t("header.mainTitle")}
                      </Link>
                      <Divider />
                      <Link
                        onClick={() => toggleDrawer(false)}
                        className="burger-link"
                        to="/subjects"
                      >
                        {t("header.subjects")}
                      </Link>
                      <Divider />
                      <Link
                        onClick={() => toggleDrawer(false)}
                        className="burger-link"
                        to="/tutors"
                      >
                        {t("header.findTutor")}
                      </Link>
                      <Divider />
                      <br />
                      <br />
                      <Link
                        onClick={() => toggleDrawer(false)}
                        to="/notifications"
                        className="notice-link"
                      >
                        {t("header.notice")}
                        {notifications?.length ? (
                          <div className="notice-icon"></div>
                        ) : (
                          ""
                        )}
                      </Link>
                      <Divider />
                      <Link onClick={() => toggleDrawer(false)} to="/saved">
                        {t("saved.saved")}
                      </Link>
                      <Divider />
                      <Link onClick={() => toggleDrawer(false)} to="/chat">
                        {t("header.message")}
                      </Link>
                    </div>
                  ) : role === "teacher" ? (
                    <div className="burger-links">
                      <Link
                        onClick={() => toggleDrawer(false)}
                        className="burger-link"
                        to="/"
                      >
                        {t("header.mainTitle")}
                      </Link>

                      <Divider />
                      <Link
                        onClick={() => toggleDrawer(false)}
                        className="nav-menu-item"
                        to="/#capabilities-container"
                      >
                        {t("header.opportunities")}
                      </Link>
                      <Divider />
                      <br />
                      <br />
                      <Link
                        onClick={() => toggleDrawer(false)}
                        to="/notifications"
                        className="notice-link"
                      >
                        {t("header.notice")}
                        {notifications?.length || notice?.length ? (
                          <div className="notice-icon"></div>
                        ) : (
                          ""
                        )}
                      </Link>
                      <Divider />
                      <Link onClick={() => toggleDrawer(false)} to="/saved">
                        {t("saved.saved")}
                      </Link>
                      <Divider />
                      <Link onClick={() => toggleDrawer(false)} to="/chat">
                        {t("header.message")}
                      </Link>
                    </div>
                  ) : (
                    <div className="burger-links">
                      <Link
                        onClick={() => toggleDrawer(false)}
                        className="burger-link"
                        to="/"
                      >
                        {t("header.mainTitle")}
                      </Link>
                      <Divider />
                      <Link
                        onClick={() => toggleDrawer(false)}
                        className="burger-link"
                        to="/#about"
                      >
                        {t("header.aboutProject")}
                      </Link>
                      <Divider />
                      <Link
                        onClick={() => toggleDrawer(false)}
                        className="burger-link"
                        to="/#subjects"
                      >
                        {t("header.subjects")}
                      </Link>
                      <Divider />
                      <Link
                        onClick={() => toggleDrawer(false)}
                        className="burger-link"
                        to="/#capabilities-container"
                      >
                        {t("header.opportunities")}
                      </Link>
                    </div>
                  )}
                </div>
                <div className="down-site">
                  {!token ? (
                    <Link
                      onClick={() => toggleDrawer(false)}
                      to="/registration"
                      className="login"
                    >
                      {t("header.regist")}
                    </Link>
                  ) : (
                    <Link
                      onClick={() => toggleDrawer(false)}
                      className="avatar"
                      to="/profile"
                    >
                      {user?.avatar_image ? (
                        <div className="avatar-info">
                          <div className="avatar-img">
                            <img src={user?.avatar_image} alt="aboutMe" />
                            <div></div>
                          </div>
                          <div className="avatar-content">
                            <h2>{user?.firstname}</h2>
                            <h4>{t(`extra.${user?.role}`)}</h4>
                          </div>
                        </div>
                      ) : (
                        <div className="no-avatar-img">
                          <PersonIcon /> {t("header.myProfile")}
                        </div>
                      )}
                    </Link>
                  )}
                </div>
              </div>
            </SwipeableDrawer>
          </React.Fragment>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
