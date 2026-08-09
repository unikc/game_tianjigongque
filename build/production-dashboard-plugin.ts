import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

type StatusItem = { status: string };
type ProductionStatus = {
  schemaVersion: number;
  updatedAt: string;
  project: string;
  releaseTarget: string;
  milestones: Array<{
    id: string;
    title: string;
    status: string;
    progress: number;
  }>;
  epics: Array<{
    id: string;
    title: string;
    priority: string;
    status: string;
    complexity: string;
    dependencies: string[];
    owner: string;
  }>;
  currentSprint: {
    period: string;
    goal: string;
    workItems: Array<{
      id: string;
      title: string;
      status: string;
      owner: string;
      exitCondition: string;
    }>;
  };
  issues: Array<{
    id: string;
    priority: string;
    status: string;
    title: string;
    owner: string;
    blocks: string[];
  }>;
  blockedItems: Array<{ id: string; title: string; reason: string }>;
  reviews: Record<
    string,
    { status: string; reviewer: string; detail: string; updatedAt: string }
  >;
  qa: {
    status: string;
    summary: string;
    checks: Array<{ name: string; status: string; detail?: string }>;
  };
  latestCompleted: Array<{
    id: string;
    title: string;
    date: string;
    summary: string;
  }>;
  nextRecommendedTask: {
    id: string;
    title: string;
    why: string;
    firstStep: string;
    acceptance: string;
  };
};

const root = process.cwd();
const statusPath = path.join(root, "docs/production/production-status.json");
const escape = (value: unknown) =>
  String(value).replace(
    /[&<>\"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ] ?? character,
  );
const labels: Record<string, string> = {
  DONE: "已完成",
  PASS: "已通过",
  READY: "可开始",
  "IN PROGRESS": "进行中",
  "IN REVIEW": "复审中",
  PLANNED: "待办",
  OPEN: "未解决",
  RESOLVED: "已解决",
  BLOCKED: "受阻",
  PENDING: "待验证",
};
const seal = (status: string) =>
  `<span class="seal seal-${escape(status.toLowerCase().replaceAll(" ", "-"))}">${escape(labels[status] ?? status)}</span>`;
const overallProgress = (items: ProductionStatus["milestones"]) =>
  Math.round(
    items.reduce((sum, item) => sum + item.progress, 0) /
      Math.max(items.length, 1),
  );
const count = (items: StatusItem[], value: string) =>
  items.filter((item) => item.status === value).length;

function renderDashboard(status: ProductionStatus) {
  const activeIssues = status.issues.filter(
    (issue) => issue.status !== "RESOLVED",
  );
  const urgent = activeIssues.filter((issue) => issue.priority === "P0");
  const important = activeIssues.filter((issue) => issue.priority === "P1");
  const sprintDone = count(status.currentSprint.workItems, "DONE");
  const progress = overallProgress(status.milestones);
  const reviewNames: Record<string, string> = {
    narrative: "Narrative Director",
    art: "Art Director",
    gameplay: "Gameplay Review",
  };
  return `<!doctype html><html lang="zh-Hans"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escape(status.project)} · 制作案牍</title><style>
  :root{--paper:#f4eddc;--paper-2:#ebe1c9;--ink:#25231e;--muted:#686256;--jade:#174e49;--red:#8f2f28;--gold:#aa8648;--line:#c9b381;--ok:#285e4c;--warn:#775b1b}*{box-sizing:border-box}html{background:#18352f}body{margin:0;color:var(--ink);font:15px/1.55 ui-sans-serif,-apple-system,BlinkMacSystemFont,"PingFang SC","Noto Sans CJK SC",sans-serif;background:radial-gradient(circle at 20% 10%,rgba(255,255,255,.12),transparent 32%),#18352f}a{color:var(--jade);min-height:44px;display:inline-flex;align-items:center}.folio{width:min(1120px,100%);min-height:100vh;margin:auto;padding:34px clamp(18px,4vw,54px) 56px;background:linear-gradient(90deg,rgba(119,91,27,.06),transparent 12%,transparent 88%,rgba(119,91,27,.06)),var(--paper);border-inline:1px solid var(--gold)}header{border-bottom:3px double var(--gold);padding-bottom:18px}.eyebrow,.section-no{letter-spacing:.16em;color:var(--red);font-weight:700;font-size:12px;text-transform:uppercase}.title-row{display:flex;justify-content:space-between;gap:20px;align-items:end}h1{font-family:"Songti SC","Noto Serif CJK SC",serif;font-size:clamp(30px,5vw,48px);font-weight:500;margin:7px 0}.dev-mark{border:1px solid var(--jade);color:var(--jade);padding:5px 10px;font-size:12px;font-weight:700}.meta{display:flex;flex-wrap:wrap;gap:8px 18px;color:var(--muted);font-size:12px}.summary{display:grid;grid-template-columns:minmax(180px,.8fr) 2fr;gap:26px;padding:22px 0}.overall strong{display:block;font:44px/1 "Songti SC",serif;color:var(--jade)}.track{height:8px;background:#d8ccb0;margin-top:10px;position:relative}.track>i{display:block;height:100%;background:var(--jade)}.milestones{display:grid;gap:8px}.milestone{display:grid;grid-template-columns:44px 1fr 50px;gap:10px;align-items:center}.milestone .track{margin:0;height:5px}.milestone b{font-size:12px}.docket{padding:23px 0;border-top:1px solid var(--line)}.section-head{display:flex;justify-content:space-between;align-items:baseline;gap:14px;margin-bottom:14px}.section-head h2{font:500 24px/1.2 "Songti SC",serif;margin:0}.seal{display:inline-block;padding:2px 8px;border:1px solid currentColor;font-size:12px;font-weight:700;white-space:nowrap}.seal-done,.seal-pass,.seal-resolved{color:var(--ok)}.seal-ready,.seal-in-progress,.seal-in-review,.seal-pending{color:var(--warn)}.seal-planned{color:var(--muted)}.seal-open,.seal-blocked{color:var(--red);border-style:double}.alerts{border-left:4px double var(--red);padding-left:15px}.alert-list,.ledger,.timeline{display:grid;gap:1px;background:var(--line);border:1px solid var(--line)}.alert,.ledger-row,.timeline-row{background:var(--paper);padding:12px 14px}.alert{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:start}.alert p,.next p{margin:4px 0;color:var(--muted)}.sprint-grid{display:grid;grid-template-columns:1.5fr 1fr;gap:20px}.sprint{background:rgba(255,255,255,.2);border:1px solid var(--line);padding:18px}.work{display:grid;grid-template-columns:60px 1fr auto;gap:10px;padding:12px 0;border-top:1px solid var(--line)}.work:first-of-type{margin-top:14px}.work small{grid-column:2/-1;color:var(--muted)}.next{border:2px solid var(--jade);padding:18px;box-shadow:inset 0 0 0 3px var(--paper),inset 0 0 0 4px var(--jade)}.next h3{font:500 23px "Songti SC",serif;margin:5px 0}.next dt{color:var(--red);font-size:12px;font-weight:700;margin-top:10px}.next dd{margin:2px 0}.epics{width:100%;border-collapse:collapse}.epics caption{text-align:left;color:var(--muted);padding-bottom:8px}.epics th,.epics td{text-align:left;padding:10px 8px;border-bottom:1px solid var(--line);vertical-align:top}.epics th{font-size:12px;color:var(--muted)}.reviews .ledger-row{display:grid;grid-template-columns:160px 100px 120px 1fr;gap:12px;align-items:start}.qa-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.check-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.check{border-bottom:1px solid var(--line);padding:7px 0;display:flex;justify-content:space-between;gap:8px}.timeline-row{display:grid;grid-template-columns:110px 1fr;gap:12px}.sources{border-top:3px double var(--gold);padding-top:17px;color:var(--muted);font-size:13px;display:flex;flex-wrap:wrap;gap:8px 20px}
  @media(max-width:600px){.folio{padding:22px 16px 42px}.title-row{display:block}.dev-mark{display:inline-block}.summary,.sprint-grid,.qa-grid{grid-template-columns:1fr}.summary{gap:18px}.milestone{grid-template-columns:38px 1fr 44px}.alert{grid-template-columns:auto 1fr}.alert .seal{grid-column:2}.epics thead{position:absolute;clip:rect(0 0 0 0)}.epics,.epics tbody,.epics tr,.epics td{display:block}.epics tr{border-top:1px solid var(--line);padding:10px 0}.epics td{border:0;padding:3px 0}.epics td::before{content:attr(data-label);display:inline-block;width:92px;color:var(--muted);font-size:12px}.reviews .ledger-row{grid-template-columns:1fr auto}.reviews .ledger-row>:nth-child(n+3){grid-column:1/-1}.timeline-row{grid-template-columns:1fr}.check-list{grid-template-columns:1fr}h1{margin-bottom:10px}}
  @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
  </style></head><body><main class="folio"><header><div class="eyebrow">制作案牍 · Production ledger</div><div class="title-row"><h1>${escape(status.project)} 制作总册</h1><span class="dev-mark">只读 · 仅开发环境</span></div><div class="meta"><span>数据更新 ${escape(status.updatedAt)}</span><span>Schema v${status.schemaVersion}</span><span>Release target · ${escape(status.releaseTarget)}</span><span>Workspace · local development</span></div></header>
  <section class="summary" aria-labelledby="overall"><div class="overall"><span class="section-no">总览</span><strong>${progress}%</strong><span id="overall">整体里程碑进度</span><div class="track" role="progressbar" aria-label="整体进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><i style="width:${progress}%"></i></div></div><div class="milestones">${status.milestones.map((m) => `<div class="milestone"><b>${escape(m.id)}</b><div><span>${escape(m.title)}</span><div class="track" role="progressbar" aria-label="${escape(m.title)}进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${m.progress}"><i style="width:${m.progress}%"></i></div></div><span>${m.progress}%</span></div>`).join("")}</div></section>
  <section class="docket alerts" aria-labelledby="alerts"><div class="section-head"><div><span class="section-no">01 · 朱批</span><h2 id="alerts">P0、P1 与受阻事项</h2></div><span class="seal seal-open">${urgent.length} 项 P0 · ${status.blockedItems.length} 项受阻 · ${important.length} 项 P1</span></div><div class="alert-list">${urgent.length ? urgent.map((i) => `<article class="alert"><b>${escape(i.id)}</b><div><strong>${escape(i.title)}</strong><p>负责人：${escape(i.owner)}${i.blocks.length ? ` · 阻塞 ${escape(i.blocks.join("、"))}` : ""}</p></div>${seal(i.status)}</article>`).join("") : `<div class="alert"><strong>暂无未解决 P0</strong></div>`}${status.blockedItems.map((i) => `<article class="alert"><b>${escape(i.id)}</b><div><strong>${escape(i.title)}</strong><p>${escape(i.reason)}</p></div>${seal("BLOCKED")}</article>`).join("")}${important.map((i) => `<article class="alert"><b>${escape(i.id)}</b><div><strong>P1 重要 · ${escape(i.title)}</strong><p>负责人：${escape(i.owner)}${i.blocks.length ? ` · 影响 ${escape(i.blocks.join("、"))}` : ""}</p></div>${seal(i.status)}</article>`).join("")}</div></section>
  <section class="docket" aria-labelledby="sprint"><div class="section-head"><div><span class="section-no">02 · 当值</span><h2 id="sprint">当前 Sprint</h2></div><span>${escape(status.currentSprint.period)} · 完成 ${sprintDone}/${status.currentSprint.workItems.length}</span></div><div class="sprint-grid"><div class="sprint"><strong>${escape(status.currentSprint.goal)}</strong>${status.currentSprint.workItems.map((i) => `<div class="work"><b>${escape(i.id)}</b><span><strong>${escape(i.title)}</strong> · ${escape(i.owner)}</span>${seal(i.status)}<small>验收：${escape(i.exitCondition)}</small></div>`).join("")}</div><aside class="next"><span class="section-no">唯一下一任务</span><h3>${escape(status.nextRecommendedTask.id)} · ${escape(status.nextRecommendedTask.title)}</h3><p>${escape(status.nextRecommendedTask.why)}</p><dl><dt>第一步</dt><dd>${escape(status.nextRecommendedTask.firstStep)}</dd><dt>验收</dt><dd>${escape(status.nextRecommendedTask.acceptance)}</dd></dl></aside></div></section>
  <section class="docket" aria-labelledby="epics"><div class="section-head"><div><span class="section-no">03 · 总目</span><h2 id="epics">Epic 状态</h2></div><span>${status.epics.length} 项</span></div><table class="epics"><caption>所有状态直接来自 production-status.json</caption><thead><tr><th scope="col">ID</th><th scope="col">Epic</th><th scope="col">优先级</th><th scope="col">状态</th><th scope="col">负责人</th><th scope="col">前置</th></tr></thead><tbody>${status.epics.map((e) => `<tr><td data-label="ID">${escape(e.id)}</td><td data-label="Epic"><strong>${escape(e.title)}</strong></td><td data-label="优先级">${escape(e.priority)} · ${escape(e.complexity)}</td><td data-label="状态">${seal(e.status)}</td><td data-label="负责人">${escape(e.owner)}</td><td data-label="前置">${escape(e.dependencies.join("、"))}</td></tr>`).join("")}</tbody></table></section>
  <section class="docket" aria-labelledby="completed"><div class="section-head"><div><span class="section-no">04 · 验讫</span><h2 id="completed">最近完成</h2></div></div><div class="timeline">${status.latestCompleted.map((i) => `<article class="timeline-row"><b>${escape(i.date)}<br>${escape(i.id)}</b><div><strong>${escape(i.title)}</strong><br><span>${escape(i.summary)}</span></div></article>`).join("")}</div></section>
  <section class="docket reviews" aria-labelledby="reviews"><div class="section-head"><div><span class="section-no">05 · 复审</span><h2 id="reviews">Director 与 Gameplay 复审</h2></div></div><div class="ledger">${Object.entries(
    status.reviews,
  )
    .map(
      ([key, r]) =>
        `<article class="ledger-row"><strong>${escape(reviewNames[key] ?? key)}</strong>${seal(r.status)}<span>${escape(r.updatedAt)}</span><span>${escape(r.detail)} · ${escape(r.reviewer)}</span></article>`,
    )
    .join("")}</div></section>
  <section class="docket" aria-labelledby="qa"><div class="section-head"><div><span class="section-no">06 · 校验</span><h2 id="qa">QA 状态</h2></div>${seal(status.qa.status)}</div><div class="qa-grid"><p>${escape(status.qa.summary)}</p><div class="check-list">${status.qa.checks.map((c) => `<div class="check"><span>${escape(c.name)}${c.detail ? ` · ${escape(c.detail)}` : ""}</span>${seal(c.status)}</div>`).join("")}</div></div></section>
  <footer class="sources"><strong>唯一事实源</strong><a href="/production/status.json">production-status.json</a><a href="/production/roadmap.md">generated roadmap</a><a href="/production/current-sprint.md">generated current sprint</a><span>此页面没有写入、编辑或状态变更入口。</span></footer></main></body></html>`;
}

export function productionDashboard(): Plugin {
  return {
    name: "development-production-dashboard",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url ?? "/", "http://localhost")
          .pathname;
        const dashboardPaths = new Set([
          "/production",
          "/production/",
          "/production/status.json",
          "/production/roadmap.md",
          "/production/current-sprint.md",
        ]);
        if (!dashboardPaths.has(pathname)) return next();
        try {
          response.statusCode = 200;
          response.setHeader("Cache-Control", "no-store");
          if (pathname.endsWith(".md")) {
            response.setHeader("Content-Type", "text/markdown; charset=utf-8");
            response.end(
              await readFile(
                path.join(root, "docs/production", path.basename(pathname)),
                "utf8",
              ),
            );
            return;
          }
          const raw = await readFile(statusPath, "utf8");
          if (pathname.endsWith("status.json")) {
            response.setHeader(
              "Content-Type",
              "application/json; charset=utf-8",
            );
            response.end(raw);
          } else {
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            response.end(renderDashboard(JSON.parse(raw) as ProductionStatus));
          }
        } catch (error) {
          next(error as Error);
        }
      });
    },
  };
}
