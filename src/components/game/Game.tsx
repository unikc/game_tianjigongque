"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChoiceButton,
  ConfirmationDialog,
  GameShell,
  Portrait,
  ProgressBar,
  RelationshipCard,
  SaveIndicator,
} from "../../../imperial-design-system";
import { characters } from "../../game/characters";
import { origins } from "../../game/content/origins";
import { scenes } from "../../game/content/scenes";
import {
  availableSideStories,
  sideStories,
  type SideStory,
  type SideStoryChoice,
} from "../../game/content/side-stories";
import { storyArc } from "../../game/content/story-arc";
import { zodiacs } from "../../game/content/zodiacs";
import { isChoiceAvailable } from "../../game/state/availability";
import {
  applyEffect,
  ACTION_POINT_CAP,
  archetype,
  completeChapter,
  courtAttention,
  createGame,
  deserialize,
  evaluate,
  evaluatePromotion,
  growthCost,
  resolveEnding,
  resumeDestination,
  rankOrder,
  residenceFor,
  performPalaceAction,
  SAVE_KEY,
  serialize,
  spendGrowthPoint,
} from "../../game/state/engine";
import type {
  ChapterId,
  Choice,
  GameState,
  OriginId,
  RelationKey,
  Reward,
  StatKey,
  ZodiacId,
} from "../../game/types";
import { backgrounds } from "../../../imperial-design-system/backgrounds/registry";

const rewardGuides: Record<
  string,
  {
    effect: string;
    hidden: string;
  }
> = {
  "item-imperial-pearl": {
    effect: "持有：帝王信任达到 40 后，可复核伪造口谕。",
    hidden: "隐藏线索：东珠在不同灯色下会暴露假赏珠。",
  },
  "keepsake-seat-register": {
    effect: "持有且高福安关系达到 20：解锁名册背面的旧押记。",
    hidden: "隐藏线索：刮痕方向与尚宫局惯用手相反。",
  },
  "keepsake-cold-incense-lid": {
    effect: "持有：调查毒香与御库纹样时保留额外证据。",
    hidden: "隐藏线索：假御库纹样可能来自宫外文书链。",
  },
  "item-empty-seal": {
    effect: "持有：可在伪诏相关场景中设置诱饵或进行反证。",
    hidden: "隐藏线索：同一枚印曾出现在军粮调令上。",
  },
};

function RewardIntel({ reward }: { reward: Reward }) {
  const guide = rewardGuides[reward.id];
  return (
    <div className="reward-intel">
      <p>
        <b>当前作用</b>
        {guide?.effect ?? "作为经历凭证，影响后续身份判断与结局记录。"}
      </p>
      <p>
        <b>潜在线索</b>
        {guide?.hidden ?? "尚未发现明确用法，后续人物或事件可能识得此物。"}
      </p>
    </div>
  );
}

const rewardPreviews: Record<number, Reward> = {
  2: {
    id: "keepsake-seat-register",
    name: "刮痕名册",
    description: "一页提醒你：宫中的位置从不只用来坐。",
    kind: "keepsake",
    asset: "/items/scratched-seat-register-v01.webp",
  },
  3: {
    id: "keepsake-cold-incense-lid",
    name: "合欢冷匣",
    description: "洗净毒粉后的盒盖，留着一枚假的御库纹样。",
    kind: "keepsake",
    asset: "/backgrounds/banquet-hall-empty-seat-v01.webp",
  },
  4: {
    id: "item-empty-seal",
    name: "空印纸",
    description: "有印无字的旧纸，可作诱饵，也可能成为罪证。",
    kind: "item",
    asset: "/backgrounds/palace-courtyard-spring-v01.webp",
  },
  5: {
    id: "evidence-relief-list",
    name: "赈灾名单",
    description: "将假皇嗣与真银两相连的名单。",
    kind: "keepsake",
    asset: "/chapters/chapter-5-unfallen-child.webp",
  },
  6: {
    id: "evidence-river-ledger",
    name: "河堤账页",
    description: "泥水浸过的账页，每个数字后面都是一户人家。",
    kind: "keepsake",
    asset: "/chapters/chapter-6-flood.webp",
  },
  7: {
    id: "item-broken-arrow",
    name: "断箭",
    description: "来自羽林库存、越过春猎围障的箭簇。",
    kind: "item",
    asset: "/chapters/chapter-7-spring-hunt.webp",
  },
  8: {
    id: "item-phoenix-impression",
    name: "凤印拓样",
    description: "不能发令，却能辨认谁在冒用皇后名义。",
    kind: "item",
    asset: "/chapters/chapter-8-phoenix-seal.webp",
  },
  9: {
    id: "evidence-ash-ledger",
    name: "灰烬账页",
    description: "火没有烧掉的几行名字。",
    kind: "keepsake",
    asset: "/chapters/chapter-9-palace-fire.webp",
  },
  10: {
    id: "title-night-signatory",
    name: "金殿署名",
    description: "在无人愿意签字的一夜承担了一道命令。",
    kind: "title",
    asset: "/chapters/chapter-10-empty-throne.webp",
  },
  11: {
    id: "keepsake-gate-order",
    name: "宫门军令",
    description: "最后一道门前留下的停战军令。",
    kind: "keepsake",
    asset: "/chapters/chapter-11-blood-edict.webp",
  },
  12: {
    id: "title-dawn-after",
    name: "天明以后",
    description: "你决定了位置如何留下，也看见决定之后的世界。",
    kind: "title",
    asset: "/chapters/chapter-12-after-dawn.webp",
  },
};

function RewardSummary({ reward }: { reward: Reward }) {
  return (
    <article className="result-reward-card">
      <div
        className="reward-art"
        role="img"
        aria-label={`${reward.name}插图`}
        style={{ backgroundImage: `url(${reward.asset})` }}
      />
      <span>
        本章所得 ·{" "}
        {reward.kind === "item"
          ? "道具"
          : reward.kind === "title"
            ? "称号"
            : "纪念"}
      </span>
      <b>{reward.name}</b>
      <p>{reward.description}</p>
      <RewardIntel reward={reward} />
    </article>
  );
}

function RelationshipPanel({ state }: { state: GameState }) {
  return (
    <div className="relations" aria-label="人物关系">
      {Object.entries(state.relations).map(([k, v]) => (
        <RelationshipCard key={k} label={k} value={v} />
      ))}
    </div>
  );
}
function ChoiceOutcome({ state }: { state: GameState }) {
  const id = state.history[state.history.length - 1];
  const choice = Object.values(scenes)
    .flatMap((scene) => scene.choices)
    .find((item) => item.id === id && item.next === state.sceneId);
  if (!choice) return null;
  const changes = [
    ...Object.entries(choice.effect.stats ?? {}).map(([name, value]) => ({
      name,
      value: value ?? 0,
      kind: "stat" as const,
    })),
    ...Object.entries(choice.effect.relations ?? {}).map(([name, value]) => ({
      name,
      value: value ?? 0,
      kind: "relation" as const,
    })),
  ];
  return (
    <aside className="outcome" role="status" aria-live="polite">
      <span className="outcome-label">方才</span>
      <p>{choice.outcome}</p>
      {changes.length > 0 && (
        <div className="change-list" aria-label="数值变化">
          {changes.map((change) => (
            <span
              key={`${change.kind}-${change.name}`}
              className={
                change.kind === "relation" ? "relation-change" : undefined
              }
            >
              <b>{change.name}</b>
              <strong>
                {change.value > 0 ? "+" : ""}
                {change.kind === "relation" ? change.value * 10 : change.value}
              </strong>
              {change.kind === "relation" && (
                <i className="relation-thread" aria-hidden="true" />
              )}
            </span>
          ))}
        </div>
      )}
    </aside>
  );
}
function SideStoryPanel({
  story,
  onChoose,
  onLeave,
}: {
  story: SideStory;
  onChoose: (choice: SideStoryChoice) => void;
  onLeave: () => void;
}) {
  return (
    <section className="side-story" aria-labelledby="side-story-title">
      <div className="topline">
        <span className="eyebrow">{story.eyebrow}</span>
        <button className="text-button" onClick={onLeave}>
          暂不处理
        </button>
      </div>
      <div className={`side-story-seal ${story.danger ? "danger" : ""}`}>
        {story.danger ? "危" : "秘"}
      </div>
      <h2 id="side-story-title">{story.title}</h2>
      <p>{story.text}</p>
      <div className="choices">
        {story.choices.map((choice, index) => (
          <ChoiceButton
            key={choice.id}
            index={index}
            onClick={() => onChoose(choice)}
          >
            {choice.text}
          </ChoiceButton>
        ))}
      </div>
    </section>
  );
}
function DialoguePanel({
  state,
  onChoose,
  onLeaveStory,
}: {
  state: GameState;
  onChoose: (choice: Choice) => void;
  onLeaveStory: () => void;
}) {
  const [choicePage, setChoicePage] = useState(0);
  const scene = scenes[state.sceneId];
  const availableChoices = scene.choices.filter((choice) =>
    isChoiceAvailable(state, choice),
  );
  const chapterLabel = scene.chapterLabel ?? "第一日";
  const progress = scene.progress
    ? (scene.progress.current / scene.progress.total) * 100
    : ((state.history.length + 1) / 6) * 100;
  const choicesPerPage = 3;
  const choicePageCount = Math.ceil(availableChoices.length / choicesPerPage);
  const visibleChoices = availableChoices.slice(
    choicePage * choicesPerPage,
    (choicePage + 1) * choicesPerPage,
  );
  const sceneBackground =
    backgrounds[scene.backgroundId ?? "palace-courtyard-day"];
  return (
    <div className="dialogue-screen">
      <div className="topline">
        <span className="scene-index">
          {chapterLabel} · {scene.title}
        </span>
        <div className="run-tools">
          <SaveIndicator />
          <button className="text-button" onClick={onLeaveStory}>
            暂离
          </button>
        </div>
      </div>
      <ProgressBar label={`${chapterLabel}章节进度`} value={progress} />
      <div
        className={`scene-head ${!scene.portrait ? "scene-head-illustrated" : ""}`}
        style={
          !scene.portrait && sceneBackground?.asset
            ? { backgroundImage: `url(${sceneBackground.asset})` }
            : undefined
        }
      >
        <div>
          <span className="speaker">{scene.speaker ?? "承熙十二年"}</span>
          <h2>{scene.title}</h2>
        </div>
        {scene.portrait && (
          <Portrait
            character={characters[scene.portrait]}
            kind={scene.portrait}
            priority
          />
        )}
      </div>
      <ChoiceOutcome state={state} />
      <div className="dialogue">{scene.text}</div>
      <div className="choices">
        {visibleChoices.map((c, i) => (
          <ChoiceButton
            key={c.id}
            index={choicePage * choicesPerPage + i}
            onClick={() => onChoose(c)}
          >
            {c.text}
          </ChoiceButton>
        ))}
        {choicePageCount > 1 && (
          <div className="choice-pager" aria-label="更多选择">
            <button
              disabled={choicePage === 0}
              onClick={() => setChoicePage((page) => page - 1)}
            >
              上一组
            </button>
            <span>
              选择 {choicePage + 1}/{choicePageCount}
            </span>
            <button
              disabled={choicePage === choicePageCount - 1}
              onClick={() => setChoicePage((page) => page + 1)}
            >
              下一组
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
function Title({
  hasSave,
  onNew,
  onContinue,
}: {
  hasSave: boolean;
  onNew: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="center title-screen">
      <div className="opening-edict">
        <span className="edict-cord" aria-hidden="true" />
        <span className="eyebrow">大晟 · 宫廷生存录</span>
        <span className="edict-preface">奉天承运 · 内廷录</span>
        <h1>
          天机
          <br />
          宫阙
        </h1>
        <div className="seal" aria-label="承熙御玺">
          <span>承</span>
          <span>熙</span>
          <span>御</span>
          <span>玺</span>
        </div>
        <p className="edict-line">钦录秀女入宫，观其心术，定其荣辱。</p>
      </div>
      <p className="subtitle">一入宫门深似海，先学会看懂圣意。</p>
      <div className="actions">
        <button className="primary" onClick={onNew}>
          入宫
        </button>
        {hasSave && (
          <button className="secondary" onClick={onContinue}>
            继续旧局
          </button>
        )}
      </div>
    </div>
  );
}
function Origin({
  onStart,
}: {
  onStart: (n: string, o: OriginId, z: ZodiacId) => void;
}) {
  const [name, setName] = useState("陆清和");
  const [origin, setOrigin] = useState<OriginId>("scholar");
  const [zodiac, setZodiac] = useState<ZodiacId>("rabbit");
  const [step, setStep] = useState<"identity" | "origin">("identity");
  return (
    <div className="origin-screen">
      <div className="origin-heading">
        <span className="eyebrow">
          秀女名册 · {step === "identity" ? "其一" : "其二"}
        </span>
        <h2>{step === "identity" ? "姓名与命宫" : "你从何处来？"}</h2>
      </div>
      {step === "identity" ? (
        <>
          <label htmlFor="name">闺名</label>
          <input
            className="name-input"
            id="name"
            maxLength={8}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <fieldset className="zodiac-fieldset">
            <legend>命宫</legend>
            <div className="zodiac-grid">
              {(
                Object.entries(zodiacs) as [
                  ZodiacId,
                  (typeof zodiacs)[ZodiacId],
                ][]
              ).map(([id, item]) => (
                <button
                  type="button"
                  key={id}
                  className={`zodiac-card ${zodiac === id ? "selected" : ""}`}
                  onClick={() => setZodiac(id)}
                  aria-pressed={zodiac === id}
                >
                  <span>{item.name}</span>
                  <b>{item.archetype}</b>
                  <small>{item.description}</small>
                </button>
              ))}
            </div>
          </fieldset>
          <button
            className="primary origin-next"
            onClick={() => setStep("origin")}
          >
            下一步 · 选择家世
          </button>
        </>
      ) : (
        <>
          <div className="origin-grid">
            {(
              Object.entries(origins) as [
                OriginId,
                (typeof origins)[OriginId],
              ][]
            ).map(([id, item]) => (
              <button
                key={id}
                className={`origin-card ${origin === id ? "selected" : ""}`}
                onClick={() => setOrigin(id)}
                aria-pressed={origin === id}
              >
                <h3>{item.name}</h3>
                <div className="deltas">
                  {Object.entries(item.deltas)
                    .map(
                      ([key, value]) =>
                        `${key} ${value! > 0 ? "+" : ""}${value}`,
                    )
                    .join(" · ")}
                </div>
                <p>{item.description}</p>
              </button>
            ))}
          </div>
          <div className="origin-actions">
            <button className="secondary" onClick={() => setStep("identity")}>
              上一步
            </button>
            <button
              className="primary"
              onClick={() => onStart(name, origin, zodiac)}
            >
              登记入宫
            </button>
          </div>
        </>
      )}
    </div>
  );
}
function ImperialEdict({
  state,
  onFinish,
  onRestart,
  onOpenJournal,
}: {
  state: GameState;
  onFinish: (s: GameState) => void;
  onRestart: () => void;
  onOpenJournal: () => void;
}) {
  const result = evaluate(state);
  return (
    <div className="center edict-screen">
      <div className="topline journal-topline">
        <span className="eyebrow">御前裁定</span>
        <button className="text-button" onClick={onOpenJournal}>
          行录
        </button>
      </div>
      <ChoiceOutcome state={state} />
      <div className="edict">
        <div className="seal">
          奉天
          <br />
          承运
        </div>
        <p>皇帝看着那幅绣品，沉吟片刻。</p>
        <p className="quote">
          “鹤有鹤的体面，鸭也有鸭的用处。至少它下得了水。”
        </p>
        <p>
          着封 <b>{state.name}</b> 为
        </p>
        <div className="rank">{result.rank}</div>
      </div>
      <button
        className="primary"
        onClick={() =>
          onFinish({ ...state, rank: result.rank, sceneId: "result" })
        }
      >
        接旨谢恩
      </button>
      <button className="text-button standalone" onClick={onRestart}>
        重新入宫
      </button>
    </div>
  );
}
function RankReveal({
  state,
  onRestart,
  onNext,
  onOpenJournal,
}: {
  state: GameState;
  onRestart: () => void;
  onNext: () => void;
  onOpenJournal: () => void;
}) {
  const result = evaluate(state);
  const strongest = Object.entries(state.stats).sort(
    (a, b) => b[1] - a[1],
  )[0][0];
  return (
    <div className="rank-screen">
      <div className="topline">
        <span className="eyebrow">第一日 · 尘埃落定</span>
        <div className="run-tools">
          <SaveIndicator />
          <button className="text-button" onClick={onOpenJournal}>
            行录
          </button>
        </div>
      </div>
      <div className="center" style={{ minHeight: "auto" }}>
        <div className="plaque">初封 · {state.rank}</div>
        <h2>{archetype(state)}</h2>
      </div>
      <div className="summary">
        <p>
          {state.name}
          入宫首日，见过三张笑脸，也听懂了至少四句未说出口的话。一只来历不明的鸭，将你的谨慎、机敏与运气一并送到御前。
        </p>
        <p>
          <b>最强项：</b>
          {strongest}
        </p>
        <RelationshipPanel state={state} />
        <p className="quote">
          <b>宫中评语：</b>
          {result.comment}
        </p>
      </div>
      <div className="actions">
        <button className="primary" onClick={onNext}>
          前往第二日
        </button>
        <button className="secondary" onClick={onRestart}>
          重新开始
        </button>
      </div>
    </div>
  );
}
function DayTwoResult({
  state,
  onContinue,
  onRestart,
  onOpenJournal,
}: {
  state: GameState;
  onContinue: () => void;
  onRestart: () => void;
  onOpenJournal: () => void;
}) {
  const resolution = state.tags.includes("day2_reframed_problem")
    ? "你没有选择谁该失去座位，而是改变了问题本身。"
    : state.tags.includes("day2_solved_materially")
      ? "你让宫宴等了一会儿，却让两个人坐上了一样高的椅子。"
      : state.tags.includes("day2_self_sacrifice")
        ? "你保住了两个人的体面，也让自己的谦让成了新的谈资。"
        : state.tags.includes("day2_chose_precedent")
          ? "你守住了先发出的帖子，也得罪了后来更有分量的客人。"
          : "你维护了宫宴的整体秩序，也看清了秩序会先牺牲谁。";
  const intrigue = state.tags.includes("day2_outsider_hand")
    ? "刮改名册的人并非尚宫局惯用右手。那道反向刀痕仍无人解释。"
    : state.tags.includes("day2_kept_evidence")
      ? "被刮去的墨迹已经留档，这件事还没有真正结束。"
      : "名册上的刮痕被席间笑语盖了过去，但没有消失。";
  return (
    <div className="result-screen">
      <div className="topline">
        <span className="eyebrow">第二日 · 宴散留痕</span>
        <div className="run-tools">
          <SaveIndicator />
          <button className="text-button" onClick={onOpenJournal}>
            行录
          </button>
        </div>
      </div>
      <div className="center" style={{ minHeight: "auto" }}>
        <div className="plaque">宫中札记 · 席位之争</div>
        <h2>一把椅子的分量</h2>
      </div>
      <div className="summary">
        <p>{resolution}</p>
        <p>{intrigue}</p>
        <RelationshipPanel state={state} />
        <RewardSummary reward={rewardPreviews[2]} />
      </div>
      <div className="actions">
        <button className="primary" onClick={onContinue}>
          收下札记
        </button>
        <button className="secondary" onClick={onRestart}>
          重新开始
        </button>
      </div>
    </div>
  );
}

function DayThreeResult({
  state,
  onContinue,
  onRestart,
  onOpenJournal,
}: {
  state: GameState;
  onContinue: () => void;
  onRestart: () => void;
  onOpenJournal: () => void;
}) {
  const life = state.tags.includes("day3_lin_dead")
    ? "你追到了空白宫签的领用记录，林栖梧却没能等到天亮。证据第一次有了人的代价。"
    : state.tags.includes("day3_wen_safe")
      ? "林栖梧活了下来，验毒结论也盖上官印；她最后听见的话却随高热消失了。"
      : "林栖梧活了下来，成为此案仍会开口的证人；香房账页则少了最关键的一张。";
  const trail = state.tags.includes("day3_gu_accused")
    ? "顾明华被禁足，但真正的文书链趁这份整齐结论转移了。"
    : state.tags.includes("day3_clerk_named")
      ? "一名内务府小吏浮出水面，顾明华也握住了你隐瞒证据的把柄。"
      : "长春宫仍在嫌疑之中，作坊账却没有替你完成最后的判断。";
  return (
    <div className="result-screen">
      <div className="topline">
        <span className="eyebrow">第三日 · 香冷人未定</span>
        <div className="run-tools">
          <SaveIndicator />
          <button className="text-button" onClick={onOpenJournal}>
            行录
          </button>
        </div>
      </div>
      <div className="center" style={{ minHeight: "auto" }}>
        <div className="plaque">宫中札记 · 合欢香冷</div>
        <h2>毒不在香里</h2>
      </div>
      <div className="summary">
        <p>{life}</p>
        <p>{trail}</p>
        <RelationshipPanel state={state} />
        <RewardSummary reward={rewardPreviews[3]} />
      </div>
      <div className="actions">
        <button className="primary" onClick={onContinue}>
          收下冷匣
        </button>
        <button className="secondary" onClick={onRestart}>
          重新开始
        </button>
      </div>
    </div>
  );
}

function DayFourResult({
  state,
  onContinue,
  onRestart,
  onOpenJournal,
}: {
  state: GameState;
  onContinue: () => void;
  onRestart: () => void;
  onOpenJournal: () => void;
}) {
  const seal = state.tags.includes("empty_seal_burned")
    ? "你烧掉了手边的空印，却无法证明世上没有第二张。"
    : state.tags.includes("day4_bait_set")
      ? "你用空印写下诱饵，也亲手越过了追查者与共犯之间的界线。"
      : state.tags.includes("empty_seal_queen")
        ? "空印由皇后封存。安全与解释它的权力，一并落到了她手里。"
        : "空印仍未公开，关于军粮总账的口头诱饵已经放出。";
  const ledger = state.tags.includes("day4_signature_forged")
    ? "军粮册上的签名落笔顺序相反：文书链正在偷用活人的名字。"
    : state.tags.includes("day4_ledger_official")
      ? "军粮册进入公案，裴氏兄长被停职，裴照南也记住了是谁做的决定。"
      : "军粮册留下了副本与疑问，裴照南获得一夜查清家门。";
  return (
    <div className="result-screen">
      <div className="topline">
        <span className="eyebrow">第四日 · 雨歇印未干</span>
        <div className="run-tools">
          <SaveIndicator />
          <button className="text-button" onClick={onOpenJournal}>
            行录
          </button>
        </div>
      </div>
      <div className="center" style={{ minHeight: "auto" }}>
        <div className="plaque">宫中札记 · 雨夜空印</div>
        <h2>没有字的命令</h2>
      </div>
      <div className="summary">
        <p>{seal}</p>
        <p>{ledger}</p>
        <RelationshipPanel state={state} />
        <RewardSummary reward={rewardPreviews[4]} />
      </div>
      <div className="actions">
        <button className="primary" onClick={onContinue}>
          记下此夜
        </button>
        <button className="secondary" onClick={onRestart}>
          重新开始
        </button>
      </div>
    </div>
  );
}

const laterResultCopy: Record<
  number,
  { eyebrow: string; title: string; reward: string }
> = {
  5: { eyebrow: "脉案封存", title: "未落之子", reward: "赈灾名单" },
  6: { eyebrow: "河水退后", title: "河决千里", reward: "河堤账页" },
  7: { eyebrow: "猎场收弦", title: "春猎惊弦", reward: "断箭" },
  8: { eyebrow: "凤印归处", title: "凤印两面", reward: "凤印拓样" },
  9: { eyebrow: "火熄留名", title: "十二宫火", reward: "灰烬账页" },
  10: { eyebrow: "金殿署名", title: "金殿无主", reward: "金殿署名" },
  11: { eyebrow: "宫门天明", title: "宫门血诏", reward: "宫门军令" },
  12: { eyebrow: "多年以后", title: "天明以后", reward: "天明以后" },
};

function LaterChapterResult({
  state,
  chapter,
  onContinue,
  onOpenJournal,
}: {
  state: GameState;
  chapter: number;
  onContinue: () => void;
  onOpenJournal: () => void;
}) {
  const copy = laterResultCopy[chapter];
  const allChoices = Object.values(scenes).flatMap((scene) => scene.choices);
  const recent = state.history
    .slice(-3)
    .map((id) => allChoices.find((choice) => choice.id === id)?.outcome)
    .filter((line): line is string => !!line);
  const ending = chapter === 12 ? `《${resolveEnding(state).title}》` : null;
  const promotion = evaluatePromotion(state, `chapter-${chapter}` as ChapterId);
  return (
    <div className="result-screen">
      <div className="topline">
        <span className="eyebrow">
          第{chapter}章 · {copy.eyebrow}
        </span>
        <div className="run-tools">
          <SaveIndicator />
          <button className="text-button" onClick={onOpenJournal}>
            行录
          </button>
        </div>
      </div>
      <div
        className="result-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, transparent 32%, rgb(15 34 32 / 84%)), url(${rewardPreviews[chapter]?.asset ?? laterChapterArt[chapter - 5]})`,
        }}
      >
        <div className="plaque">{ending ?? "宫中札记"}</div>
        <h2>{copy.title}</h2>
      </div>
      <div className="summary">
        {recent.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <RelationshipPanel state={state} />
        {ending ? (
          <p className="quote">
            <b>你的结局：</b>
            {ending}
          </p>
        ) : (
          <RewardSummary reward={rewardPreviews[chapter]} />
        )}
        {promotion.status === "promoted" && promotion.to && (
          <div
            className="promotion-reveal"
            aria-label={`晋位为${promotion.to}`}
          >
            <span aria-hidden="true">晋</span>
            <small>{promotion.route}进阶</small>
            <strong>{promotion.to}</strong>
          </div>
        )}
        {promotion.status === "held" && promotion.to && (
          <section className="promotion-held">
            <span>位分暂留 · {promotion.from}</span>
            <strong>下一位分：{promotion.to}</strong>
            <p>帝心、清议、人脉三路，任成其一即可晋位。</p>
            <div className="promotion-routes">
              {promotion.criteria.map((route) => (
                <span key={route.route} data-met={route.met}>
                  {route.route} {route.met ? "已达成" : route.label}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="actions">
        <button className="primary" onClick={onContinue}>
          {chapter === 12 ? "收录结局" : `继续第${chapter + 1}章`}
        </button>
      </div>
    </div>
  );
}

const growthStats: StatKey[] = ["才学", "谋略", "胆识", "礼仪", "人情"];
const laterChapterArt = [
  "/chapters/chapter-5-unfallen-child.webp",
  "/chapters/chapter-6-flood.webp",
  "/chapters/chapter-7-spring-hunt.webp",
  "/chapters/chapter-8-phoenix-seal.webp",
  "/chapters/chapter-9-palace-fire.webp",
  "/chapters/chapter-10-empty-throne.webp",
  "/chapters/chapter-11-blood-edict.webp",
  "/chapters/chapter-12-after-dawn.webp",
];

type PalaceContact = {
  id: string;
  name: string;
  rank: string;
  description: string;
  portrait?: string;
  focalPoint?: string;
  relationKey?: RelationKey;
  knownAfter: number;
};
const palaceContacts: PalaceContact[] = [
  {
    id: "emperor",
    name: "萧承元",
    rank: "大晟皇帝",
    description: "克制寡言，重秩序，也在观察谁能听懂他的弦外之音。",
    portrait: "/characters/xiao-chengyuan-emperor-v01.webp",
    focalPoint: "50% 16%",
    knownAfter: 0,
  },
  {
    id: "queen",
    name: characters.queen.name,
    rank: characters.queen.rank,
    description: characters.queen.publicPersona,
    portrait: characters.queen.portrait,
    focalPoint: "50% 17%",
    relationKey: "沈令仪",
    knownAfter: 0,
  },
  {
    id: "zhaoyi",
    name: characters.zhaoyi.name,
    rank: characters.zhaoyi.rank,
    description: characters.zhaoyi.publicPersona,
    portrait: characters.zhaoyi.portrait,
    focalPoint: "49% 16%",
    relationKey: "顾明华",
    knownAfter: 0,
  },
  {
    id: "eunuch",
    name: characters.eunuch.name,
    rank: characters.eunuch.rank,
    description: characters.eunuch.publicPersona,
    portrait: characters.eunuch.portrait,
    focalPoint: "51% 17%",
    relationKey: "高福安",
    knownAfter: 0,
  },
  {
    id: "lin-qiwu",
    name: "林栖梧",
    rank: "答应",
    description: "宫宴名册上被刮去名字的新人，也是毒香案里活着的证词。",
    portrait: "/characters/lin-qiwu-concubine-v01.webp",
    focalPoint: "50% 17%",
    knownAfter: 1,
  },
  {
    id: "wen-shuyu",
    name: "温疏雨",
    rank: "太医",
    description: "验毒时极少多说一句，知道药理，也知道宫中证据如何消失。",
    portrait: "/characters/wen-shuyu-physician-v01.webp",
    focalPoint: "50% 17%",
    knownAfter: 2,
  },
  {
    id: "pei-zhaonan",
    name: "裴照南",
    rank: "羽林副统领",
    description: "守门、查粮，也必须在家族与军令之间作出选择。",
    portrait: "/characters/pei-zhaonan-guard-v01.webp",
    focalPoint: "50% 16%",
    knownAfter: 3,
  },
];

function ChapterHub({
  state,
  onStartChapter,
  onGrow,
  onAction,
  onReturn,
  onAcknowledgeSideStory,
  onResolveSideStory,
  onToggleCarryReward,
  onRelinquishReward,
}: {
  state: GameState;
  onStartChapter: (sceneId: string) => void;
  onGrow: (stat: StatKey) => void;
  onAction: (
    action: "study" | "attend" | "confide" | "network" | "rest",
  ) => void;
  onReturn: () => void;
  onAcknowledgeSideStory: (storyId: string) => void;
  onResolveSideStory: (story: SideStory, choice: SideStoryChoice) => void;
  onToggleCarryReward: (reward: Reward) => void;
  onRelinquishReward: (
    reward: Reward,
    mode: "gift" | "discard",
    recipient?: RelationKey,
  ) => void;
}) {
  const chapterOneDone = state.completedChapters.includes("chapter-1");
  const chapterTwoDone = state.completedChapters.includes("chapter-2");
  const chapterThreeDone = state.completedChapters.includes("chapter-3");
  const chapterFourDone = state.completedChapters.includes("chapter-4");
  const [tab, setTab] = useState<"home" | "character" | "rewards" | "journal">(
    "home",
  );
  const hubRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    hubRef.current?.closest(".paper")?.scrollTo({ top: 0 });
  }, [tab]);
  const [chapterPage, setChapterPage] = useState(() =>
    Math.min(2, Math.floor(state.completedChapters.length / 4)),
  );
  const [journalSection, setJournalSection] = useState<"main" | "side">("main");
  const [actionFeedback, setActionFeedback] = useState<string>();
  const [activeSideStory, setActiveSideStory] = useState<SideStory>();
  const [pendingReward, setPendingReward] = useState<{
    reward: Reward;
    mode: "gift" | "discard";
    recipient?: RelationKey;
  }>();
  const nextChapterIndex = Math.min(
    state.completedChapters.length,
    storyArc.length - 1,
  );
  const nextChapter = storyArc[nextChapterIndex];
  const nextChapterNumber = nextChapterIndex + 1;
  const nextSceneId =
    nextChapterNumber === 1
      ? "entry"
      : nextChapterNumber === 2
        ? "day2_summons"
        : nextChapterNumber === 3
          ? "day3_incense"
          : nextChapterNumber === 4
            ? "day4_blank_seal"
            : `day${nextChapterNumber}_1`;
  const activeScene = scenes[state.sceneId];
  const hasActiveStory = Boolean(activeScene);
  const currentStorySceneId = hasActiveStory ? state.sceneId : nextSceneId;
  const currentStoryTitle = activeScene?.title ?? nextChapter.title;
  const currentStoryLabel =
    activeScene?.chapterLabel ?? `第${nextChapterNumber}章`;
  const currentStorySummary = hasActiveStory
    ? "你的选择停在这里，返回时会从当前场景继续。"
    : nextChapter.theme;
  const networkTarget = (
    Object.entries(state.relations) as [string, number][]
  ).sort((a, b) => a[1] - b[1])[0][0];
  const takeAction = (
    action: "study" | "attend" | "confide" | "network" | "rest",
    feedback: string,
  ) => {
    setActionFeedback(feedback);
    onAction(action);
  };
  const unlockedSideStories = availableSideStories(state);
  const newlyUnlockedSideStory = unlockedSideStories.find(
    (story) => !state.tags.includes(`side_story_prompted:${story.id}`),
  );
  const recordedSideStories = sideStories.filter(
    (story) =>
      state.resolvedSideStories.includes(story.id) ||
      unlockedSideStories.some((available) => available.id === story.id),
  );
  const carriedRewards = state.rewards.filter((reward) =>
    state.tags.includes(`carried_reward:${reward.id}`),
  );
  const emperorFavorStage =
    state.emperor.favor >= 80
      ? "深宠"
      : state.emperor.favor >= 60
        ? "偏爱"
        : state.emperor.favor >= 40
          ? "常召"
          : state.emperor.favor >= 20
            ? "留意"
            : "陌生";
  const chapterActionKey = state.completedChapters.length + 1;
  const studiedThisChapter = state.tags.includes(
    `action_studied_chapter_${chapterActionKey}`,
  );
  const attendedThisChapter = state.tags.includes(
    `action_attended_emperor_chapter_${chapterActionKey}`,
  );
  const confidedThisChapter = state.tags.includes(
    `action_confided_emperor_chapter_${chapterActionKey}`,
  );
  const attention = courtAttention(state);
  const attentionStage =
    attention >= 30
      ? "风口浪尖"
      : attention >= 20
        ? "引人侧目"
        : attention >= 10
          ? "渐受关注"
          : "宫中尚静";
  const residence = residenceFor(state);
  const knownContacts = palaceContacts
    .filter((contact) => contact.knownAfter <= state.completedChapters.length)
    .map((contact) => {
      const dead =
        (contact.id === "lin-qiwu" && state.tags.includes("day3_lin_dead")) ||
        (contact.id === "eunuch" &&
          (state.tags.includes("ch9_evidence_saved") ||
            state.tags.includes("ch9_arsonist_caught")));
      const rank =
        contact.id === "queen" && state.rank === "皇后"
          ? state.tags.includes("ch8_gu_ascends")
            ? "退居中宫"
            : "前皇后 · 太后尊位"
          : contact.id === "zhaoyi" && state.tags.includes("ch8_gu_ascends")
            ? "掌宫妃"
            : contact.rank;
      return { ...contact, rank, dead };
    });
  if (activeSideStory) {
    return (
      <SideStoryPanel
        story={activeSideStory}
        onLeave={() => setActiveSideStory(undefined)}
        onChoose={(choice) => {
          onResolveSideStory(activeSideStory, choice);
          setActiveSideStory(undefined);
        }}
      />
    );
  }
  return (
    <div ref={hubRef} className={`chapter-hub hub-mode-${tab}`}>
      <div className="topline">
        <div>
          <span className="eyebrow">内廷起居</span>
          <h2>
            {tab === "home"
              ? residence.name
              : `${state.rank ?? "答应"} · ${state.name}`}
          </h2>
        </div>
        {hasActiveStory && tab !== "home" && (
          <button className="text-button" onClick={onReturn}>
            继续剧情
          </button>
        )}
      </div>
      <nav className="hub-tabs" aria-label="寝宫主导航" data-active-tab={tab}>
        <button
          data-audio-cue="paper.turn"
          onClick={() => setTab("home")}
          aria-pressed={tab === "home"}
        >
          寝宫
        </button>
        <button
          data-audio-cue="cloth.open"
          onClick={() => setTab("character")}
          aria-pressed={tab === "character"}
        >
          人物 {state.growthPoints > 0 && <b>{state.growthPoints}</b>}
        </button>
        <button
          data-audio-cue="jade.touch"
          onClick={() => setTab("rewards")}
          aria-pressed={tab === "rewards"}
        >
          珍藏
        </button>
        <button
          data-audio-cue="paper.turn"
          onClick={() => setTab("journal")}
          aria-pressed={tab === "journal"}
        >
          行录
        </button>
        <i className="tab-indicator" aria-hidden="true" />
      </nav>
      {tab === "home" && (
        <>
          <section
            className="residence-hero"
            style={{ backgroundImage: `url(${residence.asset})` }}
            aria-labelledby="residence-title"
          >
            <div>
              <span>当前居所 · {residence.trait}</span>
              <h3 id="residence-title">{residence.name}</h3>
              <p>{residence.description}</p>
              <b>{residence.bonus}</b>
            </div>
          </section>
          <section className="residence-status" aria-label="寝宫当前状态">
            <article>
              <span>位分</span>
              <b>{state.rank ?? "答应"}</b>
            </article>
            <article>
              <span>帝驾</span>
              <b>
                {confidedThisChapter
                  ? "留谈"
                  : attendedThisChapter
                    ? "曾临"
                    : "未至"}
              </b>
            </article>
            <article>
              <span>随身物</span>
              <b>{carriedRewards.length} 件</b>
            </article>
            <article>
              <span>闲暇</span>
              <b>
                {state.actionPoints}/{ACTION_POINT_CAP}
              </b>
            </article>
          </section>
          <section className="player-home" aria-labelledby="player-home-title">
            <div className="emperor-bond" id="player-home-title">
              <div>
                <span>我与皇帝 · 萧承元</span>
                <b>{emperorFavorStage}</b>
              </div>
              <div className="emperor-bond-meters">
                <label>
                  宠爱{" "}
                  <ProgressBar label="皇帝宠爱" value={state.emperor.favor} />
                </label>
                <label>
                  信任{" "}
                  <ProgressBar label="皇帝信任" value={state.emperor.trust} />
                </label>
              </div>
            </div>
            <div className="current-affair">
              <span>
                {hasActiveStory ? "当前剧情" : "今日大事"} · {currentStoryLabel}
              </span>
              <h3>{currentStoryTitle}</h3>
              <p>{currentStorySummary}</p>
              <button
                className="primary"
                onClick={() => onStartChapter(currentStorySceneId)}
              >
                {hasActiveStory ? "继续当前剧情" : "开启今日大事"}
              </button>
            </div>
            <div className="palace-actions" aria-label="寝宫行动">
              <div className="action-economy">
                <div>
                  <span>今日安排</span>
                  <b>
                    闲暇 {state.actionPoints}/{ACTION_POINT_CAP}
                  </b>
                </div>
                <div>
                  <span>宫廷注目 · {attentionStage}</span>
                  <b>{attention}</b>
                </div>
                <i aria-hidden="true">
                  <span style={{ width: `${attention}%` }} />
                </i>
                <p>所有行动消耗 1 闲暇；公开露面会提高注目。</p>
              </div>
              <button
                disabled={
                  state.actionPoints < 1 ||
                  studiedThisChapter ||
                  state.stats.体力 < 1
                }
                onClick={() =>
                  takeAction(
                    "study",
                    `修习完成 · 修习点 +${residence.id === "tingyu" ? 2 : 1}`,
                  )
                }
              >
                <span>修习</span>
                <b>
                  {studiedThisChapter
                    ? "本章已修"
                    : state.stats.体力 < 1
                      ? "体力不足"
                      : `成长 +${residence.id === "tingyu" ? 2 : 1}`}
                </b>
                <small>闲暇 −1 · 体力 −1 · 低调</small>
              </button>
              <button
                disabled={state.actionPoints < 1 || attendedThisChapter}
                onClick={() =>
                  takeAction(
                    "attend",
                    state.emperor.favor + 6 >= 40
                      ? `御前伴驾 · 宠爱 +${residence.id === "zhaoyang" ? 8 : 6} · 顾明华关系 -10`
                      : `御前伴驾 · 宠爱 +${residence.id === "zhaoyang" ? 8 : 6}`,
                  )
                }
              >
                <span>伴驾</span>
                <b>
                  {attendedThisChapter
                    ? "本章已伴驾"
                    : `宠爱 +${residence.id === "zhaoyang" ? 8 : 6}`}
                </b>
                <small>闲暇 −1 · 注目 +3</small>
              </button>
              <button
                disabled={
                  state.actionPoints < 1 ||
                  confidedThisChapter ||
                  !attendedThisChapter ||
                  state.stats.体力 < 1
                }
                onClick={() =>
                  takeAction(
                    "confide",
                    state.stats.才学 >= 4
                      ? `灯下夜谈 · 信任 +${residence.id === "fengyi" ? 7 : 5} · 宠爱 +2`
                      : `灯下夜谈 · 信任 +${residence.id === "fengyi" ? 7 : 5}`,
                  )
                }
              >
                <span>夜谈</span>
                <b>
                  {confidedThisChapter
                    ? "本章已夜谈"
                    : state.stats.体力 < 1
                      ? "体力不足"
                      : !attendedThisChapter
                        ? "需帝驾在宫"
                        : `信任 +${residence.id === "fengyi" ? 7 : 5}`}
                </b>
                <small>闲暇 −1 · 体力 −1 · 注目 +1</small>
              </button>
              <button
                disabled={state.actionPoints < 1 || state.stats.银钱 < 1}
                onClick={() =>
                  takeAction(
                    "network",
                    `宫中走动 · ${networkTarget}关系 +${residence.id === "chenglou" ? 15 : 10}`,
                  )
                }
              >
                <span>走动</span>
                <b>
                  {state.stats.银钱 < 1
                    ? "银钱不足"
                    : `关系 +${residence.id === "chenglou" ? 15 : 10}`}
                </b>
                <small>闲暇 −1 · 银钱 −1 · 注目 +2</small>
              </button>
              <button
                disabled={state.actionPoints < 1 || state.stats.体力 >= 10}
                onClick={() =>
                  takeAction(
                    "rest",
                    `闭门休息 · 体力 +${residence.id === "jinghe" ? 2 : 1}`,
                  )
                }
              >
                <span>休息</span>
                <b>
                  {state.stats.体力 >= 10
                    ? "体力已满"
                    : `体力 +${residence.id === "jinghe" ? 2 : 1}`}
                </b>
                <small>闲暇 −1 · 低调</small>
              </button>
            </div>
            {actionFeedback && (
              <p className="action-feedback" role="status" aria-live="polite">
                {actionFeedback}
              </p>
            )}
            <section
              className="home-growth"
              aria-labelledby="home-growth-title"
            >
              <div className="home-growth-heading">
                <div>
                  <span className="section-label">修身进境</span>
                  <h3 id="home-growth-title">我的成长</h3>
                </div>
              </div>
              <dl className="home-resources" aria-label="当前资源">
                <div>
                  <dt>体力</dt>
                  <dd>{state.stats.体力}/10</dd>
                  <small>行动消耗</small>
                </div>
                <div>
                  <dt>银钱</dt>
                  <dd>{state.stats.银钱}</dd>
                  <small>打点往来</small>
                </div>
                <div>
                  <dt>名望</dt>
                  <dd>{state.stats.名望}</dd>
                  <small>清议晋位</small>
                </div>
                <div>
                  <dt>修习点</dt>
                  <dd>{state.growthPoints}</dd>
                  <small>提升能力</small>
                </div>
              </dl>
              <div className="home-growth-list">
                {growthStats.map((stat) => {
                  const cost = growthCost(state.stats[stat]);
                  const capped = !Number.isFinite(cost);
                  return (
                    <button
                      key={stat}
                      disabled={capped || state.growthPoints < cost}
                      onClick={() => onGrow(stat)}
                      aria-label={`${stat}当前${state.stats[stat]}，${capped ? "等待剧情突破" : `提升消耗${cost}点`}`}
                    >
                      <span>
                        {stat} <b>{state.stats[stat]}</b>
                      </span>
                      <i aria-hidden="true">
                        <span style={{ width: `${state.stats[stat] * 10}%` }} />
                      </i>
                      <small>
                        {capped ? "待剧情突破" : `提升需 ${cost} 点`}
                      </small>
                    </button>
                  );
                })}
              </div>
            </section>
          </section>
        </>
      )}

      {tab === "character" && (
        <section className="character-panel" aria-labelledby="character-title">
          <div className="character-identity-strip">
            <span className="section-label">内廷人物志</span>
            <h3 id="character-title">{state.name}</h3>
            <p>
              {state.rank ?? "答应"} · {origins[state.origin].name} · 命宫{" "}
              {zodiacs[state.zodiac].name}
            </p>
          </div>
          <div className="contact-section-heading">
            <span className="section-label">关系与暗流</span>
            <h3>宫中人脉</h3>
            <p>每一段亲疏，都可能在后来的宫门里回响。</p>
          </div>
          <div className="contact-book" aria-label="已认识的宫中人物">
            {knownContacts.map((contact) => {
              const relationKey = contact.relationKey;
              return (
                <article
                  className={`contact-dossier ${contact.dead ? "deceased" : ""}`}
                  key={contact.id}
                >
                  {contact.dead && (
                    <span className="deceased-seal" aria-label="人物已故">
                      故
                    </span>
                  )}
                  {"portrait" in contact && contact.portrait ? (
                    <div
                      className="contact-portrait"
                      role="img"
                      aria-label={`${contact.name}人物立绘`}
                      style={{
                        backgroundImage: `url(${contact.portrait})`,
                        backgroundPosition: contact.focalPoint,
                      }}
                    />
                  ) : (
                    <div className="imperial-monogram" aria-hidden="true">
                      {contact.name.slice(0, 1)}
                    </div>
                  )}
                  <div className="contact-copy">
                    <span>
                      {contact.dead ? `已故 · ${contact.rank}` : contact.rank}
                    </span>
                    <h3>{contact.name}</h3>
                    <p>{contact.description}</p>
                  </div>
                  {contact.id === "emperor" ? (
                    <div className="contact-bond emperor-contact-bond">
                      <b>当前关系 · {emperorFavorStage}</b>
                      <label>
                        宠爱
                        <ProgressBar
                          label="皇帝宠爱"
                          value={state.emperor.favor}
                        />
                      </label>
                      <label>
                        信任
                        <ProgressBar
                          label="皇帝信任"
                          value={state.emperor.trust}
                        />
                      </label>
                    </div>
                  ) : (
                    relationKey && (
                      <div className="contact-bond">
                        <RelationshipCard
                          label={relationKey}
                          value={state.relations[relationKey]}
                        />
                        {state.relationshipStrain[relationKey] > 0 && (
                          <small className="strain-warning">
                            暗流累积 · {state.relationshipStrain[relationKey]}
                            /2
                            {relationKey === "顾明华" && attention >= 16
                              ? " · 位分越高越易招忌"
                              : ""}
                          </small>
                        )}
                      </div>
                    )
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {tab === "journal" && (
        <section className="hub-panel" aria-labelledby="chapter-list-title">
          <span className="section-label">行录</span>
          <h3 id="chapter-list-title">宫门纪事</h3>
          <div className="journal-sections" aria-label="行录分类">
            <button
              aria-pressed={journalSection === "main"}
              onClick={() => setJournalSection("main")}
            >
              主线章回
            </button>
            <button
              aria-pressed={journalSection === "side"}
              onClick={() => setJournalSection("side")}
            >
              支线秘录
              {unlockedSideStories.length > 0 && (
                <b>{unlockedSideStories.length}</b>
              )}
            </button>
          </div>
          {journalSection === "main" && (
            <>
              <div className="chapter-list" data-page={chapterPage}>
                <article className="chapter-entry completed">
                  <div
                    className="chapter-art chapter-art-one"
                    role="img"
                    aria-label="春日宫门"
                  />
                  <div>
                    <span>第一章</span>
                    <h3>绣鸭献瑞</h3>
                    <p>初入宫门，在御前失仪与机变之间取得封位。</p>
                  </div>
                  <b>{chapterOneDone ? "已完成" : "进行中"}</b>
                </article>
                <article
                  className={`chapter-entry ${chapterTwoDone ? "completed" : chapterOneDone ? "available" : "locked"}`}
                >
                  <div
                    className="chapter-art chapter-art-two"
                    role="img"
                    aria-label="宫宴中的空席"
                  />
                  <div>
                    <span>第二章</span>
                    <h3>一席之争</h3>
                    <p>核对宫宴名册，处理两张帖子与唯一的座位。</p>
                  </div>
                  {chapterTwoDone ? (
                    <b>已完成</b>
                  ) : chapterOneDone ? (
                    <button
                      className="primary"
                      onClick={() => onStartChapter("day2_summons")}
                    >
                      进入章节
                    </button>
                  ) : (
                    <b>尚未解锁</b>
                  )}
                </article>
                <article
                  className={`chapter-entry ${chapterThreeDone ? "completed" : chapterTwoDone ? "available" : "locked"}`}
                >
                  <div
                    className="chapter-art chapter-art-two"
                    role="img"
                    aria-label="冷香与空席"
                  />
                  <div>
                    <span>第三章</span>
                    <h3>合欢香冷</h3>
                    <p>查明署着你名字的毒香，决定证据与人命谁先留下。</p>
                  </div>
                  {chapterThreeDone ? (
                    <b>已完成</b>
                  ) : chapterTwoDone ? (
                    <button
                      className="primary"
                      onClick={() => onStartChapter("day3_incense")}
                    >
                      进入章节
                    </button>
                  ) : (
                    <b>尚未解锁</b>
                  )}
                </article>
                <article
                  className={`chapter-entry ${chapterFourDone ? "completed" : chapterThreeDone ? "available" : "locked"}`}
                >
                  <div
                    className="chapter-art chapter-art-one"
                    role="img"
                    aria-label="雨夜宫门"
                  />
                  <div>
                    <span>第四章</span>
                    <h3>雨夜空印</h3>
                    <p>追查三道同印调令与藏在药箱下的军粮账。</p>
                  </div>
                  {chapterFourDone ? (
                    <b>已完成</b>
                  ) : chapterThreeDone ? (
                    <button
                      className="primary"
                      onClick={() => onStartChapter("day4_blank_seal")}
                    >
                      进入章节
                    </button>
                  ) : (
                    <b>尚未解锁</b>
                  )}
                </article>
                {storyArc.slice(4).map((chapter, index) => {
                  const number = index + 5;
                  const chapterId = chapter.id as ChapterId;
                  const previousId = `chapter-${number - 1}` as ChapterId;
                  const done = state.completedChapters.includes(chapterId);
                  const available =
                    state.completedChapters.includes(previousId);
                  return (
                    <article
                      key={chapter.id}
                      className={`chapter-entry ${done ? "completed" : available ? "available" : "locked"}`}
                    >
                      <div
                        className="chapter-art"
                        role="img"
                        aria-label={`${chapter.title}章节插图`}
                        style={{
                          backgroundImage: `url(${laterChapterArt[index]})`,
                        }}
                      />
                      <div>
                        <span>第{number}章</span>
                        <h3>{chapter.title}</h3>
                        <p>{chapter.theme}</p>
                      </div>
                      {done ? (
                        <b>已完成</b>
                      ) : available ? (
                        <button
                          className="primary"
                          onClick={() => onStartChapter(`day${number}_1`)}
                        >
                          进入章节
                        </button>
                      ) : (
                        <b>尚未解锁</b>
                      )}
                    </article>
                  );
                })}
              </div>
              <div className="chapter-pager" aria-label="章节分页">
                <button
                  className="secondary"
                  disabled={chapterPage === 0}
                  onClick={() => setChapterPage((page) => page - 1)}
                >
                  上一卷
                </button>
                <span>
                  {chapterPage * 4 + 1}–{chapterPage * 4 + 4}章
                </span>
                <button
                  className="secondary"
                  disabled={chapterPage === 2}
                  onClick={() => setChapterPage((page) => page + 1)}
                >
                  下一卷
                </button>
              </div>
            </>
          )}
          {journalSection === "side" && (
            <div className="side-story-list">
              {recordedSideStories.length > 0 ? (
                recordedSideStories.map((story) => {
                  const resolved = state.resolvedSideStories.includes(story.id);
                  return (
                    <article
                      key={story.id}
                      className={story.danger ? "danger" : undefined}
                    >
                      <span>{story.eyebrow}</span>
                      <h4>{story.title}</h4>
                      <p>{story.text}</p>
                      {resolved ? (
                        <b>已了结</b>
                      ) : (
                        <button
                          className="primary"
                          onClick={() => setActiveSideStory(story)}
                        >
                          进入支线
                        </button>
                      )}
                    </article>
                  );
                })
              ) : (
                <div className="side-story-empty">
                  <span aria-hidden="true">秘</span>
                  <p>
                    尚无支线入录。人物关系、珍藏与剧情抉择都可能引出新事件。
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {tab === "rewards" && (
        <section
          className="reward-shelf hub-panel"
          aria-labelledby="reward-title"
        >
          <span className="section-label">成长与奖励</span>
          <h3 id="reward-title">所得珍藏</h3>
          {state.rewards.length ? (
            <div className="reward-list">
              {state.rewards.map((reward) => (
                <article
                  key={reward.id}
                  className={reward.asset ? "reward-with-art" : undefined}
                >
                  {reward.asset && (
                    <div
                      className="reward-art"
                      role="img"
                      aria-label={`${reward.name}插图`}
                      style={{ backgroundImage: `url(${reward.asset})` }}
                    />
                  )}
                  <div className="reward-heading">
                    <b>{reward.name}</b>
                    <span>
                      {reward.kind === "title"
                        ? "称号"
                        : reward.kind === "item"
                          ? "御赐道具"
                          : "纪念"}
                    </span>
                  </div>
                  <p>{reward.description}</p>
                  <RewardIntel reward={reward} />
                  {reward.kind !== "title" && (
                    <div className="reward-actions">
                      <button
                        aria-pressed={state.tags.includes(
                          `carried_reward:${reward.id}`,
                        )}
                        onClick={() => onToggleCarryReward(reward)}
                      >
                        {state.tags.includes(`carried_reward:${reward.id}`)
                          ? "已携带"
                          : "携带"}
                      </button>
                      <button
                        onClick={() =>
                          setPendingReward({ reward, mode: "gift" })
                        }
                      >
                        赠予
                      </button>
                      <button
                        onClick={() =>
                          setPendingReward({ reward, mode: "discard" })
                        }
                      >
                        丢弃
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p>完成章节后，所得会收录在此。</p>
          )}
        </section>
      )}
      {pendingReward?.mode === "gift" && !pendingReward.recipient && (
        <div className="gift-recipient-backdrop" role="presentation">
          <section
            className="gift-recipient-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gift-title"
          >
            <span className="section-label">选择收礼人</span>
            <h3 id="gift-title">将「{pendingReward.reward.name}」赠予谁？</h3>
            <p>赠礼会提升关系，但你将失去物件及相关隐藏剧情入口。</p>
            <div>
              {knownContacts
                .filter((contact) => contact.relationKey && !contact.dead)
                .map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() =>
                      setPendingReward({
                        ...pendingReward,
                        recipient: contact.relationKey,
                      })
                    }
                  >
                    <b>{contact.name}</b>
                    <span>{contact.rank}</span>
                  </button>
                ))}
            </div>
            <button
              className="secondary"
              onClick={() => setPendingReward(undefined)}
            >
              取消赠予
            </button>
          </section>
        </div>
      )}
      {newlyUnlockedSideStory && (
        <div className="side-story-notice-backdrop" role="presentation">
          <section
            className={`side-story-notice ${newlyUnlockedSideStory.danger ? "danger" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="side-story-notice-title"
          >
            <div className="side-story-seal" aria-hidden="true">
              {newlyUnlockedSideStory.danger ? "危" : "秘"}
            </div>
            <span className="section-label">新支线已现</span>
            <h3 id="side-story-notice-title">{newlyUnlockedSideStory.title}</h3>
            <p>触发条件已经达成。事件已收入行录，不会打断你正在推进的主线。</p>
            <div>
              <button
                className="primary"
                onClick={() => {
                  onAcknowledgeSideStory(newlyUnlockedSideStory.id);
                  setTab("journal");
                  setJournalSection("side");
                }}
              >
                前往支线秘录
              </button>
              <button
                className="secondary"
                onClick={() =>
                  onAcknowledgeSideStory(newlyUnlockedSideStory.id)
                }
              >
                稍后查看
              </button>
            </div>
          </section>
        </div>
      )}
      {pendingReward &&
        (pendingReward.mode === "discard" || pendingReward.recipient) && (
          <ConfirmationDialog
            eyebrow={pendingReward.mode === "gift" ? "移交珍藏" : "舍弃珍藏"}
            title={`${pendingReward.mode === "gift" ? `赠予${pendingReward.recipient}` : "丢弃"}「${pendingReward.reward.name}」？`}
            description={
              pendingReward.mode === "gift"
                ? "对方关系会提升，但你将失去此物及其隐藏剧情入口。"
                : "此物会从珍藏中永久移除，相关隐藏剧情也可能无法触发。"
            }
            confirmLabel={
              pendingReward.mode === "gift" ? "确认赠出" : "确认丢弃"
            }
            cancelLabel="留下此物"
            onCancel={() => setPendingReward(undefined)}
            onConfirm={() => {
              onRelinquishReward(
                pendingReward.reward,
                pendingReward.mode,
                pendingReward.recipient,
              );
              setPendingReward(undefined);
            }}
          />
        )}
    </div>
  );
}

export default function Game() {
  const [screen, setScreen] = useState<"title" | "origin" | "play" | "hub">(
    "title",
  );
  const [state, setState] = useState<GameState | null>(null);
  const [confirmingRestart, setConfirmingRestart] = useState(false);
  const [savedOnDisk, setSavedOnDisk] = useState(false);
  const hasSave = savedOnDisk || state !== null;
  useEffect(() => {
    const timer = window.setTimeout(
      () => setSavedOnDisk(!!localStorage.getItem(SAVE_KEY)),
      0,
    );
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (state) localStorage.setItem(SAVE_KEY, serialize(state));
  }, [state]);
  const scene = useMemo(() => (state ? scenes[state.sceneId] : null), [state]);
  const laterResultChapter = state?.sceneId.match(/^day(\d+)_result$/)?.[1];
  function restart() {
    localStorage.removeItem(SAVE_KEY);
    setState(null);
    setSavedOnDisk(false);
    setConfirmingRestart(false);
    setScreen("origin");
  }
  function continueRun() {
    const s = deserialize(localStorage.getItem(SAVE_KEY) ?? "");
    if (s) {
      setState(s);
      setScreen(resumeDestination(s));
    }
  }
  function choose(choice: Choice) {
    if (!state || !scene) return;
    setState(applyEffect(state, choice.effect, choice.id, choice.next));
  }
  return (
    <GameShell
      key={`${screen}-${state?.sceneId ?? "none"}`}
      viewId={`${screen}-${state?.sceneId ?? "none"}`}
      immersive={
        screen === "play" && !!scene?.portrait && scene.portrait !== "duck"
      }
      compact={screen === "play" && !!scene}
      backgroundId={scene?.backgroundId}
    >
      <div
        className="game-view"
        inert={confirmingRestart ? true : undefined}
        aria-hidden={confirmingRestart || undefined}
      >
        {screen === "title" && (
          <Title
            hasSave={hasSave}
            onNew={() => setScreen("origin")}
            onContinue={continueRun}
          />
        )}{" "}
        {screen === "origin" && (
          <Origin
            onStart={(n, o, z) => {
              setState(createGame(n, o, undefined, z));
              setScreen("play");
            }}
          />
        )}{" "}
        {screen === "hub" && state && (
          <ChapterHub
            state={state}
            onStartChapter={(sceneId) => {
              setState({ ...state, sceneId });
              setScreen("play");
            }}
            onGrow={(stat) => setState(spendGrowthPoint(state, stat))}
            onAction={(action) => setState(performPalaceAction(state, action))}
            onReturn={() => setScreen("play")}
            onAcknowledgeSideStory={(storyId) =>
              setState({
                ...state,
                tags: [
                  ...new Set([...state.tags, `side_story_prompted:${storyId}`]),
                ],
              })
            }
            onResolveSideStory={(story, choice) => {
              let resolved = applyEffect(
                state,
                choice.effect,
                choice.id,
                state.sceneId,
              );
              resolved = {
                ...resolved,
                emperor: {
                  favor: Math.max(
                    0,
                    Math.min(
                      100,
                      resolved.emperor.favor + (choice.emperor?.favor ?? 0),
                    ),
                  ),
                  trust: Math.max(
                    0,
                    Math.min(
                      100,
                      resolved.emperor.trust + (choice.emperor?.trust ?? 0),
                    ),
                  ),
                },
                resolvedSideStories: [
                  ...new Set([...resolved.resolvedSideStories, story.id]),
                ],
              };
              if (choice.demote) {
                const index = Math.max(
                  0,
                  rankOrder.indexOf(resolved.rank ?? "答应") - 1,
                );
                resolved = { ...resolved, rank: rankOrder[index] };
              }
              setState(resolved);
            }}
            onToggleCarryReward={(reward) => {
              const carryTag = `carried_reward:${reward.id}`;
              setState({
                ...state,
                tags: state.tags.includes(carryTag)
                  ? state.tags.filter((tag) => tag !== carryTag)
                  : [...state.tags, carryTag],
              });
            }}
            onRelinquishReward={(reward, mode, recipient) => {
              setState({
                ...state,
                rewards: state.rewards.filter((item) => item.id !== reward.id),
                relations:
                  mode === "gift" && recipient
                    ? {
                        ...state.relations,
                        [recipient]: Math.min(
                          100,
                          state.relations[recipient] + 10,
                        ),
                      }
                    : state.relations,
                tags: [
                  ...new Set([
                    ...state.tags.filter(
                      (tag) => tag !== `carried_reward:${reward.id}`,
                    ),
                    `${mode === "gift" ? "gifted" : "discarded"}_${reward.id}`,
                  ]),
                ],
              });
            }}
          />
        )}{" "}
        {screen === "play" && state && state.sceneId === "evaluation" && (
          <ImperialEdict
            state={state}
            onFinish={setState}
            onRestart={() => setConfirmingRestart(true)}
            onOpenJournal={() => setScreen("hub")}
          />
        )}{" "}
        {screen === "play" && state && state.sceneId === "result" && (
          <RankReveal
            state={state}
            onRestart={() => setConfirmingRestart(true)}
            onOpenJournal={() => setScreen("hub")}
            onNext={() => {
              setState(completeChapter(state, "chapter-1"));
              setScreen("hub");
            }}
          />
        )}{" "}
        {screen === "play" && state && state.sceneId === "day2_result" && (
          <DayTwoResult
            state={state}
            onContinue={() => {
              setState(completeChapter(state, "chapter-2"));
              setScreen("hub");
            }}
            onRestart={() => setConfirmingRestart(true)}
            onOpenJournal={() => setScreen("hub")}
          />
        )}{" "}
        {screen === "play" && state && state.sceneId === "day3_result" && (
          <DayThreeResult
            state={state}
            onContinue={() => {
              setState(completeChapter(state, "chapter-3"));
              setScreen("hub");
            }}
            onRestart={() => setConfirmingRestart(true)}
            onOpenJournal={() => setScreen("hub")}
          />
        )}{" "}
        {screen === "play" && state && state.sceneId === "day4_result" && (
          <DayFourResult
            state={state}
            onContinue={() => {
              setState(completeChapter(state, "chapter-4"));
              setScreen("hub");
            }}
            onRestart={() => setConfirmingRestart(true)}
            onOpenJournal={() => setScreen("hub")}
          />
        )}{" "}
        {screen === "play" &&
          state &&
          laterResultChapter &&
          Number(laterResultChapter) >= 5 && (
            <LaterChapterResult
              state={state}
              chapter={Number(laterResultChapter)}
              onContinue={() => {
                const completed = completeChapter(
                  state,
                  `chapter-${laterResultChapter}` as ChapterId,
                );
                setState(completed);
                setScreen("hub");
              }}
              onOpenJournal={() => setScreen("hub")}
            />
          )}{" "}
        {screen === "play" && state && scene && (
          <DialoguePanel
            state={state}
            onChoose={choose}
            onLeaveStory={() => setScreen("hub")}
          />
        )}{" "}
      </div>
      {confirmingRestart && (
        <ConfirmationDialog
          eyebrow="撤回名册"
          title="重新入宫？"
          description="当前选择与封赏会被抹去，无法复原。"
          confirmLabel="确定重开"
          cancelLabel="留在此局"
          onCancel={() => setConfirmingRestart(false)}
          onConfirm={restart}
        />
      )}
    </GameShell>
  );
}
