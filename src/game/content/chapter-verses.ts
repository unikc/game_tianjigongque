/**
 * 十二章章首谶诗（E10）。
 *
 * 设计约束：
 *   1. 每首诗 2–4 行，第一次读是氛围，回读后能看出具体线索。
 *   2. 不揭露种子真相（wenLoyalty / arsonPatron / leakLink 全部不触及）。
 *   3. 不复制任何已有诗词，全部原创。
 *   4. 行文用古典白话，不用文言生僻字——手机屏幕上要能快速读完。
 *   5. 每首诗的 clue 字段是给开发者看的注释，解释具体指向哪件事。
 *
 * 「有用但不全知」：诗不说名字，只说形状。
 */

export type ChapterVerse = {
  chapter: number;
  /** 章节标题，与 later-scenes 保持一致 */
  title: string;
  /** 谶诗正文，数组中每个字符串是一行 */
  lines: readonly string[];
  /**
   * 开发者注释：事后可验证的具体指向。
   * 不渲染给玩家，只用于 QA 对照。
   */
  clue: string;
};

export const chapterVerses: readonly ChapterVerse[] = [
  {
    chapter: 1,
    title: "尘埃落定",
    lines: ["一只鸭子不会说话，", "却让所有人看见了你。"],
    clue: "绣鸭事件：一件无意之物让玩家在御前出现，此后的一切都从这一刻被看见开始。",
  },
  {
    chapter: 2,
    title: "宴散留痕",
    lines: ["席上有人多坐了一刻，", "名册上少了一个字。", "你数清楚了吗。"],
    clue: "名册刮改事件：宫宴结束后名字被刮去，留下的痕迹比留下的人更重要。",
  },
  {
    chapter: 3,
    title: "香冷人未定",
    lines: [
      "合欢香无色无味，",
      "验它的人也无色无味。",
      "有一行字是后来添的，",
      "问题是，为了谁。",
    ],
    clue: "脉案改写：温疏雨改了那一行，动机是救人还是掩护，至今未定。",
  },
  {
    chapter: 4,
    title: "雨歇印未干",
    lines: ["盖印不难，", "难的是盖完之后还能回头。"],
    clue: "空印事件：使用或拒绝空白印鉴，每一个决定都会留下追责的可能。",
  },
  {
    chapter: 5,
    title: "未落之子",
    lines: [
      "有人替惠嫔活过了那个冬天，",
      "账还没有算清。",
      "孩子没有落地，",
      "名字先落了纸。",
    ],
    clue: "脉案与惠嫔命运：改写那一行的代价，在这一章开始显形。",
  },
  {
    chapter: 6,
    title: "河决千里",
    lines: [
      "堤不是今年才坏的，",
      "赈银也不是今天才少的。",
      "问谁，问的是现在，",
      "问到最后，问的是三年前。",
    ],
    clue: "赈灾账与宗室：表面是今年的水灾，实际追溯到三年前同一批人的同一套做法。",
  },
  {
    chapter: 7,
    title: "春猎惊弦",
    lines: ["箭离弦的那一刻，", "你选了什么先救。", "他看见了。"],
    clue: "刺杀：玩家在混乱中的优先选择，皇帝记住了——这件事在第11章会重新被提起。",
  },
  {
    chapter: 8,
    title: "凤印两面",
    lines: [
      "印章只有一枚，",
      "用它的人有两种理由。",
      "三年前皇后用过一次，",
      "她没有说为了什么。",
    ],
    clue: "凤印与沈令仪的秘密：三年前的一次使用，第8章才说出理由。",
  },
  {
    chapter: 9,
    title: "十二宫火",
    lines: [
      "火不挑人，",
      "但放火的人挑了地方。",
      "火后先被救出来的那一卷，",
      "最能说明谁在场。",
    ],
    clue: "纵火主使线索：谁的文书先被救走，谁就更可能在场——对应天机「问火」的兑现。",
  },
  {
    chapter: 10,
    title: "金殿无主",
    lines: [
      "位子空着，",
      "但它不是真的空的。",
      "每个靠近它的人，",
      "都在用自己的样子填它。",
    ],
    clue: "权力真空与摄政合法性：金殿无人坐，每一方都在试图以自己的方式定义它。",
  },
  {
    chapter: 11,
    title: "宫门血诏",
    lines: [
      "诏书有人念，",
      "册子也有人念。",
      "听完的人自己决定，",
      "哪一种声音更重。",
    ],
    clue: "政变与秘录：伪诏与卫夷则的秘录册同时出现在宫门前，玩家用哪种声音对抗另一种。",
  },
  {
    chapter: 12,
    title: "天明以后",
    lines: [
      "天亮了。",
      "你做过的事都还在，",
      "你没有做的事也还在。",
      "叫什么，由你说了算。",
    ],
    clue: "结局总括：所有选择的积累在这里成形。空印案的核心命题——谁失去名字，谁决定叫什么——在这里给出答案。",
  },
] as const;

/** 根据章节数取谶诗，找不到返回 undefined。 */
export function verseForChapter(chapter: number): ChapterVerse | undefined {
  return chapterVerses.find((v) => v.chapter === chapter);
}

/** 玩家是否已经看过某章谶诗。 */
export function verseAlreadySeen(tags: string[], chapter: number): boolean {
  return tags.includes(`verse_seen:chapter-${chapter}`);
}

/** 标记某章谶诗已看的 tag。用于测试和外部引用。 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function verseSeen(chapter: number): string {
  return `verse_seen:chapter-${chapter}`;
}
