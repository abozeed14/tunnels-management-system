import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaginationControls } from "./pagination-controls";

describe("PaginationControls", () => {
  it("renders correctly", () => {
    render(
      <PaginationControls
        currentPage={1}
        totalPages={5}
        pageSize={10}
        totalCount={50}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    );
    expect(screen.getByText("Page 1 of 5")).toBeDefined();
    // Check for presence of total count
    expect(screen.getByText("50")).toBeDefined();
    // Check for presence of "Total" text (might be part of a larger string)
    expect(screen.getByText(/Total/)).toBeDefined();
  });

  it("disables previous button on first page", () => {
    render(
      <PaginationControls
        currentPage={1}
        totalPages={5}
        pageSize={10}
        totalCount={50}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    );
    expect(screen.getByLabelText("Previous page").hasAttribute("disabled")).toBe(true);
    expect(screen.getByLabelText("First page").hasAttribute("disabled")).toBe(true);
  });

  it("disables next button on last page", () => {
    render(
      <PaginationControls
        currentPage={5}
        totalPages={5}
        pageSize={10}
        totalCount={50}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    );
    expect(screen.getByLabelText("Next page").hasAttribute("disabled")).toBe(true);
    expect(screen.getByLabelText("Last page").hasAttribute("disabled")).toBe(true);
  });

  it("calls onPageChange when buttons clicked", () => {
    const onPageChange = vi.fn();
    render(
      <PaginationControls
        currentPage={2}
        totalPages={5}
        pageSize={10}
        totalCount={50}
        onPageChange={onPageChange}
        onPageSizeChange={() => {}}
      />
    );
    
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
