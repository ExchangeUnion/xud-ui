import React, { ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PageCircularProgress from "../../common/PageCircularProgress";
import { redirectToNextRoute } from "./create-effect";

const Create = (): ReactElement => {
  const history = useHistory();
  useEffect(redirectToNextRoute(history));
  return <PageCircularProgress />;
};

export default Create;
