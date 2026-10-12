/**
 * Development server for viewer.html.
 * Serves this folder on http://localhost:4507 without caching, and appends what the viewer
 * reports in development mode (errors, warnings and each edit action) to dev.log.
 * Also stands in for the future save API: POST /dev/push accepts committed changes from a
 * logged-in user and appends them to dev_pushes.jsonl. Nothing is applied to the data.
 *
 * Run with: deno run --allow-net --allow-read --allow-write=dev.log,dev_pushes.jsonl dev_server.ts
 */

import { serveDir } from "jsr:@std/http@^1.0.0/file-server";

const PORT = 4507;
const MAX_ENTRY = 20_000; // characters kept from one log post
const MAX_PUSH = 20_000_000; // characters accepted in one push
const root = import.meta.dirname!;
const logPath = `${root}/dev.log`;
const pushPath = `${root}/dev_pushes.jsonl`;

Deno.serve({ port: PORT, hostname: "127.0.0.1" }, async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/dev/log") {
    // Only the viewer served from here may write to the log
    if (req.method !== "POST" || req.headers.get("origin") !== url.origin) {
      return new Response(null, { status: 403 });
    }
    const body = (await req.text()).slice(0, MAX_ENTRY).replace(/[\r\n]+/g, " ");
    await Deno.writeTextFile(logPath, body + "\n", { append: true });
    console.log(body);
    return new Response(null, { status: 204 });
  }

  if (url.pathname === "/dev/push") {
    if (req.method !== "POST" || req.headers.get("origin") !== url.origin) {
      return new Response(null, { status: 403 });
    }
    const text = await req.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return Response.json({ error: "body is not JSON" }, { status: 400 });
    }
    // Mock of authentication: any user name except the anonymous default is "logged in"
    if (typeof body.user !== "string" || body.user === "" || body.user === "anon") {
      return Response.json({ error: "login required" }, { status: 401 });
    }
    if (!Array.isArray(body.changes) || text.length > MAX_PUSH) {
      return Response.json({ error: "expected a list of changes" }, { status: 400 });
    }
    await Deno.writeTextFile(pushPath, JSON.stringify(body) + "\n", { append: true });
    console.log(`push from ${body.user}: ${body.changes.length} change(s)`);
    return Response.json({ ok: true, accepted: body.changes.length });
  }

  if (url.pathname === "/") return Response.redirect(`${url.origin}/viewer.html`, 302);

  const res = await serveDir(req, { fsRoot: root, quiet: true });
  res.headers.set("cache-control", "no-store");
  return res;
});
