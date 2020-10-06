import {
  Button,
  createStyles,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  makeStyles,
  Snackbar,
  SnackbarContent,
  Theme,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import FileSaver from "file-saver";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useState } from "react";
import api from "../../api";
import { Status } from "../../models/Status";
import { SettingsStore, SETTINGS_STORE } from "../../stores/settingsStore";
import { WithStores } from "../../stores/WithStores";
import { drawerWidth } from "../Dashboard";
import ServiceDetailsContent from "./ServiceDetailsContent";

export type ServiceDetailsProps = WithStores & {
  status: Status;
  handleClose: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      position: "absolute",
      left: drawerWidth,
      top: 0,
      margin: theme.spacing(3),
      width: "100%",
      maxWidth: `calc(100% - ${drawerWidth + theme.spacing(3) * 2}px)`,
      backgroundColor: theme.palette.background.default,
    },
    snackbar: {
      bottom: theme.spacing(3) * 2,
      right: theme.spacing(3) * 2,
    },
    snackbarMessage: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  })
);

const downloadLogs = (
  settingsStore: SettingsStore,
  serviceName: string,
  handleError: () => void
): void => {
  api.logs$(serviceName, settingsStore.xudDockerUrl).subscribe({
    next: (value: string) => {
      const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, `${serviceName}_logs.log`);
    },
    error: handleError,
  });
};

const ServiceDetails = inject(SETTINGS_STORE)(
  observer(
    (props: ServiceDetailsProps): ReactElement => {
      const { settingsStore, status, handleClose } = props;
      const classes = useStyles();
      const [errorMsgOpen, setErrorMsgOpen] = useState(false);

      return (
        <Dialog
          open
          onClose={handleClose}
          classes={{
            paper: classes.dialog,
          }}
        >
          <DialogTitle>
            <Grid container justify="space-between" alignItems="center">
              <Grid item container xs={2}>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid item container justify="center" xs={8}>
                <Typography variant="h4" component="h4">
                  General {status.service} info
                </Typography>
              </Grid>
              <Grid item container justify="flex-end" xs={2}>
                <Button
                  startIcon={<GetAppOutlinedIcon />}
                  onClick={() =>
                    downloadLogs(settingsStore!, status.service, () =>
                      setErrorMsgOpen(true)
                    )
                  }
                >
                  Download logs
                </Button>
              </Grid>
            </Grid>
          </DialogTitle>
          <Divider />
          <ServiceDetailsContent status={status} />
          <Snackbar
            className={classes.snackbar}
            open={errorMsgOpen}
            autoHideDuration={10000}
            onClose={() => setErrorMsgOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <SnackbarContent
              className={classes.snackbarMessage}
              message={`Could not download the logs for ${status.service}`}
              action={
                <IconButton onClick={() => setErrorMsgOpen(false)}>
                  <CloseIcon />
                </IconButton>
              }
            />
          </Snackbar>
        </Dialog>
      );
    }
  )
);

export default ServiceDetails;
