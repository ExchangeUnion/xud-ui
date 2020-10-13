import {
  Button,
  ClickAwayListener,
  createStyles,
  Fade,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Popper,
  Theme,
  Tooltip,
  Typography,
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import CloseIcon from "@material-ui/icons/Close";
import SortIcon from "@material-ui/icons/Sort";
import React, { ReactElement, useState } from "react";
import { SortingOrder } from "./SortingUtil";

export type TradesSortingOptionsProps<T> = {
  sortOpts: SortOption<T>[];
  orderBy: SortOption<T>;
  sortingOrder: SortingOrder;
  onOptionSelected: (opt: SortOption<T>) => void;
};

export type SortOption<T> = {
  label: string;
  prop: keyof T;
  groupBy?: keyof T;
  sortingOrder?: SortingOrder;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sortIconContainer: {
      paddingRight: theme.spacing(2),
      paddingTop: theme.spacing(2),
    },
    sortOptionsMenu: {
      backgroundColor: theme.palette.background.default,
    },
    sortOption: {
      padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
      textTransform: "none",
      borderRadius: 0,
      color: theme.palette.text.secondary,
    },
    sortOptionActive: {
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.text.primary,
    },
    sortDirIconContainer: {
      width: "15px",
    },
    sortDirIcon: {
      fontSize: theme.typography.body2.fontSize,
    },
  })
);

function TradesSortingOptions<T>(
  props: TradesSortingOptionsProps<T>
): ReactElement {
  const classes = useStyles();
  const { sortOpts, orderBy, sortingOrder, onOptionSelected } = props;
  const [sortOptsOpen, setSortOptsOpen] = useState(false);
  const [sortOptsAnchorEl, setSortOptsAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const handleSortIconClick = (event: React.MouseEvent<HTMLElement>): void => {
    if (sortOptsOpen) {
      closeSortOptions();
      return;
    }
    setSortOptsOpen(true);
    setSortOptsAnchorEl(event.currentTarget as HTMLElement);
  };

  const closeSortOptions = (): void => {
    setSortOptsOpen(false);
    setSortOptsAnchorEl(null);
  };

  const getSortingDirIcon = (opt: SortOption<T>): ReactElement | null => {
    if (opt.sortingOrder || opt !== orderBy) {
      return null;
    }
    return sortingOrder === "desc" ? (
      <ArrowDownwardIcon className={classes.sortDirIcon} />
    ) : (
      <ArrowUpwardIcon className={classes.sortDirIcon} />
    );
  };

  return (
    <Grid
      item
      container
      justify="flex-end"
      className={classes.sortIconContainer}
    >
      <ClickAwayListener onClickAway={closeSortOptions}>
        <div>
          <Tooltip title="Sort trades" placement="left">
            <IconButton onClick={handleSortIconClick}>
              {!sortOptsOpen ? <SortIcon /> : <CloseIcon />}
            </IconButton>
          </Tooltip>
          <Popper
            open={sortOptsOpen}
            anchorEl={sortOptsAnchorEl}
            placement="bottom-end"
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper className={classes.sortOptionsMenu}>
                  <Grid container direction="column">
                    {sortOpts.map((opt) => (
                      <Button
                        fullWidth
                        disableRipple
                        size="small"
                        onClick={() => {
                          onOptionSelected(opt);
                          closeSortOptions();
                        }}
                        className={classes.sortOption}
                        key={opt.label as string}
                      >
                        <Grid
                          item
                          container
                          alignItems="center"
                          spacing={1}
                          wrap="nowrap"
                          className={`${
                            orderBy.label === opt.label
                              ? classes.sortOptionActive
                              : ""
                          }`}
                        >
                          <Grid item>
                            <Typography
                              component="div"
                              className={classes.sortDirIconContainer}
                            >
                              {getSortingDirIcon(opt)}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography component="div" variant="caption">
                              {opt.label}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Button>
                    ))}
                  </Grid>
                </Paper>
              </Fade>
            )}
          </Popper>
        </div>
      </ClickAwayListener>
    </Grid>
  );
}

export default TradesSortingOptions;
