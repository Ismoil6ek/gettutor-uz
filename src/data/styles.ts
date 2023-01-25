export const menuItemStyle = {
  color: "#000",
  display: "flex",
  gap: "5px",

  "&:nth-of-type(2n)": {
    backgroundColor: "rgba(224, 224, 224, 0.2)",
  },

  "&.Mui-selected": {
    backgroundColor: "rgba(128, 128, 128, 0.2) !important",

    "&:hover, &:focus": {
      backgroundColor: "rgba(128, 128, 128, 0.4)",
    },
  },

  "&:hover, &:focus": {
    backgroundColor: "rgba(224, 224, 224, 0.8)",
  },

  " .menu-icon": {
    width: "24px",
    height: "24px",
    color: "#a0a0a0",
    fill: "#a0a0a0",

    "&.like-active": {
      color: "#1db94e",
    },

    "&.share": {
      transform: "scale(-1, 1)",
    },
  },
};

export const selectStyle = {
  borderRadius: "10px",
  backgroundColor: "white",

  "& .MuiSelect-select": {
    paddingBlock: "15px",
  },
};

export const filterSelectStyle = {
  borderRadius: "5px",
  backgroundColor: "white",

  "& .MuiSelect-select": {
    paddingBlock: "10px",
  },
};


export const textFieldStyle = {
  ".MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "white",
  },
};
