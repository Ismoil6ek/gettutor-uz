export type language = "uz" | "ru" | "en";

export type translation = {
  uz: string;
  ru: string;
  en: string;
};

export type role = "student" | "teacher" | "Unauthenticated." | null;

export interface certificates {
  id: number;
  link: string;
  name: string | null;
  type_id: number | null;
  grade_id: number | null;
}

export interface certificateData {
  id: number;
  name: string | null;
  values: number[];
}

export interface statistics {
  subjects: number;
  courses: number;
  reviews: number;
  users: number;
}

export interface schedule {
  firstTime: {
    beginHour: string;
    beginMinute: string;
    finishHour: string;
    finishMinute: string;
  };
  secondTime: {
    beginHour: string;
    beginMinute: string;
    finishHour: string;
    finishMinute: string;
  };
  is_valid: boolean;
}

export interface activeTutor {
  id: number;
  course_id: number;
  teacher_id: number;
  teacher_name: string;
  hourly_rate: number;
  hourly_rate_type: number;
  verified_teacher: boolean;
  subject: string;
  subject_id: number;
  rating: number;
  saved: true | null;
  experience: number;
  language_ids: number[];
  languages: string[];
  study_type_id: number;
  region_id: number;
  country_id: number;
  file: string;
  schedule: schedule[];
  degree_id: number;
  education_id: number;
  certificate_type: number[] | null[];
  is_verified: boolean;
}

export interface teacherView {
  name: string | null;
}

export interface user {
  id: number;
  firstname: string;
  lastname: string;
  email: string | null;
  phone: number;
  birthday: number | null;
  birthday_datetime: string | null;
  role: role;
  gender: string | null;
  country_name: string | null;
  country_id: number | null;
  region_name: string | null;
  region_id: number | null;
  is_verified: boolean;
  avatar_image: string | null;
  file_id: number | null;
  about: string | null;
  is_online: boolean;
  language_ids: number[];
  languages: string[];
  age: number | null;
  hourly_rate: number | null;
  hourly_rate_type: number;
  course_id: number | null;
  course_name: string | null;
  education_id: number | null;
  education_name: string | null;
  degree_id: number | null;
  degree_name: string | null;
  experience: number | null;
  test_lesson: boolean | null;
  schedule: schedule[];
  subject: string | null;
  subject_id: number | null;
  rating: number | null;
  study_type_id: number[];
  study_type: string | null;
  videos_count: number | null;
  comment_count: number | null;
  followers: number | null;
  certificates: certificates[];
}

export interface subjectItem {
  id: number;
  name: any;
  icon: string | null;
  quantity: number;
}

export interface subjects {
  is_homepage: subjectItem[];
  byCategory: {
    [id: number]: {
      id: number;
      name: translation;
      quantity: number;
      data: subjectItem[];
    };
  };
  isFetched: boolean;
  allData: subjectItem[];
}

export interface studyTypes {
  id: number;
  name: translation;
}

export interface selectedUser {
  user_id?: number;
  name?: string;
  phone?: string;
  image?: string | null;
  is_online?: number | boolean;
  teacher_id?: number;
  teacher_name?: string;
  subject_name?: string;
  subject_id?: number | null;
  from_user_id?: number | null;
}

export interface notifications {
  id: number;
  title: string;
  body: string;
  is_read: boolean;
  start_at: string;
  expire_at: string;
  created_at: string;
  users: boolean;
}

export interface requests {
  id: number;
  course_id: number;
  status: number;
  reason_id: number | null;
  student_id: number;
  student_name: string;
  student_image: string | null;
  comment: string;
  created_at: string;
}

export interface tutorVidoes {
  id: number;
  video_link: string;
  video_name: string;
  subject: string;
  subject_id: number;
  teacher_name: string;
  view_count: number;
  is_public: boolean;
}

export interface country {
  id: number;
  name: translation;
}

type region = { country_id: number; id: number; name: translation };
export interface regions {
  [key: string]: region[];
}

export interface education {
  id: number;
  name: translation;
}

export interface degree {
  id: number;
  name: translation;
}

export interface languages {
  id: number;
  code: string;
  name: {
    uz: string;
    ru: string;
    en: string;
  };
}

export interface filter {
  experience: {
    url: string;
    value: number | string;
    name: string;
    isValid: boolean;
  };
  gender: { url: string; value: string; name: string; isValid: boolean };
  subject: {
    url: string;
    value: number | string;
    name: number | string;
    isValid: boolean;
  };
  search: { url: string; value: string; name: string; isValid: boolean };
  studyType: {
    url: string;
    value: number | string;
    name: string;
    isValid: boolean;
  };
  byCountry: {
    url: string;
    value: number | string;
    name: string;
    isValid: boolean;
  };
  byRegion: {
    url: string;
    value: number | string;
    name: string;
    isValid: boolean;
  };
  byPrice: {
    url: string;
    value: number | number[];
    name: string;
    isValid: boolean;
  };
  byLanguage: {
    url: string;
    value: number | string;
    name: string;
    isValid: boolean;
  };
  byEducation: {
    url: string;
    value: number[];
    isValid: boolean;
  };
  byDegree: {
    url: string;
    value: number[];
    isValid: boolean;
  };
  weekArray: { url: string; value: number[]; name: string; isValid: boolean };
  certificateName: {
    url: string;
    value: number | string;
    name: string;
    isValid: boolean;
  };
  certificateScore: {
    url: string;
    value: number | null;
    name: string;
    isValid: boolean;
  };
  currency: {
    url: string;
    value: number;
    name: string;
    isValid: boolean;
  };
}

export interface subjectData {
  id: number;
  is_homepage: boolean;
  category: {
    id: number;
    name: translation;
  };
  name: translation;
  icon: string;
  quantity: number;
  teacher_count: number;
}

export interface certificates {
  id: number;
  name: string | null;
  values: number[];
}

export interface weeksArr {
  name: string;
  id: number;
}

export interface countries {}

export interface tutor {
  id: number;
  course_id: number;
  teacher_id: number;
  teacher_name: string;
  hourly_rate: number;
  hourly_rate_type: number;
  verified_teacher: boolean;
  subject: string;
  subject_id: number;
  rating: number;
  saved: boolean;
  experience: number;
  language_ids: number[];
  languages: string[];
  study_type_id: number[];
  region_id: number;
  country_id: number;
  file: string;
  schedule: schedule[];
  degree_id: number;
  education_id: number;
  certificate_type: (null | number)[];
}

export interface pagination {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}

export interface students {
  user_id: number;
  name: string;
  phone: string;
  image: null | string;
  is_online: number;
}

export interface teachers {
  teacher_id: number;
  teacher_name: string;
  subject_name: string | null;
  phone: string;
  subject_id: number;
  image: null | string;
  is_online: number;
}

export interface temp_video_obj {
  video_name: null | string;
  video_link: string;
  video_teacher_name: string;
  video_subject_name: string;
}

export interface studentVideos {
  id: number;
  video_link: string;
  video_name: string;
  subject: string;
  subject_id: number;
  teacher_name: string;
  view_count: number;
  is_public: boolean;
}

export interface labels {
  [key: number]: string;
}

export interface review {
  created_at: number;
  id: number;
  rate: number;
  receiver_image: string;
  receiver_name: string;
  sender_id: number;
  sender_image: null;
  sender_name: string;
  subject: string;
  text: string;
  subject_id: number;
}

export interface feedbackTeacher {
  average: number | null;
  reviews: review[];
}

export type literalKey = "remove_video" | "visibility";

export interface idObject {
  isPublic: boolean;
  id: number;
}

export interface teacherVeiw {
  id: number;
  firstname: string;
  lastname: string;
  birthday: number;
  course_id: number;
  role: string;
  status: string;
  gender: string;
  country_id: number;
  region_id: number | null;
  region_name: string | null;
  is_verified: boolean;
  test_lesson: boolean;
  study_type_id: number[];
  hourly_rate: number;
  hourly_rate_type: number;
  experience: number;
  rate: number;
  subject_id: number;
  subject: string;
  avatar_image: string;
  file_id: number;
  about: string;
  is_online: string;
  phone: number;
  email: string;
  followers: number;
  saved: boolean;
  language_ids: number[];
  languages: string[];
  degree_id: number | null;
  education_id: number;
  age: number;
  certificates: teacherCertificates[];
  videos: teacherVideos[];
  my_teacher: boolean;
  schedule: schedule[];
}

export interface teacherCertificates {
  id: number;
  name: string;
  file_id: number;
  type_id: number | null;
  grade_id: number | null;
  file: {
    id: number;
    name: string;
    ext: string;
    link: string;
    domain: string;
    user_id: number;
    upload_data: string;
    path: string;
    size: number;
    created_at: string;
    updated_at: string;
  };
}

export interface teacherVideos {
  id: number;
  video_link: string;
  video_name: string;
  subject: string;
  subject_id: number;
  teacher_name: string;
  view_count: number;
  is_public: boolean;
}

export interface teacherReview {
  average: number;
  reviews: teacherReviews[];
}
export interface teacherReviews {
  id: number;
  rate: number;
  text: string;
  receiver_image: string;
  sender_image: string | null;
  receiver_name: string;
  sender_name: string;
  sender_id: number;
  subject: string;
  created_at: string;
}

export interface feedbackRatings {
  [key: number]: number;
}

export interface savedTeachers {
  id: number;
  course_id: number;
  teacher_id: number;
  teacher_name: string;
  hourly_rate: number;
  hourly_rate_type: number;
  verified_teacher: boolean;
  subject: string;
  subject_id: number;
  rating: number;
  saved: boolean;
  experience: number;
  language_ids: number[];
  languages: string[];
  study_type_id: number[];
  file: string;
}

export interface myStudentsList {
  user_id: number;
  name: string;
  phone: string;
  image: string | null;
  is_online: number;
}
export interface myTeachersList {
  teacher_id: number;
  teacher_name: string;
  subject_name: string;
  phone: string;
  subject_id: number | null;
  image: string;
  is_online: boolean;
}

export interface pupilData {
  avatar_image: string | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  birthday: string | null;
  country_id: number | null | "";
  region_id: number | null | "";
  gender: string | null;
  languages: number[];
  about: string | null;
}

export interface teacherData {
  avatar_image: string | null;
  file_id: number | null;
  firstname: string | null;
  lastname: string | null;
  birthday: string | null;
  gender: string | null;
  country_id: number | null;
  region_id: number | null;
  education_id: number | null;
  degree_id: number | null;
  experience: number | null;
  subject_id: number | null;
  languages: number[];
  about: string | null;
  study_type_id: number[] | [];
  hourly_rate: string | null | number;
  hourly_rate_type: number | null;
  test_lesson: boolean | null;
  email: string | null;
}

export type fillCheckType =
  | "firstname"
  | "lastname"
  | "avatar_image"
  | "birthday"
  | "gender"
  | "country_id"
  | "region_id"
  | "education_id"
  | "degree_id"
  | "experience"
  | "subject_id"
  | "languages"
  | "study_type_id"
  | "about"
  | "hourly_rate"
  | "schedule";

export interface educationDegreeType {
  [key: number]: string;
}

export interface daysList {
  [key: number]: string;
}

export interface lastMessage {
  isTrusted: boolean;
  bubbles: boolean;
  cancelBubble: boolean;
  cancelable: boolean;
  composed: boolean;
  currentTarget: any;
  data: string;
  defaultPrevented: boolean;
  eventPhase: number;
  lastEventId: string;
  origin: string;
  path: [];
  ports: [];
  returnValue: boolean;
  source: null;
  srcElement: any;
  target: any;
  timeStamp: 1598.5999999940395;
  type: "message";
  userActivation: null;
}

export interface priceValue {
  max_usd: number;
  max_uzs: number;
  min_usd: number;
  min_uzs: number;
}

export interface Tariffs {
  id: number;
  days: number;
  price: number;
  name: translation;
}

export interface chatUser {
  id: number;
  name: string | null;
  image: string | null;
  from_user_id: number;
  is_online?: boolean;
}

export interface message {
  created_at: string;
  from_me?: boolean;
  message: string;
  from_user_id: number;
}

export interface UserSubscription {
  id: number;
  name: translation | null;
  user_id: number;
  subscription_id: number;
  price: string;
  promo_id: number | null;
  status: string;
  expired_at: number | null;
  expire_date: number;
  canceled_at: number | null;
  created_at: string;
  updated_at: string;
}
