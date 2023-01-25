import React from "react";
import { useTranslation } from "react-i18next";

import "./privacyPolicy.scss";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const privacyBody1 = t("privacyPolicy.body#1");
  const privacyBody2 = t("privacyPolicy.body#2");
  const privacyBody3 = t("privacyPolicy.body#3");
  const privacyBody4 = t("privacyPolicy.body#4");
  const privacyBody5 = t("privacyPolicy.body#5");
  const privacyBody6 = t("privacyPolicy.body#6");
  const privacyBody7 = t("privacyPolicy.body#7");
  const privacyBody8 = t("privacyPolicy.body#8");

  return (
    <div className="terms-container">
      <h1>{t("forRightHolders.title#1")}</h1>
      <p className="terms-body">{t("forRightHolders.body#1")}</p>
      <p className="terms-body">{t("forRightHolders.body#2")}</p>
      <h2 className="terms-title">{t("privacyPolicy.title#1")}</h2>
      {privacyBody1.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("privacyPolicy.title#2")}</h2>
      {privacyBody2.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("privacyPolicy.title#3")}</h2>
      {privacyBody3.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("privacyPolicy.title#4")}</h2>
      {privacyBody4.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("privacyPolicy.title#5")}</h2>
      {privacyBody5.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("privacyPolicy.title#6")}</h2>
      {privacyBody6.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("privacyPolicy.title#7")}</h2>
      {privacyBody7.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("privacyPolicy.title#8")}</h2>
      {privacyBody8.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
    </div>
  );
};

export default PrivacyPolicy;
