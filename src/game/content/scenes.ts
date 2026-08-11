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
    text: "作坊账上出现长春宫采买人的姓氏。顾明华承认她买过同式香盒，却反问：“若我要杀人，为何留下自己宫里的名字？”\n\n殿外已有宫人等着听你指认。现在说出口的名字，天黑前就会变成结论。",
    choices: [
      {
        id: "day3_accuse_gu",
        text: "证据指向长春宫，请先拘押采买人与顾昭仪。",
        outcome:
          "顾明华被暂禁长春宫。你得到一个迅速而整齐的答案，也看见有人趁乱搬走了香房旧账。",
        effect: {
          stats: { 名望: 1 },
          relations: { 顾明华: -2 },
          tags: ["day3_gu_accused", "day3_chain_moved"],
        },
        next: "day3_vigil",
      },
      {
        id: "day3_refuse_easy_answer",
        text: "只拘采买人，不把作坊账当作最后结论。",
        outcome:
          "你拒绝让一个熟悉的名字替所有疑点收尾。顾明华欠你一次克制，皇后却要你尽快拿出更好的答案。",
        effect: {
          stats: { 谋略: 1 },
          relations: { 顾明华: 1, 沈令仪: -1 },
          tags: ["day3_chain_open"],
        },
        next: "day3_vigil",
      },
      {
        id: "day3_trade_silence",
        text: "私下把账页交给顾明华，换她提供真正经手人。",
        outcome:
          "她给出一个内务府小吏的名字，却留下了原账。你得到一条更深的线，也让她握住你隐瞒证据的把柄。",
        effect: {
          stats: { 胆识: 1 },
          relations: { 顾明华: 1 },
          tags: ["day3_gu_bargain", "day3_clerk_named"],
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
    text: "林答应在夜里醒过一次，说青禾临死前反复念着“不是香”。随后她又陷入高热。与此同时，温疏雨被催去太医院回话，香房旧账也只剩今夜可查。\n\n你只能把有限的人手留在一处。",
    choices: [
      {
        id: "day3_guard_lin",
        text: "守住林答应，确保她活到能够作证。",
        outcome:
          "你守到晨钟响起。林答应退了热，却有人趁夜撕走香房旧账中最关键的一页。",
        effect: {
          stats: { 人情: 2 },
          tags: ["day3_lin_alive", "day3_ledger_page_lost"],
        },
        next: "day3_result",
      },
      {
        id: "day3_guard_wen",
        text: "陪温疏雨去太医院，保住验毒结论。",
        outcome:
          "脉案最终盖上太医院官印。林答应活了下来，但再醒时已经记不清青禾最后一句话。",
        effect: {
          stats: { 礼仪: 1, 谋略: 1 },
          tags: ["day3_lin_alive", "day3_wen_safe", "day3_medical_record"],
        },
        next: "day3_result",
      },
      {
        id: "day3_search_ledger",
        text: "连夜查旧账，追出礼盒进入宫门的路径。",
        outcome:
          "你找到了同一批空白宫签的领用记录。天亮时，林答应的榻前蒙上了白布。",
        effect: {
          stats: { 谋略: 2, 人情: -1 },
          tags: ["day3_lin_dead", "day3_blank_pass"],
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
    text: "暴雨封住宫门。高福安从湿透的衣襟里取出一张旧纸：纸上盖着内廷朱印，印上却没有半个字。\n\n“今夜已经有三道调令用了同一枚印。天亮前，总会有人来取这张空白的。”",
    choices: [
      {
        id: "day4_keep_seal",
        text: "收下空印，先不告诉任何人。",
        outcome:
          "纸很轻，落进袖中却像多了一块铁。高福安把自己的命与秘密一并交给了你。",
        effect: {
          stats: { 谋略: 1 },
          relations: { 高福安: 1 },
          tags: ["empty_seal_player"],
        },
        next: "day4_three_orders",
      },
      {
        id: "day4_send_queen",
        text: "立刻交给皇后，请她封存内廷印库。",
        outcome:
          "沈令仪收下旧纸，也收走了你亲自试探它的机会。宫门很快加了双岗。",
        effect: {
          stats: { 礼仪: 1 },
          relations: { 沈令仪: 1, 高福安: -1 },
          tags: ["empty_seal_queen"],
        },
        next: "day4_three_orders",
      },
      {
        id: "day4_copy_marks",
        text: "记下纸张水纹与印边缺口，再让高福安带走。",
        outcome:
          "你没有持有危险的东西，却留下足以辨认同批纸张的特征。高福安对你的谨慎不置可否。",
        effect: { stats: { 才学: 1, 谋略: 1 }, tags: ["empty_seal_traced"] },
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
    text: "羽林副统领裴照南撬开被扣下的车箱。药材下面压着军粮账簿，数目足够养一支私兵三个月。\n\n账簿末页有她兄长的签名。她按住那一页：“给我一夜，我会查清这名字是真是假。”",
    choices: [
      {
        id: "day4_trust_pei",
        text: "给她一夜，但留下末页拓印。",
        outcome:
          "裴照南带走原册。你给了她查明家族的机会，也给自己留下防止账簿消失的后手。",
        effect: {
          stats: { 谋略: 1, 人情: 1 },
          tags: ["day4_pei_trusted", "day4_ledger_copy"],
        },
        next: "day4_gu_offer",
      },
      {
        id: "day4_seize_ledger",
        text: "拒绝私情，将账簿立即封存呈报。",
        outcome:
          "账簿进入公案，裴照南的兄长也在天亮前被停职。她向你行礼，礼数无可挑剔。司籍女史谢明微接过账册，先记谁交、谁见，再在缺页处留下一道空白。",
        effect: {
          stats: { 礼仪: 1, 名望: 1 },
          tags: ["day4_ledger_official", "day4_pei_alienated"],
        },
        next: "day4_gu_offer",
      },
      {
        id: "day4_test_signature",
        text: "先用旧军报比对笔锋，再决定是否上报。",
        outcome:
          "签名形似，落笔顺序却反了。有人不仅偷印，也在熟练地偷走别人的名字。",
        effect: {
          stats: { 才学: 1, 谋略: 1 },
          tags: ["day4_signature_forged"],
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
    text: "顾明华在雨停前找到你。\n\n“他们既敢用空印，我们便替它添一句话：明夜将军粮总账移往西库。谁来截这道假令，谁就是上家。”\n\n这是最快的诱饵，也会让落笔的人变成伪造调令的共犯。",
    choices: [
      {
        id: "day4_set_bait",
        text: "同意设局，由自己写下假调令。",
        outcome:
          "你亲手填满那张空白。钩已经抛出，从此却再不能说自己从未伪造过一道命令。",
        effect: {
          stats: { 胆识: 1, 谋略: 1 },
          relations: { 顾明华: 1 },
          tags: ["day4_bait_set", "day4_forgery_complicit"],
        },
        next: "day4_result",
      },
      {
        id: "day4_destroy_seal",
        text: "拒绝设局，当面烧掉能够触及的空印。",
        outcome:
          "纸在铜盆里卷成黑灰。你毁掉一个武器，却不知道同样的纸是否还有第二张。",
        effect: {
          stats: { 礼仪: 1 },
          relations: { 顾明华: -1 },
          tags: ["empty_seal_burned"],
        },
        next: "day4_result",
      },
      {
        id: "day4_countermark",
        text: "不写假令，只放出总账将移库的口头消息。",
        outcome: "你用流言代替伪诏。诱饵较慢，却不会留下能将你送上刑台的墨迹。",
        effect: { stats: { 人情: 1, 谋略: 1 }, tags: ["day4_rumor_bait"] },
        next: "day4_result",
      },
    ],
  },
  ...laterScenes,
};
// 天机阁第4章入口：追加一条可绕过的侧枝，主线分支图不变。
applyTianjiChapter4(scenes);
