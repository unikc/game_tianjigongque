import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { productionDashboard } from "../build/production-dashboard-plugin";

const root = process.cwd();
const read = (file: string) => readFile(path.join(root, file), "utf8");

describe("production status", () => {
  it("keeps one valid structured source with no duplicate epic ids", async () => {
    const status = JSON.parse(
      await read("docs/production/production-status.json"),
    );
    const ids = status.epics.map((epic: { id: string }) => epic.id);
    expect(status.schemaVersion).toBe(1);
    expect(new Set(ids).size).toBe(ids.length);
    expect(
      status.currentSprint.workItems.filter(
        (item: { status: string }) => item.status === "IN PROGRESS",
      ).length,
    ).toBeLessThanOrEqual(2);
    expect(status.nextRecommendedTask.acceptance).toBeTruthy();
  });

  it("keeps generated markdown synchronized with the structured source", async () => {
    const status = JSON.parse(
      await read("docs/production/production-status.json"),
    );
    const [roadmap, sprint] = await Promise.all([
      read("docs/production/roadmap.md"),
      read("docs/production/current-sprint.md"),
    ]);
    expect(roadmap).toContain("自动生成自");
    expect(sprint).toContain("自动生成自");
    for (const epic of status.epics) {
      expect(roadmap).toContain(epic.id);
      expect(roadmap).toContain(epic.title);
    }
    for (const item of status.currentSprint.workItems) {
      expect(sprint).toContain(item.id);
      expect(sprint).toContain(item.title);
    }
  });

  it("registers the dashboard only for the development server", () => {
    const plugin = productionDashboard();
    expect(plugin.apply).toBe("serve");
    expect(plugin.name).toBe("development-production-dashboard");
  });

  it("does not create a release application route", async () => {
    const files = await read("vite.config.ts");
    expect(files).toContain("productionDashboard()");
    await expect(read("app/production/page.tsx")).rejects.toThrow();
  });
});
