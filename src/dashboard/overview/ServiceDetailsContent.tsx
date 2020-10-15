import {
  CircularProgress,
  createStyles,
  DialogContent,
  Divider,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import { Subscription } from "rxjs";
import api from "../../api";
import { SERVICES_WITH_ADDITIONAL_INFO } from "../../constants";
import { Info } from "../../models/Info";
import { LndInfo } from "../../models/LndInfo";
import { Status } from "../../models/Status";
import { SettingsStore, SETTINGS_STORE } from "../../stores/settingsStore";
import { WithStores } from "../../stores/WithStores";

export type ServiceDetailsContentProps = WithStores & {
  status: Status;
  closeDetails: () => void;
};

type InfoRow = {
  label: string;
  value: string | number;
  copyIcon?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      padding: 0,
    },
    contentCell: {
      padding: theme.spacing(2),
      textAlign: "center",
      wordWrap: "break-word",
      whiteSpace: "pre-wrap",
    },
    textRow: {
      padding: theme.spacing(3),
      textAlign: "center",
    },
    loaderContainer: {
      height: "100px",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);

const fetchInfo = (
  settingsStore: SettingsStore,
  onNext: (value: Info) => void,
  closeDetails: () => void
): Subscription => {
  return api.getinfo$(settingsStore.xudDockerUrl).subscribe({
    next: onNext,
    error: closeDetails,
  });
};

const createRows = (info: Info, status: Status): InfoRow[] => {
  if (status.service === "xud") {
    return createXudRows(status, info);
  }
  if (status.service === "connext") {
    return createConnextRows(info);
  }
  if (status.service.startsWith("lnd")) {
    const currency = status.service === "lndbtc" ? "BTC" : "LTC";
    const lndInfo: LndInfo = info.lnd[currency];
    return createLndRows(lndInfo);
  }
  return [];
};

const createXudRows = (status: Status, info: Info): InfoRow[] => [
  { label: "Status", value: status.status },
  { label: "Alias", value: info.alias },
  {
    label: "NodeKey",
    value: info.node_pub_key,
    copyIcon: !!info.node_pub_key,
  },
  {
    label: "Address",
    value: info.uris?.length ? info.uris[0] : "",
    copyIcon: !!info.uris?.length,
  },
  { label: "Network", value: info.network },
  { label: "Peers", value: info.num_peers },
  { label: "Pairs", value: info.num_pairs },
  { label: "Own orders", value: info.orders.own },
  { label: "Peers' orders", value: info.orders.peer },
  { label: "Pending swaps", value: info.pending_swap_hashes?.join("\n") },
];

const createConnextRows = (info: Info): InfoRow[] => [
  { label: "Status", value: info.connext.status },
  {
    label: "Address",
    value: info.connext.address,
    copyIcon: !!info.connext.address,
  },
  { label: "Version", value: info.connext.version },
  { label: "Chain", value: info.connext.chain },
];

const createLndRows = (lndInfo: LndInfo): InfoRow[] => [
  { label: "Status", value: lndInfo.status },
  { label: "Alias", value: lndInfo.alias },
  {
    label: "Address",
    value: lndInfo.uris?.length ? lndInfo.uris[0] : "",
    copyIcon: !!lndInfo.uris?.length,
  },
  {
    label: "Chains",
    value: (lndInfo.chains || [])
      .map((chain) => `${chain.chain} ${chain.network}`)
      .join("\n"),
  },
  { label: "Blockheight", value: lndInfo.blockheight },
  { label: "Active channels", value: lndInfo.channels?.active },
  { label: "Inactive channels", value: lndInfo.channels?.inactive },
  { label: "Pending channels", value: lndInfo.channels?.pending },
  { label: "Closed channels", value: lndInfo.channels?.closed },
  { label: "Version", value: lndInfo.version },
];

const ServiceDetailsContent = inject(SETTINGS_STORE)(
  observer(
    (props: ServiceDetailsContentProps): ReactElement => {
      const { settingsStore, status, closeDetails } = props;
      const classes = useStyles();
      const [rows, setRows] = useState<InfoRow[]>([]);
      const [initialLoadComplete, setInitialLoadComplete] = useState(false);

      useEffect(() => {
        if (!SERVICES_WITH_ADDITIONAL_INFO.includes(status.service)) {
          return;
        }
        const onNextValue = (value: Info): void => {
          setRows(createRows(value, status));
          if (!initialLoadComplete) {
            setInitialLoadComplete(true);
          }
        };
        const subscription = fetchInfo(
          settingsStore!,
          onNextValue,
          closeDetails
        );
        return () => subscription.unsubscribe();
      }, [closeDetails, initialLoadComplete, settingsStore, status]);

      return (
        <DialogContent className={classes.content}>
          {initialLoadComplete ? (
            rows?.map((row) => (
              <Grid
                key={row.label}
                container
                item
                justify="space-between"
                alignItems="center"
              >
                <Grid item xs={3} md={2} className={classes.contentCell}>
                  <strong>{row.label}</strong>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item xs={6} md={8} className={classes.contentCell}>
                  {row.value}
                </Grid>
                <Grid item xs={2} md={1} className={classes.contentCell}>
                  {row.copyIcon && (
                    <IconButton
                      onClick={() =>
                        (window as any).electron.copyToClipboard(row.value)
                      }
                    >
                      <FileCopyOutlinedIcon fontSize="small" />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))
          ) : (
            <Grid container className={classes.loaderContainer}>
              <CircularProgress color="inherit" />
            </Grid>
          )}
          {!rows?.length &&
            !SERVICES_WITH_ADDITIONAL_INFO.includes(status.service) && (
              <Typography
                variant="body1"
                component="p"
                className={classes.textRow}
              >
                No additional information to display
              </Typography>
            )}
        </DialogContent>
      );
    }
  )
);

export default ServiceDetailsContent;
