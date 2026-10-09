// 1280-wide MOCK of Firefox chrome (tab strip, toolbar, URL bar, sidebar, menu) in theme/manifest.json colours,
// plus the manifest colour table. Not a real Firefox render (no Xvfb; headless can't capture chrome).
// node tools/theme-preview.mjs [frameOverride] [outName]
import { firefox } from 'playwright';
import fs from 'node:fs';
const root = new URL('../', import.meta.url).pathname;
const C = { ...JSON.parse(fs.readFileSync(root + 'theme/manifest.json', 'utf8')).theme.colors };
const M = JSON.parse(fs.readFileSync(root + 'theme/manifest.json', 'utf8')).theme;
const alt = process.argv[2]; const W = +(process.env.WIN || 1280);
let frameImg = M.images?.theme_frame ? 'data:image/png;base64,' + fs.readFileSync(root + 'theme/' + M.images.theme_frame).toString('base64') : null;
if (alt) { C.frame = alt; C.frame_inactive = alt; frameImg = null; if (alt === '#131029') Object.assign(C, { tab_background_separator: '#5b4bd659' }); if (alt === '#000000') Object.assign(C, { tab_background_text: '#a8bdd6', tab_background_separator: '#5b4bd659' }); }
const out = root + 'shots/' + (process.argv[3] || 'preview-1280.png');
const sw = v => `<span class=sw style="background:${v}"></span>`;
const ents = Object.entries(C), half = Math.ceil(ents.length / 2);
const tbl = es => '<table>' + es.map(([k, v]) => `<tr><td>${sw(v)}</td><td>${k}</td><td>${v}</td></tr>`).join('') + '</table>';
const html = `<!doctype html><meta charset=utf-8><style>
body{margin:0;background:#000;font:13px "Barlow",system-ui,sans-serif;color:${C.toolbar_text};width:${W}px}
.frame{background:${frameImg ? `url(${frameImg}) left top no-repeat, ` : ''}${C.frame};display:flex;align-items:flex-end;gap:2px;padding:6px 8px 0;height:40px}
.tab{width:230px;height:34px;display:flex;align-items:center;gap:8px;padding:0 12px;color:${C.tab_background_text};border-right:1px solid ${C.tab_background_separator};box-sizing:border-box}
.tab.sel{background:${C.tab_selected};color:${C.tab_text};box-shadow:inset 0 2px 0 ${C.tab_line};border-radius:4px 4px 0 0;border-right:0}
.tab.load .fav{background:${C.tab_loading}}
.fav{width:14px;height:14px;background:${C.icons};opacity:.85;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.plus{color:${C.icons};padding:0 10px 8px;font-size:18px}
.bar{background:${C.toolbar};border-top:1px solid ${C.toolbar_top_separator};border-bottom:1px solid ${C.toolbar_bottom_separator};display:flex;align-items:center;gap:12px;padding:6px 10px}
.ic{color:${C.icons};font-size:16px;width:24px;height:24px;display:grid;place-items:center;border-radius:4px}
.ic.hover{background:${C.button_background_hover}}.ic.att{color:${C.icons_attention}}
.vsep{width:1px;height:20px;background:${C.toolbar_vertical_separator}}
.url{flex:1;height:30px;border-radius:4px;background:${C.toolbar_field};border:1px solid ${C.toolbar_field_border};color:${C.toolbar_field_text};display:flex;align-items:center;padding:0 10px;font-family:"IBM Plex Mono",monospace;font-size:12px}
.url.focus{background:${C.toolbar_field_focus};border-color:${C.toolbar_field_border_focus};color:${C.toolbar_field_text_focus};box-shadow:0 0 0 1px ${C.toolbar_field_border_focus}}
.hl{background:${C.toolbar_field_highlight};color:${C.toolbar_field_highlight_text}}
.body{display:flex;height:560px}
.side{width:260px;background:${C.sidebar};color:${C.sidebar_text};border-right:1px solid ${C.sidebar_border};padding:8px 0}
.side div{padding:5px 14px}.side .on{background:${C.sidebar_highlight};color:${C.sidebar_highlight_text}}.side .h{opacity:.6;font-size:11px;text-transform:uppercase;letter-spacing:.08em}
.page{flex:1;background:${C.ntp_background};color:${C.ntp_text};position:relative;padding:18px 24px;overflow:hidden}
.pop{position:absolute;right:14px;top:4px;width:220px;background:${C.popup};border:1px solid ${C.popup_border};color:${C.popup_text};padding:4px 0}
.pop div{padding:5px 14px}.pop .on{background:${C.popup_highlight};color:${C.popup_highlight_text}}
table{border-collapse:collapse;font:11px "IBM Plex Mono",monospace;color:#a8bdd6;columns:2}
.cols{display:flex;gap:28px}
td{padding:1px 8px 1px 0}.sw{display:inline-block;width:22px;height:12px;border:1px solid #ffffff33;vertical-align:middle}
h3{font:600 14px "Chakra Petch",sans-serif;margin:0 0 8px;color:${C.ntp_text}}
.lab{position:absolute;left:24px;bottom:12px;font:11px monospace;color:#8a93b8}
</style>
<div class=frame><div class="tab sel"><span class=fav></span>claude.ai</div><div class="tab load"><span class=fav></span>Loading…</div><div class=tab><span class=fav></span>Project board</div><div class=tab><span class=fav></span>addons.mozilla.org</div><span class=plus>+</span></div>
<div class=bar><span class=ic>←</span><span class=ic>→</span><span class="ic hover">↻</span><span class=vsep></span><div class="url focus"><span class=hl>claude.ai</span>/new</div><span class="ic att">⬇</span><span class=ic>☰</span></div>
<div class=body><div class=side><div class=h>Bookmarks</div><div>Docs</div><div class=on>claude.ai</div><div>example.org</div><div>Mozilla Add-ons</div><div class=h style="margin-top:10px">History</div><div>Today</div><div>Yesterday</div></div>
<div class=page><div class=pop><div>New tab</div><div class=on>New window</div><div>Add-ons and themes</div><div>Settings</div></div>
<h3>theme/manifest.json colours</h3><div class=cols>${tbl(ents.slice(0, half))}${tbl(ents.slice(half))}</div>
<div class=lab>MOCK of Firefox chrome built from theme/manifest.json (not a real Firefox screenshot) · frame ${frameImg ? 'gradient image (' + M.images.theme_frame + '), window ' + W + 'px' : C.frame}</div></div></div>`;
const b = await firefox.launch({ headless: true, executablePath: process.env.FX || undefined });
const p = await (await b.newContext({ viewport: { width: W, height: 640 } })).newPage();
await p.setContent(html); await p.screenshot({ path: out }); console.log(out);
await b.close();
