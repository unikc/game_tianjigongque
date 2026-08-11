import type { Scene } from "../types";
import { laterScenes } from "./later-scenes";
import { applyTianjiChapter4 } from "./tianji-scenes";
export const scenes: Record<string, Scene> = {
  entry: {
    id: "entry",
    title: "宫门初启",
    backgroundId: "palace-courtyard-spring",
    text: "大晟承熙十二年，春。太后下旨选秀。\n\n你与二十三名秀女穿过宫墙。内侍提醒：“入宫后，少说、少问、少看。”\n\n前面的秀女回头：“那我们还能做什么？”",
    choices: [
      {
        id: "entry_breathe",
        text: "“大约可以呼吸。”",
        outcome: "前排有人没忍住笑。高福安看了你一眼，像是记住了这份胆量。",
        effect: { stats: { 胆识: 1 }, tags: ["uses_humor"] },
        next: "queen",
      },
      {
        id: "entry_watch",
        text: "“先看别人做什么。”",
        outcome: "你落后半步，把众人的慌张与镇定都看进眼里。",
        effect: { stats: { 谋略: 1 }, tags: ["observes_before_acting"] },
        next: "queen",
      },
      {
        id: "entry_remember",
        text: "“他说少说，没说不许记着。”",
        outcome: "内侍的拂尘顿了一下。你决定把每句话都留个来处。",
        effect: { stats: { 才学: 1 }, tags: ["values_evidence"] },
        next: "queen",
      },
      {
        id: "entry_silent",
        text: "保持沉默。",
        outcome: "无人注意你答了什么。因为你什么也没答。",
        effect: { stats: { 礼仪: 1 }, tags: ["avoids_conflict"] },
        next: "queen",
      },
    ],
  },
  queen: {
    id: "queen",
    title: "坤宁问训",
    speaker: "皇后 · 沈令仪",
    portrait: "queen",
    text: "“宫中不缺聪明人，缺的是知道何时不显聪明的人。”\n\n她将茶盏放回原处，轻得没有一点声响，却叫满殿的人都坐直了些。",
    choices: [
      {
        id: "queen_humble",
        text: "“臣妾愿先学规矩，再学聪明。”",
        outcome: "皇后微微颔首。她喜欢懂规矩的人，但宫里从不缺这样的话。",
        effect: {
          stats: { 礼仪: 1 },
          relations: { 沈令仪: 1 },
          tags: ["observes_before_acting"],
        },
        next: "zhaoyi",
      },
      {
        id: "queen_useful",
        text: "“聪明若能替娘娘分忧，便不算显摆。”",
        outcome: "皇后没有斥你，只让你把这句话再想一遍。",
        effect: {
          stats: { 胆识: 1, 礼仪: -1 },
          tags: ["claims_ownership"],
        },
        next: "zhaoyi",
      },
      {
        id: "queen_silent",
        text: "低头称是，不多添一个字。",
        outcome: "皇后端起茶盏。你没得到夸奖，也没有成为她的新麻烦。",
        effect: {
          relations: { 沈令仪: 2 },
          tags: ["avoids_conflict"],
        },
        next: "zhaoyi",
      },
    ],
  },
  zhaoyi: {
    id: "zhaoyi",
    title: "长春试语",
    speaker: "昭仪 · 顾明华",
    portrait: "zhaoyi",
    text: "“妹妹若有不懂的，尽管来问我。只是宫里的答案，往往第二日便会变。”\n\n她笑得亲切，身后的宫女却已悄悄记下你袖口的绣样。",
    choices: [
      {
        id: "gu_share",
        text: "“那便劳姐姐替我留意，所得也愿与姐姐同享。”",
        outcome: "顾明华笑意更深。‘同享’二字，她似乎只听见了后一个。",
        effect: {
          stats: { 人情: 1 },
          relations: { 顾明华: 1 },
          tags: ["socially_generous"],
        },
        next: "eunuch",
      },
      {
        id: "gu_write",
        text: "“答案会变，落在纸上的吩咐总有来处。”",
        outcome: "顾明华赞你细心，语气却比方才远了一寸。",
        effect: {
          stats: { 谋略: 2 },
          relations: { 顾明华: -1 },
          tags: ["values_evidence"],
        },
        next: "eunuch",
      },
      {
        id: "gu_praise",
        text: "“姐姐这样的人，想必总比答案先到一步。”",
        outcome: "这句恭维足够妥帖，也足够寻常。顾明华欣然收下。",
        effect: {
          stats: { 礼仪: 1 },
          relations: { 顾明华: 1 },
          tags: ["avoids_conflict"],
        },
        next: "eunuch",
      },
    ],
  },
  eunuch: {
    id: "eunuch",
    title: "廊下传话",
    speaker: "内侍 · 高福安",
    portrait: "eunuch",
    text: "“奴才只是传话。至于这话是谁真正想说的，娘娘日后自然会懂。”\n\n他说完并不走，目光在你手中的点心匣子上停了半息。",
    choices: [
      {
        id: "gao_gift",
        text: "将点心匣子递过去：“公公一路辛苦。”",
        outcome: "高福安接得自然，仿佛那只匣子原本就姓高。",
        effect: {
          stats: { 人情: 1, 银钱: -1 },
          relations: { 高福安: 1 },
          tags: ["socially_generous"],
        },
        next: "duck",
      },
      {
        id: "gao_ask",
        text: "“传话有来处，公公可否教我看明白？”",
        outcome: "高福安笑说不敢，却把下一句传得慢了许多。",
        effect: {
          stats: { 谋略: 1 },
          relations: { 高福安: 1 },
          tags: ["values_evidence"],
        },
        next: "duck",
      },
      {
        id: "gao_nod",
        text: "郑重道谢，仿佛真的只听见了一句话。",
        outcome: "高福安退开半步。你守住了体面，也没有买到更多消息。",
        effect: {
          stats: { 礼仪: 1 },
          relations: { 高福安: 1 },
          tags: ["avoids_conflict"],
        },
        next: "duck",
      },
    ],
  },
  duck: {
    id: "duck",
    title: "绣鸭献瑞",
    backgroundId: "palace-courtyard-spring",
    speaker: "御前内侍",
    portrait: "duck",
    portraitLabel: "被调换的鸭纹绣品",
    text: "御前呈礼时，你绣了七日的仙鹤忽然变成了扁嘴短腿的鸭。\n\n满殿寂静。皇帝看看绣品，又看看你。\n\n“这是……鹤？”",
    choices: [
      {
        id: "duck_rabbit",
        text: "【静观】先看绣线断口，再答御前。",
        outcome:
          "你看出鸭纹覆在原绣之上，针脚还沾着长春宫常用的金粉。证据有了，是否点破仍由你决定。",
        effect: {
          stats: { 谋略: 1 },
          relations: { 高福安: 1 },
          tags: ["observes_before_acting", "values_evidence"],
        },
        next: "evaluation",
        requiresZodiac: "rabbit",
      },
      {
        id: "duck_tiger",
        text: "【直取】“绣品出了差错，臣妾担下此事，也请准臣妾查清。”",
        outcome:
          "你先揽下风波，也顺手揽下查案。皇帝记住了你的气势，皇后则记住了你多领了一桩事。",
        effect: {
          stats: { 胆识: 1, 名望: 1 },
          relations: { 沈令仪: -1 },
          tags: ["claims_ownership"],
        },
        next: "evaluation",
        requiresZodiac: "tiger",
      },
      {
        id: "duck_monkey",
        text: "【机变】“鹤今日告假，托鸭代它来贺。”",
        outcome:
          "殿中静了半息，皇帝先笑了。礼官决定暂时不追问仙禽如何递交假帖。",
        effect: {
          stats: { 胆识: 1, 人情: 1 },
          tags: ["uses_humor"],
        },
        next: "evaluation",
        requiresZodiac: "monkey",
      },
      {
        id: "duck_ox",
        text: "【实干】呈上随身保留的原绣针样与用线簿。",
        outcome:
          "你原本只是怕日后补线不便。如今一册笨办法，恰好比十句辩白都有用。",
        effect: {
          stats: { 礼仪: 1, 谋略: 1 },
          tags: ["values_evidence"],
        },
        next: "evaluation",
        requiresZodiac: "ox",
      },
      {
        id: "duck_admit",
        text: "“臣妾绣的正是鸭。春江水暖，最先知道的本就不是鹤。”",
        outcome: "皇帝眉梢一动。礼官脸色发白，殿中有人把笑咳成了嗽。",
        effect: {
          stats: { 胆识: 2, 礼仪: -1 },
          tags: ["uses_humor", "claims_ownership"],
        },
        next: "evaluation",
      },
      {
        id: "duck_investigate",
        text: "“礼物自出宫门后便有登记，请查经手之人。”",
        outcome: "高福安接过名册。皇后认同你的条理，也记下你把风波带到了御前。",
        effect: {
          stats: { 谋略: 2, 名望: -1 },
          relations: { 沈令仪: -1, 高福安: 1 },
          tags: ["values_evidence"],
        },
        next: "evaluation",
      },
      {
        id: "duck_symbol",
        text: "“鸭成双，正合宫中和睦之意。”",
        outcome:
          "皇后替你圆下场面。顾明华望着那只孤零零的鸭，没有提醒你‘成双’还少一只。",
        effect: {
          stats: { 人情: 2 },
          relations: { 沈令仪: 1, 顾明华: -1 },
          tags: ["socially_generous"],
        },
        next: "evaluation",
      },
      {
        id: "duck_faint",
        text: "眼前一黑，顺势晕倒。",
        outcome:
          "两名宫女熟练地接住你。危机暂缓，但明日全宫都会知道你晕得很及时。",
        effect: {
          stats: { 体力: -1, 名望: -1 },
          tags: ["avoids_conflict"],
        },
        next: "evaluation",
      },
    ],
  },
  day2_summons: {
    id: "day2_summons",
    title: "晨钟传帖",
    chapterLabel: "第二日",
    progress: { current: 1, total: 4 },
    speaker: "内侍 · 高福安",
    portrait: "eunuch",
    text: "天未大亮，高福安便送来两张帖子：皇后命你午前核对宫宴名册，顾昭仪则请你先去长春宫“喝一盏不费时的茶”。\n\n两处都写着“不急”，两处显然都很急。",
    choices: [
      {
        id: "day2_queen_first",
        text: "先办皇后的差事，再向昭仪赔礼。",
        outcome: "你按品级行事。规矩挑不出错，只是长春宫那盏茶大约已经凉了。",
        effect: {
          stats: { 礼仪: 1 },
          relations: { 沈令仪: 1, 顾明华: -1 },
          tags: ["day2_order_first"],
        },
        next: "day2_register",
      },
      {
        id: "day2_gu_first",
        text: "先赴昭仪之约，问清她为何抢这半个时辰。",
        outcome:
          "顾明华没有让你喝茶，只把一页宴单推到面前。她要的果然不是寒暄。",
        effect: {
          stats: { 人情: 1 },
          relations: { 顾明华: 1, 沈令仪: -1 },
          tags: ["day2_favor_first"],
        },
        next: "day2_register",
      },
      {
        id: "day2_split_task",
        text: "请高福安代送回帖，自己先去取名册。",
        outcome:
          "你花掉一份人情，换来两边都不必空等。高福安提醒你：代送话容易，替人担话很贵。",
        effect: {
          stats: { 谋略: 1, 银钱: -1 },
          relations: { 高福安: 1 },
          tags: ["day2_delegated"],
        },
        next: "day2_register",
      },
      {
        id: "day2_imperial_review",
        text: "【帝信·一】请高福安将两帖一并呈到御前，当面定下先后。",
        outcome:
          "皇帝没有替任何一宫撑腰，只命你在御前核完名册。两边都失了先手，也都看出你能把难题递到谁的案上。",
        effect: {
          stats: { 名望: 1 },
          relations: { 沈令仪: -1, 顾明华: -1, 高福安: 1 },
          tags: ["day2_imperial_review"],
        },
        next: "day2_register",
        requiresEmperor: { trust: 5 },
      },
      {
        id: "day2_rank_access",
        text: "【贵人】请两宫将帖子一并送到尚宫局，当面核办。",
        outcome:
          "你的位分足够让三方坐到一张案前，也足够让所有人记住是谁召集了这场会面。",
        effect: {
          stats: { 名望: 1, 胆识: 1 },
          relations: { 沈令仪: -1, 顾明华: -1 },
          tags: ["day2_open_table"],
        },
        next: "day2_register",
        requiresRank: "贵人",
      },
    ],
  },
  day2_register: {
    id: "day2_register",
    title: "名册少了一笔",
    chapterLabel: "第二日",
    progress: { current: 2, total: 4 },
    text: "宫宴名册上，西席末位原写着新封的林答应，墨迹却被细细刮去，换成一位宗室女眷。\n\n两个人都已经收到帖子。若照新册行事，林答应会在众目睽睽之下没有座位；若照旧帖添席，又像是在质疑皇后的名册。",
    choices: [
      {
        id: "day2_restore_name",
        text: "按旧帖恢复林答应的名字，并附上改动痕迹。",
        outcome:
          "你保住了一个人的体面，也把改册之人的手留在纸上。证据清楚，锋芒也清楚。",
        effect: {
          stats: { 谋略: 1, 名望: 1 },
          relations: { 沈令仪: -1 },
          tags: ["day2_kept_evidence"],
        },
        next: "day2_request",
      },
      {
        id: "day2_add_side_seat",
        text: "不改名册，另添一席称作临时赏座。",
        outcome:
          "两张帖子都有了去处，但林答应会明白自己坐的是一把随时可以撤走的椅子。",
        effect: { stats: { 人情: 1, 礼仪: 1 }, tags: ["day2_preserved_faces"] },
        next: "day2_request",
      },
      {
        id: "day2_report_blank",
        text: "先不落笔，把两张帖子与名册一并呈给皇后。",
        outcome:
          "你拒绝替任何人完成最后一笔。皇后接下难题，也看出你把责任原样送了回来。",
        effect: {
          stats: { 礼仪: 1 },
          relations: { 沈令仪: 1 },
          tags: ["day2_returned_decision"],
        },
        next: "day2_request",
      },
      {
        id: "day2_rabbit_trace",
        text: "【静观】对着窗光查看刮痕与纸纤维。",
        outcome:
          "刮痕朝向与尚宫局惯用的右手刀相反。动册的人很可能不在尚宫局，却熟悉这里的纸。",
        effect: {
          stats: { 谋略: 2 },
          tags: ["day2_kept_evidence", "day2_outsider_hand"],
        },
        next: "day2_request",
        requiresZodiac: "rabbit",
      },
    ],
  },
  day2_request: {
    id: "day2_request",
    title: "一盏未凉的茶",
    chapterLabel: "第二日",
    progress: { current: 3, total: 4 },
    speaker: "昭仪 · 顾明华",
    portrait: "zhaoyi",
    text: "顾明华终于让你坐下。茶还是热的——她一直在等你。\n\n她承认宗室女眷是她临时请来的，却说自己从未命人刮去林答应的名字。然后她推过来一件东西：是皇后手书的一张条子，上面是你昨日说过的一句话，一字不差。\n\n\"妹妹若信我，宴上别提那道刮痕。若不信——\"她把茶杯转了半圈，\"——这张条子今晚就到皇后面前去。\"",
    choices: [
      {
        id: "day2_trust_gu",
        text: "答应守口。她手里有一张你说过的话，你没有筹码拒绝。",
        outcome:
          "顾明华把条子收起来，笑意才真正松开了。\n你替她守住了今天，也替她守住了你说过的那句话。\n宫里最牢的绳子不是威胁，是别人替你保管的秘密。",
        effect: {
          stats: { 人情: -1 },
          relations: { 顾明华: 2 },
          tags: ["day2_guarded_secret", "day2_gu_has_leverage"],
        },
        next: "day2_banquet",
      },
      {
        id: "day2_warn_gu",
        text: "把条子要回来。\"你现在还不值得用这个对我。\"",
        outcome:
          "她没有把条子给你，但你看见她把它重新压到砚台下面了。\n你没有守秘密，也没有交出证据。你们现在互相知道了对方的底线在哪里——这比任何承诺都更危险，也更有用。",
        effect: {
          stats: { 胆识: 1, 谋略: 1 },
          relations: { 顾明华: -2, 沈令仪: 1 },
          tags: ["day2_private_report", "day2_bluffed_gu"],
        },
        next: "day2_banquet",
      },
      {
        id: "day2_ask_price",
        text: "\"条子换条子。你把那张给我，我把刮痕的事压下去。\"",
        outcome:
          "她看了你很久。\n最后把条子烧掉了，就在你面前，用茶碟接着灰。\n\"妹妹比我以为的更值得来往。\"她说。\n你不知道这是夸奖还是警告，但条子没有了，你欠她一件事也没有了。",
        effect: {
          stats: { 胆识: 2 },
          relations: { 顾明华: 1 },
          tags: ["day2_named_price", "day2_leverage_traded"],
        },
        next: "day2_banquet",
      },
      {
        id: "day2_tiger_refuse",
        text: "【直取】站起来。\"条子尽管送去——我亲自去跟皇后解释那句话的前后文。\"",
        outcome:
          "顾明华第一次收起了那副待客的笑，认真地看了你一眼。\n\"你不怕。\"\n\"我怕，\"你说，\"但我比你更怕被人拿着一张纸控制一辈子。\"\n她让你走了。条子还在她那里——但她今天没有用它。",
        effect: {
          stats: { 胆识: 2, 名望: 1 },
          relations: { 顾明华: -3 },
          tags: ["day2_refused_pressure", "day2_gu_keeps_leverage"],
        },
        next: "day2_banquet",
        requiresZodiac: "tiger",
      },
    ],
  },
    day2_banquet: {
    id: "day2_banquet",
    title: "席前一把空椅",
    backgroundId: "banquet-hall-empty-seat",
    chapterLabel: "第二日",
    progress: { current: 4, total: 4 },
    speaker: "皇后 · 沈令仪",
    portrait: "queen",
    text: "林答应和宗室女眷同时走进来。殿里确实只有一把椅子。\n\n皇后没有看名册，只问你：\"这席该请谁坐？\"\n\n两百个人都在看你。",
    choices: [
      {
        id: "day2_seat_lin",
        text: "请林答应入席——帖子在先，规矩在先。",
        outcome:
          "林答应坐下了。\n\n宗室女眷站在原地，没有人去安置她。她在两百人面前站了足足一刻钟，才被旁边的宫人悄悄引走。\n\n皇后没有说话，但你看见她在名册上写了什么。\n\n顾明华在另一侧，脸上什么表情都没有，这反而让你不安。",
        effect: {
          stats: { 名望: 1, 人情: -1 },
          relations: { 沈令仪: 1, 顾明华: -2, 林栖梧: 2 },
          tags: ["day2_chose_precedent", "day2_royal_humiliated"],
        },
        next: "day2_result",
      },
      {
        id: "day2_seat_guest",
        text: "请宗室女眷入席——朝廷体面不能让步。",
        outcome:
          "宗室女眷坐下了。\n\n林答应站在原地。\n她是新封的答应，位分比任何人都低，她不能说话，不能哭，只能站着。\n\n皇后说：\"安排得当。\"\n\n但你记得她的眼睛。",
        effect: {
          stats: { 礼仪: 2 },
          relations: { 沈令仪: 1, 顾明华: 2, 林栖梧: -3 },
          tags: ["day2_chose_institution", "day2_lin_stood"],
        },
        next: "day2_result",
      },
      {
        id: "day2_offer_own_seat",
        text: "让出自己的席位，请二人都坐。你站着。",
        outcome:
          "两个人都坐下了。\n\n你站在自己的位置旁边，整整一顿宫宴。\n有人低声笑了。有人停下筷子看了你很久。\n\n皇后在宴后把你留下来说了一句话：\"今日之事，哀家记得。\"\n\n你不知道这是奖赏还是提醒。",
        effect: {
          stats: { 人情: 2, 体力: -1 },
          emperor: { favor: 4 },
          relations: { 沈令仪: 2, 林栖梧: 3 },
          tags: ["day2_self_sacrifice", "day2_stood_all_banquet"],
        },
        next: "day2_result",
      },
      {
        id: "day2_monkey_merge",
        text: "【机变】请内侍撤去那把椅子，改设赏花小案——两人共席，无分高下。",
        outcome:
          "内侍愣了一下，照办了。\n\n礼官在旁边小声说：\"这不合制。\"\n你说：\"那就现在立制。\"\n\n两个人坐下来，中间是一盘没人敢先动的点心。宾客们看了你很久，然后继续吃饭。\n\n事情被解决了。但你说过的那句话——那就现在立制——有人记在了心里。",
        effect: {
          stats: { 才学: 1, 谋略: 1 },
          relations: { 沈令仪: -1 },
          tags: ["day2_reframed_problem", "day2_defied_protocol"],
        },
        next: "day2_result",
        requiresZodiac: "monkey",
      },
      {
        id: "day2_ox_fetch",
        text: "【实干】叫人去偏殿搬一把同制的椅子过来，暂缓开宴。",
        outcome:
          "宴开迟了半盏茶。\n\n那把椅子搬来的时候，两百人都看着一把椅子被搬进殿里。\n问题被解决了，但所有人都亲眼见到这个宴会因为少了一把椅子而迟开。\n\n皇后说：\"务实。\"\n\n你不确定她是在夸你还是在归类你。",
        effect: {
          stats: { 体力: 1, 名望: -1 },
          relations: { 沈令仪: 1 },
          tags: ["day2_solved_materially"],
        },
        next: "day2_result",
        requiresZodiac: "ox",
      },
    ],
  },
    day3_incense: {
    id: "day3_incense",
    title: "香从何来",
    chapterLabel: "第三日",
    progress: { current: 1, total: 5 },
    backgroundId: "banquet-hall-empty-seat",
    text: "宴散后的清晨，林答应收到一盒署着你名字的合欢香。她刚点燃半枚，侍女青禾便撞开窗，将香炉掀翻。\n\n午时，青禾死在香房门外。林答应昏迷，脉搏细如蚕丝。太医说：熏烟已入肺，再等一刻钟，救不回来了。\n\n香房门还没有关上。里面那块地砖上，染着毒粉的落灰还在原处——一旦救人，太医进去，证物就会被踩散。\n\n门外的宫人已经认出了盒底的宫签，有人在说你的名字。",
    choices: [
      {
        id: "day3_save_lin",
        text: "让太医进去。证物没了就没了——你不能看着她死。",
        outcome:
          "温疏雨冲进去，脚踩过那片落灰。\n林答应活下来了。\n香房里的证物没了，但她的脉搏还在。\n下午，没有任何人替你洗清嫌疑——因为没有证据。\n说你名字的宫人，说得更理直气壮了。",
        effect: {
          stats: { 人情: 2, 名望: -2 },
          relations: { 林栖梧: 3 },
          tags: ["day3_lin_treated", "day3_evidence_lost", "day3_people_first"],
        },
        next: "day3_physician",
      },
      {
        id: "day3_seal_room",
        text: "封门。让太医等在外面，先记录地面的落灰。",
        outcome:
          "你封上了门。\n太医在外面等了一刻钟，门缝里传来林答应换气的声音，越来越浅。\n落灰被完整记录下来。\n林答应活了——但只差一点点。温疏雨说：如果再晚三息进去，就来不及了。\n她进去时的眼神你一直没有忘记。",
        effect: {
          stats: { 谋略: 2, 人情: -1 },
          relations: { 林栖梧: -2, 温疏雨: -1 },
          tags: ["day3_scene_preserved", "day3_lin_treated", "day3_cold_choice"],
        },
        next: "day3_physician",
      },
      {
        id: "day3_clear_name",
        text: "把宫签从盒底取出来，当众宣读笔迹——在所有人的证词形成之前。",
        outcome:
          "你把宫签举起来，请宫人认字。\n有人指出落款的草书和你平时的字不同。\n你的嫌疑暂时被压住了——代价是你伸手进了那个香盒，所有人都看见了。\n证物上现在有你的指印。\n林答应还在昏迷，没有人去救她，因为所有人都在看你。",
        effect: {
          stats: { 谋略: 1, 名望: 1 },
          relations: { 沈令仪: 1, 林栖梧: -2 },
          tags: ["day3_name_cleared", "day3_fingerprints_added", "day3_lin_untreated"],
        },
        next: "day3_physician",
      },
      {
        id: "day3_favor_intervention",
        text: "【帝宠·二】持御前腰牌同时调动两拨人：一拨救人，一拨封门。",
        outcome:
          "腰牌让内侍和太医同时行动。\n有人救人，有人封门——但内侍不懂如何保全证物，封门的时候已经踩乱了一半的落灰。\n林答应活了。证物只剩一半。\n顾明华在人群后面看了你很久。她现在知道你在御前有多少分量了。",
        effect: {
          stats: { 谋略: 1, 人情: 1 },
          relations: { 顾明华: -2 },
          tags: [
            "day3_imperial_intervention",
            "day3_lin_treated",
            "day3_scene_partial",
          ],
        },
        next: "day3_physician",
        requiresEmperor: { favor: 12 },
      },
    ],
  },
    day3_physician: {
    id: "day3_physician",
    title: "毒不在香",
    chapterLabel: "第三日",
    progress: { current: 2, total: 5 },
    speaker: "太医 · 温疏雨",
    text: "温疏雨用银针挑开香灰，又刮下盒盖内层一点暗粉。\n\n“香料无毒。毒在盒盖，开合时落下。慢性矿毒，沾手后再碰茶水，才会发作。”\n\n她若把判断写进脉案，便等于承认太医院曾漏检同类毒物。",
    choices: [
      {
        id: "day3_record_truth",
        text: "请她照实落案，由你承担逼她签字的责任。",
        outcome:
          "温疏雨写得极慢，一字也没有含糊。她把脉案交给你，也把自己的前程压在了上面。",
        effect: {
          stats: { 胆识: 1 },
          tags: ["day3_medical_record", "day3_protected_wen"],
        },
        next: "day3_pearl",
      },
      {
        id: "day3_private_test",
        text: "暂不入档，请她只做第二次验毒。",
        outcome: "你替她留下退路，也让这份结论暂时只能靠两个人的信用支撑。",
        effect: { stats: { 谋略: 1, 人情: 1 }, tags: ["day3_private_result"] },
        next: "day3_pearl",
      },
      {
        id: "day3_report_physician",
        text: "将发现直接交给皇后，由太医院自行解释。",
        outcome: "皇后接管验毒。温疏雨没有反驳，只在收走药箱时避开了你的目光。",
        effect: {
          stats: { 礼仪: 1 },
          relations: { 沈令仪: 1 },
          tags: ["day3_wen_exposed"],
        },
        next: "day3_pearl",
      },
    ],
  },
  day3_pearl: {
    id: "day3_pearl",
    title: "东珠照伪",
    chapterLabel: "第三日",
    progress: { current: 3, total: 5 },
    text: "盒扣上粘着一层细白珠粉，礼盒却盖着“御库制”的戳记。高福安说，真正御库盒扣只用东珠边料，粉色温润；这层粉冷白发青。\n\n若拿真东珠比照，便能证明礼盒来自宫外仿造；也会让所有人知道你受过御前关注。",
    choices: [
      {
        id: "day3_use_pearl",
        text: "取出御赐东珠，当众比对珠粉。",
        outcome:
          "两种珠光在窗下泾渭分明。礼盒的御库身份被推翻，你与皇帝的那点关联也成了新的谈资。",
        effect: {
          stats: { 谋略: 1, 名望: 1 },
          relations: { 顾明华: -1 },
          tags: ["day3_box_counterfeit", "day3_pearl_revealed"],
        },
        next: "day3_accusation",
        requiresTag: "day3_has_pearl",
      },
      {
        id: "day3_ask_gao",
        text: "请高福安暗取御库废料，只在私下比照。",
        outcome:
          "高福安替你带回一点真珠粉，也顺便知道了你最怕谁听见这件事。证据较弱，秘密却暂时还在。",
        effect: {
          stats: { 人情: 1, 银钱: -1 },
          relations: { 高福安: 1 },
          tags: ["day3_box_counterfeit_private"],
        },
        next: "day3_accusation",
      },
      {
        id: "day3_trace_craft",
        text: "不碰东珠，沿盒扣工艺追查宫外作坊。",
        outcome:
          "你保住了御赐之物的隐秘，却只得到三家都能制作同款盒扣的作坊名单。",
        effect: { stats: { 谋略: 1 }, tags: ["day3_workshop_lead"] },
        next: "day3_accusation",
      },
      {
        id: "day3_preserve_lid",
        text: "先封存盒盖，不急着证明它来自哪里。",
        outcome: "盒盖被完整封存。你没有立刻得到答案，却保住了日后复验的可能。",
        effect: { stats: { 礼仪: 1 }, tags: ["day3_lid_preserved"] },
        next: "day3_accusation",
      },
    ],
  },
  day3_accusation: {
    id: "day3_accusation",
    title: "长春宫的名字",
    chapterLabel: "第三日",
    progress: { current: 4, total: 5 },
    speaker: "昭仪 · 顾明华",
    portrait: "zhaoyi",
    text: "作坊账上出现长春宫采买人的姓氏。\n\n顾明华没有解释，只反问：\"若我要杀人，为何留下自己宫里的名字？\"\n\n殿外有三十个宫人在等你说话。你说出去的名字，天黑前就会变成结论——无论是否真相。你现在掌握的，是指认还是等待的权力。不是发现真相的权力。",
    choices: [
      {
        id: "day3_accuse_gu",
        text: "证据指向长春宫。说出她的名字。",
        outcome:
          "顾明华被暂禁长春宫。\n\n你说出那个名字的时候，三十个人都在看你。有人去执行了。\n\n两个时辰后，你得到消息：趁着这场混乱，香房里最关键的一页旧账被人悄悄撕走了。\n\n你抓住了一个人，让另一个人有时间收拾干净。",
        effect: {
          stats: { 名望: 1, 谋略: -1 },
          relations: { 顾明华: -3 },
          tags: ["day3_gu_accused", "day3_chain_moved"],
        },
        next: "day3_vigil",
      },
      {
        id: "day3_refuse_easy_answer",
        text: "只拘采买人，不指认顾明华。名字太快变成结论。",
        outcome:
          "顾明华还站在你对面。\n\n你看见她呼出一口气，很慢，像是等了很久。\n\n皇后把你叫到一旁说：\"你今天欠了她一次，她知道的。\"\n\n你拒绝了容易的答案，但你也没有更好的答案。现在是你的问题了。",
        effect: {
          stats: { 谋略: 2 },
          relations: { 顾明华: 2, 沈令仪: -1 },
          tags: ["day3_chain_open", "day3_owed_gu"],
        },
        next: "day3_vigil",
      },
      {
        id: "day3_trade_silence",
        text: "把账页私下递给顾明华，换她说出真正经手的人。",
        outcome:
          "你们没有当着任何人的面交谈。\n\n她给了你一个名字——内务府的一个小吏。你给了她那页账。\n\n后来你想，那页账里究竟写着什么，你已经永远不会知道了。\n\n她现在握着你隐瞒证据的事实。你握着一个不知道能不能用的名字。",
        effect: {
          stats: { 胆识: 1 },
          relations: { 顾明华: 1 },
          tags: ["day3_gu_bargain", "day3_clerk_named", "day3_gu_knows_cover"],
        },
        next: "day3_vigil",
      },
    ],
  },
    day3_vigil: {
    id: "day3_vigil",
    title: "留谁到天明",
    chapterLabel: "第三日",
    progress: { current: 5, total: 5 },
    text: "林答应在夜里醒过一次，说了一句话，然后又烧起来了。\n\n宫人复述给你听：青禾临死前反复念着\"不是香\"。\n\n温疏雨被太医院连夜催回去问话——那份脉案今晚就要决定盖不盖官印。香房旧账也只有今夜可查：明天会有人来要求\"归还原件\"。\n\n林答应的榻前没有人守。",
    choices: [
      {
        id: "day3_guard_lin",
        text: "守住林答应。她是唯一听见青禾说话的人。",
        outcome:
          "你守到晨钟响起。\n\n林答应退了热。她认出了你，握住了你的手。\n\n香房旧账在你不在的时候被人翻过了——最关键的那一页，干干净净地消失了。\n\n但林答应活着。她记得青禾说的那三个字。\n那三个字将来能不能用，你不知道。",
        effect: {
          stats: { 人情: 2 },
          relations: { 林栖梧: 4 },
          tags: ["day3_lin_alive", "day3_ledger_page_lost", "day3_lin_witness"],
        },
        next: "day3_result",
      },
      {
        id: "day3_guard_wen",
        text: "陪温疏雨去太医院。脉案盖上官印，才是真的证据。",
        outcome:
          "脉案盖上了印。\n\n你回来的时候，林答应刚退烧。她在你走后睡着了，睡着之前又烧了一遍。\n\n她醒过来不记得青禾说的话了。\n高热会带走一些东西。\n\n你有一份有公信力的脉案。\n你再也拿不回那三个字了。",
        effect: {
          stats: { 礼仪: 1, 谋略: 1 },
          relations: { 温疏雨: 2 },
          tags: ["day3_lin_alive", "day3_wen_safe", "day3_medical_record", "day3_testimony_lost"],
        },
        next: "day3_result",
      },
      {
        id: "day3_search_ledger",
        text: "查旧账。\"不是香\"意味着毒从别处来——账目能找到那个别处。",
        outcome:
          "你翻了整整一夜。\n\n在天亮前找到了：同一批空白宫签的领用记录，上面有三个名字，全都是内务府的人。\n\n天亮的时候，宫人进来，在林答应的榻前蒙上了白布。\n\n你得到了一条比青禾的遗言更能追责的线索。\n你失去了你想要救的人。",
        effect: {
          stats: { 谋略: 2, 人情: -2 },
          relations: { 林栖梧: -3 },
          tags: ["day3_lin_dead", "day3_blank_pass", "day3_ledger_trail"],
        },
        next: "day3_result",
      },
    ],
  },
    day4_blank_seal: {
    id: "day4_blank_seal",
    title: "有印无字",
    chapterLabel: "第四日",
    progress: { current: 1, total: 5 },
    speaker: "内侍 · 高福安",
    portrait: "eunuch",
    text: "暴雨封住宫门。高福安从湿透的衣襟里取出一张旧纸：纸上盖着内廷朱印，印上却没有半个字。\n\n他的声音比平时更低：\"今夜已经有三道调令用了同一枚印。拿这张的人比你我都大，他们在等有人替他们填上字。\"\n\n他把纸推向你。\n\n他冒着被牵连的风险把这张纸带给你，而不是别的任何人。",
    choices: [
      {
        id: "day4_keep_seal",
        text: "收下。纸进了袖子，你就成了这件事的一部分。",
        outcome:
          "纸很轻，落进袖中却像多了一块铁。\n\n高福安把自己的命与这个秘密一并交给了你。\n\n从今晚起，你拿着一张可以让你入狱的纸，也拿着一张可以反制拿它的人的纸。\n\n这两件事是同一张纸。",
        effect: {
          stats: { 谋略: 1 },
          relations: { 高福安: 2 },
          tags: ["empty_seal_player"],
        },
        next: "day4_three_orders",
      },
      {
        id: "day4_send_queen",
        text: "立刻交给皇后。这件事应该比你更大的人来处理。",
        outcome:
          "沈令仪收下旧纸，掂了掂，收进了自己的袖子。\n\n宫门很快加了双岗。\n\n高福安没有说什么，但今夜之后，他找你说话之前会多想一想。\n\n你把危险转移出去了。你也把主动权转移出去了。",
        effect: {
          stats: { 礼仪: 1 },
          relations: { 沈令仪: 1, 高福安: -2 },
          tags: ["empty_seal_queen"],
        },
        next: "day4_three_orders",
      },
      {
        id: "day4_copy_marks",
        text: "记下纸张水纹与印边缺口，让高福安把原件带走。",
        outcome:
          "你花了一炷香的时间，把能用眼睛记住的东西都记住了。\n\n然后你让高福安拿回去，像什么都没有发生一样。\n\n你没有拿着那张纸。你也没有那张纸能给你的任何东西。\n但你现在能认出它的兄弟。",
        effect: {
          stats: { 才学: 1, 谋略: 1 },
          tags: ["empty_seal_traced"],
        },
        next: "day4_three_orders",
      },
    ],
  },
    day4_three_orders: {
    id: "day4_three_orders",
    title: "三道调令",
    chapterLabel: "第四日",
    progress: { current: 2, total: 5 },
    text: "同一时辰，尚宫局收到调宫女的令，太医院收到搬药材的令，北宫门收到放行车马的令。三份字迹不同，朱印右下却都有同一道缺口。\n\n雨水正在冲淡车辙，三条线只能先追一条。",
    choices: [
      {
        id: "day4_follow_courier",
        text: "跟住传令内侍，找出命令从哪里交到他手中。",
        outcome:
          "内侍在文书房后窗换过一次油纸伞。递伞的人没有露脸，只露出一枚宗室腰牌。",
        effect: { stats: { 谋略: 1, 体力: -1 }, tags: ["day4_royal_badge"] },
        next: "day4_archive",
      },
      {
        id: "day4_check_archive",
        text: "直奔文书房，核对印库和领纸记录。",
        outcome:
          "印没有丢，少的是一沓带暗纹的空白官纸。领用栏被人用雨水洇成了一片。",
        effect: { stats: { 才学: 1 }, tags: ["day4_paper_missing"] },
        next: "day4_archive",
      },
      {
        id: "day4_warn_gate",
        text: "先通知北宫门扣车，宁可惊动幕后之人。",
        outcome: "车被截下。箱上写着药材，雨水冲开的缝里却露出一角军粮账册。",
        effect: { stats: { 胆识: 1, 名望: 1 }, tags: ["day4_cart_stopped"] },
        next: "day4_archive",
      },
    ],
  },
  day4_archive: {
    id: "day4_archive",
    title: "文书房后窗",
    chapterLabel: "第四日",
    progress: { current: 3, total: 5 },
    text: "文书房后窗没有上锁。里面一盏灯未灭，案上留着半张被火燎过的调令；院墙外则传来车轮碾过积水的声音。\n\n擅入文书房能拿到原件，也足以让你被治罪。",
    choices: [
      {
        id: "day4_enter_archive",
        text: "翻窗进去，抢在火苗吞掉印文前取走调令。",
        outcome: "你用湿袖按灭火星，保住半枚残印。巡夜人也看见了你的背影。",
        effect: {
          stats: { 胆识: 1, 体力: -1 },
          tags: ["day4_burned_order", "day4_seen_trespassing"],
        },
        next: "day4_cart",
      },
      {
        id: "day4_chase_cart",
        text: "放弃纸片，沿车声追向北宫门。",
        outcome:
          "你赶上了车，却只来得及看见赶车人跳进雨幕。车中不是药材，是军粮账簿。",
        effect: { stats: { 体力: 1 }, tags: ["day4_grain_ledger"] },
        next: "day4_cart",
      },
      {
        id: "day4_call_witness",
        text: "叫来两名女官作证，再按规矩开门查验。",
        outcome:
          "手续让你晚了半刻，烧剩的纸只余印角；但没人能反咬你私闯文书房。",
        effect: {
          stats: { 礼仪: 1, 名望: 1 },
          tags: ["day4_witnessed_search"],
        },
        next: "day4_cart",
      },
    ],
  },
  day4_cart: {
    id: "day4_cart",
    title: "药箱里的军粮",
    chapterLabel: "第四日",
    progress: { current: 4, total: 5 },
    text: "裴照南撬开车箱的时候，里面的药材还是药材。\n\n然后她看见了底部的账簿。\n\n她把账本翻到最后一页，没有说话。末页有她兄长的签名，数目足够养一支私兵三个月。\n\n她按住那一页。不是遮住——是按住，像是不让它跑掉。\n\n\"给我一夜，\"她说，\"我会查清这名字是真是假。\"\n\n她没有哭，没有辩解，只是按着那一页纸，等你开口。",
    choices: [
      {
        id: "day4_trust_pei",
        text: "给她一夜。留下末页拓印，把原册交给她。",
        outcome:
          "她拿走了账簿。\n\n你手里剩着那张拓印，墨迹还没有干。\n\n你不知道她会查出什么，也不知道明天她会不会回来。\n你只知道，你选择相信一个按着自己兄长名字的人，这件事你会记一辈子——无论她查出什么。",
        effect: {
          stats: { 谋略: 1, 人情: 2 },
          relations: { 裴照南: 4 },
          tags: ["day4_pei_trusted", "day4_ledger_copy"],
        },
        next: "day4_gu_offer",
      },
      {
        id: "day4_seize_ledger",
        text: "不给。把账簿从她手下拿走，立即封存呈报。",
        outcome:
          "她的手还压在那一页上。\n\n你把账簿从她手下抽出来，她没有反抗。\n\n她向你行了礼，礼数无可挑剔。\n然后她走了，没有说话。\n\n账簿进入公案。她兄长在天亮前被停职。\n你得到了证物。\n你看见她离开的时候，手指还是弯的，像是还在按着什么。",
        effect: {
          stats: { 礼仪: 1, 名望: 1, 人情: -1 },
          relations: { 裴照南: -3 },
          tags: ["day4_ledger_official", "day4_pei_alienated"],
        },
        next: "day4_gu_offer",
      },
      {
        id: "day4_test_signature",
        text: "先用旧军报比对笔锋。当着她的面，当场验真假。",
        outcome:
          "她把账本翻开，你把军报铺在旁边。\n\n笔锋对着笔锋。你们谁都没有说话。\n\n落笔顺序反了。是有人在模仿她兄长的字，模仿得很熟练，只在收笔的习惯上露出了破绽。\n\n她看着那个差异，很久没有抬头。\n\"是假的。\"她说。这两个字她说得很轻，像是在确认，又像是在说服自己。",
        effect: {
          stats: { 才学: 1, 谋略: 1 },
          relations: { 裴照南: 3 },
          tags: ["day4_signature_forged", "day4_pei_knows_truth"],
        },
        next: "day4_gu_offer",
      },
    ],
  },
    day4_gu_offer: {
    id: "day4_gu_offer",
    title: "以假令钓真手",
    chapterLabel: "第四日",
    progress: { current: 5, total: 5 },
    speaker: "昭仪 · 顾明华",
    portrait: "zhaoyi",
    text: "雨停了。顾明华来找你，没有带任何人。\n\n她把空印放在你们之间，说：\"他们敢用空印，我们便替它添一句话——明夜将军粮总账移往西库。谁来截这道假令，谁就是上家。\"\n\n她停了一下，然后加了一句：\"落笔的人是共犯。但事成之后，上家的名字会替落笔的人挡住所有事。\"\n\n她看着你，等你写。",
    choices: [
      {
        id: "day4_set_bait",
        text: "拿起笔，在空印上写下那句话。",
        outcome:
          "墨迹落下去的那一秒，你清楚地知道：从今以后，不管事情怎么发展，你都曾经写过一道假调令。\n\n顾明华收起那张纸。她没有道谢，只说：\"妹妹的字很好。\"\n\n钩已经抛出了。\n你不再是只在旁边看的人了。",
        effect: {
          stats: { 胆识: 2, 谋略: 1 },
          relations: { 顾明华: 2 },
          tags: ["day4_bait_set", "day4_forgery_complicit"],
        },
        next: "day4_result",
      },
      {
        id: "day4_destroy_seal",
        text: "拒绝。把那张空印当着她的面烧掉。",
        outcome:
          "纸在铜盆里卷起来，朱印变成灰烬。\n\n顾明华看着火，没有说话。等灰冷了，她说：\"你不写，有别人会写。\"\n\n你知道她说的是真的。\n\n你毁掉了一张纸。你不知道同样的纸还有多少张。你只知道这一张上面不会有你的字。",
        effect: {
          stats: { 礼仪: 1, 胆识: 1 },
          relations: { 顾明华: -2 },
          tags: ["empty_seal_burned"],
        },
        next: "day4_result",
      },
      {
        id: "day4_countermark",
        text: "不落笔。放出口头消息，不留任何书面证据。",
        outcome:
          "你告诉她：不写，但可以让消息传出去。\n\n顾明华想了一下，同意了。\n\n口头消息比一道假令慢，也比一道假令难追责。\n上家可能等不及，也可能更谨慎。\n\n你没有在任何地方留下自己的字。\n你也没有那道假令能引出的任何东西。",
        effect: {
          stats: { 谋略: 2, 名望: 1 },
          relations: { 顾明华: 1 },
          tags: ["day4_rumor_bait"],
        },
        next: "day4_result",
      },
    ],
  },

  ...laterScenes,
};
// 天机阁第4章入口：追加一条可绕过的侧枝，主线分支图不变。
applyTianjiChapter4(scenes);
