import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React, { ReactElement } from "react";

export type WalletRowProps = {
  label: string;
  value?: string;
  labelItem?: ReactElement | boolean;
  color?: "textPrimary" | "textSecondary" | "primary" | "secondary" | "error";
  subrows?: WalletSubrow[];
};

export type WalletSubrow = Omit<WalletRowProps, "subrows">;

function WalletRow(props: WalletRowProps): ReactElement {
  return (
    <Grid item container>
      <Grid
        item
        container
        justify="space-between"
        alignItems="center"
        wrap="nowrap"
      >
        <Grid item container spacing={1} wrap="nowrap">
          <Grid item>
            <Typography
              component="span"
              variant="subtitle1"
              color={props.color}
              noWrap
            >
              {props.label}
            </Typography>
          </Grid>
          {!!props.labelItem && (
            <Grid item container alignItems="center">
              {props.labelItem}
            </Grid>
          )}
        </Grid>
        <Typography component="span" variant="body2" color={props.color}>
          {props.value}
        </Typography>
      </Grid>
      {props.subrows &&
        props.subrows.map((row) => (
          <Grid item container justify="space-between" key={row.label}>
            <Typography component="span" variant="body2" color={row.color}>
              {row.label}
            </Typography>
            <Typography component="span" variant="body2" color={row.color}>
              {row.value}
            </Typography>
          </Grid>
        ))}
    </Grid>
  );
}

export default WalletRow;
