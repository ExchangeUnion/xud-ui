import Balance from "./Balance";

export type GetbalanceResponse = {
  orders: { [key: string]: Balance };
};
