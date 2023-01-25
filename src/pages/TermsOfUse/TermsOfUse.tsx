import React from "react";
import { useTranslation } from "react-i18next";

import "./termsOfUse.scss";

const TermsOfUse = () => {
  const { t } = useTranslation();
  const privacyBody1 = t("termsOfUse.body#1");
  const privacyBody2 = t("termsOfUse.body#2");
  const privacyBody3 = t("termsOfUse.body#3");
  const privacyBody4 = t("termsOfUse.body#4");
  const privacyBody5 = t("termsOfUse.body#5");
  const privacyBody6 = t("termsOfUse.body#6");
  const privacyBody7 = t("termsOfUse.body#7");
  const privacyBody8 = t("termsOfUse.body#8");
  const privacyBody9 = t("termsOfUse.body#9");
  const privacyBody10 = t("termsOfUse.body#10");
  const privacyBody11 = t("termsOfUse.body#11");
  const privacyBody12 = t("termsOfUse.body#12");

  return (
    <div className="terms-container">
      <h4>{t("termsOfUse.body")}</h4>
      <h1>{t("termsOfUse.title")}</h1>
      <h4>{t("termsOfUse.body1")}</h4>
      <h5>{t("termsOfUse.body2")}</h5>
      <h2 className="terms-title">{t("termsOfUse.title#1")}</h2>
      {privacyBody1.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("termsOfUse.title#2")}</h2>
      {privacyBody2.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("termsOfUse.title#3")}</h2>
      {privacyBody3.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("termsOfUse.title#4")}</h2>
      {privacyBody4.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("termsOfUse.title#5")}</h2>
      {privacyBody5.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("termsOfUse.title#6")}</h2>
      {privacyBody6.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("termsOfUse.title#7")}</h2>
      {privacyBody7.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("termsOfUse.title#8")}</h2>
      {privacyBody8.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("termsOfUse.title#9")}</h2>
      {privacyBody9.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("termsOfUse.title#10")}</h2>
      {privacyBody10.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("termsOfUse.title#11")}</h2>
      {privacyBody11.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
      <h2 className="terms-title">{t("termsOfUse.title#12")}</h2>
      {privacyBody12.split("\n").map((text: string, index: number) => {
        return (
          <p className="terms-body" key={index + 1}>
            {text}
          </p>
        );
      })}
    </div>
  );
};

export default TermsOfUse;
