import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { LocalizationProvider } from "../LocalizationProvider";
import { useLocalizedDomain } from "../useLocalizedDomain";

const TranslationProbe = () => {
  const { t } = useLocalizedDomain("example_domain");
  return <p>{t("example.greeting", "Hello")}</p>;
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(cleanup);

describe("LocalizationProvider", () => {
  it("loads translations for any backend domain and uses the matching key", async () => {
    const loadTexts = vi.fn().mockResolvedValue([
      { keyCode: "example.greeting", textValue: "नमस्ते" },
    ]);

    render(
      <LocalizationProvider loadTexts={loadTexts}>
        <TranslationProbe />
      </LocalizationProvider>,
    );

    await waitFor(() => expect(screen.getByText("नमस्ते")).toBeInTheDocument());

    expect(loadTexts).toHaveBeenCalledWith({
      domain: "example_domain",
      locale: "en",
    });
  });

  it("keeps the supplied fallback when the backend has no matching key", async () => {
    render(
      <LocalizationProvider loadTexts={vi.fn().mockResolvedValue([])}>
        <TranslationProbe />
      </LocalizationProvider>,
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Hello")).toBeInTheDocument());
  });
});
