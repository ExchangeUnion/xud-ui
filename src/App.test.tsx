import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders 'XUD Docker not detected' text", () => {
  const { getByText } = render(<App />);
  const headerTextElement = getByText(/XUD Docker not detected/i);
  expect(headerTextElement).toBeInTheDocument();
});
