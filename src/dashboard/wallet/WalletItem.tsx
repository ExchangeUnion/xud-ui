import { createStyles, makeStyles, Theme, Tooltip } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import React, { ReactElement } from "react";
import { satsToCoinsStr } from "../../common/currencyUtil";
import Balance from "../../models/Balance";
import { TradingLimits } from "../../models/TradingLimits";
import WalletRow, { WalletSubrow } from "./WalletRow";

export type WalletItemProps = {
  currency: string;
  balance: Balance;
  limits?: TradingLimits;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      height: "100%",
    },
    cardContent: {
      padding: theme.spacing(3),
    },
    rowsGroup: {
      paddingTop: theme.spacing(2),
    },
  })
);

function WalletItem(props: WalletItemProps): ReactElement {
  const classes = useStyles();
  const { balance, currency, limits } = props;
  const offChainSubrows: WalletSubrow[] = [];
  const onChainSubrows: WalletSubrow[] = [];

  const addToRowsIfNotZero = (
    rows: WalletSubrow[],
    value: string | number,
    label: string
  ): void => {
    if (Number(value)) {
      rows.push({
        label: label,
        value: satsToCoinsStr(value),
      });
    }
  };

  addToRowsIfNotZero(
    offChainSubrows,
    balance.pending_channel_balance,
    "pending"
  );
  addToRowsIfNotZero(
    offChainSubrows,
    balance.inactive_channel_balance,
    "inactive"
  );
  addToRowsIfNotZero(
    onChainSubrows,
    balance.unconfirmed_wallet_balance,
    "pending"
  );

  const getLimitsRow = (buy: boolean): ReactElement => {
    const label = `Max ${buy ? "buy" : "sell"}`;
    const hints = [];
    const reserved = Number(
      buy ? limits!.reserved_inbound : limits!.reserved_outbound
    );
    if (reserved) {
      hints.push(`in orders: ${satsToCoinsStr(reserved)}`);
    }
    if (buy && !["BTC", "LTC"].includes(currency)) {
      hints.push("auto-extended");
    }

    return (
      <WalletRow
        label={label}
        value={satsToCoinsStr(buy ? limits!.max_buy : limits!.max_sell)}
        labelItem={
          !!hints.length && (
            <Tooltip
              title={hints.map((hint) => (
                <div>{hint}</div>
              ))}
            >
              <InfoIcon fontSize="inherit" />
            </Tooltip>
          )
        }
      />
    );
  };

  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography component="h2" variant="h6" color="textSecondary">
            {currency}
          </Typography>
          <Grid container direction="column">
            <Grid item container className={classes.rowsGroup}>
              <Typography component="h3" variant="overline">
                <strong>Balance</strong>
              </Typography>
              <WalletRow
                label="Wallet"
                subrows={onChainSubrows}
                value={satsToCoinsStr(balance.wallet_balance)}
                labelItem={
                  <Tooltip title="on-chain, not tradable">
                    <InfoIcon fontSize="inherit" />
                  </Tooltip>
                }
              />
              <WalletRow
                label="Channel"
                value={satsToCoinsStr(balance.channel_balance)}
                subrows={offChainSubrows}
                labelItem={
                  <Tooltip title="off-chain, tradable">
                    <InfoIcon fontSize="inherit" />
                  </Tooltip>
                }
              />
              <WalletRow
                label="Total"
                value={satsToCoinsStr(balance.total_balance)}
              />
            </Grid>
            {limits && (
              <Grid item container className={classes.rowsGroup}>
                <Typography component="h3" variant="overline">
                  <strong>Trading limits</strong>
                </Typography>
                {getLimitsRow(true)}
                {getLimitsRow(false)}
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default WalletItem;
