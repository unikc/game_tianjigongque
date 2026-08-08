"""把 public/ 下的图片压缩并转成 data URI，供 inline.py 替换资源路径。"""

import base64
import io
import json
import os

from PIL import Image

MAX_WIDTH = 520
QUALITY = 62

out = {}
for root, _, files in os.walk("public"):
    for name in sorted(files):
        path = os.path.join(root, name)
        url = "/" + os.path.relpath(path, "public").replace("\\", "/")
        if name.endswith(".svg"):
            data = open(path, "rb").read()
            out[url] = "data:image/svg+xml;base64," + base64.b64encode(data).decode()
            continue
        if not name.endswith((".webp", ".png", ".jpg")):
            continue
        im = Image.open(path)
        w, h = im.size
        if w > MAX_WIDTH:
            im = im.resize((MAX_WIDTH, int(h * MAX_WIDTH / w)), Image.LANCZOS)
        buf = io.BytesIO()
        im.convert("RGB").save(buf, "WEBP", quality=QUALITY, method=6)
        out[url] = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()

json.dump(out, open("/tmp/assets.json", "w"))
total = sum(len(v) for v in out.values())
print(f"资源 {len(out)} 项，内联后 {total / 1024 / 1024:.2f} MB")
