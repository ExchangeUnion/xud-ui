import Link from "@material-ui/core/Link";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import React, { ReactElement } from "react";

function LinkToSetupGuide(): ReactElement {
  return (
    <>
      <Link
        component="button"
        color="textSecondary"
        onClick={() =>
          (window as any).electron.openExternal(
            "https://docs.exchangeunion.com/start-earning/market-maker-guide"
          )
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
