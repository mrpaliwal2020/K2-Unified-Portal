import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { K2AsyncStateView } from "../Feedback/K2AsyncStateView";
import { K2DateField, K2ReferenceSelect } from "../Forms/K2FormFields";
import { K2PortalPageLayout } from "../Page/K2PortalPageLayout";

afterEach(cleanup);

describe("K2 portal primitives", () => {
  it("emits a date-only value from K2DateField", () => {
    const onValueChange = vi.fn();

    render(
      <K2DateField
        id="harvest-date"
        label="Harvest date"
        onValueChange={onValueChange}
        value=""
      />,
    );

    const input = screen.getByLabelText("Harvest date");
    fireEvent.change(input, { target: { value: "2026-09-19" } });

    expect(input).toHaveAttribute("type", "date");
    expect(onValueChange).toHaveBeenCalledWith("2026-09-19");
  });

  it("renders accessible reference-data options and emits their value", () => {
    const onValueChange = vi.fn();

    render(
      <K2ReferenceSelect
        id="unit"
        label="Unit"
        onValueChange={onValueChange}
        options={[
          { value: "fpo-1", label: "Timarni FPO" },
          { value: "fpo-2", label: "Harda FPO" },
        ]}
        value=""
      />,
    );

    const select = screen.getByLabelText("Unit");
    fireEvent.change(select, { target: { value: "fpo-2" } });

    expect(screen.getByRole("option", { name: "Timarni FPO" })).toBeInTheDocument();
    expect(onValueChange).toHaveBeenCalledWith("fpo-2");
  });

  it("renders a retryable error state", () => {
    const onRetry = vi.fn();

    render(<K2AsyncStateView onRetry={onRetry} state="error" />);

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(screen.getByRole("heading", { name: "We could not load this information" })).toBeInTheDocument();
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("renders a labelled page heading and action", () => {
    render(
      <K2PortalPageLayout actions={<button type="button">Add member</button>} title="Members">
        <p>Member content</p>
      </K2PortalPageLayout>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Members" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add member" })).toBeInTheDocument();
  });

  it("has no automated accessibility violations for standard form fields", async () => {
    const { container } = render(
      <form>
        <K2DateField id="meeting-date" label="Meeting date" value="" />
        <K2ReferenceSelect
          id="meeting-unit"
          label="Unit"
          options={[{ value: "fpo-1", label: "Timarni FPO" }]}
          value=""
        />
      </form>,
    );

    const results = await axe.run(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });

    expect(results.violations).toEqual([]);
  });
});
