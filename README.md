# XUD UI

A graphical user interface for interacting with a [xud-docker](https://github.com/ExchangeUnion/xud-docker) environment.

## Features

### [v1.0.0](https://github.com/ExchangeUnion/xud-ui/releases/tag/v1.0.0)

- Connect to an existing [xud-docker](https://github.com/ExchangeUnion/xud-docker) environment, local or remote
- Provides read-only views & downloads for
  - services running in [xud-docker](https://github.com/ExchangeUnion/xud-docker)
  - wallets
  - trade history

#### [v1.1.0](https://github.com/ExchangeUnion/xud-ui/milestone/1)

#### [v1.2.0](https://github.com/ExchangeUnion/xud-ui/milestone/2)

#### [v1.3.0](https://github.com/ExchangeUnion/xud-ui/milestone/3)

#### [v1.4.0](https://github.com/ExchangeUnion/xud-ui/milestone/4)

#### [v1.5.0](https://github.com/ExchangeUnion/xud-ui/milestone/5)

#### [v2.0.0](https://github.com/ExchangeUnion/xud-ui/milestone/6)

## Getting started

- Download and run the XUD UI executable. The latest release can be found [here](https://github.com/ExchangeUnion/xud-ui/releases/latest).

- Make sure to have a [xud-docker](https://github.com/ExchangeUnion/xud-docker) environment running with API enabled. You can do that by either entering the environment with `bash xud.sh --proxy.disabled=false` or enabling the API permanently in `mainnet.conf`:

```
[proxy]
disabled = false
expose-ports = ["8889"]
```

- The API is accessible via the following ports
  - mainnet: 8889 (`localhost:8889`) - _default_
  - testnet: 18889 (`localhost:18889`)
  - simnet: 28889 (`localhost:28889`)
- If you are running xud-docker mainnet locally, XUD UI connects automatically to this instance

## Application logs

Logs are written to the following locations

- on Linux: ~/.config/xud-ui/logs/
- on macOS: ~/Library/Logs/xud-ui/
- on Windows: %USERPROFILE%\AppData\Roaming\xud-ui\logs\

## Application data

Application data is stored in the following locations

- on Linux: ~/.config/xud-ui/
- on macOS: ~/Library/Application\ Support/xud-ui/
- on Windows: %USERPROFILE%\AppData\Roaming\xud-ui\

## Development

### Requirements

- Node v12.1.0+
- Yarn

### Install dependencies

`yarn`

### Start in development mode

#### Windows (Powershell)
`($env:HTTPS = "true") -and (yarn start)`

#### Linux, macOS (Bash)
`HTTPS=true yarn start`

### Tests

`yarn test`

### Lint

`yarn lint`

## Building an executable

`yarn build` to build for an OS the command is executed from.
