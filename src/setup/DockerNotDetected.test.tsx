import { render } from "@testing-library/react";
import React from "react";
import App from "../App";

test("renders 'Waiting for XUD Docker' text when promise is pending", () => {
  window.electron = {
    send: () => {},
    receive: () => {},
    platform: () => "linux",
  };
  const { getByText } = render(<App />);
  const headerTextElement = getByText(/Waiting for XUD Docker/i);
  expect(headerTextElement).toBeInTheDocument();
});
