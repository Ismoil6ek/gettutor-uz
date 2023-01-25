import React from "react";
import "./innerLoader.scss";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

const InnerLoader = () => {
  return (
    <div className="inner-loader">
      <Stack sx={{ color: "grey.500" }} spacing={2} direction="row">
        <CircularProgress color="success" />
      </Stack>
    </div>
  );
};

export default InnerLoader;
