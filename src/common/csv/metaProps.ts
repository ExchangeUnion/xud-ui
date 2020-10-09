/* eslint-disable */

/**
 * source: https://github.com/react-csv/react-csv
 */

import { string, array, oneOfType, bool, func } from "prop-types";

export const propTypes = {
  data: oneOfType([string, array]).isRequired,
  headers: array,
  target: string,
  separator: string,
  filename: string,
  uFEFF: bool,
  onClick: func,
  asyncOnClick: bool,
};

export const defaultProps = {
  separator: ",",
  filename: "generatedBy_react-csv.csv",
  uFEFF: true,
  asyncOnClick: false,
};

export const PropsNotForwarded = ["data", "headers"];
