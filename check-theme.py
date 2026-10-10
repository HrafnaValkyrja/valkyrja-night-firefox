# Manifest check: static theme only (no permissions, scripts, background or content scripts).
import json, sys
m = json.load(open('theme/manifest.json'))
bad = [k for k in ('permissions', 'host_permissions', 'optional_permissions', 'background', 'content_scripts', 'browser_action', 'action') if k in m]
assert not bad, f'not a static theme: {bad}'
assert 'theme' in m and m['theme'].get('colors'), 'no theme colours'
print('THEME MANIFEST CHECK PASS')

# Text contrast: every text colour against the background it sits on (WCAG AA, 4.5:1).
def lum(h):
    h = h.lstrip('#')[:6]; r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    f = lambda v: v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
c = m['theme']['colors']
pairs = [('tab_background_text', 'frame'), ('tab_background_text', 'frame_inactive'), ('tab_text', 'tab_selected'), ('toolbar_text', 'toolbar'),
         ('toolbar_field_text', 'toolbar_field'), ('toolbar_field_text_focus', 'toolbar_field_focus'), ('popup_text', 'popup'), ('sidebar_text', 'sidebar'), ('ntp_text', 'ntp_background')]
for fg, bg in pairs:
    a, b = sorted((lum(c[fg]), lum(c[bg])), reverse=True); ratio = (a + 0.05) / (b + 0.05)
    assert ratio >= 4.5, f'{fg} on {bg}: {ratio:.2f} < 4.5'
print(f'CONTRAST CHECK PASS ({len(pairs)} pairs, lowest {min(((max(lum(c[f]), lum(c[b])) + .05) / (min(lum(c[f]), lum(c[b])) + .05)) for f, b in pairs):.2f}:1)')
