import { ConnextInfo } from "./ConnextInfo";
import { LndInfo } from "./LndInfo";

export type Info = {
  version: string;
  node_pub_key: string;
  uris: string[];
  num_peers: number;
  num_pairs: number;
  orders: { peer: number; own: number };
  lnd: { [currency: string]: LndInfo };
  alias: string;
  network: string;
  pending_swap_hashes: string[];
  connext: ConnextInfo;
};
