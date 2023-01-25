import { createReducer } from "@reduxjs/toolkit";
import {
  changeUser,
  getRole,
  changeSelectedUser,
  changeOurMessage,
  changeSelectedUserId,
  changeShowPage,
  changeNotifications,
  changeNotice,
  getTutorVideos,
  changeFilter,
  getCertificates,
  getLanguages,
  getSubjects,
  getStudyTypes,
  getCountries,
  getRegions,
  getEducation,
  getDegree,
  changeActiveUsers,
} from "./actions";

import {
  user,
  role,
  subjects,
  studyTypes,
  selectedUser,
  notifications,
  requests,
  tutorVidoes,
  country,
  regions,
  education,
  degree,
  languages,
  filter,
  certificates,
  certificateData,
  message,
} from "../data/interfaces";

interface statesInterface {
  user: user | null;
  role: role | null;
  activeUsers: number[];
  languages: languages[];
  subjects: subjects | null;
  studyTypes: studyTypes[];
  selectedUser: selectedUser | null;
  selectedUserId: number | null;
  ourMessages: message[] | null;
  changeState: number | null;
  showPage: boolean;
  notifications: notifications[];
  notice: requests[];
  socketUrl: string;
  tutorVideos: tutorVidoes[];
  filter: filter;
  certificates: certificateData[];
  countries: country[] | false;
  regions: regions | false;
  education: education[] | null;
  degree: degree[] | null;
}

const initialState = {
  user: null,
  role: null,
  activeUsers: [],
  languages: [],
  subjects: { is_homepage: [], byCategory: {}, isFetched: false, allData: [] },
  studyTypes: [],
  selectedUser: null,
  selectedUserId: null,
  ourMessages: null,
  changeState: null,
  showPage: false,
  notifications: [],
  notice: [],
  socketUrl: "wss://api.gettutor.uz:6001/app/b941ed184fa80082bae2",
  tutorVideos: [],
  filter: {
    experience: { url: "&experience[]=", value: "", name: "", isValid: false },
    gender: { url: "&gender=", value: "", name: "", isValid: false },
    subject: { url: "&subject=", value: "", name: "", isValid: false },
    search: { url: "&name=", value: "", name: "", isValid: false },
    studyType: { url: "&studyType[]=", value: "", name: "", isValid: false },
    byCountry: { url: "&country=", value: "", name: "", isValid: false },
    byRegion: { url: "&region[]=", value: "", name: "", isValid: false },
    byPrice: {
      url: "",
      value: [0, 0],
      name: "",
      isValid: false,
    },
    byLanguage: { url: "&language[]=", value: "", name: "", isValid: false },
    byEducation: {
      url: "",
      value: [],
      isValid: false,
    },
    byDegree: { url: "", value: [], isValid: false },
    weekArray: { url: "", value: [], name: "", isValid: false },
    certificateName: { url: "&type=", value: "", name: "", isValid: false },
    certificateScore: { url: "&grade=", value: null, name: "", isValid: false },
    currency: { url: "&price_type=", value: 0, name: "", isValid: false },
  },
  certificates: [],
  countries: false,
  regions: false,
  education: null,
  degree: null,
} as statesInterface;

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeUser, (state, action) => {
      state.user = action.payload;
    })
    .addCase(getRole, (state, action) => {
      state.role = action.payload;
    })
    .addCase(changeSelectedUser, (state, action) => {
      state.selectedUser = action.payload;
    })
    .addCase(changeOurMessage, (state, action) => {
      state.ourMessages = action.payload;
    })
    .addCase(changeSelectedUserId, (state, action) => {
      state.selectedUserId = action.payload;
    })
    .addCase(changeShowPage, (state, action) => {
      state.showPage = action.payload;
    })
    .addCase(changeNotifications, (state, action) => {
      state.notifications = action.payload;
    })
    .addCase(changeNotice, (state, action) => {
      state.notice = action.payload;
    })
    .addCase(getTutorVideos, (state, action) => {
      state.tutorVideos = action.payload;
    })
    .addCase(changeFilter, (state, action) => {
      state.filter = action.payload;
    })
    .addCase(getCertificates, (state, action) => {
      state.certificates = action.payload;
    })
    .addCase(getLanguages, (state, action) => {
      state.languages = action.payload;
    })
    .addCase(getSubjects, (state, action) => {
      state.subjects = action.payload;
    })
    .addCase(getStudyTypes, (state, action) => {
      state.studyTypes = action.payload;
    })
    .addCase(getCountries, (state, action) => {
      state.countries = action.payload;
    })
    .addCase(getRegions, (state, action) => {
      state.regions = action.payload;
    })
    .addCase(changeActiveUsers, (state, action) => {
      state.activeUsers = action.payload;
    })
    .addCase(getEducation, (state, action) => {
      state.education = action.payload;
    })
    .addCase(getDegree, (state, action) => {
      state.degree = action.payload;
    });
});

export type RootState = ReturnType<typeof reducer>;
