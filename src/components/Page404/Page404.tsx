import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Page404() {
  const navigate = useNavigate();
  useEffect(() => {
    window.location.replace("https://gettutor.uz/404");
  }, []);
  return <div></div>;
}
