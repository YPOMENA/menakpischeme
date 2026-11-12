// Turns the `vite build --mode artifact` output into one HTML page for a claude.ai
// artifact: the publish step adds <!doctype>/<head>/<body>, so this writes only
// the title, styles, root element and the inlined app script.
import fs from "fs";
import path from "path";

const dir = "dist-artifact";
const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g)].map(m => m[1]);
const styles = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)].map(m => m[1]);
if (scripts.length !== 1) throw new Error(`expected one bundled script, found ${scripts.length}`);

const read = (url) => fs.readFileSync(path.join(dir, url.replace(/^\//, "")), "utf8");
// Keep the inlined code from closing its own <script> element early.
const js = read(scripts[0]).replace(/<\/script/gi, "<\\/script");
const css = styles.map(read).join("\n");

const page = `<title>MENA FY26-27 KPI Scorecard</title>
<style>
body { background: #f4f6fb; }
${css}
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`;
fs.writeFileSync(path.join(dir, "scorecard.html"), page);
console.log(`wrote ${path.join(dir, "scorecard.html")} (${Math.round(page.length / 1024)} KB)`);
