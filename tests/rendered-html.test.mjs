import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the palace game shell with product metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html[^>]+lang="zh-CN"/i);
  assert.match(html, /<title>天机宫阙 · 第一日<\/title>/i);
  assert.match(
    html,
    /name="viewport"[^>]+width=device-width, initial-scale=1/i,
  );
  assert.match(html, /天机宫阙/);
  assert.match(html, /入宫/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/i);
});

test("ships a usable no-script document structure", async () => {
  const html = await (await render()).text();
  assert.match(html, /<main\b/i);
  assert.match(html, /<button[^>]*>[^<]*入宫/i);
  assert.match(html, /aria-label="承熙御玺"/i);
  assert.doesNotMatch(html, /react-loading-skeleton|sites-skeleton/i);
});

test("applies the saved or system appearance before hydration", async () => {
  const html = await (await render()).text();
  assert.match(html, /tianji-palace-theme/);
  assert.match(html, /prefers-color-scheme: dark/);
  assert.match(html, /dataset\.gameTheme/);
});
