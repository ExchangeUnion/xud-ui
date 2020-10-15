import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Theme,
} from "@material-ui/core";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import React, { ReactElement } from "react";
import CSVLink from "../../common/csv/CsvLink";
import { formatDateTimeForFilename } from "../../common/dateUtil";
import { TradeHeader, TradeRow } from "./Tradehistory";

export type TradehistoryDownloadProps = {
  rows: TradeRow[];
  headers: TradeHeader[];
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    downloadButtonContainer: {
      paddingTop: theme.spacing(3),
    },
    downloadLink: {
      textDecoration: "none",
    },
  })
);

const TradehistoryDownload = (
  props: TradehistoryDownloadProps
): ReactElement => {
  const classes = useStyles();
  const { headers, rows } = props;

  return (
    <Grid
      item
      container
      justify="flex-end"
      className={classes.downloadButtonContainer}
    >
      <CSVLink
        data={rows}
        headers={headers}
        filename={`tradehistory_${formatDateTimeForFilename(new Date())}.csv`}
        className={classes.downloadLink}
      >
        <Button variant="contained" startIcon={<GetAppOutlinedIcon />}>
          Download (.csv)
        </Button>
      </CSVLink>
    </Grid>
  );
};

export default TradehistoryDownload;
