import {
  Button,
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
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import api from "../../api";
import CenterEllipsis from "../../common/CenterEllipsis";
import CSVLink from "../../common/csv/CsvLink";
import { formatDateTimeForFilename } from "../../common/dateUtil";
import TradesSortingOptions, {
  SortOption,
} from "../../common/sorting/SortingOptions";
import { getComparator, stableSort } from "../../common/sorting/SortingUtil";
import { OrderRole } from "../../enums/OrderRole";
import { OrderSide } from "../../enums/OrderSide";
import { Trade } from "../../models/Trade";
import { TradehistoryResponse } from "../../models/TradehistoryResponse";
import { SETTINGS_STORE } from "../../stores/settingsStore";
import { WithStores } from "../../stores/WithStores";
import DashboardContent, { DashboardContentState } from "../DashboardContent";
import ViewDisabled from "../ViewDisabled";

type PropsType = RouteComponentProps<{ param1: string }> &
  WithStores &
  WithStyles<typeof styles>;

type StateType = DashboardContentState & {
  trades?: TradehistoryResponse;
  rows: Row[];
  orderBy: SortOption<Row>;
};

type Row = {
  swapHash: string;
  trade: string;
  price: string;
  orderId: string;
  executedAt: string;
  role: OrderRole;
  side: OrderSide;
  amount: number;
};

const styles = (theme: Theme) => {
  return createStyles({
    tableCell: {
      padding: theme.spacing(2),
    },
    tableCellIcon: {
      marginLeft: theme.spacing(1),
    },
    downloadButtonContainer: {
      paddingTop: theme.spacing(3),
    },
    downloadLink: {
      textDecoration: "none",
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

  sortOpts: SortOption<Row>[] = [
    { label: "Time", prop: "executedAt", sortingOrder: "desc" },
    { label: "Amount", prop: "amount", sortingOrder: "desc" },
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
    };
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
      const amount = Number(trade.quantity) / 10 ** 8;
      return {
        swapHash: trade.r_hash,
        trade: `${trade.side.toLowerCase()} ${amount} ${baseCurrency} as ${trade.role.toLowerCase()}`,
        price: `${trade.price} ${quoteCurrency}`,
        orderId: order.id,
        executedAt: new Date(Number(trade.executed_at)).toLocaleString("en-GB"),
        role: trade.role,
        side: trade.side,
        amount: amount,
      };
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
        ) : (
          !!this.state.rows?.length && (
            <>
              <Grid container component={Paper} direction="column">
                <TradesSortingOptions
                  sortOpts={this.sortOpts}
                  orderBy={this.state.orderBy}
                  onOptionSelected={(opt) => this.setState({ orderBy: opt })}
                ></TradesSortingOptions>
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
                    stableSort(
                      this.state.rows,
                      getComparator(
                        this.state.orderBy.sortingOrder,
                        this.state.orderBy.prop
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
              <Grid
                item
                container
                justify="flex-end"
                className={classes.downloadButtonContainer}
              >
                <CSVLink
                  data={this.state.rows}
                  headers={this.tableHeaders}
                  filename={`trades_${formatDateTimeForFilename(
                    new Date()
                  )}.csv`}
                  className={classes.downloadLink}
                >
                  <Button
                    variant="contained"
                    startIcon={<GetAppOutlinedIcon />}
                  >
                    Download (.csv)
                  </Button>
                </CSVLink>
              </Grid>
            </>
          )
        )}
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Trades));
