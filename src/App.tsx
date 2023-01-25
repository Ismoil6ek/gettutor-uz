import { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Navbar/Navbar";

import {
  changeSelectedUser,
  changeUser,
  getCertificates,
  getCountries,
  getLanguages,
  getStudyTypes,
  getRegions,
  getSubjects,
  getEducation,
  getDegree,
  getRole,
} from "./redux/actions";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { base_url } from "./data/index";
import TeacherProfile from "./pages/TeacherProfile/TeacherProfile";
import PupilProfileData from "./pages/PupilProfileData/PupilProfileData";
import PupilProfile from "./pages/PupilProfile/PupilProfile";

import { ReactComponent as GoToHeader } from "./assets/svg/rightBtn.svg";
import NotificationPage from "./pages/NotificationPage/NotificationPage";

// Aos
// import "aos/dist/aos.css";
import { subjects, subjectData } from "./data/interfaces";
import { useAppDispatch, useAppSelector } from "./hooks/useTypedSelector";

import Loader from "./components/Loader/Loader";
import Page404 from "./components/Page404/Page404";
import ExtraInfo from "./pages/Registration/ExtraInfo/ExtraInfo";
import Registration from "./pages/Registration/Registration";
import Echo from "laravel-echo";

// lazy Pages
const Main = lazy(() => import("./pages/Main/Main"));
const Subjects = lazy(() => import("./pages/Subjects/Subjects"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse/TermsOfUse"));
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage"));
const MyTeachersList = lazy(
  () => import("./pages/MyTeachersList/MyTeachersList")
);
const Tutors = lazy(() => import("./pages/Tutors/Tutors"));
const AboutTeacher = lazy(() => import("./pages/AboutTeacher/AboutTeacher"));
const Chat = lazy(() => import("./pages/Chat/Chat"));
const Saved = lazy(() => import("./pages/Saved/Saved"));
const PageNotFound = lazy(() => import("./pages/PageNotFound/PageNotFound"));
const MyStudentsList = lazy(
  () => import("./pages/MyStudentsList/MyStudentsList")
);
const TeacherProfileData = lazy(
  () => import("./pages/TeacherProfileData/TeacherProfileData")
);

function App() {
  window.Pusher = require("pusher-js");
  const { role, user } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [showBtn, setShowBtn] = useState("myBtn none");
  const { pathname, hash, key } = useLocation();
  const [checking, setChecking] = useState<boolean>(true);

  const fetchLanguages = () => {
    fetch(`${base_url}/site/data/language`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch(getLanguages(result.data));
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const fetchSubjects = () => {
    fetch(`${base_url}/site/subjects/data`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const temp: subjects = {
          is_homepage: [],
          byCategory: {},
          allData: [],
          isFetched: true,
        };

        result.data.forEach((item: subjectData) => {
          // Homepage
          if (item.is_homepage)
            temp.is_homepage.push({
              id: item.id,
              name: item.name,
              icon: item.icon,
              quantity: item.teacher_count,
            });

          // By category
          if (temp.byCategory[item.category.id]) {
            temp.byCategory[item.category.id].data.push({
              id: item.id,
              name: item.name,
              icon: item.icon,
              quantity: item.teacher_count,
            });
          } else {
            temp.byCategory[item.category.id] = {
              id: item.category.id,
              name: item.category.name,
              quantity: item.quantity,
              data: [
                {
                  id: item.id,
                  name: item.name,
                  icon: item.icon,
                  quantity: item.teacher_count,
                },
              ],
            };
          }

          temp.allData.push({
            name: item.name,
            id: item.id,
            quantity: item.teacher_count,
            icon: item.icon,
          });
        });

        dispatch(getSubjects(temp));
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const fetchStudyTypes = () => {
    fetch(`${base_url}/site/data/study/type`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch(getStudyTypes(result.data));
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const fetchCountries = () => {
    fetch(`${base_url}/site/data/country`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch(getCountries(result.data));
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const fetchRegions = () => {
    fetch(`${base_url}/site/data/region`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch(getRegions(result.data));
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const fetchCertificates = () => {
    fetch(`${base_url}/site/data/certificates`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch(getCertificates(result.data));
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const fetchEducation = () => {
    fetch(`${base_url}/site/data/educations`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch(getEducation(result.data));
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const fetchDegree = () => {
    fetch(`${base_url}/site/data/degree/type`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch(getDegree(result.data));
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  useEffect(() => {
    // if not a hash link, scroll to top
    if (hash === "") {
      window.scrollTo(0, 0);
    }
    // else scroll to id
    else {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 100);
    }
  }, [pathname, hash, key]);

  useEffect(() => {
    fetch(`${base_url}/site/users/about-me`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch(changeUser(result.data));
        if (result.message === "Unauthenticated.") {
          localStorage.removeItem("token");
          localStorage.removeItem("pathName");
          dispatch(getRole("Unauthenticated."));
        } else if (result.data.role === "student") {
          dispatch(getRole("student"));
        } else if (result.data.role === "teacher") {
          dispatch(getRole("teacher"));
        } else {
          dispatch(getRole(null));
        }
      })
      .catch((err) => {
        localStorage.removeItem("token");
        localStorage.removeItem("pathName");
        console.log({ err });
      })
      .finally(() => {
        setChecking(false);
      });

    fetchLanguages();
    fetchSubjects();
    fetchStudyTypes();
    fetchCountries();
    fetchRegions();
    fetchEducation();
    fetchDegree();
    fetchCertificates();

    window.addEventListener("scroll", () => {
      scrollFunction();
    });

    return () => {
      window.removeEventListener("scroll", () => {
        scrollFunction();
      });
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user) {
      window.Echo = new Echo({
        broadcaster: "pusher",
        authEndpoint: "http://api.gettutor.uz/api/broadcasting/auth",
        key: "b941ed184fa80082bae2",
        auth: {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
        cluster: "ap2",
        wsHost: "api.gettutor.uz",
        encrypted: true,
        enabledTransports: ["wss"],
        disabledTransports: ["ws"],
        wssPort: 6001,
        disableStats: true,
        forceTLS: true,
      });
    }
  }, [user]);

  useEffect(() => {
    if (pathname !== "/chat") {
      dispatch(changeSelectedUser(null));
    }
    // eslint-disable-next-line
  }, [pathname]);

  function scrollFunction() {
    if (
      document.body.scrollTop > 500 ||
      document.documentElement.scrollTop > 500
    ) {
      setShowBtn("myBtn");
    } else {
      setShowBtn("none");
    }
  }

  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <div className="app">
      <ToastContainer pauseOnHover={false} />
      <Header />

      <Suspense
        fallback={
          <div className="route-loader">
            <Loader />
          </div>
        }
      >
        <div className="app-pages">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/confidencial" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route
              path="/profile"
              element={
                role === "student" || "teacher" ? (
                  <ProfilePage />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />

            {/* User attendant people */}
            <Route
              path="/my-teachers"
              element={
                checking ? (
                  <MyTeachersList />
                ) : role === "student" ? (
                  <MyTeachersList />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />

            {/* User data */}
            <Route
              path="/pupil-profile-data"
              element={
                checking ? (
                  <PupilProfileData />
                ) : role === "student" ? (
                  <PupilProfileData />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />

            {/* User Profile */}
            <Route
              path="/pupil-profile"
              element={
                checking ? (
                  <PupilProfile />
                ) : role === "student" ? (
                  <PupilProfile />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />

            {/* Tutors */}
            <Route path="/tutors" element={<Tutors />} />
            <Route path="/tutors/view/:id" element={<AboutTeacher />} />

            <Route path="/chat" element={<Chat />} />

            <Route path="/saved" element={<Saved />} />
            {window.innerWidth < 1440 && (
              <Route
                path="/notifications"
                element={
                  role === "student" || "teacher" ? (
                    <NotificationPage />
                  ) : (
                    <Navigate to={"/"} />
                  )
                }
              />
            )}
            <Route path="/extra-info" element={<ExtraInfo />} />

            <Route path="*" element={<PageNotFound />} />

            {/* User attendant people */}
            <Route
              path="/my-students"
              element={
                checking ? (
                  <MyStudentsList />
                ) : role === "teacher" ? (
                  <MyStudentsList />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            {/* User data */}
            <Route
              path="/teacher-profile-data"
              element={
                checking ? (
                  <TeacherProfileData />
                ) : role === "teacher" ? (
                  <TeacherProfileData />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            {/* User Profile */}
            <Route
              path="/teacher-profile"
              element={
                checking ? (
                  <TeacherProfile />
                ) : role === "teacher" ? (
                  <TeacherProfile />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route path="/registration" element={<Registration />}></Route>
          </Routes>
        </div>
      </Suspense>

      <div
        onClick={() => {
          topFunction();
        }}
        id="myBtn"
        className={showBtn}
        title="Go to top"
      >
        <GoToHeader className="icon" />
        {/* <img src={goToHeader} alt="photo" /> */}
      </div>
    </div>
  );
}

export default App;
