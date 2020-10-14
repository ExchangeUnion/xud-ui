import { createStyles, makeStyles, Theme, Tooltip } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
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
  const offChainSubrows: WalletSubrow[] = [
    {
      label: "free in channel",
      value: satsToCoinsStr(balance.channel_balance),
    },
    { label: "in orders", value: "X.XXXX" },
  ];

  const getLimitsRow = (buy: boolean): ReactElement => {
    const label = `Max ${buy ? "buy" : "sell"}`;

    return (
      <WalletRow
        label={label}
        value={satsToCoinsStr(buy ? limits!.max_buy : limits!.max_sell)}
        labelItem={
          !["BTC", "LTC"].includes(currency) && (
            <Tooltip title="auto-extended">
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
                value={satsToCoinsStr(balance.wallet_balance)}
                labelItem={
                  <Tooltip title="on-chain, not tradable">
                    <HelpOutlineIcon fontSize="inherit" />
                  </Tooltip>
                }
              />
              <WalletRow
                label="Channel"
                subrows={offChainSubrows}
                labelItem={
                  <Tooltip title="off-chain, tradable">
                    <HelpOutlineIcon fontSize="inherit" />
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
