# XUD EXPLORER

A graphical user interface for interacting with the [xud](https://github.com/ExchangeUnion/xud) environment

## Getting started

- Download and run the XUD Explorer executable. The releases can be found [here](https://github.com/ExchangeUnion/xud-ui/releases).

- Make sure to have an [xud-docker](https://github.com/ExchangeUnion/xud-docker) environment running with the `--proxy.disabled=false` flag:

```
bash xud.sh --proxy.disabled=false
```

- Currently, the [proxy service](https://github.com/ExchangeUnion/xud-docker-api) only accepts requests from `localhost:3000`. When running xud-docker and XUD Explorer on different machines, use port forwarding.
- The locally running xud-docker mainnet instance is detected automatically.
- The proxy service is accessible via the following ports
  - mainnet: 8889 (`localhost:8889`) - _default_
  - testnet: 18889 (`localhost:18889`)
  - simnet: 28889 (`localhost:28889`)

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
