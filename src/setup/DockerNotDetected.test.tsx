import { render } from "@testing-library/react";
import React from "react";
import App from "../App";

test("renders 'Connecting to XUD Docker' text when promise is pending", () => {
  const { getByText } = render(<App />);
  const headerTextElement = getByText(/Connecting to XUD Docker/i);
  expect(headerTextElement).toBeInTheDocument();
});
