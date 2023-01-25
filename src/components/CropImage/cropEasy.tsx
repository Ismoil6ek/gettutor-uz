import { Dialog, DialogContentText, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "./cropImage";
import "./crop.scss";

const CropEasy = ({
  photoURL,
  files,
  setPhotoURL,
  setFile,
}: {
  photoURL: string;
  files: File;
  setPhotoURL: (url: string) => void;
  setFile: (file: Blob) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(2);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    console.log({
      result:
        sessionStorage.getItem("currentlyOpened") !== null
          ? JSON.parse(sessionStorage.getItem("currentlyOpened")!)
          : "nothing",
    });

    if (!JSON.parse(sessionStorage.getItem("currentlyOpened")!)) {
      setOpen(true);
      sessionStorage.setItem("currentlyOpened", JSON.stringify(true));
    }

    setTimeout(() => {
      sessionStorage.setItem("currentlyOpened", JSON.stringify(false));
    }, 1e5);
  }, [files.name]);

  const handleClose = () => {
    setOpen(false);

    setTimeout(() => {
      sessionStorage.setItem("currentlyOpened", JSON.stringify(false));
    }, 2000);
  };

  const cropComplete = (cropedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropImage = async () => {
    try {
      if (croppedAreaPixels) {
        const { file, url } = (await getCroppedImg(
          photoURL,
          croppedAreaPixels,
          files
        )) as { file: Blob; url: string };
        setFile(file);
        setPhotoURL(url);
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onClose={handleClose}
      sx={{ borderRadius: "8px" }}
      className="dialog"
    >
      <DialogTitle
        sx={{
          background: "#fff",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        <h2 className="crop-modal-title">Обрезать изображение</h2>
      </DialogTitle>
      <DialogContentText
        sx={{
          background: "#fff",
          position: "relative",
          height: 250,
          width: "auto",
          minWidth: { sm: 400 },
        }}
      >
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onZoomChange={setZoom}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
          cropSize={{ width: 250, height: 250 }}
        />
      </DialogContentText>
      <div className="crop-btns">
        <button className="crop-modal-btn" onClick={cropImage}>
          Обрезать
        </button>
        <button onClick={handleClose} className="crop-modal-btn2">
          Отмена
        </button>
      </div>
    </Dialog>
  );
};

export default CropEasy;
