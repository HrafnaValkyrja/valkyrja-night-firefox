# Manifest check: static theme only (no permissions, scripts, background or content scripts).
import json, sys
m = json.load(open('theme/manifest.json'))
bad = [k for k in ('permissions', 'host_permissions', 'optional_permissions', 'background', 'content_scripts', 'browser_action', 'action') if k in m]
assert not bad, f'not a static theme: {bad}'
assert 'theme' in m and m['theme'].get('colors'), 'no theme colours'
print('THEME MANIFEST CHECK PASS')
