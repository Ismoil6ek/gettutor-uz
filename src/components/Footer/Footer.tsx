import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// img
import logo from "../../assets/svg/logo-white.svg";
import Img6 from "../../assets/svg/Vector-0.svg";
import Img7 from "../../assets/svg/Vector-1.svg";
import Img8 from "../../assets/svg/Vector-2.svg";
import Img9 from "../../assets/svg/md-call.svg";
import Img10 from "../../assets/svg/mail.svg";

// Style
import "./Footer.scss";
import { useAppSelector } from "../../hooks/useTypedSelector";

const Footer = () => {
  const { t } = useTranslation();
  const { role } = useAppSelector((state) => state);

  return (
    <div className="footer-container">
      <div className="footer">
        <div className="footer-up-side">
          <div className="footer-up-side-everywhere">
            <div className="footer-up-side-everywhere-logo">
              <img src={logo} alt="logo" />
            </div>
            <p className="footer-up-side-everywhere-p">
              {t("footer.topic")}
              <br />
              <br />
              {t("footer.copyright")}
              <br />
              <br />
              {t("footer.doneByAnySoft")}
            </p>
          </div>
          {role === "teacher" ? (
            <div className="footer-up-side-laws">
              <Link className="footer-up-side-law" to="/">
                {t("header.mainTitle")}
              </Link>

              <a className="footer-up-side-law" href="#capabilities-container">
                {t("header.opportunities")}
              </a>

              <Link className="footer-up-side-law" to="/saved">
                {t("saved.saved")}
              </Link>

              <Link className="footer-up-side-law" to="/chat">
                {t("header.message")}
              </Link>
            </div>
          ) : role === "student" ? (
            <div className="footer-up-side-laws">
              <Link className="footer-up-side-law" to="/">
                {t("header.mainTitle")}
              </Link>
              <Link className="footer-up-side-law" to="/subjects">
                {t("header.subjects")}
              </Link>
              <Link className="footer-up-side-law" to="/tutors">
                {t("header.findTutor")}
              </Link>
              <Link className="footer-up-side-law" to="/saved">
                {t("saved.saved")}
              </Link>
            </div>
          ) : (
            <div className="footer-up-side-laws">
              <Link className="footer-up-side-law" to="/">
                {t("header.mainTitle")}
              </Link>
              <a className="footer-up-side-law" href="#about">
                {t("header.aboutProject")}
              </a>
              <a className="footer-up-side-law" href="#subjects">
                {t("header.subjects")}
              </a>
              <a className="footer-up-side-law" href="#capabilities-container">
                {t("header.opportunities")}
              </a>
            </div>
          )}
          <div className="footer-up-side-contact">
            <h2 className="footer-up-side-contact-h2">
              {t("footer.contacts")}
            </h2>
            <a href="tel:+998555011800" className="footer-up-side-contact-p">
              <img src={Img9} alt="phone" />
              55 501 18 00
            </a>
            <a
              href="mailto:help@gettutor.uz"
              type="email"
              className="footer-up-side-contact-p"
            >
              <img src={Img10} alt="mail" />
              help@gettutor.uz
            </a>
          </div>
          <div className="footer-up-side-downloads">
            <div className="footer-up-side-download">
              <h2>{t("footer.mobileApp")}</h2>
              <div>
                <a
                  href="https://play.google.com/store/apps/details?id=uz.anysoft.gettutor&hl=ru&gl=US"
                  className="footer-up-side-download-googleplay button-hover"
                ></a>
                <a
                  href="https://apps.apple.com/app/gettutor/id6444833848"
                  className="footer-up-side-download-appstore button-hover"
                ></a>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="footer-down-side">
          <div className="footer-down-side-links">
            <Link to="/confidencial" className="footer-down-side-link">
              {t("footer.policies")}
            </Link>
            <Link to="/terms-of-use" className="footer-down-side-link">
              {t("footer.termsOfUse")}
            </Link>
          </div>
          <div className="footer-up-side-everywhere-imgs">
            {/* <h2 className="footer-up-side-everywhere-imgs-h2">
              {t("footer.socials")}
            </h2> */}
            <div className="footer-up-side-everywhere-img">
              <a
                className="button-hover"
                href="https://gettutor.uz"
                target="_blank"
              >
                <img src={Img6} alt="photoFooter" />
              </a>
              <a
                className="button-hover"
                href="https://gettutor.uz"
                target="_blank"
              >
                <img src={Img7} alt="photoFooter" />
              </a>
              <a
                className="button-hover"
                href="https://gettutor.uz"
                target="_blank"
              >
                <img src={Img8} alt="photoFooter" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
