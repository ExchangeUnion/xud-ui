# XUD EXPLORER

A graphical user interface for interacting with a [xud-docker](https://github.com/ExchangeUnion/xud-docker) environment.

## Getting started

- Download and run the XUD Explorer executable. The latest release can be found [here](https://github.com/ExchangeUnion/xud-ui/releases).

- Make sure to have a [xud-docker](https://github.com/ExchangeUnion/xud-docker) environment running with the API enabled, e.g. with `bash xud.sh --proxy.disabled=false` or the proxy permanently enabled in `mainnet.conf`:
```
[proxy]
disabled = false
expose-ports = ["8889"]
```
- The proxy service is accessible via the following ports
  - mainnet: 8889 (`localhost:8889`) - _default_
  - testnet: 18889 (`localhost:18889`)
  - simnet: 28889 (`localhost:28889`)
- If you are running xud-docker mainnet locally, XUD Explorer connects automatically to this instance

## Development

### Requirements

- Node v12.1.0+
- Yarn

### Install dependencies

`yarn`

### Start in development mode

`yarn start`

### Tests

`yarn test`

### Lint

`yarn lint`

## Building an executable

`yarn build` to build for an OS the command is executed from.
