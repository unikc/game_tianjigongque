js = open("/tmp/app.inlined.js", encoding="utf-8").read()
css = open("/tmp/app.inlined.css", encoding="utf-8").read()

html = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>天机宫阙</title>
<style>
html,body{margin:0;padding:0;background:#152e2d;min-height:100%}
#root{min-height:100vh}
__CSS__
</style>
</head>
<body>
<div id="root"></div>
<script>
__JS__
</script>
</body>
</html>
"""

html = html.replace("__CSS__", css).replace("__JS__", js)
path = "/mnt/user-data/outputs/tianji-palace.html"
open(path, "w", encoding="utf-8").write(html)
print("wrote", path, round(len(html.encode("utf-8")) / 1024 / 1024, 2), "MB")
