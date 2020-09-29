import Link from "@material-ui/core/Link";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import React, { ReactElement } from "react";
import { XUD_DOCKER_DOCS_URL } from "../constants";

function LinkToSetupGuide(): ReactElement {
  return (
    <>
      <Link
        component="button"
        color="textSecondary"
        onClick={() =>
          (window as any).electron.openExternal(XUD_DOCKER_DOCS_URL)
        }
      >
        How to set up XUD Docker
      </Link>
      &nbsp;
      <OpenInNewIcon fontSize="inherit" />
    </>
  );
}

export default LinkToSetupGuide;
