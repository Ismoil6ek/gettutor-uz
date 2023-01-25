export const base_url = "https://api.gettutor.uz/api/v1";

export const studyTypes = [
  "At the student`s house",
  "At the teacher`s house",
  "At learning centre",
  "Online",
];

export const degreeType = ["Bachelor", "Master", "Doctorate"];

export const education = ["Middle school", "High school", "Undergraduate"];

export const experiences = [
  { name: "1 - 3", value: 1 },
  { name: "3 - 5", value: 2 },
  { name: "5 - 10", value: 3 },
  { name: "10+", value: 4 },
];

export const months = {
  uz: [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ],
  ru: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};
