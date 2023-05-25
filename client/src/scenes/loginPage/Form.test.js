import { renderWithProviders } from "../../test-utils";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { screen, cleanup, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { default: Form } = require("./Form");

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

afterEach(() => {
  cleanup();
});

test("on initial render, login button should be disabled", () => {
  renderWithProviders(<Form />);
  expect(screen.getByRole("button", { type: /submit/i })).toBeDisabled();
});

test("if form is filled, login button should be enabled", async () => {
  renderWithProviders(<Form />);

  const emailInput = screen.getByRole("textbox", { name: /email/i });
  await userEvent.type(emailInput, "someemail@test.com");
  const passwordInput = screen.getByLabelText(/password/i);
  await userEvent.type(passwordInput, "1234567890");

  expect(screen.getByRole("button", { type: /submit/i })).toBeEnabled();

  userEvent.clear(emailInput);
  userEvent.clear(passwordInput);
});

test("Success submit", async () => {
  const handleSubmit = jest.fn((values) => {});
  renderWithProviders(
    <Form
      handleSubmit={handleSubmit}
      pageType="login"
      error=""
      setPageType={undefined}
    />
  );

  const emailInput = screen.getByRole("textbox", { name: /email/i });
  await userEvent.type(emailInput, "someemail@test.com");

  const passwordInput = screen.getByLabelText(/password/i);
  await userEvent.type(passwordInput, "1234567890");

  const submitButton = screen.getByRole("button", { type: /submit/i });

  await act(async () => {
    userEvent.click(submitButton);
  });

  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
