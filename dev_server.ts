/**
 * Development server for viewer.html.
 * Serves this folder on http://localhost:4507 without caching, and appends what the viewer
 * reports in development mode (errors, warnings and each edit action) to dev.log.
 *
 * Run with: deno run --allow-net --allow-read --allow-write=dev.log dev_server.ts
 */

import { serveDir } from "jsr:@std/http@^1.0.0/file-server";

const PORT = 4507;
const MAX_ENTRY = 20_000; // characters kept from one log post
const root = import.meta.dirname!;
const logPath = `${root}/dev.log`;

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

  if (url.pathname === "/") return Response.redirect(`${url.origin}/viewer.html`, 302);

  const res = await serveDir(req, { fsRoot: root, quiet: true });
  res.headers.set("cache-control", "no-store");
  return res;
});
