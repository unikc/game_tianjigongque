import type { Choice, Scene, StatKey } from "../types";
import {
  applyChapter5Patch,
  applyWenShuyuThread,
} from "./later-scenes-ch5-patch";
import { applyUnreliableInfoPatch } from "./later-scenes-truth-patch";
import {
  applyChapter6Patch,
  applyDownstreamHooks,
} from "./later-scenes-ch6-patch";
import { xieReviewBaseChoices } from "../state/xie-mingwei";
import { applyTianjiTrades, applyTianjiLedger } from "./tianji-scenes";
import { applyTianjiPayoff } from "./tianji-payoff-patch";

type SeedChoice = [text: string, outcome: string, tag: string];
type Beat = [title: string, text: string, choices: SeedChoice[]];
type ChapterSeed = {
  number: number;
  title: string;
  growth: [
    stat: StatKey,
    min: number,
    text: string,
    outcome: string,
    tag: string,
  ];
  beats: Beat[];
};

const approaches: StatKey[] = ["谋略", "人情", "胆识"];

const chapters: ChapterSeed[] = [
  {
    number: 5,
    title: "未落之子",
    growth: [
      "才学",
      4,
      "【修习·才学四】按月份重排全部脉案。",
      "你证明所谓三月身孕在第一份脉案落笔前就已被编好，惠嫔不必独自承担骗局。",
      "ch5_growth_breakthrough",
    ],
    beats: [
      [
        "赏花惊变",
        "赏花宴上，惠嫔腹痛倒地。宫人喊着皇嗣不保，温疏雨却在脉案边写下：从未有孕。",
        [
          [
            "封住消息，先救惠嫔。",
            "你让帘外的哭喊停下，保住她说出真相的机会，也让假孕流言先一步发酵。",
            "ch5_save_hui",
          ],
          [
            "当众核对脉案与用药。",
            "矛盾被摆上桌面。惠嫔家族无法再用一声哭遮住三个月的假脉案。",
            "ch5_public_record",
          ],
          [
            "扣住送药宫人，追问药从何来。",
            "药来自宗室女眷，温疏雨的改案却仍需要解释。",
            "ch5_trace_drug",
          ],
        ],
      ],
      [
        "被扣住的妹妹",
        "惠嫔承认配合假孕。她的家族用妹妹作人质，又借“皇嗣”拿到了赈灾差事。",
        [
          [
            "用脉案交换妹妹平安入宫。",
            "人质获救，假孕真相暂时仍是你的筹码。",
            "ch5_sister_saved",
          ],
          [
            "公开假孕，切断家族的赈灾差事。",
            "差事被收回，惠嫔也失去了最后一层保护。",
            "ch5_truth_public",
          ],
          [
            "让谎言延续，逼家族补回赈银。",
            "一批银子回到账上，你却成为维护假皇嗣的人。",
            "ch5_lie_continues",
          ],
        ],
      ],
      [
        "脉案落款",
        "太后要一个能平息宫议的名字：惠嫔、温疏雨，或那个送药的宗室女眷。",
        [
          [
            "安排惠嫔“平安退养”，让她活着离宫。",
            "宫中得到一个体面解释，惠嫔与妹妹在天亮前离开。",
            "ch5_hui_retires",
          ],
          [
            "保护温疏雨，公开宗室女眷的药单。",
            "太医院保住证人，宗室却把你视为必须拔掉的刺。",
            "ch5_wen_protected",
          ],
          [
            "拒绝交人，呈上赈灾名单。",
            "你把后宫丑闻变成朝廷亏空，所有阵营都被迫重新下注。",
            "ch5_relief_list",
          ],
        ],
      ],
    ],
  },
  {
    number: 6,
    title: "河决千里",
    growth: [
      "谋略",
      4,
      "【修习·谋略四】把赈银、票号与军粮三账交叉核验。",
      "三个看似无关的缺口拼成同一条转银路径，你不必在救灾和追账之间完全二选一。",
      "ch6_growth_breakthrough",
    ],
    beats: [
      [
        "三成空账",
        "河道决口，赈银少了三成，数目恰与空印军粮账吻合。宫墙外的灾民等不起一场完整审讯。",
        [
          [
            "先拨宫库补缺，暂不惊动主谋。",
            "第一批粮船按时出发，宫库却留下无法公开的缺口。",
            "ch6_aid_first",
          ],
          [
            "冻结涉案银号，逐笔追账。",
            "赃银被扣，合法物资也一起停在码头。",
            "ch6_freeze_funds",
          ],
          [
            "公开亏空，迫使百官当场认捐。",
            "粮款迅速凑齐，朝局也因这份公开羞辱剧烈震荡。",
            "ch6_public_accounts",
          ],
        ],
      ],
      [
        "（占位，不会展示）",
        "（占位，不会展示）",
        [
          ["（占位）", "（占位）", "ch6_placeholder_1"],
          ["（占位）", "（占位）", "ch6_placeholder_2"],
          ["（占位）", "（占位）", "ch6_placeholder_3"],
        ],
      ],
      [
        "谁承担延误",
        "回宫后，顾明华要用证据换位置，沈令仪要先保住赈运。两者都说百姓等不起。",
        [
          [
            "把证据交给皇后，换她立即开仓。",
            "赈运恢复，皇后也获得了决定何时公开真相的权力。",
            "ch6_queen_aid",
          ],
          [
            "与顾明华扣住证据，逼出全部赃银。",
            "更多银子回流，第一批受冻的人却等不到胜利。",
            "ch6_gu_leverage",
          ],
          [
            "复制账目分交两方，自己保留原册。",
            "没有人得到完整控制，你则成为双方共同提防的账册持有人。",
            "ch6_split_ledger",
          ],
        ],
      ],
    ],
  },
  {
    number: 7,
    title: "春猎惊弦",
    growth: [
      "胆识",
      4,
      "【修习·胆识四】当场接管围场号令。",
      "你没有追一支箭，而是先封住所有出口；皇帝与证人同时得到撤离机会。",
      "ch7_growth_breakthrough",
    ],
    beats: [
      [
        "箭离弦",
        "春猎场上，一支羽林制式箭越过围障，直取皇帝。裴照南扑向箭路，旧案留下的证词则指向递弓之人。",
        [
          [
            "推开皇帝，自己挡在箭路上。",
            "箭擦过你的肩，皇帝无伤，递弓人消失在人群里。",
            "ch7_emperor_safe",
          ],
          [
            "先护住掌握递弓名册的证人。",
            "证词保住了，皇帝却中箭重伤。朝廷在你作出解释前便开始争夺监国权。",
            "ch7_emperor_wounded",
          ],
          [
            "追击刺客，夺下他手里的调令。",
            "你拿到空印格式的调令；身后传来皇帝倒地的惊呼。",
            "ch7_order_captured",
          ],
        ],
      ],
      [
        "羽林库存",
        "箭簇来自羽林库存，领用册写着裴照南兄长的名字。她要亲自审问守库人。",
        [
          [
            "让裴照南主审，但全程留官记录。",
            "她问出了冒领暗号，也被迫听见兄长确曾签过另一册军粮。",
            "ch7_pei_truth",
          ],
          [
            "撤下裴照南，交皇后审理。",
            "审讯保持名义上的公正，裴照南却失去指挥羽林的资格。",
            "ch7_pei_removed",
          ],
          [
            "秘密放走守库人，跟踪他的上家。",
            "线人把你带向宗室别院，也让刺杀案少了一个能公开作证的人。",
            "ch7_follow_network",
          ],
        ],
      ],
      [
        "猎场余波",
        "猎场消息彼此矛盾：有人称皇帝无伤，有人称他已不能视朝。边军则在等一道真假难辨的圣旨。",
        [
          [
            "公开猎场实情，依法设临时议政。",
            "争权被搬到明面，京城暂稳，皇权的虚弱也再无法遮掩。",
            "ch7_legal_council",
          ],
          [
            "隐瞒伤势，由你代传三日口谕。",
            "命令得以延续，你也第一次尝到没有名位的御权。",
            "ch7_shadow_orders",
          ],
          [
            "让皇后与羽林分别掌印、掌门。",
            "权力被拆开，暂时无人能独自发动政变，也无人真正信任另一方。",
            "ch7_split_power",
          ],
        ],
      ],
    ],
  },
  {
    number: 8,
    title: "凤印两面",
    growth: [
      "礼仪",
      5,
      "【修习·礼仪五】援引旧制，提出凤印共签。",
      "你从礼制里找到限制礼制的先例，两宫都无法把共签斥为僭越。",
      "ch8_growth_breakthrough",
    ],
    beats: [
      [
        "皇后的三年",
        "沈令仪承认三年前就发现空印案，并放走一名主犯，换取宗室军队不入京。",
        [
          [
            "要求她交出完整账册，再谈理由。",
            "她给你看了被删去的名字，却没有立即交出原册。",
            "ch8_demand_ledger",
          ],
          [
            "接受她当年的选择，共同阻止政变。",
            "皇后第一次把凤印推到你面前，也让你共同承担她掩盖的死亡。",
            "ch8_side_queen",
          ],
          [
            "召旧案幸存者与宗卷，当面对质被牺牲的人名。",
            "抽象的多数变成一个个具体名字，皇后沉默了很久。",
            "ch8_names_heard",
          ],
        ],
      ],
      [
        "明华发难",
        "顾明华公开半份证据，要求皇后交权。她把另一半放在你手边：“选谁决定它是否完整。”",
        [
          [
            "补全证据，支持废后。",
            "凤位开始动摇，顾明华则接近了她一直想要的位置。",
            "ch8_side_gu",
          ],
          [
            "压下后半份，逼双方接受共同核查。",
            "两宫都失去速胜机会，也都把你列为关键变量。",
            "ch8_mediate",
          ],
          [
            "复制证据，公开给女官与朝臣。",
            "秘密不再属于任何一个宫殿，秩序也失去了控制真相的能力。",
            "ch8_truth_public",
          ],
        ],
      ],
      [
        "凤印归处",
        "皇后愿退居、共治或继续执掌；顾明华则要你在今夜给出阵营答案。",
        [
          [
            "与沈令仪共治，限制凤印使用。",
            "皇后留任，你获得查验每道内廷命令的权力。",
            "ch8_dual_rule",
          ],
          [
            "支持顾明华接管内廷。",
            "长春宫的人连夜进入尚宫局，旧秩序倒下，新秩序已经开始记账。",
            "ch8_gu_ascends",
          ],
          [
            "谁也不选，建立女官联合议事。",
            "你拒绝让一枚凤印继续代表所有人，代价是每道命令都变得更慢。",
            "ch8_council",
          ],
        ],
      ],
    ],
  },
];

const later: ChapterSeed[] = [
  {
    number: 9,
    title: "十二宫火",
    growth: [
      "人情",
      5,
      "【修习·人情五】调用你长期保护的宫人网络。",
      "不需你命令，宫人已分头救出证人、高福安与鼠册；过去积累的人情第一次成为集体力量。",
      "ch9_growth_breakthrough",
    ],
    beats: [
      [
        "库房起火",
        "保存副册的十二宫库房同时起火。高福安、账册、御印与纵火者分在四个方向。",
        [
          [
            "先救被困的高福安。",
            "他活着出来，御印与半库账页却被火吞没。",
            "ch9_gao_alive",
          ],
          [
            "抢救总账与御印。",
            "证据被救出，高福安的呼救声在梁木倒塌后停止。",
            "ch9_evidence_saved",
          ],
          [
            "追纵火者，不让火成为结案。",
            "你抓到一名宗室死士，身后的库房与人一起燃烧。",
            "ch9_arsonist_caught",
          ],
        ],
      ],
      [
        "冷宫开门",
        "火势蔓延到冷宫。那里关着三名早被宣布病亡的旧案证人，门锁钥匙却在火场另一侧。",
        [
          [
            "砸门救人，放弃附近账页。",
            "三名被历史抹去的人重新走到天光下。",
            "ch9_witnesses_saved",
          ],
          [
            "先取牌位后的鼠册，再回来开门。",
            "鼠册到手时，冷宫只剩一个活口。",
            "ch9_mouse_ledger",
          ],
          [
            "命宫人分头救援，许诺事后不追擅离之罪。",
            "过去受过你保护的宫人冲进烟里；你曾牺牲过的人则没有回应。",
            "ch9_staff_mobilized",
          ],
        ],
      ],
      [
        "灰烬点名",
        "天亮后必须决定先公布死者、账目还是纵火者身份。每一项都会让另外两项面临灭口。",
        [
          [
            "先公布全部死者姓名。",
            "死者不再能被悄悄删除，账册持有人却开始逃亡。",
            "ch9_names_public",
          ],
          [
            "先封锁证据，保护幸存证人。",
            "真相暂时沉默，活人获得转移时间。",
            "ch9_protect_survivors",
          ],
          [
            "公开纵火者背后的宗室。",
            "京城哗然，宗室军队提前开始集结。",
            "ch9_royal_exposed",
          ],
        ],
      ],
    ],
  },
  {
    number: 10,
    title: "金殿无主",
    growth: [
      "名望",
      6,
      "【修习·名望六】召集百官公开见证三权分配。",
      "你的名字足以让争权者坐下听完规则，粮、门、印在众目下完成交接。",
      "ch10_growth_breakthrough",
    ],
    beats: [
      [
        "一夜三权",
        "皇帝久未亲自视朝，边军逼近。粮、门、印三件权力必须在天亮前分配，不能安全地交给同一人。",
        [
          [
            "皇后掌印，裴照南掌门，你掌粮。",
            "三方互相制衡，也互相怀疑每一次迟到的命令。",
            "ch10_balanced_regency",
          ],
          [
            "顾明华掌门，你掌印，女官议事掌粮。",
            "旧品级被打乱，长春宫与女官第一次共同签下一道军令。",
            "ch10_gu_compact",
          ],
          [
            "把三权拆给公开议政会。",
            "决定变慢，却没有任何人能在夜里独自改写国家。",
            "ch10_public_council",
          ],
        ],
      ],
      [
        "假口谕",
        "太后带来一道皇帝口谕，所附赏珠色泽冷白，与第三章仿盒上的珠粉相同。",
        [
          [
            "用御赐东珠揭穿假口谕。",
            "真假珠光再次成为证人，太后母族的使者当殿变色。",
            "ch10_pearl_proof",
          ],
          [
            "暂认口谕，顺着传令者追上家。",
            "假命令进入流程，你也获得靠近幕后人的通道。",
            "ch10_follow_false_order",
          ],
          [
            "不争真假，只要求皇帝本人或医官作证。",
            "程序挡住口谕，温疏雨成为全殿最危险的证人。",
            "ch10_medical_witness",
          ],
        ],
      ],
      [
        "谁来签字",
        "边军只认一份能调粮开门的正式命令。签字者将成为事实上的摄政者。",
        [
          [
            "由自己签字并承担摄政责任。",
            "宫门没有失守，你也再不能退回无权旁观的位置。",
            "ch10_player_regent",
          ],
          [
            "请沈令仪与顾明华共同签署。",
            "两枚印并列落下，合作与背叛从同一张纸开始。",
            "ch10_dual_signature",
          ],
          [
            "拒绝宫中私签，召朝臣公开联署。",
            "命令晚了半个时辰，却第一次不只来自宫墙之内。",
            "ch10_public_signature",
          ],
        ],
      ],
    ],
  },
  {
    number: 11,
    title: "宫门血诏",
    growth: [
      "谋略",
      7,
      "【修习·谋略七】同时公布真假诏书的纸、印、粮三条证据。",
      "三条证据互相验证，政变军无法再用一句“伪造”推翻全部真相。",
      "ch11_growth_breakthrough",
    ],
    beats: [
      [
        "伪诏叩门",
        "政变军持诏抵达最后一道宫门。裴照南守门，顾明华与沈令仪却互相要求你先交出对方。",
        [
          [
            "公开军粮账，瓦解领饷军士。",
            "阵前开始有人放下兵刃，也有人因家人仍在宗室手中继续向前。",
            "ch11_broadcast_ledger",
          ],
          [
            "用空印反制，伪造撤军令。",
            "前军短暂后撤，你曾经追查的手段如今由你熟练使用。",
            "ch11_counterfeit_retreat",
          ],
          [
            "打开外门，让朝臣与百姓见证诏书。",
            "政变失去秘密进行的条件，宫门也失去最后一道物理保护。",
            "ch11_open_gate",
          ],
        ],
      ],
      [
        "交出一个人",
        "顾明华要处决沈令仪；沈令仪则要求以顾明华首级换停战。两人都称这是最少的牺牲。",
        [
          [
            "拒绝交人，拿自己作谈判人质。",
            "你走出宫门，给双方一炷香的停火，也把性命放到不受控制的人手里。",
            "ch11_self_hostage",
          ],
          [
            "秘密拘押两人，对外宣称已经处决。",
            "两颗假首级换来停火，真相一旦泄露便会同时失去所有信用。",
            "ch11_false_execution",
          ],
          [
            "交由公开审讯，不接受战场处决。",
            "程序无法立刻满足军队，宫门战因此多持续了一刻。",
            "ch11_public_trial",
          ],
        ],
      ],
      [
        "最后一道门",
        "宫门即将被破。你积累的人证、宫人支持与公开账目只能支撑一种最终方案。",
        [
          [
            "承诺赦免普通军士，只追伪诏主谋。",
            "多数军士倒戈，主谋在混乱中被捕，清算范围被你亲手划定。",
            "ch11_narrow_justice",
          ],
          [
            "命裴照南反击，彻底清除政变军。",
            "宫门守住，石阶上的血也让胜利失去任何庆典颜色。",
            "ch11_battle_won",
          ],
          [
            "交出全部证据换取无血退兵。",
            "军队退去，空印案真相则落入新的权力集团手中。",
            "ch11_truth_traded",
          ],
        ],
      ],
    ],
  },
  {
    number: 12,
    title: "天明以后",
    growth: [
      "礼仪",
      8,
      "【修习·礼仪八】把女官复核写进新宫规。",
      "你的改革不再依赖一位永远英明的皇后；下一名新人也拥有可执行的申诉路径。",
      "ch12_growth_breakthrough",
    ],
    beats: [
      [
        "真相的份量",
        "政变结束，空印案可以全部公开、部分公开或永久封存。每个名字都对应一个仍活着的家族。",
        [
          [
            "公开全部姓名与账目。",
            "朝局震荡，受害者终于不再只是失踪的数字。",
            "ch12_full_truth",
          ],
          [
            "只公开制度与主谋，保护被胁迫者。",
            "改革获得空间，一部分具体责任也被留在阴影里。",
            "ch12_partial_truth",
          ],
          [
            "封存原册，以秘密网络维持稳定。",
            "天下迅速恢复秩序，你成为唯一知道秩序地基的人。",
            "ch12_truth_sealed",
          ],
        ],
      ],
      [
        "位置如何分配",
        "凤印、军门、女官议事与宫外商路都等待新的主人。你可以接受最高位置，也可以改变位置本身。",
        [
          [
            "登上凤座，以公开权力改革内廷。",
            "你获得改写制度的权力，也继承所有无法立刻兑现的承诺。",
            "ch12_phoenix",
          ],
          [
            "建立女官议事与公开审计。",
            "权力不再只属于一枚印，改变却需要忍受缓慢与争执。",
            "ch12_reform",
          ],
          [
            "交出宫权，带着证据与人脉离宫。",
            "宫门在身后合拢，你第一次可以决定明日去往哪里。",
            "ch12_freedom",
          ],
        ],
      ],
      [
        "多年后一页名册",
        "多年后，一名无位新人在名册上被人悄悄划去。她没有靠山，只有一个尚未被任何人记住的名字。",
        [
          [
            "亲自恢复她的名字，并追查删名者。",
            "最高处仍需要你亲自纠正一笔，凤座的改革尚未完成。",
            "ending_phoenix_throne",
          ],
          [
            "让新制度自动留下异议与复核记录。",
            "不必有人认识她，规则本身替她保住了位置。",
            "ending_jade_reform",
          ],
          [
            "把这件事写入公开宫史，随后离开。",
            "名字传出宫门。你没有留下封号，却留下别人无法再轻易抹去的纸。",
            "ending_palace_history",
          ],
        ],
      ],
    ],
  },
];

function createChapterScenes(chapter: ChapterSeed): Record<string, Scene> {
  return Object.fromEntries(
    chapter.beats.map(([title, text, choices], beatIndex) => {
      const id = `day${chapter.number}_${beatIndex + 1}`;
      const next =
        beatIndex === chapter.beats.length - 1
          ? `day${chapter.number}_result`
          : `day${chapter.number}_${beatIndex + 2}`;
      const sceneChoices: Choice[] = choices.map(
        ([choiceText, outcome, tag], index) => ({
          id: `${id}_${index + 1}`,
          text: choiceText,
          outcome,
          effect: { stats: { [approaches[index]]: 1 }, tags: [tag] },
          next,
        }),
      );
      if (beatIndex === 0) {
        const [stat, min, choiceText, outcome, tag] = chapter.growth;
        sceneChoices.push({
          id: `${id}_growth`,
          text: choiceText,
          outcome,
          effect: { stats: { 名望: 1 }, tags: [tag] },
          next,
          requiresStat: { stat, min },
        });
      }
      return [
        id,
        {
          id,
          title,
          chapterLabel: `第${chapter.number}日`,
          progress: { current: beatIndex + 1, total: chapter.beats.length },
          text,
          choices: sceneChoices,
        } satisfies Scene,
      ];
    }),
  );
}

export const laterScenes: Record<string, Scene> = Object.assign(
  {},
  ...[...chapters, ...later].map(createChapterScenes),
);
applyChapter5Patch(laterScenes);
applyChapter6Patch(laterScenes);
applyTianjiTrades(laterScenes);
applyTianjiPayoff(laterScenes);
applyTianjiLedger(laterScenes);

laterScenes.day10_legitimacy_veto = {
  id: "day10_legitimacy_veto",
  title: "名分之问",
  chapterLabel: "第10日",
  progress: { current: 3, total: 3 },
  speaker: "太后 · 崔氏",
  portrait: "dowager",
  text: "你证明了这道口谕不能用，却还没有说明为何该由你落笔。太后隔帘问：明日百官问起，凭哪一条旧例、哪几个人的名字，说这是摄政，不是夺权？你仍可换一种署名，让命令在天亮前生效。",
  choices: [
    {
      id: "day10_veto_dual",
      text: "退半步，请沈令仪与顾明华共同签署。",
      outcome: "你放弃独署，两宫以彼此牵制换来一道能被承认的命令。",
      effect: {
        relations: { 崔氏: 1 },
        tags: [
          "ch10_dual_signature",
          "legitimacy:regency:claim-withdrawn",
          "cui_accepts_shared_signature",
        ],
      },
      next: "day10_result",
    },
    {
      id: "day10_veto_public",
      text: "请朝臣入殿，改为公开联署。",
      outcome:
        "你把速度让给程序，命令因此晚了半刻，却不再只靠宫墙内的口头承诺。",
      effect: {
        relations: { 崔氏: -1 },
        tags: [
          "ch10_public_signature",
          "legitimacy:regency:claim-withdrawn",
          "cui_accepts_public_signature",
        ],
      },
      next: "day10_result",
    },
    {
      id: "day10_veto_limited",
      text: "援引旧例，只署‘帝驾回宫前代行复核’。",
      outcome:
        "你把摄政写成有期限的职责，而不是无边界的位置。太后准两宫将期限一并落印，旧例替你守住了落笔的资格。",
      effect: {
        relations: { 崔氏: 2 },
        tags: [
          "ch10_player_regent",
          "legitimacy:regency:limited",
          "cui_accepts_limited_regency",
        ],
      },
      next: "day10_result",
      requiresTag: "ch8_growth_breakthrough",
    },
  ],
};

function laterChoice(id: string) {
  const found = Object.values(laterScenes)
    .flatMap((scene) => scene.choices)
    .find((choice) => choice.id === id);
  if (!found) throw new Error(`Missing later-scene choice: ${id}`);
  return found;
}

// Chapters 7–9 form the first delayed-consequence showcase: intimacy and
// political trust diverge, alliances alter access, and saving evidence can
// permanently cost a life.
Object.assign(laterChoice("day7_1_1").effect, {
  emperor: { favor: 8, trust: -2 },
  tags: ["ch7_emperor_safe", "ch7_player_wounded"],
});
Object.assign(laterChoice("day7_1_2").effect, {
  emperor: { favor: -3, trust: 7 },
  tags: ["ch7_emperor_wounded", "ch7_witness_saved"],
});
Object.assign(laterChoice("day7_1_3").effect, {
  emperor: { favor: -6, trust: 3 },
  tags: ["ch7_emperor_wounded", "ch7_order_captured", "ch7_witness_lost"],
});
Object.assign(laterChoice("day7_1_growth").effect, {
  emperor: { trust: 5 },
  tags: ["ch7_growth_breakthrough", "ch7_command_overreach"],
});

Object.assign(laterChoice("day8_1_1").effect, {
  relations: { 沈令仪: -1 },
  emperor: { trust: 2 },
  tags: ["ch8_demand_ledger"],
});
Object.assign(laterChoice("day8_1_2").effect, {
  relations: { 沈令仪: 2, 顾明华: -1 },
  tags: ["ch8_side_queen", "ch8_shares_queen_guilt"],
});
Object.assign(laterChoice("day8_1_3").effect, {
  relations: { 沈令仪: -1 },
  tags: ["ch8_names_heard", "ch8_truth_public"],
});
laterScenes.day8_1.choices.push(
  {
    id: "day8_wounded_council",
    text: "【猎场余波】请温疏雨公开伤情，再议凤印归属。",
    outcome:
      "御前空席不再能被各宫各自解释。皇帝失去片刻体面，你却替所有人保住了同一份事实。",
    effect: {
      stats: { 名望: 1 },
      emperor: { favor: -2, trust: 6 },
      tags: ["ch8_health_disclosed"],
    },
    next: "day8_2",
    requiresTag: "ch7_emperor_wounded",
  },
  {
    id: "day8_safe_testimony",
    text: "【救驾余波】请皇帝隔帘听完全部人名，不替任何一宫表态。",
    outcome: "他第一次把沉默用来逼迫权力自证，而不是替各方维持表面平衡。",
    effect: {
      emperor: { favor: 3, trust: 4 },
      tags: ["ch8_emperor_heard_names"],
    },
    next: "day8_2",
    requiresTag: "ch7_emperor_safe",
  },
);

Object.assign(laterChoice("day9_1_1").effect, {
  relations: { 高福安: 2 },
  tags: ["ch9_gao_alive", "ch9_evidence_lost"],
});
Object.assign(laterChoice("day9_1_2").effect, {
  relations: { 高福安: -3 },
  tags: ["ch9_gao_dead", "ch9_evidence_saved"],
});
Object.assign(laterChoice("day9_1_3").effect, {
  relations: { 高福安: -3 },
  tags: ["ch9_gao_dead", "ch9_arsonist_caught", "ch9_evidence_lost"],
});
Object.assign(laterChoice("day9_2_3"), {
  requiresStat: { stat: "人情", min: 5 },
  outcome:
    "宫人分路救出高福安与两名证人，但所有人都看见这张关系网；鼠册在混乱中只保住半页。",
});
Object.assign(laterChoice("day9_2_3").effect, {
  tags: [
    "ch9_staff_mobilized",
    "ch9_staff_exposed",
    "ch9_mouse_ledger_partial",
  ],
});

// 独自署名先提出主张，再由政治合法性模型判断是否能被承认。
// 主张本身绝不能反过来成为自己的依据。
Object.assign(laterChoice("day10_3_1").effect, {
  tags: ["ch10_player_regent_claim"],
});
laterChoice("day10_3_1").outcome =
  "你提笔写下第一个字，帘后却先问：这份权力从何而来？纸上的命令仍待承认。";

laterScenes.day10_2.speaker = "太后 · 崔氏";
laterScenes.day10_2.portrait = "dowager";
laterScenes.day10_2.text =
  "太后带来一道声称出自皇帝的口谕，所附赏珠色泽冷白，与第三章仿盒上的珠粉相同。她先道：‘这口谕由崔氏门下递入。哀家不替它作真，只替它走到该受核验的地方。’";
laterChoice("day10_2_1").outcome +=
  " 太后命使者退到阶下，只道：‘此令不可用。下一道由谁来签？’";
laterChoice("day10_2_2").outcome +=
  " 太后准你追查，却命人把‘暂认至天明’一并写入记录：‘暂认二字，也要有人担。’";
laterChoice("day10_2_3").outcome +=
  " 太后承认御前无人亲署，又道：‘医官能证明无人落笔，不能替你决定谁来代笔。’";

laterScenes.day11_1.choices.push({
  id: "day11_limited_regency_order",
  text: "【限期摄政】逐队核验两宫签押，命守军只认期限内的复核令。",
  outcome:
    "太后命人把期限贴在宫门内外同一高度。内军的命令链稳住了，逐队核验却耽搁了时辰，外门撞击声已经近了一层。",
  effect: {
    stats: { 礼仪: 1, 体力: -1 },
    relations: { 崔氏: 1 },
    tags: ["ch11_limited_regency_honored"],
  },
  next: "day11_2",
  requiresTag: "legitimacy:regency:limited",
});
laterChoice("day9_3_2").requiresAnyTag = [
  "ch9_witnesses_saved",
  "ch9_mouse_ledger",
  "ch9_staff_mobilized",
];
laterChoice("day9_3_3").requiresTag = "ch9_arsonist_caught";

// Evidence that has been gifted or discarded can no longer solve later scenes.
laterScenes.day10_2.choices[0].requiresRewardId = "item-imperial-pearl";
laterScenes.day11_1.choices[1].requiresRewardId = "item-empty-seal";

applyDownstreamHooks(laterScenes);
applyWenShuyuThread(laterScenes);
applyUnreliableInfoPatch(laterScenes);

laterChoice("day6_1_3").outcome +=
  " 谢明微在认捐簿末添了一栏：承诺之人、入账之日、尚欠之数。";
laterChoice("day6_3_1").outcome +=
  " 开仓令送进司籍复核时，她只收了有皇后落款的那一页。";

laterScenes.day8_xie_review = {
  id: "day8_xie_review",
  title: "三份不同的原本",
  chapterLabel: "第8日",
  progress: { current: 3, total: 4 },
  speaker: "司籍女史 · 谢明微",
  portrait: "xie",
  text: "三份记录被摊在案上。谢明微不问你信谁，只问哪一页先到。",
  choices: xieReviewBaseChoices,
};
laterScenes.day8_2.choices.forEach((choice) => {
  choice.next = "day8_xie_review";
});
laterScenes.day8_1.progress = { current: 1, total: 4 };
laterScenes.day8_2.progress = { current: 2, total: 4 };
laterScenes.day8_3.progress = { current: 4, total: 4 };

laterScenes.day10_2.text +=
  "\n\n谢明微指出口谕的传递链断在宫门内递手处，随即退开半步：‘臣能退回这一张，不能替下一张命令找来服从。’";

// E07: the fire reveals a process leak, not a randomly selected villain.
// Keep the investigation inside chapter nine and preserve every old route.
laterScenes.day9_leak_canaries = {
  id: "day9_leak_canaries",
  title: "三札分路",
  chapterLabel: "第9日",
  progress: { current: 2, total: 5 },
  speaker: "司籍女史 · 谢明微",
  portrait: "xie",
  text: "火点追着副册挪过的位置走。谢明微写下三句互不相容的话：‘三句里只有一处会漏，倒比三句都真省纸。’你必须决定把人手放在哪一段。",
  choices: [
    {
      id: "day9_leak_watch_route",
      text: "跟住路牌：派可信宫人盯御药院偏门。",
      outcome:
        "你先取得旧路牌时刻簿，再少留一人救火，把轿牌、口令与经过时辰逐一记下。",
      effect: {
        stats: { 体力: -1 },
        tags: ["leak:canaries-released", "leak:observed:courier-route"],
      },
      next: "day9_leak_return",
    },
    {
      id: "day9_leak_audit_review",
      text: "核对退回笺：与谢明微逐时查青线封签。",
      outcome:
        "你取得退回笺离桌记录。谢明微只证明哪张纸离开过桌面，不替任何经手人作无罪保证。",
      effect: {
        relations: { 谢明微: 1 },
        tags: ["leak:canaries-released", "leak:observed:review-copy"],
      },
      next: "day9_leak_return",
    },
    {
      id: "day9_leak_run_rumor",
      text: "让琴匣流言跑完：看谁最先伸手。",
      outcome:
        "你先抄下长春宫守门名录，没有立刻截住传言。顾明华的私藏嫌疑先在宫里多活了一刻。",
      effect: {
        relations: { 顾明华: -1 },
        stats: { 名望: -1 },
        tags: ["leak:canaries-released", "leak:observed:recipient-household"],
      },
      next: "day9_leak_return",
    },
  ],
};

// Static shape keeps tooling and branch traversal complete. The playable
// scene is built from the seed by buildLeakReturnScene.
laterScenes.day9_leak_return = {
  id: "day9_leak_return",
  title: "风声回返",
  chapterLabel: "第9日",
  progress: { current: 3, total: 5 },
  text: "一条假消息带着行动痕迹回来了。它能指出失守的环节，不能替你给某个人定罪。",
  choices: [
    ...["review-copy", "courier-route", "recipient-household"].map((link) => ({
      id: `day9_leak_accuse_${link}`,
      text: `封查${link}`,
      outcome: "问责留下后果，调查仍继续。",
      effect: { tags: [`belief_leak:${link}`, `accused_link:${link}`] },
      next: "day9_2",
    })),
    {
      id: "day9_leak_rotate_all",
      text: "公开三札，轮换路线，暂不归责。",
      outcome: "没有人因一次推断被定罪，真实泄漏者也知道试探已经暴露。",
      effect: { tags: ["canaries-published", "actual-leak-adapts"] },
      next: "day9_2",
    },
  ],
};

laterScenes.day9_1.choices.forEach((choice) => {
  choice.next = "day9_leak_canaries";
});
laterScenes.day9_1.progress = { current: 1, total: 5 };
laterScenes.day9_2.progress = { current: 4, total: 5 };
laterScenes.day9_3.progress = { current: 5, total: 5 };
