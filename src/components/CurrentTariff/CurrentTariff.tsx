import "./currentTariff.scss";
import { useTranslation } from "react-i18next";
// MUI icons
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { months } from "../../data";
import { language, UserSubscription } from "../../data/interfaces";
import i18n from "../../i18n/config";

const CurrentTariff = ({
  userSubscription,
}: {
  userSubscription: UserSubscription;
}) => {
  const { t } = useTranslation();

  const handleTimeAgo = (created: number) => {
    const date = new Date(created * 1000);
    const day = date.getDate();
    const month = months[i18n.language as language][date.getMonth()].slice(
      0,
      3
    );
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  };

  return (
    <div className="current-tariff">
      <div className="current-tariff-header">
        <div className="tariff-name-period-wrapper">
          <h3 className="current-tariff-name">
            {userSubscription.name
              ? userSubscription.name[i18n.language as language]
              : "-------"}
          </h3>
          {/* <p className="period">
            {t("profile.expiredTill")}{" "}
            {handleTimeAgo(userSubscription.expire_date)}
          </p> */}
        </div>
        <div className="current-tariff-cost">
          {userSubscription.price} {t("extra.sum")}
        </div>
        <div className="period-mobile">
          {t("profile.expiredTill")}:{" "}
          {handleTimeAgo(userSubscription.expire_date)}
        </div>
        {/* <div className="renew-change-btn-wrapper">
          <button className="renew-tariff-btn">
            {t("profile.renewSubscription")}
          </button>
          <button className="change-tariff-btn">
            {t("profile.changeSubscription")}
          </button>
        </div> */}
      </div>
      <div className="current-tariff-body">
        <h3 className="offers-title">{t("profile.offer")}</h3>
        <ul className="offers-list">
          <li className="offer-item">
            <DoneAllIcon className="done-icon" />
            {t("profile.tarrifOpp#1")}
          </li>
          <li className="offer-item">
            <DoneAllIcon className="done-icon" />
            {t("profile.tarrifOpp#2")}
          </li>
          <li className="offer-item">
            <DoneAllIcon className="done-icon" />
            {t("profile.tarrifOpp#3")}
          </li>
          <li className="offer-item">
            <DoneAllIcon className="done-icon" />
            {t("profile.tarrifOpp#4")}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CurrentTariff;
