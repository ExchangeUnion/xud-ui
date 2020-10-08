import {
  createStyles,
  Divider,
  Grid,
  IconButton,
  Paper,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import api from "../../api";
import CenterEllipsis from "../../common/CenterEllipsis";
import { OrderRole } from "../../enums/OrderRole";
import { OrderSide } from "../../enums/OrderSide";
import { Trade } from "../../models/Trade";
import { TradehistoryResponse } from "../../models/TradehistoryResponse";
import { SETTINGS_STORE } from "../../stores/settingsStore";
import { WithStores } from "../../stores/WithStores";
import DashboardContent from "../DashboardContent";

type PropsType = RouteComponentProps<{ param1: string }> &
  WithStores &
  WithStyles<typeof styles>;

type StateType = {
  trades?: TradehistoryResponse;
  rows: Row[];
};

type Row = {
  swapHash: string;
  trade: string;
  price: string;
  orderId: string;
  executedAt: string;
  role: OrderRole;
  side: OrderSide;
};

const styles = (theme: Theme) => {
  return createStyles({
    tableCell: {
      padding: theme.spacing(2),
    },
    tableCellIcon: {
      marginLeft: theme.spacing(1),
    },
  });
};

@inject(SETTINGS_STORE)
@observer
class Trades extends DashboardContent<PropsType, StateType> {
  tableHeaders: {
    label: string;
    key: keyof Row;
    copyIcon?: boolean;
    grids?: 1 | 2 | 3 | 4;
  }[] = [
    { label: "Swap hash", key: "swapHash", copyIcon: true, grids: 3 },
    { label: "Trade", key: "trade" },
    { label: "Price", key: "price" },
    { label: "Order ID", key: "orderId", copyIcon: true, grids: 3 },
    { label: "Time", key: "executedAt" },
  ];

  constructor(props: PropsType) {
    super(props);
    this.state = { trades: undefined, rows: [] };
    this.refreshableData.push({
      queryFn: api.tradehistory$,
      stateProp: "trades",
      onSuccessCb: (trades: TradehistoryResponse) =>
        this.setState({ rows: this.createRows(trades.trades) }),
    });
  }

  createRows = (trades: Trade[]): Row[] => {
    return (trades || []).map((trade) => {
      const order =
        trade.role === OrderRole.MAKER ? trade.maker_order : trade.taker_order;
      const [baseCurrency, quoteCurrency] = trade.pair_id.split("/");
      return {
        swapHash: trade.r_hash,
        trade: `${trade.side.toLowerCase()} ${
          Number(trade.quantity) / 10 ** 8
        } ${baseCurrency} as ${trade.role.toLowerCase()}`,
        price: `${trade.price} ${quoteCurrency}`,
        orderId: order.id,
        executedAt: new Date(Number(trade.executed_at)).toLocaleString("en-GB"),
        role: trade.role,
        side: trade.side,
      };
    });
  };

  render(): ReactElement {
    const { classes } = this.props;

    return (
      <Grid container component={Paper} direction="column">
        <Grid item container justify="space-between" wrap="nowrap">
          {this.tableHeaders.map((header) => (
            <Grid
              key={header.key}
              item
              container
              xs={header.grids || 2}
              className={classes.tableCell}
              justify="center"
            >
              <Typography component="span" variant="body1">
                {header.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Divider />
        <Grid item container direction="column">
          {!!this.state.trades &&
            this.state.rows.map((row) => (
              <Grid
                item
                container
                justify="space-between"
                wrap="nowrap"
                key={row.swapHash}
              >
                {this.tableHeaders.map((column) => (
                  <Grid
                    item
                    container
                    xs={column.grids || 2}
                    className={classes.tableCell}
                    justify="center"
                    key={`${row.swapHash}_${column.key}`}
                  >
                    {column.copyIcon ? (
                      <Grid
                        container
                        item
                        wrap="nowrap"
                        alignItems="flex-start"
                        justify="center"
                      >
                        <CenterEllipsis text={row[column.key]} />
                        <IconButton
                          size="small"
                          className={classes.tableCellIcon}
                          onClick={() =>
                            (window as any).electron.copyToClipboard(
                              row[column.key]
                            )
                          }
                        >
                          <FileCopyOutlinedIcon fontSize="inherit" />
                        </IconButton>
                      </Grid>
                    ) : (
                      <Typography variant="body2" component="span">
                        {row[column.key]}
                      </Typography>
                    )}
                  </Grid>
                ))}
              </Grid>
            ))}
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Trades));
