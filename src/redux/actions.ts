import { createAction } from "@reduxjs/toolkit";
import {
  role,
  user,
  subjects,
  studyTypes,
  selectedUser,
  notifications,
  requests,
  tutorVidoes,
  regions,
  education,
  degree,
  languages,
  filter,
  country,
  certificateData,
  message,
} from "../data/interfaces";

export const changeUser = createAction<user>("SET_USER");

export const getRole = createAction<role | null>("GET_ROLE");
export const changeSelectedUser = createAction<selectedUser | null>(
  "CHANGE_SELECTED"
);
export const changeSelectedUserId = createAction<number | null>(
  "CHANGE_SELECTED_ID"
);
export const changeOurMessage = createAction<message[] | null>(
  "CHANGE_OUR_MESSAGE"
);
export const changeStateAction = createAction<number | null>("CHANGE_STATE");
export const changeShowPage = createAction<boolean>("CHANGE_SHOW_PAGE");
export const changeNotifications = createAction<notifications[]>(
  "CHANGE_NOTIFICATIONS"
);
export const changeNotice = createAction<requests[]>("CHANGE_NOTICE");
export const getTutorVideos = createAction<tutorVidoes[]>("GET_TUTOR_VIDEOS");
export const changeFilter = createAction<filter>("CHANGE_FILTER");
export const getCertificates =
  createAction<certificateData[]>("GET_CERIFICATES");
export const getLanguages = createAction<languages[]>("GET_LANGUAGES");
export const getSubjects = createAction<subjects>("GET_SUBJECTS");
export const getStudyTypes = createAction<studyTypes[]>("GET_STUDY_TYPE");
export const getCountries = createAction<country[] | false>("GET_COUNTRIES");
export const getRegions = createAction<regions | false>("GET_REGIONS");
export const getEducation = createAction<education[] | null>("GET_EDUCATION");
export const getDegree = createAction<degree[] | null>("GET_DEGREE");
export const changeActiveUsers = createAction<number[]>("CHANGE_ACTIVE_USERS");
