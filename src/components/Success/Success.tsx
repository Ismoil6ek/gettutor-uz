import React from "react";
import "./success.scss";

// img
import { ReactComponent as SuccessSvg } from "../../assets/svg/successSent.svg";

import Dialog from "@mui/material/Dialog";

const Success = ({ success }: { success: boolean }) => {
  const [open, setOpen] = React.useState(success);

  // useEffect(() => {
  //   const handleClose = () => {
  //     setTimeout(() => {
  //       setOpen(false);
  //     }, 1000);
  //   };
  //   handleClose();
  // }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="success">
          <SuccessSvg />
          <h4>Ваша заявка отправлено!</h4>
          <button onClick={() => setOpen(false)}>Хорошо</button>
        </div>
      </Dialog>
    </div>
  );
};

export default Success;
