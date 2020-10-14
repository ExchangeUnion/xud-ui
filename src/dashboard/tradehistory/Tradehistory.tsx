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
import PageCircularProgress from "../../common/PageCircularProgress";
import SortingOptions, {
  SortOption,
} from "../../common/sorting/SortingOptions";
import {
  getComparator,
  SortingOrder,
  stableSort,
} from "../../common/sorting/SortingUtil";
import { OrderRole } from "../../enums/OrderRole";
import { Trade } from "../../models/Trade";
import { TradehistoryResponse } from "../../models/TradehistoryResponse";
import { SETTINGS_STORE } from "../../stores/settingsStore";
import { WithStores } from "../../stores/WithStores";
import DashboardContent, { DashboardContentState } from "../DashboardContent";
import ViewDisabled from "../ViewDisabled";
import TradehistoryDownload from "./TradehistoryDownload";

export type TradeRow = {
  swapHash: string;
  price: number;
  priceStr: string;
  orderId: string;
  executedAt: string;
  role: string;
  side: string;
  amount: number;
  amountStr: string;
  baseAsset: string;
  quoteAsset: string;
};

export type TradeHeader = {
  label: string;
  key: keyof TradeRow;
  copyIcon?: boolean;
  gridsXs?: 1 | 2 | 3 | 4;
  gridsXl?: 1 | 2 | 3 | 4;
};

type PropsType = RouteComponentProps<{ param1: string }> &
  WithStores &
  WithStyles<typeof styles>;

type StateType = DashboardContentState & {
  trades?: TradehistoryResponse;
  rows: TradeRow[];
  orderBy: SortOption<TradeRow>;
  sortingOrder: SortingOrder;
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
class Tradehistory extends DashboardContent<PropsType, StateType> {
  tableHeaders: TradeHeader[] = [
    { label: "Swap hash", key: "swapHash", copyIcon: true, gridsXl: 3 },
    { label: "Side", key: "side", gridsXs: 1 },
    { label: "Amount", key: "amountStr" },
    { label: "Role", key: "role", gridsXs: 1 },
    { label: "Price", key: "priceStr" },
    { label: "Order ID", key: "orderId", copyIcon: true },
    { label: "Time", key: "executedAt", gridsXl: 1 },
  ];
  csvHeaders: TradeHeader[] = [
    { label: "Swap hash", key: "swapHash" },
    { label: "Side", key: "side" },
    { label: "Amount", key: "amount" },
    { label: "Base asset", key: "baseAsset" },
    { label: "Price", key: "price" },
    { label: "Quote asset", key: "quoteAsset" },
    { label: "Role", key: "role" },
    { label: "Order ID", key: "orderId" },
    { label: "Time", key: "executedAt" },
  ];

  sortOpts: SortOption<TradeRow>[] = [
    { label: "Time", prop: "executedAt" },
    { label: "Amount", prop: "amount", groupBy: "baseAsset" },
    { label: "Price", prop: "price", groupBy: "quoteAsset" },
    { label: "Buy", prop: "side", sortingOrder: "asc" },
    { label: "Sell", prop: "side", sortingOrder: "desc" },
    { label: "Maker", prop: "role", sortingOrder: "asc" },
    { label: "Taker", prop: "role", sortingOrder: "desc" },
  ];

  constructor(props: PropsType) {
    super(props);
    this.state = {
      rows: [],
      orderBy: this.sortOpts[0],
      sortingOrder: this.sortOpts[0].sortingOrder || "desc",
    };
    this.refreshableData.push({
      queryFn: api.tradehistory$,
      stateProp: "trades",
      onSuccessCb: (trades: TradehistoryResponse) =>
        this.setState({ rows: this.createRows(trades.trades) }),
    });
  }

  createRows = (trades: Trade[]): TradeRow[] => {
    return (trades || []).map((trade) => {
      const order =
        trade.role === OrderRole.MAKER ? trade.maker_order : trade.taker_order;
      const [baseCurrency, quoteCurrency] = trade.pair_id.split("/");
      const amount = Number(trade.quantity) / 10 ** 8;
      return {
        swapHash: trade.r_hash,
        amountStr: `${amount.toFixed(8)} ${baseCurrency}`,
        priceStr: `${trade.price.toFixed(8)} ${quoteCurrency}`,
        orderId: order.id,
        executedAt: new Date(Number(trade.executed_at)).toLocaleString("en-GB"),
        role: trade.role.toLowerCase(),
        side: trade.side.toLowerCase(),
        amount: amount,
        price: trade.price,
        baseAsset: baseCurrency,
        quoteAsset: quoteCurrency,
      };
    });
  };

  onSortOptionSelect = (opt: SortOption<TradeRow>): void => {
    this.setState({
      orderBy: opt,
      sortingOrder:
        opt.sortingOrder ||
        (this.state.orderBy !== opt || this.state.sortingOrder === "asc"
          ? "desc"
          : "asc"),
    });
  };

  render(): ReactElement {
    const { classes } = this.props;

    return (
      <Grid container direction="column">
        {this.state.xudLocked || this.state.xudNotReady ? (
          <ViewDisabled
            xudLocked={this.state.xudLocked}
            xudStatus={this.state.xudStatus}
          />
        ) : this.state.rows?.length ? (
          <>
            <Grid container component={Paper} direction="column">
              <SortingOptions
                sortOpts={this.sortOpts}
                orderBy={this.state.orderBy}
                sortingOrder={this.state.sortingOrder}
                onOptionSelected={this.onSortOptionSelect}
              ></SortingOptions>
              <Grid item container justify="space-between" wrap="nowrap">
                {this.tableHeaders.map((header) => (
                  <Grid
                    key={header.key}
                    item
                    container
                    xs={header.gridsXs || 2}
                    xl={header.gridsXl || header.gridsXs || 2}
                    className={classes.tableCell}
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
                  stableSort(
                    this.state.rows,
                    getComparator(
                      this.state.orderBy.sortingOrder ||
                        this.state.sortingOrder,
                      this.state.orderBy.prop,
                      this.state.orderBy.groupBy
                    )
                  ).map((row) => (
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
                          xs={column.gridsXs || 2}
                          xl={column.gridsXl || column.gridsXs || 2}
                          className={classes.tableCell}
                          key={`${row.swapHash}_${column.key}`}
                        >
                          {column.copyIcon && row[column.key] ? (
                            <Grid
                              container
                              item
                              wrap="nowrap"
                              alignItems="flex-start"
                            >
                              <CenterEllipsis text={row[column.key] + ""} />
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
            <TradehistoryDownload
              headers={this.csvHeaders}
              rows={this.state.rows}
            />
          </>
        ) : this.state.initialLoadCompleted ? (
          <Grid item container justify="center">
            No trades to display
          </Grid>
        ) : (
          <PageCircularProgress />
        )}
      </Grid>
    );
  }
}

export default withRouter(
  withStyles(styles, { withTheme: true })(Tradehistory)
);
