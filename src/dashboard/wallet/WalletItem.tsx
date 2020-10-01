import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React, { ReactElement } from "react";
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
    cardContent: {
      padding: theme.spacing(3),
    },
  })
);

function WalletItem(props: WalletItemProps): ReactElement {
  const classes = useStyles();
  const { balance, currency, limits } = props;
  const onchainSubrows: WalletSubrow[] = [
    {
      label: "max sell",
      value: limits?.max_sell,
    },
    {
      label: "max buy",
      value: limits?.max_buy,
      color: "textSecondary",
    },
    { label: "in orders", value: "X.XXXX" },
  ];

  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Card>
        <CardContent className={classes.cardContent}>
          <Typography component="h2" variant="h6" color="textSecondary">
            {currency}
          </Typography>
          <Grid container spacing={2}>
            <WalletRow
              label="on-chain"
              value={balance.wallet_balance}
            ></WalletRow>
            <WalletRow
              label="on-lightning (tradable)"
              subrows={onchainSubrows}
            ></WalletRow>
            <WalletRow label="Total" value={balance.total_balance}></WalletRow>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default WalletItem;
