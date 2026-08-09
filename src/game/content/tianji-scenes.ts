/**
 * 天机阁场景（E03）。
 *
 * 挂接方式：全部做成**可绕过的侧枝**。每一处都从既有场景追加一个选项，
 * 走完之后回到原来的 `next`。因此主线分支图完全不变，
 * 一个从不进阁的玩家会得到和改造前一模一样的十二章。
 *
 * 分布：
 *   第4章 雨夜   · 认识阁主，第一次听见「价」这个字（不成交）
 *   第6章 河决后 · 第一次交易：问医（signpost）
 *   第8章 凤印后 · 第二次交易：问火（signpost，价更高）
 *   第9章 火后   · 第三次交易：问风（exclusion）
 *   第11章 宫门  · 册子回来：你交出去的东西成为别人的证词
 *
 * 三次交易共用同一个 `tianji_trade` 场景，问题由当前可交易的谶语决定，
 * 因此不需要为每一章重写一遍阁楼。
 */

import type { Choice, Scene } from "../types";
import {
  forecastReading,
  forecastTags,
  tradableForecasts,
  tradeAvailability,
  surrenderedSecrets,
  ledgerExposure,
  type ForecastId,
} from "../state/tianji-pavilion";
import type { GameState } from "../types";

const pavilionBase = {
  speaker: "天机阁主 · 卫夷则",
  portrait: "archivist" as const,
};

// ---------------------------------------------------------------------------
// 第4章：认识她。这一场不交易，只让玩家听见规则。
// ---------------------------------------------------------------------------

const introScene = (returnTo: string): Scene => ({
  id: "tianji_intro",
  title: "阁上无灯",
  chapterLabel: "第4日",
  ...pavilionBase,
  text:
    "雨夜封宫，你抄近路穿过西苑，才发现墙后还有一座楼。楼里没有点灯，一个女官正把一卷旧档念给上首的人听。" +
    "念到一半，上首的人抬手让她停下：“这一段的笔，和承熙三年河工册上的是同一只手。去把那一卷取来。”\n\n" +
    "她始终没有看你。等女官出去了，她才说：“进来的是新人。你身上有纸味，不是熏的，是自己翻出来的。”",
  choices: [
    {
      id: "tianji_intro_ask",
      text: "问她：这里是什么地方？",
      outcome:
        "“天机阁。掌历法、灾异、旧档。”她顿了顿，“别人以为我们能看见明天。其实我们只是把昨天记得比别人细。同一只手写过的东西，早晚会露出同一个习惯。”",
      effect: { stats: { 才学: 1 }, tags: ["tianji_known"] },
      next: "tianji_intro_2",
    },
    {
      id: "tianji_intro_watch",
      text: "先不作声，听她还要取哪几卷。",
      outcome:
        "她一连报了四卷，卷卷相隔十几年。你忽然明白她不是在查一件事，是在把许多年里同一个习惯挑出来。她也没有点破你没出声。",
      effect: { stats: { 谋略: 1 }, tags: ["tianji_known", "tianji_observed"] },
      next: "tianji_intro_2",
      requiresZodiac: "rabbit",
    },
    {
      id: "tianji_intro_leave",
      text: "行礼，退出去。今夜你还有别的事。",
      outcome:
        "你退到雨里。身后那句话跟出来：“下回想问什么，先想好拿什么换。这里不赊。”",
      effect: { stats: { 礼仪: 1 }, tags: ["tianji_known"] },
      next: returnTo,
    },
  ],
});

// 第4章的第二场：听完规矩后直接上楼交易，因此不需要回程参数——
// 两条路都通往 tianji_trade_ch4，由它负责送玩家回主线。
const introSecondScene = (): Scene => ({
  id: "tianji_intro_2",
  title: "此处不赊",
  chapterLabel: "第4日",
  ...pavilionBase,
  text:
    "“你想问将来的事。”她说，不是疑问句。“可以。但我这里不赊。”\n\n" +
    "“我不要银钱，银钱进不了册子。我要一件事——你做过、确实做过、而且到今天为止没有第二个人知道的事。” " +
    "她把手放在案上那本厚册子上。“说给我听，我写进去。以后我说的话，就有你的一份。”",
  choices: [
    {
      id: "tianji_intro_price",
      text: "问：为什么偏要这个？",
      outcome:
        "“因为这是唯一你骗不了我的东西。”她说，“公事我这里都有卷。你若编一件公事糊弄我，我三卷之内就对得出来。私事不同——私事我查不到，所以你要是肯说，我就知道你是真想要那句话。”",
      effect: { stats: { 才学: 1 }, tags: ["tianji_price_known"] },
      next: "tianji_trade_ch4",
    },
    {
      id: "tianji_intro_refuse",
      text: "说：那我大概永远问不起。",
      outcome:
        "“也好。”她第一次露出一点像笑的东西，“买得起我这句话的人，都是在暗处做过事的人。你要是能一直站在亮处，那你比我们都强。”",
      effect: {
        stats: { 名望: 1 },
        tags: ["tianji_price_known", "tianji_declined_early"],
      },
      next: "tianji_trade_ch4",
    },
  ],
});

// ---------------------------------------------------------------------------
// 交易场景。三章共用，内容按当前可交易的谶语在运行时生成。
// ---------------------------------------------------------------------------

/** 静态骨架，保证分支遍历工具能走完全图。 */
const tradeSkeleton = (id: string, returnTo: string): Scene => ({
  id,
  title: "价",
  ...pavilionBase,
  text: "你问，她开价。价是你自己做过的一件事。",
  choices: [
    ...(["physician", "fire", "wind"] as ForecastId[]).map((forecastId) => ({
      id: `${id}_pay_${forecastId}`,
      text: `付价，问「${forecastId}」`,
      outcome: "她把你说的话写进册子，然后给了你一句不算答案的答案。",
      effect: { tags: [`tianji_forecast:${forecastId}`] },
      next: returnTo,
    })),
    {
      id: `${id}_walk_away`,
      text: "不换。转身下楼。",
      outcome: "你留住了那件事。你也仍然不知道接下来会发生什么。",
      effect: { stats: { 名望: 1 }, tags: ["tianji_refused_trade"] },
      next: returnTo,
    },
  ],
});

/**
 * 每一章的阁楼实例：场景 id → 回程目标。
 *
 * 三章各自一个实例，回程因此是静态确定的；不需要在运行时
 * 记住玩家是从哪里上楼的，也就不需要新增存档字段。
 */
export const tianjiTradeScenes: Record<string, string> = {};

/**
 * 运行时构建交易场景。
 *
 * 与 `buildXieReviewScene` / `buildLeakReturnScene` 同一模式：
 * 静态骨架保留在注册表里，实际呈现时按状态重算。
 */
export function buildTianjiTradeScene(
  state: GameState,
  sceneId: string,
): Scene {
  const returnTo = tianjiTradeScenes[sceneId] ?? "hub";
  const tradable = tradableForecasts(state);
  const paid = surrenderedSecrets(state).length;
  const chapterLabel = `第${Math.max(6, state.completedChapters.length + 1)}日`;

  if (!tradable.length) {
    // 两种落空：要么没到时候，要么——更有意思的那种——你没有私事可付。
    const blocked = (["physician", "fire", "wind"] as ForecastId[])
      .map((id) => tradeAvailability(state, id))
      .find((item) => item.kind === "nothing-to-pay");
    return {
      id: sceneId,
      title: blocked ? "无秘可付" : "尚未到时候",
      chapterLabel,
      ...pavilionBase,
      text: blocked
        ? "她听了很久，然后摇头。\n\n“你身上没有我要的东西。”她说，“你做过的事，我这里都有卷——名册、脉案、开仓令，一笔一笔都在。你没有一件是自己压着的。”\n\n" +
          "“这不是坏事。”她把册子合上，“你走的是明路。明路的人问不到天机，也不需要问。将来出了事，替你说话的是记录，不是我。”"
        : "她听完你的来意，没有开价。\n\n“还早。”她说，“你要问的事还没有影子。等它有了影子，你自己会知道该问什么。”",
      choices: [
        {
          id: `${sceneId}_no_trade`,
          text: "行礼，退下。",
          outcome: blocked
            ? "你下楼时忽然想到：你走到今天，竟然没有一件事是不敢说的。这既让你安心，也让你少了一条路。"
            : "你把这座楼记在心里，等它派上用场的那一天。",
          effect: blocked
            ? { stats: { 名望: 1 }, tags: ["tianji_nothing_to_pay"] }
            : { tags: ["tianji_too_early"] },
          next: returnTo,
        },
      ],
    };
  }

  const choices: Choice[] = tradable.map(({ forecast, price }) => ({
    id: `${sceneId}_pay_${forecast.id}`,
    text: `问：${forecast.question}`,
    outcome:
      `她要走的是「${price.label}」——${price.detail}\n\n` +
      `你说了。她一面听一面在册子上落笔，没有抬头。写完才开口：\n\n${forecastReading(state, forecast.id)}\n\n` +
      "“记住，我没有回答你。”她说，“我只告诉你该看哪里。看错了，是你自己的事。”",
    effect: {
      stats: { 谋略: 1 },
      relations: { 卫夷则: 4 },
      tags: [
        ...forecastTags(state, forecast.id),
        `secret_surrendered:${price.memoryId}`,
        "secret_source:tianji",
      ],
    },
    next: returnTo,
  }));

  choices.push({
    id: `${sceneId}_walk_away`,
    text: "不换。有些事说出去就不再是你的了。",
    outcome:
      "“想清楚了？”她没有挽留，“那你就只能和别人一样，等它发生。”\n\n你下楼的时候，听见她翻开了下一卷。她不缺客人。",
    effect: {
      stats: { 名望: 1 },
      relations: { 卫夷则: -1 },
      tags: ["tianji_refused_trade"],
    },
    next: returnTo,
  });

  const priceHint =
    paid === 0
      ? "她的册子上还没有你的名字。"
      : paid === 1
        ? "册子上已经有你的一行。她翻到那一页只用了一息。"
        : "册子上你的那几行已经连成了一段。她不必翻找。";

  return {
    id: sceneId,
    title: "价",
    chapterLabel,
    ...pavilionBase,
    text:
      `楼里仍旧没有灯。${priceHint}\n\n` +
      "“说吧。”她说，“你要问哪一件？”\n\n" +
      "案上那本册子摊着，纸页边缘被摸得发亮。你忽然意识到，写在上面的每一行，都是某个人当初也以为只有自己知道的事。",
    choices,
  };
}

// ---------------------------------------------------------------------------
// 第11章：册子回来。
// ---------------------------------------------------------------------------

const ledgerSkeleton = (returnTo: string): Scene => ({
  id: "tianji_ledger_called",
  title: "册子上的那几行",
  chapterLabel: "第11日",
  ...pavilionBase,
  text: "政变方带来的不是刀，是一本册子。",
  choices: [
    {
      id: "tianji_ledger_own",
      text: "认下。",
      outcome: "你把册子上的每一行都认了。",
      effect: { tags: ["tianji_ledger_owned"] },
      next: returnTo,
    },
    {
      id: "tianji_ledger_preempt",
      text: "先公开。",
      outcome: "你抢在他们前面把那几行念了出来。",
      effect: { tags: ["tianji_ledger_preempted"] },
      next: returnTo,
    },
    {
      id: "tianji_ledger_trade",
      text: "换回来。",
      outcome: "你用更大的东西换回了那几页。",
      effect: { tags: ["tianji_ledger_bought"] },
      next: returnTo,
    },
  ],
});

export function buildLedgerScene(state: GameState, returnTo: string): Scene {
  const secrets = surrenderedSecrets(state);
  const exposure = ledgerExposure(state);
  const quoted = secrets
    .slice(0, 3)
    .map((secret) => `　「${secret.label}」——${secret.detail}`)
    .join("\n");

  return {
    id: "tianji_ledger_called",
    title: "册子上的那几行",
    chapterLabel: "第11日",
    ...pavilionBase,
    text:
      "宫门前，持伪诏的人没有先拔刀。他从袖中取出一本册子，翻到折角的那一页，念了起来。\n\n" +
      quoted +
      "\n\n" +
      "每一行都是真的。每一行都是你亲口说的。当初你以为你是在买一句关于将来的话——" +
      "现在这几行正被当众读出来，用来证明你从一开始就在暗处做事。\n\n" +
      "卫夷则站在阶下，没有解释，也没有否认。她只说了一句：“我从不替人保密。我说过的，是不赊。”",
    choices: [
      {
        id: "tianji_ledger_own",
        text: "一行一行认下来，然后说出每一件事当时是为了谁。",
        outcome:
          "你没有辩解哪一件是被迫的。你只说了当时站在你面前的是谁。念册子的人越念越慢——他手里的每一行，都在替你补一个名字。",
        effect: {
          stats: { 胆识: 1, 名望: 1 },
          tags: [
            "tianji_ledger_owned",
            "revenge_answered:tianji-ledger-called-in",
          ],
        },
        next: returnTo,
      },
      {
        id: "tianji_ledger_preempt",
        text: "抢过话头，把册子上还没念到的也一并念完。",
        outcome:
          "你念得比他快，也比他全。一件秘密被自己念出来的时候，就不再是别人的筹码了——代价是从今往后，你再没有暗处。",
        effect: {
          stats: { 名望: 2, 谋略: 1 },
          tags: [
            "tianji_ledger_preempted",
            "public_truth_self_disclosed",
            "revenge_answered:tianji-ledger-called-in",
          ],
        },
        next: returnTo,
      },
      {
        id: "tianji_ledger_trade",
        text: "向卫夷则开价：用你手里更重的一卷，换回这几页。",
        outcome:
          "她收下了。她收下的东西比你交出去的那几件加起来还重——但她确实把那几页撕下来给了你。“这一次算清了。”她说，“下一次还是不赊。”",
        effect: {
          stats: { 谋略: 1, 名望: -1 },
          relations: { 卫夷则: 6 },
          tags: [
            "tianji_ledger_bought",
            "tianji_ledger_debt_deepened",
            "revenge_answered:tianji-ledger-called-in",
          ],
        },
        next: returnTo,
        requiresAnyTag: [
          "empty_seal_player",
          "ch9_mouse_ledger",
          "holds_register_leverage",
        ],
      },
      {
        id: "tianji_ledger_silence",
        text: "什么都不说，让他念完。",
        outcome:
          "他念完了。宫门前安静了很久。没有人替你补一句，因为你自己也没有。这几行从此就是你在别人记忆里的样子。",
        effect: {
          stats: { 名望: -2 },
          tags: [
            "tianji_ledger_unanswered",
            "revenge_answered:tianji-ledger-called-in",
          ],
        },
        next: returnTo,
      },
    ],
    // exposure 只影响文本口吻，不额外加惩罚——避免惩罚螺旋。
    ...(exposure === "decisive" ? { portraitLabel: "秘录 · 三页折角" } : {}),
  };
}

// ---------------------------------------------------------------------------
// 挂接
// ---------------------------------------------------------------------------

/** 第4章：在雨夜空印的场景里追加一条通往阁楼的路。 */
export function applyTianjiChapter4(scenes: Record<string, Scene>) {
  const host = scenes.day4_three_orders;
  if (!host) return;
  const returnTo = host.choices[0]?.next ?? "day4_archive";
  scenes.tianji_intro = introScene(returnTo);
  scenes.tianji_intro_2 = introSecondScene();
  // 第4章的阁楼实例：这一次交易换到的「问医」会在第5章兑现。
  tianjiTradeScenes.tianji_trade_ch4 = returnTo;
  scenes.tianji_trade_ch4 = tradeSkeleton("tianji_trade_ch4", returnTo);
  host.choices.push({
    id: "day4_tianji_detour",
    text: "抄西苑近路避开巡夜——那面墙后似乎还有一座楼。",
    outcome: "你听见楼里有人在念一卷很旧的档。",
    effect: { stats: { 谋略: 1 } },
    next: "tianji_intro",
  });
}

/** 第6、8、9章：同一座阁楼，三次不同的价。 */
export function applyTianjiTrades(laterScenes: Record<string, Scene>) {
  // 每一次交易都必须发生在它所预言的那一章**之前**，否则不叫预知。
  //   day6_2（第6章） → 问火 → 第9章十二宫火兑现
  //   day8_2（第8章） → 问风 → 第9章三札分路兑现
  // 问医由第4章的阁楼实例承担，见 applyTianjiChapter4。
  const hosts: Array<[hostId: string, label: string]> = [
    ["day6_2", "赈银的事还没有着落，你想起西苑那座没有灯的楼。"],
    ["day8_2", "凤印的事悬着。有一个人不会站队，因为她只收价。"],
  ];

  hosts.forEach(([hostId, label]) => {
    const host = laterScenes[hostId];
    if (!host) return;
    const back = host.choices[0]?.next;
    if (!back) return;
    const sceneId = `tianji_trade_${hostId}`;
    tianjiTradeScenes[sceneId] = back;
    laterScenes[sceneId] = tradeSkeleton(sceneId, back);
    host.choices.push({
      id: `${hostId}_tianji`,
      text: label,
      outcome: "你又一次站在那本册子前面。",
      effect: {},
      next: sceneId,
      requiresTag: "tianji_known",
    });
  });
}

/** 第11章册子场景的回程目标。 */
export let ledgerReturnTarget = "day11_2";

/** 第11章：册子回来。 */
export function applyTianjiLedger(laterScenes: Record<string, Scene>) {
  const host = laterScenes.day11_1;
  if (!host) return;
  const back = host.choices[0]?.next ?? "day11_2";
  ledgerReturnTarget = back;
  laterScenes.tianji_ledger_called = ledgerSkeleton(back);
  host.choices.push({
    id: "day11_tianji_ledger",
    text: "宫门前那人手里拿的不是刀，是一本册子。",
    outcome: "你认得那本册子的封皮。",
    effect: {},
    next: "tianji_ledger_called",
    requiresAnyTag: [
      "tianji_forecast:physician",
      "tianji_forecast:fire",
      "tianji_forecast:wind",
    ],
  });
}
