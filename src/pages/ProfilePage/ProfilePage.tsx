import React, { useState } from "react";
import Tab from "../../components/Tab/Tab";
import Ad from "../../components/Ad/Ad";
// import components
import ProfileCart from "../../components/ProfileCart/ProfileCart";
// import css
import "./profilePage.scss";
import MyStudentsCart from "../../components/MyStudentsCart/MyStudentsCart";
import MyTeachersCart from "../../components/MyTeachersCart/MyTeachersCart";
import { useSelector } from "react-redux";
import ProgressVerification from "../../components/ProgressVerification/ProgressVerification";
import { useEffect } from "react";
import Footer from "../../components/Footer/Footer";

// MUI
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { useRef } from "react";
import Loader from "../../components/Loader/Loader";
import { useAppSelector } from "../../hooks/useTypedSelector";
import { TransitionProps } from "@mui/material/transitions";
import { fillCheckType } from "../../data/interfaces";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProfilePage = () => {
  const [open, setOpen] = React.useState(true);
  const [loader, setLoader] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const { role, certificates, user } = useAppSelector((state) => state);

  // control hide/show ad content states
  const [show, setShow] = useState<boolean>(false);
  // state for change tab components
  const [tabId, setTabId] = useState(0);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("open", "true");
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    role === "student" ? setShow(true) : setShow(false); // If you want enable Ad content change bolean types to opposite
  }, [role]);
  // Auto acroll when ad button is clicked

  useEffect(() => {
    progressCounter();
  }, [user, progressValue]);

  useEffect(() => {
    if (role && user) {
      setLoader(false);
    }
    // eslint-disable-next-line
  }, [user, role]);

  const progressCounter = () => {
    if (user?.role === "teacher") {
      let counter = 0;

      let counterList: string[] = [
        "firstname",
        "lastname",
        "avatar_image",
        "birthday",
        "gender",
        "country_id",
        "region_id",
        "education_id",
        "degree_id",
        "experience",
        "subject_id",
        "languages",
        "study_type_id",
        "about",
        "hourly_rate",
        "schedule",
      ];

      // fname, lname, image, age, gender, country, region, education, degree, experience, subject, languages, studytype, about, hourlyrate, schedule,
      // check if test lesson have ad 5
      // certificates
      counterList.forEach((item: string) => {
        if (user[item as fillCheckType] !== null) {
          counter++;
        }
      });

      if (user.test_lesson) counter++;

      if (user.about) counter++;

      if (certificates?.length > 0) counter += 2;
      if (counter === 20) {
        setIsCompleted(true);
      }
      setProgressValue(Math.floor((counter / 20) * 100));
    }
  };

  return !user ? (
    <Loader width="100%" height="110vh" />
  ) : (
    <div className="profile-page" data-aos="fade-up" data-aos-duration="1000">
      <main
        className={"profile-page-main without-ad"} // {show ? "profile-page-main" :} =>  Removed by Bekzod
      >
        <div className="asidebar-info-wrapper without-ad-cart">
          {role === "teacher" &&
            window.innerWidth < 1440 &&
            !sessionStorage.getItem("open") && (
              <div>
                <Dialog
                  open={open}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleClose}
                  aria-describedby="alert-dialog-slide-description"
                  className={isCompleted ? "completed" : ""}
                >
                  <ProgressVerification
                    progressValue={progressValue}
                    isCompleted={isCompleted}
                  />
                </Dialog>
              </div>
            )}

          <ProfileCart />
          {role === "teacher" && (
            <ProgressVerification
              progressValue={progressValue}
              isCompleted={isCompleted}
            />
          )}
          {role === "teacher" ? <MyStudentsCart /> : <MyTeachersCart />}
        </div>
        {/* {role === "teacher" ? (
          <Ad 
          className="add-container"
          show={show}
          setShow={setShow}
          setTabId={setTabId}
          event={event}
          />
        ) : (
          ""
        )} Removed by Bekzod */}
        <Tab
          className="tab-container without-ad-tab"
          setShow={setShow}
          tabId={tabId}
          setTabId={setTabId}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
