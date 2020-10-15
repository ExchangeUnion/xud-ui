import { render } from "@testing-library/react";
import React from "react";
import App from "../App";

test("renders 'Waiting for XUD Docker' text when promise is pending", () => {
  const { getByText } = render(<App />);
  const headerTextElement = getByText(/Waiting for XUD Docker/i);
  expect(headerTextElement).toBeInTheDocument();
});
