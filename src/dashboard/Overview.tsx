import React, { Component, ReactElement } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { PartialObserver, Subscription, timer } from "rxjs";
import { mergeMap } from "rxjs/operators";
import api from "../api";
import { Path } from "../router/Path";

type PropsType = RouteComponentProps<{ param1: string }>;

class Overview extends Component<PropsType> {
  private subscriptions: Subscription[] = [];

  constructor(props: PropsType) {
    super(props);
    this.state = { info: null };
  }

  componentDidMount() {
    this.subscriptions.push(
      timer(0, 5000)
        .pipe(mergeMap(api.getinfo$))
        .subscribe(this.handleGetinfo())
    );
  }

  componentWillUnmount() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handleGetinfo(): PartialObserver<any> {
    return {
      next: (data) => this.setState({ info: data }),
      error: () =>
        this.props.history.push({
          pathname: Path.HOME,
        }),
    };
  }

  render(): ReactElement {
    return (
      <p>
        {(this.state as any).info && JSON.stringify((this.state as any).info)}
      </p>
    );
  }
}

export default withRouter(Overview);
