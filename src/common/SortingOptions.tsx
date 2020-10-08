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
import CloseIcon from "@material-ui/icons/Close";
import SortIcon from "@material-ui/icons/Sort";
import React, { ReactElement, useState } from "react";
import { SortingOrder } from "./SortingUtil";

export type TradesSortingOptionsProps<T> = {
  sortOpts: SortOption<T>[];
  orderBy: SortOption<T>;
  onOptionSelected: (opt: SortOption<T>) => void;
};

export type SortOption<T> = {
  label: string;
  prop: keyof T;
  sortingOrder: SortingOrder;
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
  })
);

function TradesSortingOptions<T>(
  props: TradesSortingOptionsProps<T>
): ReactElement {
  const classes = useStyles();
  const { sortOpts, orderBy, onOptionSelected } = props;
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
                        <Typography
                          component="div"
                          variant="caption"
                          className={`${
                            orderBy.label === opt.label
                              ? classes.sortOptionActive
                              : ""
                          }`}
                        >
                          {opt.label}
                        </Typography>
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
