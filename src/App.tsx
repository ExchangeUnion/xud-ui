import React, { ReactElement } from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";

function App(): ReactElement {
  return (
    <Container>
      <Box display="flex" alignItems="center" justifyContent="center" my={4}>
        <ReportProblemOutlinedIcon fontSize="large" />
        &nbsp;&nbsp;
        <Typography variant="h4" component="h1">
          XUD Docker not detected
        </Typography>
      </Box>
    </Container>
  );
}

export default App;
