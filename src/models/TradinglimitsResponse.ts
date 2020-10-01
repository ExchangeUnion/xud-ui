import { TradingLimits } from "./TradingLimits";

export type TradinglimitsResponse = {
  limits: { [key: string]: TradingLimits };
};
