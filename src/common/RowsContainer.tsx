import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import React, { ReactElement } from "react";

function RowsContainer(props: { children: ReactElement[] }): ReactElement {
  const { children } = props;
  return (
    <Box height="100vh" padding="10vh 10vw">
      <Grid container direction="column" spacing={10}>
        {children}
      </Grid>
    </Box>
  );
}
export default RowsContainer;
