import json
import re

assets = json.load(open("/tmp/assets.json"))
js = open("/tmp/app.js", encoding="utf-8").read()
css = open("/tmp/app.css", encoding="utf-8").read()

quotes = ['"', "'", "`"]
n = 0
for url, data in sorted(assets.items(), key=lambda x: -len(x[0])):
    for q in quotes:
        token = q + url + q
        if token in js:
            js = js.replace(token, q + data + q)
            n += 1
    if url in css:
        css = css.replace(url, data)
        n += 1

open("/tmp/app.inlined.js", "w", encoding="utf-8").write(js)
open("/tmp/app.inlined.css", "w", encoding="utf-8").write(css)
print("替换次数", n)

left = set(re.findall(r"""["'`](/(?:backgrounds|characters|items|protagonist|chapters)/[^"'`]+)""", js))
print("JS中未替换:", sorted(left)[:6] if left else "无")
print("JS", round(len(js) / 1024), "KB  CSS", round(len(css) / 1024), "KB")
