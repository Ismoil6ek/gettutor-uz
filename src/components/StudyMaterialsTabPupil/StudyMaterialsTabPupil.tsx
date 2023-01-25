import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";

// MUI icons
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Dialog from "@mui/material/Dialog";
import EmptyMaterialICon from "../../assets/svg/empty_materials_icon.svg";

//Image
import cancel from "../../assets/svg/cancel.svg";

// connect sass
import "./studyMaterialsTabPupil.scss";
import { base_url } from "../../data";
import { useEffect } from "react";
import { useState } from "react";
import { language, studentVideos, teachers, temp_video_obj } from "../../data/interfaces";
import { useAppSelector } from "../../hooks/useTypedSelector";
import Loader from "../Loader/Loader";

const StudyMaterialsTabPupil = () => {
  const { t, i18n } = useTranslation();
  // const chevronWidth = 40;
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [videos, setVideos] = useState<studentVideos[] | null>(null);
  const [teachers, setTeachers] = useState<teachers[] | null>(null);
  const [filtered, setFiltered] = useState<{ [key: number]: (temp_video_obj)[] } | []>([]);
  const [open, setOpen] = useState(false);
  const [videoLink, setVideoLink] = useState<string>("");
  const { subjects } = useAppSelector((state) => state);
  const [loader, setLoader] = useState(true);
  
    const handleChange =
      (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
      };

  const handleSubject = (id: number) => {
    const subjectItem =   subjects?.allData.filter((item: any) => item.id === id)

    if (subjectItem) {
      return subjectItem[0].name[i18n.language as language]
    }

    return ''
  }
  useEffect(() => {
    fetch(`${base_url}/site/videos/student-videos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          setVideos(result.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(`${base_url}/site/users/teachers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          setTeachers(result.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (videos) {
      let temp: { [key: number]: (temp_video_obj)[] } = [];
      videos.forEach((video) => {
        let temp_id = video.subject_id;

        let temp_video_obj: temp_video_obj = {
          video_name: video.video_name,
          video_link: video.video_link,
          video_teacher_name: video.teacher_name,
          video_subject_name: video.subject,
        };

        if (!Array.isArray(temp[temp_id])) {
          temp[temp_id] = [temp_video_obj];
        } else {
          temp[temp_id].push(temp_video_obj);
        }
      });
      teachers && setLoader(false);

      setFiltered(temp);
    }
  }, [videos, teachers]);

  const handleClose = () => {
    setOpen(false);
  };
  return loader ? (
    <Loader height="50vh" width="100%" />
  ) : (
    <div className="study-materials-tab-pupil">
      {teachers?.length ? (
        teachers?.map((item, index) => {
          return (
            <Accordion
              key={index}
              expanded={expanded === `panel${index+1}`}
              onChange={handleChange(`panel${index+1}`)}
              sx={{ margin: "10px !important" }}
              className="study-materials-tab-pupil-accordion"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
                className="study-materials-tab-pupil-accordion-summary"
              >
                <Typography className="study-materials-tab-pupil-typography-header">
                  <span className="study-materials-tab-pupil-typography-title">
                    {handleSubject(item.subject_id)}
                  </span>
                  <span className="study-materials-tab-pupil-subject-content">
                    {filtered[item.subject_id]
                      ? filtered[item.subject_id].length
                      : 0}
                    {t("studentProfile.classes")}
                  </span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="study-materials-tab-pupil-accordion-details">
                {filtered[item.subject_id] ? (
                  filtered[item.subject_id].map((el, index) => {
                    return (
                      <Typography
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        className="study-materials-tab-pupil-typography-content-item"
                      >
                        {el.video_link?.split(".").pop() === "mp4" ? (
                          <span
                            onClick={() => {
                              setOpen(true);
                              setVideoLink(el.video_link)
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <PlayCircleIcon className="study-materials-tab-pupil-typography-content-item-icon" />
                            {el.video_name}
                          </span>
                        ) : (
                          <a
                            target="blank"
                            href={el.video_link}
                            download
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <InsertDriveFileIcon className="study-materials-tab-pupil-typography-content-item-icon" />
                            {el.video_name}
                          </a>
                        )}
                        <span>{el.video_teacher_name}</span>
                      </Typography>
                    );
                  })
                ) : (
                  <div style={{ textAlign: "center" }}>
                    {t("profile.Tutorials!")}
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
            
          );
        })
      ) : (
        <div className="empty-materials">
          <img src={EmptyMaterialICon} alt="empty_material_icon" />
          <div className="empty-materials-content">
            <h3 className="empty-materials-title">{t("profile.Textbooks")}</h3>
            <span className="empty-materials-description">
              {t("profile.NoTutorials")}
            </span>
          </div>
        </div>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div
          style={{ background: "#fff", borderRadius: "5px", padding: "10px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: " 10px",
            }}
          >
            <img
              onClick={() => setOpen(false)}
              style={{ cursor: "pointer" }}
              src={cancel}
              alt="photo"
            />
          </div>
          <video
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
            }}
            src={videoLink !== "" ? videoLink : "../../assets/video/mov.mp4"}
            controls
          ></video>
        </div>
      </Dialog>
    </div>
  );
};

export default StudyMaterialsTabPupil;
