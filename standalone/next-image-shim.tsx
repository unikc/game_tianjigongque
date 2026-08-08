/**
 * next/image 的最小等价实现，只在 standalone 单文件构建里通过 esbuild alias 生效。
 *
 * 为什么需要它：next/image 依赖 Next 的运行时与图片优化端点，脱离 Next 之后
 * 会解析为 undefined，React 抛出 error #130（组件类型无效）导致白屏。
 *
 * 为什么不直接改 Portrait.tsx：那是线上 Next 应用真实使用的组件，
 * 改它会牺牲正式站点的图片优化。构建期替换是更小的代价。
 *
 * 实现说明：只覆盖项目实际用到的 props。`fill` 在 next/image 里表示
 * 铺满定位父元素，等价于绝对定位 + object-fit: cover。
 */

import type { CSSProperties } from "react";

type ImgProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
};

export default function Image({
  src,
  alt,
  fill,
  priority,
  width,
  height,
  className,
  style,
}: ImgProps) {
  const fillStyle: CSSProperties = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }
    : {};
  // 这个文件的存在意义就是在脱离 Next 运行时的 standalone 构建里替代
  // next/image，因此此处必须使用原生 img 元素。
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={{ ...fillStyle, ...style }}
    />
  );
}
