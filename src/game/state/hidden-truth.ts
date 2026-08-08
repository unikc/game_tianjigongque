/**
 * 隐藏真相系统。
 *
 * 设计动机：改造前，玩家和主角知道的一样多，每个选择都退化成"选哪个属性"。
 * 真正让权谋叙事好玩的是**信息不对称**——你必须在不确定的事实上下注。
 *
 * 实现方式：
 * - 真相由局内种子确定性推导，不写入 GameState，因此存档、回放、
 *   既有的"同种子结果一致"测试全部自动兼容，零迁移成本。
 * - 玩家通过调查获得的是 `belief_*` 标签（你以为的事实），
 *   只有满足更高门槛的调查才会给出 `known_*` 标签（你确实查清了）。
 * - 场景可以用 requiresTruth 挂在真相上，于是同一个选择在不同周目
 *   会导向不同结果——玩家第二周目才会发现自己上一次赌错了。
 *
 * 这套东西刻意做得很薄：它不引入新的状态字段，只是把"种子"这个
 * 已经存在、已经参与判定的东西，重新解释为"这局世界的底牌"。
 */

/** 温疏雨当初为什么改脉案。 */
export type WenLoyalty =
  /** 她确实是为了让惠嫔活下来才改的案——她说的是真话。 */
  | "honest"
  /** 她收了宗室的钱，假孕本就是她参与编造的——她说的是半真话。 */
  | "compromised";

/** 十二宫纵火真正的主使。 */
export type ArsonPatron =
  /** 宗室：与刺杀、空印案同源。 */
  | "royal"
  /** 太后母族：借宗室之名灭口，把水搅浑。 */
  | "dowager";

export type HiddenTruths = {
  wenLoyalty: WenLoyalty;
  arsonPatron: ArsonPatron;
};

/**
 * 从种子推导本局真相。
 *
 * 用两个互质的乘数分别取位，避免两个真相被同一个 bit 决定
 * （否则玩家查清一件事就等于免费知道另一件，信息不对称就塌了）。
 */
export function deriveTruths(seed: number): HiddenTruths {
  const s = Math.abs(Math.floor(seed)) || 1;
  return {
    wenLoyalty: (s * 2654435761) % 3 === 0 ? "compromised" : "honest",
    arsonPatron: (s * 40503) % 2 === 0 ? "dowager" : "royal",
  };
}

/** 供 UI 显示：把真相翻译成一句复盘用的话。 */
export const truthSummaries: {
  wenLoyalty: Record<WenLoyalty, string>;
  arsonPatron: Record<ArsonPatron, string>;
} = {
  wenLoyalty: {
    honest: "温疏雨说的是真话：她改脉案，是为了让惠嫔活过那个冬天。",
    compromised:
      "温疏雨说的是半真话：假孕从一开始就有她的笔迹，她收过宗室的银子。",
  },
  arsonPatron: {
    royal: "十二宫的火是宗室放的，与春猎那支箭同源。",
    dowager: "十二宫的火是太后母族放的，借宗室之名灭口，把水搅浑。",
  },
};
