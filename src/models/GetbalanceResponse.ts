import Balance from "./Balance";

export type GetbalanceResponse = {
  balances: { [key: string]: Balance };
};
