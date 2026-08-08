#!/usr/bin/env python3
"""
生成 iOS App 图标（1024x1024）与 favicon。

设计说明：
- 底色用品牌玉色 #234b48 的深化版本，与启动屏、状态栏一致，避免启动时色块跳变。
- 中心是一枚仿古印章：朱红印底 + 米白"阙"字，取自游戏名"天机宫阙"的题眼。
  选"阙"而不是"天"，因为宫阙是这个游戏的空间与权力隐喻，辨识度也更高。
- 苹果要求 App 图标不带圆角、不带透明通道（系统自动切圆角），所以输出为不透明 RGB。
- 边缘留出约 12% 的安全边距，防止被系统圆角裁掉笔画。

注意：这是一版可用的程序化图标，用于跑通打包与提审流程。
正式上架前建议交给美术做一版手绘/篆刻质感的，商店图标是转化率的关键位。
"""

from PIL import Image, ImageDraw, ImageFont

SIZE = 1024
JADE_DEEP = (23, 53, 50)  # #173532 与 capacitor.config 背景一致
JADE = (35, 75, 72)  # #234b48 品牌玉色
GOLD = (164, 131, 69)  # #a48345 旧金
SEAL_RED = (141, 48, 39)  # #8d3027 印泥红
RICE = (244, 236, 216)  # #f4ecd8 宣纸

FONT_PATH = "/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc"


def radial_background(size: int) -> Image.Image:
    """玉色径向渐变，中心略亮，模拟玉石透光。"""
    img = Image.new("RGB", (size, size), JADE_DEEP)
    px = img.load()
    cx = cy = size / 2
    max_d = (cx**2 + cy**2) ** 0.5
    for y in range(size):
        for x in range(size):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5 / max_d
            t = min(1.0, d * 1.15)
            px[x, y] = tuple(
                int(JADE[i] * (1 - t) + JADE_DEEP[i] * t) for i in range(3)
            )
    return img


def main() -> None:
    img = radial_background(SIZE)
    draw = ImageDraw.Draw(img)

    # 外圈金线，呼应界面里的描金边框
    margin = int(SIZE * 0.11)
    draw.rectangle(
        [margin, margin, SIZE - margin, SIZE - margin],
        outline=GOLD,
        width=int(SIZE * 0.011),
    )

    # 内侧细金线，形成双框的宫廷感
    inner = margin + int(SIZE * 0.028)
    draw.rectangle(
        [inner, inner, SIZE - inner, SIZE - inner],
        outline=GOLD,
        width=int(SIZE * 0.004),
    )

    # 中央印章：朱红方底，四角微圆，模仿篆刻印面
    seal_m = int(SIZE * 0.235)
    draw.rounded_rectangle(
        [seal_m, seal_m, SIZE - seal_m, SIZE - seal_m],
        radius=int(SIZE * 0.022),
        fill=SEAL_RED,
    )

    # 印面上的"阙"字
    font_size = int(SIZE * 0.40)
    font = ImageFont.truetype(FONT_PATH, font_size)
    char = "阙"
    bbox = draw.textbbox((0, 0), char, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(
        ((SIZE - w) / 2 - bbox[0], (SIZE - h) / 2 - bbox[1]),
        char,
        font=font,
        fill=RICE,
    )

    out = "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png"
    img.save(out, "PNG")
    print(f"wrote {out} ({img.size[0]}x{img.size[1]}, mode={img.mode})")

    # 网页版 favicon / PWA 图标
    for px_size, path in [(192, "public/icon-192.png"), (512, "public/icon-512.png")]:
        img.resize((px_size, px_size), Image.LANCZOS).save(path, "PNG")
        print(f"wrote {path}")


if __name__ == "__main__":
    main()
