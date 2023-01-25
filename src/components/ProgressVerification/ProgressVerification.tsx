import React from "react";
import "./progressVerification.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
// Svg
import VerificationLogo from "../../assets/svg/verification_logo.svg";
import { useAppSelector } from "../../hooks/useTypedSelector";

const ProgressVerification = ({ progressValue, isCompleted } : {progressValue: number, isCompleted: boolean}) => {
  const { t } = useTranslation();
  const { role } = useAppSelector((state) => state);

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 10,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 10,
      backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
    },
  }));

  return (
    <div
      className={
        isCompleted
          ? "progress-verification completed"
          : "progress-verification"
      }
    >
      <div className="progress-verification-header">
        <img
          src={VerificationLogo}
          alt="verify_logo"
          className="verification-logo"
        />
        <div className="verification-title-content-wrapper">
          <h3 className="verification-title">{t("profile.verification")}</h3>
          <p className="verification-content">{t("profile.getVerification")}</p>
        </div>
      </div>
      <div className="progress-verification-body">
        <h3 className="progress-verification-body-title">
          {t("profile.yourRequest")}
        </h3>
        <Box sx={{ flexGrow: 1 }}>
          <br />
          <BorderLinearProgress variant="determinate" value={progressValue} />
        </Box>
        <p className="progress-value">
          {t("profile.completed")} {progressValue}%
        </p>
      </div>
      <div className="progress-verification-footer">
        <Link
          to={
            role === "teacher" ? "/teacher-profile-data" : "/pupil-profile-data"
          }
          className="complete-anketa-btn"
        >
          {t("profile.fillForm")}
        </Link>
      </div>
    </div>
  );
};

export default ProgressVerification;
