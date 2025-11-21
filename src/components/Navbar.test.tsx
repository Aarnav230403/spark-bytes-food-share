import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { describe, test, beforeEach, vi, expect } from "vitest";
import Navbar from "./Navbar"; 

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
}

describe("Navbar", () => {
  test("renders brand link to home", () => {
    renderNavbar();

    const homeLink = screen.getByRole("link", { name: /terriertable/i });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  test("renders Log In button linking to /auth", () => {
    renderNavbar();

    const authLink = screen.getByRole("link", { name: /log in/i });

    expect(authLink).toBeInTheDocument();
    expect(authLink).toHaveAttribute("href", "/auth");
  });
});
