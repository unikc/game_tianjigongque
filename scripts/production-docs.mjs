import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const statusPath = path.join(root, "docs/production/production-status.json");

export async function readProductionStatus() {
  return JSON.parse(await readFile(statusPath, "utf8"));
}

const statusLabel = (status) => `\`${status}\``;

export function renderRoadmap(status) {
  const epicRows = status.epics
    .map(
      (epic) =>
        `| ${epic.id} | ${epic.title} | ${epic.priority} | ${statusLabel(epic.status)} | ${epic.complexity} | ${epic.dependencies.join("、") || "—"} | ${epic.owner} |`,
    )
    .join("\n");
  const completedFoundations = status.epics
    .filter((epic) => epic.status === "DONE")
    .map((epic) => `- **${epic.id} — ${epic.title}。** 已完成并通过质量门槛。`)
    .join("\n");
  const next = status.nextRecommendedTask;
  return `# 《${status.project}》制作路线图

> 自动生成自 \`docs/production/production-status.json\`。请勿直接编辑本文件。

更新日期：${status.updatedAt}
目标：${status.releaseTarget}

## 制作原则

- 同时最多两项重大功能处于 \`IN PROGRESS\`。
- 当前十二章主线稳定性优先于新增篇幅。
- 新角色共用统一的叙事记忆、秘密归属、信息可信度与确定性种子系统。
- \`DONE\` 必须满足 \`AGENTS/ImperialProducer.md\` 的全部质量门槛。

## Epic dashboard

| ID | Epic | Priority | Status | Complexity | Dependencies | Current owner |
| --- | ---- | -------- | ------ | ---------- | ------------ | ------------- |
${epicRows}

## Development order

${status.developmentOrder.map((item, index) => `${index + 1}. ${item}`).join("\n")}

## Completed foundations

${completedFoundations || "- 尚无已完成基础。"}

## Next recommended task

**${next.id} — ${next.title}**

- 原因：${next.why}
- 第一步：${next.firstStep}
- 验收：${next.acceptance}
`;
}

export function renderCurrentSprint(status) {
  const sprint = status.currentSprint;
  const workRows = sprint.workItems
    .map(
      (item) =>
        `| ${item.id} | ${item.title} | ${statusLabel(item.status)} | ${item.owner} | ${item.exitCondition} |`,
    )
    .join("\n");
  const active = sprint.workItems.filter(
    (item) => item.status === "IN PROGRESS",
  ).length;
  return `# Current sprint

> 自动生成自 \`docs/production/production-status.json\`。请勿直接编辑本文件。

更新日期：${status.updatedAt}

## Sprint goal

${sprint.goal}

## WIP

| ID | Item | Status | Owner | Exit condition |
| -- | ---- | ------ | ----- | -------------- |
${workRows}

WIP count: ${active} major feature${active === 1 ? "" : "s"} \`IN PROGRESS\`.

## Not this sprint

${sprint.notThisSprint.map((item) => `- ${item}`).join("\n")}

## Review gates

${sprint.gates.map((item) => `- ${item}`).join("\n")}
`;
}

export async function generateProductionDocs() {
  const status = await readProductionStatus();
  await Promise.all([
    writeFile(
      path.join(root, "docs/production/roadmap.md"),
      renderRoadmap(status),
    ),
    writeFile(
      path.join(root, "docs/production/current-sprint.md"),
      renderCurrentSprint(status),
    ),
  ]);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await generateProductionDocs();
}
