import {
  createStyles,
  DialogContent,
  Divider,
  Grid,
  makeStyles,
  Theme,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { History } from "history";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Subscription } from "rxjs";
import api from "../../api";
import { Info } from "../../models/Info";
import { LndInfo } from "../../models/LndInfo";
import { Status } from "../../models/Status";
import { Path } from "../../router/Path";
import { SettingsStore, SETTINGS_STORE } from "../../stores/settingsStore";
import { WithStores } from "../../stores/WithStores";

export type ServiceDetailsContentProps = WithStores & {
  status: Status;
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
      "&:last-child": {
        paddingBottom: 0,
        borderBottom: theme.palette.divider,
      },
    },
    contentCell: {
      padding: theme.spacing(2),
      textAlign: "center",
      wordWrap: "break-word",
      whiteSpace: "pre-wrap",
    },
  })
);

const fetchInfo = (
  settingsStore: SettingsStore,
  onNext: (value: Info) => void,
  history: History
): Subscription => {
  return api.getinfo$(settingsStore.xudDockerUrl).subscribe({
    next: onNext,
    error: () => history.push(Path.DASHBOARD),
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
  { label: "Active channels", value: lndInfo.channels.active },
  { label: "Inactive channels", value: lndInfo.channels.inactive },
  { label: "Pending channels", value: lndInfo.channels.pending },
  { label: "Closed channels", value: lndInfo.channels.closed },
  { label: "Version", value: lndInfo.version },
];

const ServiceDetailsContent = inject(SETTINGS_STORE)(
  observer(
    (props: ServiceDetailsContentProps): ReactElement => {
      const { settingsStore, status } = props;
      const history = useHistory();
      const classes = useStyles();
      const [rows, setRows] = useState<InfoRow[]>([]);

      useEffect(() => {
        const onNextValue = (value: Info): void => {
          setRows(createRows(value, status));
        };
        const subscription = fetchInfo(settingsStore!, onNextValue, history);
        return () => subscription.unsubscribe();
      }, [history, settingsStore, status]);

      return (
        <DialogContent className={classes.content}>
          {!!rows?.length && (
            <>
              {rows.map((row) => (
                <Grid key={row.label} container item alignItems="center">
                  <Grid item xs={3} className={classes.contentCell}>
                    <strong>{row.label}</strong>
                  </Grid>
                  <Divider orientation="vertical" flexItem />
                  <Grid item xs={7} className={classes.contentCell}>
                    {row.value}
                  </Grid>
                  <Grid item xs={1} className={classes.contentCell}>
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
              ))}
              <Divider />
            </>
          )}
        </DialogContent>
      );
    }
  )
);

export default ServiceDetailsContent;
