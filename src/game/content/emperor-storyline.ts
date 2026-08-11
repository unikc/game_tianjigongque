/**
 * 萧承元专线场景。
 *
 * ── 设计原则 ──────────────────────────────────────────────────────────
 *
 * 萧承元是「聪明但长期借平衡逃避责任」的人。
 * CP 线不绕开这个特质——玩家会看见他的懦弱，也会看见他如何
 * 在懦弱之外找到一种只对你才有的诚实。
 *
 * 感情线和政治线用同一套场景，玩家自己决定那是什么关系。
 * 他不会主动告白，玩家也不需要「攻略」他——
 * 他们之间积累的是共同持有的信息和共同做过的选择。
 *
 * ── 四条场景分布 ──────────────────────────────────────────────────────
 *
 * 第3章末：他让人传话，问你脉案的事——他也在查，只是从另一个方向
 * 第5章末：单独召见，问的不是案子
 * 第8章：凤印风波后，他只对你说了一句话
 * 第10章：权力真空，他的信任决定他在关键时刻做了什么
 *
 * ── 触发条件 ──────────────────────────────────────────────────────────
 *
 * 这条线不需要刷数值——它需要玩家在场景里做出过「让他看见你」的选择。
 * 具体来说：
 *   - 第3章触发：宠爱 >= 8（御前初见之后他注意到你了）
 *   - 第5章触发：信任 >= 15（他开始把你当作一个判断可靠的人）
 *   - 第8章触发：信任 >= 25 或有 ch7_told_emperor_truth
 *   - 第10章触发：信任 >= 35，决定他做还是不做某件事
 */

import type { Scene, Choice } from "../types";
import type { GameState } from "../types";

// ---------------------------------------------------------------------------
// 第3章末：他也在查
// ---------------------------------------------------------------------------

export const emperorCh3Skeleton: Scene = {
  id: "emperor_ch3_message",
  title: "他派来的人",
  chapterLabel: "第三日",
  text: "天黑之前，高福安来传话：皇帝问脉案的事，不通过任何宫，直接问你。",
  choices: [
    {
      id: "emp_ch3_tell",
      text: "如实说。",
      outcome: "你说了。",
      effect: { emperor: { trust: 4 } },
      next: "day3_result",
    },
    {
      id: "emp_ch3_partial",
      text: "说了一半。",
      outcome: "他听完，没有追问另一半。",
      effect: { emperor: { trust: 2 } },
      next: "day3_result",
    },
    {
      id: "emp_ch3_refuse",
      text: "请高福安回禀：案子查完再说。",
      outcome: "高福安回去了。消息是你的。",
      effect: { emperor: { trust: 1, favor: 2 } },
      next: "day3_result",
    },
  ],
};

export function buildEmperorCh3Scene(
  state: GameState,
  returnTo: string,
): Scene {
  // 他是从哪里知道有这件事的——取决于第3章的选择
  const heardViaPublic = state.tags.includes("day3_name_cleared");
  const heardViaPearl = state.tags.includes("day3_box_counterfeit");
  const heardViaWen = state.tags.includes("day3_medical_record");

  let howHeHeard = "";
  if (heardViaPublic)
    howHeHeard = "你当众核对笔迹的事他听说了。";
  else if (heardViaPearl)
    howHeHeard = "东珠的事他知道了——他知道你用了他给的东西。";
  else if (heardViaWen)
    howHeHeard = "脉案进了公案，他的人抄了一份。";
  else
    howHeHeard = "宫里的事，他总有办法知道。";

  return {
    id: "emperor_ch3_message",
    title: "他派来的人",
    chapterLabel: "第三日",
    text:
      "天还没有黑，高福安来传话。\n\n" +
      `${howHeHeard}\n\n` +
      "皇帝问：脉案的事，你查到哪里了？\n\n" +
      "不经过任何宫，直接问你。",
    choices: [
      {
        id: "emp_ch3_tell",
        text: "如实说，包括温疏雨改案的部分。",
        outcome:
          "高福安把你说的话一字不漏地带回去了。\n\n" +
          "第二天，皇帝没有召见你，但你知道他知道了。\n" +
          "知道同一件事的两个人，在宫里是一种特殊的关系。",
        effect: {
          stats: { 胆识: 1 },
          emperor: { trust: 6, favor: 2 },
          tags: ["emp_told_full_truth_ch3"],
        },
        next: returnTo,
      },
      {
        id: "emp_ch3_partial",
        text: "说了事实，没有说温疏雨改案。她的事你替她压着。",
        outcome:
          "你说的是真话，只是不完整的真话。\n\n" +
          "高福安接话的时候停了一下，你不知道那个停顿意味着什么。\n" +
          "他大概知道你没有说完。他没有追问。",
        effect: {
          emperor: { trust: 3, favor: 3 },
          tags: ["emp_told_partial_ch3", "emp_knows_you_hold_something"],
        },
        next: returnTo,
      },
      {
        id: "emp_ch3_refuse",
        text: "请高福安回禀：案子还没查完，查完再说。",
        outcome:
          "高福安去了，回来说：皇帝说好。\n\n" +
          "就这两个字。\n\n" +
          "你不知道他是在等你，还是在看你的底气。\n" +
          "也许两者都是。",
        effect: {
          emperor: { trust: 2, favor: 4 },
          tags: ["emp_delayed_answer_ch3"],
        },
        next: returnTo,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 第5章：单独召见，他问的不是案子
// ---------------------------------------------------------------------------

export const emperorCh5Skeleton: Scene = {
  id: "emperor_ch5_audience",
  title: "御书房里的问题",
  chapterLabel: "第五日",
  text: "皇帝单独召见你。他问了一个和案子无关的问题。",
  choices: [
    {
      id: "emp_ch5_honest",
      text: "回答那个问题。",
      outcome: "他听完，点了点头。",
      effect: { emperor: { trust: 5 } },
      next: "day5_result",
    },
    {
      id: "emp_ch5_deflect",
      text: "把话题带回案子。",
      outcome: "他接受了这个转移。",
      effect: { emperor: { favor: 3 } },
      next: "day5_result",
    },
  ],
};

export function buildEmperorCh5Scene(
  state: GameState,
  returnTo: string,
): Scene {
  // 他的问题取决于玩家在第3章的选择
  const toldFullTruth = state.tags.includes("emp_told_full_truth_ch3");
  const delayedAnswer = state.tags.includes("emp_delayed_answer_ch3");

  let hisQuestion = "";
  if (toldFullTruth)
    hisQuestion =
      "他问：「上次你说了全部，这次——如果我问你一件你一个人知道的事，你还会说吗？」";
  else if (delayedAnswer)
    hisQuestion =
      "他问：「案子查完了。你说查完了再告诉我。我在等。」\n他的语气不像是催促，像是在陈述一件他一直记着的事。";
  else
    hisQuestion =
      "他没有绕弯子：「温疏雨改案的事，是你替她压着的，还是你不知道？」";

  return {
    id: "emperor_ch5_audience",
    title: "御书房里的问题",
    chapterLabel: "第五日",
    text:
      "御书房里没有其他人。\n\n" +
      "你原本以为他会问案子的进展。他没有。\n\n" +
      `${hisQuestion}`,
    choices: [
      {
        id: "emp_ch5_honest",
        text: "如实回答，包括你替她压着的部分。",
        outcome:
          "他听完，没有立刻说话。\n\n" +
          "然后他说：「你每次都在替别人做决定，有没有哪一次是为自己的？」\n\n" +
          "你不知道这是在评价还是在问。\n" +
          "他也没有等你回答，就让你退下了。\n\n" +
          "那个问题你带出了御书房，在很长时间里都没有找到答案。",
        effect: {
          stats: { 胆识: 1 },
          emperor: { trust: 8, favor: 3 },
          tags: ["emp_ch5_honest", "emp_question_unanswered"],
        },
        next: returnTo,
      },
      {
        id: "emp_ch5_deflect",
        text: "把话带回案子。「案情有新进展，臣想先禀报。」",
        outcome:
          "他接受了这个转移，听完了案情。\n\n" +
          "临走时他说了一句话：「你很擅长不回答问题。」\n\n" +
          "他的语气不是批评，是陈述。\n" +
          "就像他在记录一件你的特征。",
        effect: {
          stats: { 谋略: 1 },
          emperor: { trust: 4, favor: 4 },
          tags: ["emp_ch5_deflected", "emp_notes_your_evasion"],
        },
        next: returnTo,
      },
      {
        id: "emp_ch5_ask_back",
        text: "反问他：「皇上为什么想知道？」",
        outcome:
          "他愣了一下。\n\n" +
          "然后他笑了——不是客套的笑，是真的被问到了。\n\n" +
          "「因为，」他说，「宫里很少有人在我问问题的时候，想知道我为什么要问。」\n\n" +
          "他没有回答你的问题，你也没有回答他的。\n" +
          "你们在御书房里僵持了一会儿，然后他让你退下了。",
        effect: {
          emperor: { trust: 7, favor: 6 },
          tags: ["emp_ch5_asked_back", "emp_mutual_curiosity"],
        },
        next: returnTo,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 第8章：凤印风波后，他只对你说一句话
// ---------------------------------------------------------------------------

export function buildEmperorCh8Scene(
  state: GameState,
  returnTo: string,
): Scene {
  const toldTruthCh7 = state.tags.includes("ch7_told_emperor_truth");
  const mutual = state.tags.includes("ch7_mutual_knowledge");
  const hidHesitation = state.tags.includes("ch7_hid_hesitation");

  let opening = "";
  if (toldTruthCh7 || mutual)
    opening =
      "猎场之后，你们之间有一件只有两个人知道的事。\n\n" +
      "凤印风波结束的那天晚上，他让人把你单独留下来。";
  else if (hidHesitation)
    opening =
      "你在猎场替他撒过谎。他不知道。\n\n" +
      "凤印风波结束的那天晚上，他让人把你单独留下来。";
  else
    opening = "凤印风波结束的那天晚上，他让人把你单独留下来。";

  return {
    id: "emperor_ch8_alone",
    title: "只对你说的那句话",
    chapterLabel: "第八日",
    text:
      opening +
      "\n\n殿里没有其他人。\n\n" +
      "他说：「凤印的事，沈令仪和顾明华都给了我答案。\n" +
      "我想知道你的。\n不是你觉得我想听的那个，是你自己的。」",
    choices: [
      {
        id: "emp_ch8_real_answer",
        text: "说你真正的判断——不管他想不想听。",
        outcome:
          "你说了。\n\n" +
          "他没有立刻回应，只是看着你，像是在决定是否相信你说的是真的，而不是他想听的。\n\n" +
          "然后他说：「好。」\n\n" +
          "就这一个字。\n" +
          "你不知道那是对你的判断的认同，还是对你愿意说出来的认同。\n" +
          "也许对他来说，这两件事是同一件事。",
        effect: {
          stats: { 胆识: 1 },
          emperor: { trust: 10, favor: 4 },
          tags: ["emp_ch8_real_answer", "emp_known_for_truth"],
        },
        next: returnTo,
      },
      {
        id: "emp_ch8_ask_his",
        text: "先问他的判断。「皇上先说。」",
        outcome:
          "他沉默了一会儿。\n\n" +
          "「我不知道。」他说，「这就是为什么我要问你。」\n\n" +
          "他第一次在你面前说了「我不知道」。\n" +
          "你回答了他的问题，他听得很认真。\n\n" +
          "离开之前，他说了一句话：「你让我想起我还可以不知道一些事。」\n" +
          "你一直在想这句话是什么意思。",
        effect: {
          emperor: { trust: 8, favor: 8 },
          tags: ["emp_ch8_mutual", "emp_admits_uncertainty"],
        },
        next: returnTo,
      },
      {
        id: "emp_ch8_deflect_again",
        text: "给他一个他能用的答案，而不是你真正的判断。",
        outcome:
          "你给了他一个合理的、有道理的、无害的答案。\n\n" +
          "他点头，然后说：「谢谢你。」\n\n" +
          "你走出去的时候，觉得他谢的大概不是那个答案。\n" +
          "他谢的是你用心思考过这件事，哪怕最终给的不是真的。\n\n" +
          "这让你有点难受。",
        effect: {
          emperor: { trust: 5, favor: 6 },
          tags: ["emp_ch8_deflected_again", "emp_feels_distance"],
        },
        next: returnTo,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 第10章：权力真空里，他做了一件只因为你才做的事
// ---------------------------------------------------------------------------

export function buildEmperorCh10Scene(
  state: GameState,
  returnTo: string,
): Scene {
  const trust = state.emperor.trust;
  const knownForTruth = state.tags.includes("emp_known_for_truth");
  const mutualKnowledge = state.tags.includes("emp_admits_uncertainty");

  if (trust < 35 && !knownForTruth) {
    // 信任不够——他没有来
    return {
      id: "emperor_ch10_absent",
      title: "他没有来",
      chapterLabel: "第十日",
      text:
        "权力真空的第三天，你等了他一段时间。\n\n" +
        "他没有出现。\n\n" +
        "不是因为他不关心，是因为他还在用「平衡」的方式处理这件事。\n" +
        "他在等看哪边更重。\n" +
        "你不在任何一边，所以他不在你这里。",
      choices: [
        {
          id: "emp_ch10_accept_absent",
          text: "接受这个事实，靠自己处理今天的事。",
          outcome:
            "你自己处理了。\n\n" +
            "他后来知道，让人传话说：「你处理得好。」\n" +
            "这句话你收下了，没有回应。",
          effect: {
            stats: { 胆识: 1, 名望: 1 },
            tags: ["emp_ch10_absent", "emp_handled_alone"],
          },
          next: returnTo,
        },
      ],
    };
  }

  // 信任足够——他出现了，做了一件事
  const whatHeDid = mutualKnowledge
    ? "他公开站出来，说了一件他以前从未当众承认过的事：\n「国库的缺口，朕早就知道了。没有人逼朕说，是朕自己选择说。」"
    : "他让人给你送来一道只有你名字的手书——不是圣旨，是他自己写的，" +
      "上面只有一句话：\n「今日之事，由朕来说，不必你独担。」";

  return {
    id: "emperor_ch10_moment",
    title: "他做的那一件事",
    chapterLabel: "第十日",
    text:
      "权力真空的第三天，你正在处理一件以为只能自己扛的事。\n\n" +
      `然后他出现了。\n\n${whatHeDid}`,
    choices: [
      {
        id: "emp_ch10_accept",
        text: "让他来。接受这件事，不试图保护他免于后果。",
        outcome:
          "他说了，或者送来了那句话。\n\n" +
          "你让他来了。\n\n" +
          "后来有人问你，你是怎么让皇帝表态的。\n" +
          "你说：我没有让他做任何事，他自己决定的。\n\n" +
          "这是真话。这也是你第一次觉得他不只是一个你需要管理的变量。",
        effect: {
          emperor: { trust: 8, favor: 6 },
          stats: { 名望: 1 },
          tags: ["emp_ch10_accepts_help", "emp_not_just_a_variable"],
        },
        next: returnTo,
      },
      {
        id: "emp_ch10_protect",
        text: "阻止他。这件事如果他开口，对他的风险比对你更大。",
        outcome:
          "你说：「皇上不必开口，臣来处理。」\n\n" +
          "他看了你很久。\n\n" +
          "「你总是这样，」他说，「总是在替别人考虑后果。」\n\n" +
          "你没有解释。他也没有坚持。\n" +
          "他退开了，你独自处理了今天的事。\n\n" +
          "他事后没有再提，但你知道他记着这件事。",
        effect: {
          emperor: { trust: 10, favor: 4 },
          tags: ["emp_ch10_protected_him", "emp_knows_you_protect"],
        },
        next: returnTo,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 挂接
// ---------------------------------------------------------------------------

export const emperorSceneTargets: Record<string, string> = {};

export function applyEmperorStoryline(laterScenes: Record<string, Scene>) {
  // 静态骨架
  laterScenes.emperor_ch3_message = emperorCh3Skeleton;
  laterScenes.emperor_ch5_audience = emperorCh5Skeleton;
  laterScenes.emperor_ch8_alone = {
    id: "emperor_ch8_alone",
    title: "只对你说的那句话",
    chapterLabel: "第八日",
    text: "凤印风波结束的那天晚上，他让人把你单独留下来。",
    choices: [
      {
        id: "emp_ch8_real_answer",
        text: "说你真正的判断。",
        outcome: "他说：好。",
        effect: { emperor: { trust: 10 }, tags: ["emp_ch8_real_answer"] },
        next: "day8_result",
      },
      {
        id: "emp_ch8_ask_his",
        text: "先问他。",
        outcome: "他说他不知道。",
        effect: { emperor: { trust: 8, favor: 8 }, tags: ["emp_ch8_mutual"] },
        next: "day8_result",
      },
      {
        id: "emp_ch8_deflect_again",
        text: "给他一个能用的答案。",
        outcome: "他谢谢你，你有点难受。",
        effect: { emperor: { trust: 5, favor: 6 }, tags: ["emp_ch8_deflected_again"] },
        next: "day8_result",
      },
    ],
  };
  laterScenes.emperor_ch10_moment = {
    id: "emperor_ch10_moment",
    title: "他做的那一件事",
    chapterLabel: "第十日",
    text: "权力真空的第三天，他出现了。",
    choices: [
      {
        id: "emp_ch10_accept",
        text: "让他来。",
        outcome: "你第一次觉得他不只是变量。",
        effect: { emperor: { trust: 8, favor: 6 }, tags: ["emp_ch10_accepts_help"] },
        next: "day10_1",
      },
      {
        id: "emp_ch10_protect",
        text: "阻止他。",
        outcome: "他退开了，你独自处理了今天的事。",
        effect: { emperor: { trust: 10 }, tags: ["emp_ch10_protected_him"] },
        next: "day10_1",
      },
    ],
  };

  // 第3章末尾追加（宠爱>=8时出现）
  // 挂在 day3_vigil 的选项后面
  const day3_vigil = laterScenes.day3_vigil;
  if (day3_vigil) {
    const back = "day3_result";
    emperorSceneTargets["emperor_ch3_message"] = back;
    day3_vigil.choices.push({
      id: "day3_emperor_message",
      text: "天黑前，高福安来传话：皇帝有问。",
      outcome: "他在问案子，也在问你。",
      effect: {},
      next: "emperor_ch3_message",
      requiresEmperor: { favor: 8 },
    });
  }

  // 第5章末尾追加（信任>=15时出现）
  const day5_lin = laterScenes.day5_lin_names;
  if (day5_lin) {
    const back = "day5_result";
    emperorSceneTargets["emperor_ch5_audience"] = back;
    day5_lin.choices.push({
      id: "day5_emperor_summon",
      text: "回寝宫前，宫人来报：皇帝召见，御书房，只你一人。",
      outcome: "你去了。",
      effect: {},
      next: "emperor_ch5_audience",
      requiresEmperor: { trust: 15 },
    });
  }

  // 第8章：在 day8_3 之后追加（信任>=25 或 ch7_told_emperor_truth）
  const day8_3 = laterScenes.day8_3;
  if (day8_3) {
    const back = "day8_result";
    emperorSceneTargets["emperor_ch8_alone"] = back;
    day8_3.choices.push({
      id: "day8_emperor_alone",
      text: "议事结束，宫人说：皇帝单独留你。",
      outcome: "殿里没有其他人了。",
      effect: {},
      next: "emperor_ch8_alone",
      requiresAnyTag: [
        "ch7_told_emperor_truth",
        "ch7_mutual_knowledge",
        "emp_ch5_honest",
        "emp_ch5_asked_back",
      ],
    });
  }

  // 第10章：在 day10_1 之前追加（信任>=35时出现）
  const day10_1 = laterScenes.day10_1;
  if (day10_1) {
    const back = "day10_2";
    emperorSceneTargets["emperor_ch10_moment"] = back;
    day10_1.choices.push({
      id: "day10_emperor_appears",
      text: "他来了。",
      outcome: "你没有想到他会在这个时候出现。",
      effect: {},
      next: "emperor_ch10_moment",
      requiresEmperor: { trust: 35 },
    });
  }
}
