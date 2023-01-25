import React from "react";
import "./studyMaterialsTabTeacher.scss";
import { useTranslation } from "react-i18next";
import { base_url } from "../../data";
import { changeStateAction, getTutorVideos } from "../../redux/actions";
//import MUI icons
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

// MUI elements
import {
  Dialog,
  IconButton,
  InputLabel,
  Menu,
  Popover,
  Select,
  SelectChangeEvent,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

// images
import uploadIcon from "../../assets/svg/upload-icon.svg";
import Cancel from "../../assets/svg/cancel.svg";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import EmptyMaterialICon from "../../assets/svg/empty_materials_icon.svg";
import { useEffect } from "react";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/useTypedSelector";
import { idObject, literalKey } from "../../data/interfaces";
import { filterSelectStyle, menuItemStyle } from "../../data/styles";

const StudyMaterialsTabTeacher = () => {
  const { t } = useTranslation();
  const [anchorHandleCertificate, setAnchorHandleCertificate] =
    useState<Element | null>(null);
  const [fileVideo, setFileVideo] = useState<File | null>(null);
  const [fileVideoId, setFileVideoId] = useState(null);
  const [anchorUploadCertificate, setAnchorUploadCertificate] =
    useState<boolean>(false);
  const [value, setValue] = useState(0);
  const [videoName, setVideoName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(6);
  const [tempId, setTempId] = useState<idObject | number | null>(null);
  const [tempObj, setTempObj] = useState<idObject | null>(null);
  const [tempKey, setTempKey] = useState("");
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [openMobileVideoDialog, setOpenMobileVideoDialog] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const dispatch = useDispatch();
  const { changeState, tutorVideos } = useAppSelector((state) => state);
  const [loader, setLoader] = useState(true);
  const useLabel = useRef<HTMLLabelElement | null>(null);
  const [typeMaterial, setTypeMaterial] = useState<string>("All");
  const [renderCert, setRenderCert] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setTypeMaterial(event.target.value);
  };

  const filterMaterial = () => {
    let filteredMaterialsList: any = [];
    if (typeMaterial === "All") {
      filteredMaterialsList = tutorVideos;
      return filteredMaterialsList;
    } else if (typeMaterial === "Document") {
      filteredMaterialsList = tutorVideos.filter(
        (item) => item.video_link.split(".").pop() === "pdf"
      );
      return filteredMaterialsList;
    } else {
      filteredMaterialsList = tutorVideos.filter(
        (item) => item.video_link.split(".").pop() === "mp4"
      );
      return filteredMaterialsList;
    }
  };

  const openHandleCertificatePopover = (
    event: React.MouseEvent<HTMLLabelElement>
  ) => {
    setAnchorHandleCertificate(event.currentTarget);
  };

  const closeHandleVideoPopover = () => {
    setAnchorHandleCertificate(null);
  };

  const openUploadCertificatePopover = () => {
    setAnchorUploadCertificate(true);
  };
  const closeUploadCertificatePopover = () => {
    setAnchorUploadCertificate(false);
  };
  const addVideo = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (videoName.length === 0) {
      e.preventDefault();
      toast.error(t("extra.pleaseFillFile"));
    } else {
      uploadVideo();
      useLabel.current!.style.display = "none";
    }
  };

  const uploadVideo = () => {
    if (fileVideo) {
      const formData = new FormData();
      formData.append("file", fileVideo, fileVideo.name);

      axios
        .request({
          method: "POST",
          url: `${base_url}/site/files/upload`,
          data: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          onUploadProgress: function (progressEvent) {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              setValue(percentCompleted);
            }
          },
        })
        .then((response) => response)
        .then((data) => {
          setFileVideoId(data.data.data.id);
          if (data.status === 200) {
            closeUploadCertificatePopover();
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleClickOpenVideoDialog = (
    key: literalKey,
    id: idObject | number
  ) => {
    switch (key) {
      case "remove_video":
        setTempId(id);
        setOpenVideoDialog(true);
        setTempKey("remove_video");
        break;
      case "visibility":
        if (typeof id !== "number") {
          setTempObj(id);
        }
        setTempKey("visibility");
        break;
      default:
        return null;
    }
    setTempId(id);
    setOpenVideoDialog(true);
  };

  const handleCloseVideoDialog = () => {
    setOpenVideoDialog(false);
  };

  const removeVideo = () => {
    switch (tempKey) {
      case "remove_video":
        fetch(`${base_url}/site/videos/${tempId}/delete`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => response.json())
          .then(() => {
            handleCloseVideoDialog();
            dispatch(changeStateAction(Math.random()));
            setRenderCert((init) => !init);
          })
          .catch((err) => console.log(err));
        break;
      case "visibility":
        if (tempObj) {
          fetch(`${base_url}/site/videos/${tempObj.id}/update`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              is_public: !tempObj.isPublic,
            }),
          })
            .then((response) => response.json())
            .then(() => {
              handleCloseVideoDialog();
              dispatch(changeStateAction(Math.random()));
              setRenderCert((init) => !init);
            })
            .catch((err) => console.log(err));
        }
        break;

      default:
        return null;
    }
  };

  // show more less functions
  const showmore = () => {
    setItemsToShow(tutorVideos.length);
  };

  const showless = () => {
    setItemsToShow(6);
  };

  useEffect(() => {
    if (fileVideo) {
      closeHandleVideoPopover();
      openUploadCertificatePopover();
    }
  }, [fileVideo]);

  useEffect(() => {
    if (!anchorUploadCertificate) {
      setValue(0);
      setVideoName("");
      setFileVideo(null);
    }
  }, [anchorUploadCertificate]);
  //============================  Post video  =====================================
  useEffect(() => {
    if (fileVideoId) {
      fetch(`${base_url}/site/videos/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          file_id: fileVideoId,
          name: videoName,
          is_public: isPublic,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          dispatch(changeStateAction(Math.random()));
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line
  }, [fileVideoId]);

  useEffect(() => {
    fetch(`${base_url}/site/videos/index`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(getTutorVideos(result.data));
        setLoader(false);
      })
      .catch((err) => console.log(err));
  }, [fileVideoId, changeState, renderCert]);

  return loader ? (
    <Loader height="50vh" width="100%" />
  ) : (
    <div className="study-materials">
      <div className="upload-image">
        <Popover
          className="upload-popover"
          open={Boolean(anchorHandleCertificate)}
          anchorEl={anchorHandleCertificate}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
        >
          <div className="upolad-popover-header">
            <h2 className="upolad-popover-title">{t("profile.addMaterial")}</h2>
            <CloseIcon
              onClick={() => closeHandleVideoPopover()}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="upload-popover-body">
            <label className="upolad-popover-btn" htmlFor="upload-image">
              <img src={uploadIcon} alt="upload_icon" />
              <span>{t("profile.download")}</span>
            </label>
            <input
              accept=" application/pdf, video/*"
              className="image-uploader"
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  console.log(e.target.files[0]);
                  setFileVideo(e.target.files[0]);
                  console.log(fileVideo);
                }
              }}
              name="upload-image-input"
              id="upload-image"
            />
          </div>
        </Popover>
        {/* Popover for upload */}
        <Popover
          className="upload-popover"
          open={Boolean(anchorUploadCertificate)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
        >
          <div className="upolad-popover-header">
            <h2 className="upolad-popover-title">{t("profile.addMaterial")}</h2>
            <CloseIcon
              onClick={() => closeUploadCertificatePopover()}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="upload-popover-body">
            <h3 className="body-title">{t("profile.startDownload")}</h3>
            <div className="upload-file">
              <div className="file-logo">
                <InsertDriveFileIcon />
              </div>
              <div className="file-data">
                <div className="name-upload-proccess">
                  <h4 className="file-name">{fileVideo?.name}</h4>
                  {value > 0 && (
                    <label className="upload-proccess" htmlFor="progress-bar">
                      {value}%
                    </label>
                  )}
                </div>
                {value > 0 && (
                  <div className="progress-file">
                    <progress
                      id="progress-bar"
                      value={value}
                      max={100}
                    ></progress>
                  </div>
                )}
              </div>
              <label ref={useLabel} htmlFor="cancel">
                <img src={Cancel} alt="cancel-btn" />
              </label>
              <input
                className="image-uploader"
                type="file"
                onChange={(e) => {
                  if (e.target.files) {
                    setFileVideo(e.target.files[0]);
                  }
                }}
                name="upload-image-input"
                id="cancel"
              />
            </div>
            <input
              value={videoName}
              onChange={(e) => {
                setVideoName(e.target.value);
              }}
              type="text"
              className="enter-file-name"
              placeholder={t("profile.fileName") as string}
            />
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={1}
                name="radio-buttons-group"
              >
                <FormControlLabel
                  className="form-control-label"
                  value={1}
                  control={<Radio className="radio" />}
                  label={t("extra.VisibleP")}
                  onClick={() => setIsPublic(false)}
                />
                <FormControlLabel
                  className="form-control-label"
                  value={2}
                  control={<Radio className="radio" />}
                  label={t("extra.VisibleA")}
                  onClick={() => setIsPublic(true)}
                />
              </RadioGroup>
            </FormControl>
            <div className="add-cancel-btn-wrapper">
              <button className="add-certificate" onClick={(e) => addVideo(e)}>
                {t("profile.add")}
              </button>
              <button
                onClick={() => {
                  closeUploadCertificatePopover();
                }}
                className="cancel-action"
              >
                {t("profile.toCancel")}
              </button>
            </div>
          </div>
        </Popover>
      </div>
      {tutorVideos.length ? (
        <div className="study-materials-content">
          <div className="study-materials-header">
            <h3 className="study-materials-title">{t("profile.Textbooks")}</h3>
            <div className="study-materials-buttons">
              {/* <button className="sort-study-materials-btn">
                {t("profile.sort")} <ArrowDropDownIcon />
              </button> */}
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small">
                  {t("extra.filter")}
                </InputLabel>
                <Select
                  sx={filterSelectStyle}
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={typeMaterial}
                  label="Filter"
                  onChange={handleChange}
                >
                  <MenuItem sx={menuItemStyle} value={"Document"}>
                    {t("extra.docouments")}
                  </MenuItem>
                  <MenuItem sx={menuItemStyle} value={"Videos"}>
                    {t("extra.videos")}
                  </MenuItem>
                  <MenuItem sx={menuItemStyle} value={"All"}>
                    {t("extra.all")}
                  </MenuItem>
                </Select>
              </FormControl>
              <label
                onClick={openHandleCertificatePopover}
                className="add-study-materials"
                htmlFor="upload-video"
              >
                <AddIcon className="add-study-materials-icon" />
              </label>
            </div>
          </div>
          <div className="study-materials-body">
            {tutorVideos &&
              filterMaterial()
                .slice(
                  0,
                  tutorVideos.length > 6 ? itemsToShow : tutorVideos.length
                )
                .map((item: any) => {
                  return (
                    <div key={item.id} className="study-material-item-wrapper">
                      <div className="study-material-video">
                        <div key={item.id} className="video-menu laptop">
                          <PopupState
                            variant="popover"
                            popupId="demo-popup-menu"
                          >
                            {(popupState) => (
                              <React.Fragment>
                                <IconButton
                                  {...bindTrigger(popupState)}
                                  aria-label="more"
                                  id="long-button"
                                  aria-haspopup="true"
                                >
                                  <MoreVertIcon />
                                </IconButton>
                                {/* Dashboard */}
                                <Menu
                                  {...bindMenu(popupState)}
                                  anchorOrigin={{
                                    vertical: "center",
                                    horizontal: "center",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                  }}
                                  className="menu-ul"
                                >
                                  <MenuItem
                                    style={{
                                      padding: "3px",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      gap: "5px",
                                    }}
                                    className="menu-item-li"
                                    onClick={() => {
                                      popupState.close();
                                    }}
                                  >
                                    <a
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                      }}
                                      href={item.video_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {t("profile.fullScreen")}
                                      <FullscreenIcon fontSize="small" />
                                    </a>
                                  </MenuItem>
                                  <MenuItem
                                    style={{
                                      padding: "3px",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      gap: "5px",
                                    }}
                                    className="menu-item-li"
                                    onClick={() => {
                                      handleClickOpenVideoDialog("visibility", {
                                        isPublic: item.is_public,
                                        id: item.id,
                                      });
                                      popupState.close();
                                    }}
                                  >
                                    {t("profile.ChangeVisibility")}
                                    <div className="visibility laptop">
                                      {item?.is_public ? (
                                        <VisibilityIcon
                                          fontSize="small"
                                          className="visibility-icon"
                                        />
                                      ) : (
                                        <VisibilityOffIcon
                                          fontSize="small"
                                          className="visibility-icon"
                                        />
                                      )}
                                    </div>
                                  </MenuItem>
                                  <MenuItem
                                    style={{
                                      padding: "3px",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      gap: "5px",
                                    }}
                                    className="menu-item-li"
                                    onClick={() => {
                                      handleClickOpenVideoDialog(
                                        "remove_video",
                                        item.id
                                      );
                                      popupState.close();
                                    }}
                                  >
                                    {t("profile.Delete")}
                                    <DeleteIcon fontSize="small" />
                                  </MenuItem>
                                </Menu>
                              </React.Fragment>
                            )}
                          </PopupState>
                        </div>
                        {item.video_link?.split(".").pop() === "mp4" ? (
                          <div className="videos-wrapper">
                            <video
                              controlsList="nodownload noplaybackrate"
                              width="240px"
                              src={item.video_link}
                              controls
                              disablePictureInPicture
                              className="laptop"
                            ></video>
                            <div className="videos-mobile mobile">
                              <div className="video-mobile-item">
                                <div className="video-icon-name-wrapper">
                                  <PlayCircleFilledIcon
                                    onClick={() => (
                                      setOpenMobileVideoDialog(true),
                                      setVideoLink(item.video_link)
                                    )}
                                  />
                                  <h4
                                    onClick={() => (
                                      setOpenMobileVideoDialog(true),
                                      setVideoLink(item.video_link)
                                    )}
                                    className="video-name"
                                  >
                                    {item.video_name}
                                  </h4>
                                </div>
                                <div className="delete-visibililty-icons-wrapper">
                                  {item?.is_public ? (
                                    <VisibilityIcon
                                      onClick={() => {
                                        handleClickOpenVideoDialog(
                                          "visibility",
                                          {
                                            isPublic: item.is_public,
                                            id: item.id,
                                          }
                                        );
                                        // ChangeVideoVisibility();
                                      }}
                                      className="visibility-icon"
                                    />
                                  ) : (
                                    <VisibilityOffIcon
                                      onClick={() => {
                                        handleClickOpenVideoDialog(
                                          "visibility",
                                          {
                                            isPublic: item.is_public,
                                            id: item.id,
                                          }
                                        );
                                        // ChangeVideoVisibility(item.is_public, item.id);
                                      }}
                                      className="visibility-icon"
                                    />
                                  )}
                                  <DeleteIcon
                                    onClick={() => {
                                      handleClickOpenVideoDialog(
                                        "remove_video",
                                        item.id
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <h4 className="video-name laptop">
                              {item.video_name}
                            </h4>
                          </div>
                        ) : (
                          <div className="mobile-laptop-file-wrapper files-wrapper">
                            <div className="laptop-file-wrapper laptop">
                              <object
                                data={item.video_link}
                                className="laptop"
                                // type="application/pdf"
                              >
                                {" "}
                              </object>
                            </div>
                            <div className="files-mobile mobile">
                              <a
                                href={item.video_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="file-mobile-item"
                              >
                                <InsertDriveFileIcon />
                                <h4 className="video-name">
                                  {item.video_name}
                                </h4>
                              </a>
                              <div className="delete-visibililty-icons-wrapper">
                                {item?.is_public ? (
                                  <VisibilityIcon
                                    onClick={() => {
                                      handleClickOpenVideoDialog("visibility", {
                                        isPublic: item.is_public,
                                        id: item.id,
                                      });
                                    }}
                                    className="visibility-icon"
                                  />
                                ) : (
                                  <VisibilityOffIcon
                                    onClick={() => {
                                      handleClickOpenVideoDialog("visibility", {
                                        isPublic: item.is_public,
                                        id: item.id,
                                      });
                                    }}
                                    className="visibility-icon"
                                  />
                                )}
                                <DeleteIcon
                                  onClick={() => {
                                    handleClickOpenVideoDialog(
                                      "remove_video",
                                      item.id
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <h4 className="video-name laptop">
                              {item.video_name}
                            </h4>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            {/* Dialog for remove certificate */}
            <Dialog
              open={openVideoDialog}
              onClose={() => setOpenVideoDialog(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <div className="dialog-content">
                <h3 className="dialog-title">{t("profile.sure?")}</h3>
                <button onClick={removeVideo} className="confirm-command-btn">
                  {t("profile.Yes")}
                </button>
                <button onClick={handleCloseVideoDialog} className="cancel-btn">
                  {t("profile.Cancel")}
                </button>
              </div>
            </Dialog>
            {/* Dialog for show video on mobile */}
            <Dialog
              open={openMobileVideoDialog}
              onClose={() => setOpenMobileVideoDialog(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "5px",
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: " 10px",
                  }}
                >
                  <img
                    onClick={() => setOpenMobileVideoDialog(false)}
                    style={{ cursor: "pointer" }}
                    src={Cancel}
                    alt="cancel-icon"
                  />
                </div>
                <video
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                  }}
                  src={
                    videoLink !== "" ? videoLink : "../../assets/video/mov.mp4"
                  }
                  controls
                ></video>
              </div>
            </Dialog>
          </div>

          <div className="show-more-less-btn-wrapper">
            {tutorVideos && tutorVideos.length >= 7 ? (
              itemsToShow < 7 ? (
                <button
                  onClick={showmore}
                  className="show-more-study-materials-btn"
                >
                  {t("viewTutor.showMore")}
                  <ArrowDownwardIcon className="show-more-study-materials-btn-icon" />
                </button>
              ) : (
                <button
                  onClick={showless}
                  className="show-more-study-materials-btn"
                >
                  {t("profile.showLess")}
                  <ArrowUpwardIcon className="show-more-study-materials-btn-icon" />
                </button>
              )
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <div className="empty-materials">
          <img src={EmptyMaterialICon} alt="empty_material_icon" />
          <div className="empty-materials-content">
            <h3 className="empty-materials-title">{t("profile.Textbooks")}</h3>
            <span className="empty-materials-description">
              {t("profile.YouHaven'tAdded")}
            </span>
          </div>
          <label
            onClick={openHandleCertificatePopover}
            className="add-study-materials"
            htmlFor="upload-video"
          >
            <AddIcon className="add-study-materials-icon" /> {t("profile.add")}
          </label>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialsTabTeacher;
