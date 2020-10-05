export type LndInfo = {
  status: string;
  channels: {
    active: number;
    inactive: number;
    pending: number;
    closed: number;
  };
  chains: { chain: string; network: string }[];
  blockheight: string;
  uris: string[];
  version: string;
  alias: string;
};
