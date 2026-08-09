import type { GameState } from "../types";

export type LegitimacyBasisKind =
  | "ritual-precedent"
  | "coalition-support"
  | "public-procedure"
  | "concession"
  | "imperial-mandate";

export type PoliticalOffice =
  | "inner-court"
  | "regency"
  | "succession"
  | "reform";

export type PoliticalClaimant =
  | "player"
  | "queen"
  | "gu"
  | "joint-palaces"
  | "women-council"
  | "public-council";

export type LegitimacyBasis = {
  id: string;
  kind: LegitimacyBasisKind;
  office: PoliticalOffice;
  beneficiary: PoliticalClaimant;
  sourceChoiceId: string;
  label: string;
  provenance: string;
  status: "active" | "spent" | "superseded";
};

export type LegitimacyAlternative = {
  id: string;
  label: string;
  allOf: string[];
  beneficiary: PoliticalClaimant;
  explanation: string;
};

export type LegitimacyQuestion = {
  id: "player-regency";
  office: "regency";
  claimant: "player";
  alternatives: LegitimacyAlternative[];
  vetoCopy: string;
  counterChoices: Array<"joint-palaces" | "public-council" | "limited-regency">;
};

type ContextFact = {
  id: string;
  sourceChoiceId: string;
  label: string;
  explanation: string;
};

const regencyBases: LegitimacyBasis[] = [
  {
    id: "old-rule-personal-review",
    kind: "ritual-precedent",
    office: "regency",
    beneficiary: "player",
    sourceChoiceId: "day8_1_growth",
    label: "旧例可援",
    provenance: "你曾从旧宫规中找出两宫共同复核凤印的成例。",
    status: "active",
  },
  {
    id: "mediator-concession",
    kind: "concession",
    office: "regency",
    beneficiary: "player",
    sourceChoiceId: "day8_2_2",
    label: "调停有约",
    provenance: "你曾以保留两宫体面为条件，换得亲自复核文书的职责。",
    status: "active",
  },
  {
    id: "joint-review-coalition",
    kind: "coalition-support",
    office: "regency",
    beneficiary: "player",
    sourceChoiceId: "day8_3_1",
    label: "两宫共认",
    provenance: "凤印曾由两宫共管，而你被写入复核之列。",
    status: "active",
  },
  {
    id: "women-council-procedure",
    kind: "public-procedure",
    office: "regency",
    beneficiary: "player",
    sourceChoiceId: "day8_3_3",
    label: "女官留名",
    provenance: "你主持建立的女官议事已经留下公开复核记录。",
    status: "active",
  },
  {
    id: "balanced-regency-concession",
    kind: "concession",
    office: "regency",
    beneficiary: "player",
    sourceChoiceId: "day10_1_1",
    label: "三方分权",
    provenance: "你先把决策、掌印与军门拆开，主动限制了自己的权力。",
    status: "active",
  },
  {
    id: "gu-compact-coalition",
    kind: "coalition-support",
    office: "regency",
    beneficiary: "player",
    sourceChoiceId: "day10_1_2",
    label: "顾氏共署",
    provenance: "顾明华掌门、你掌印，女官议事掌粮，三方职责已有约定。",
    status: "active",
  },
  {
    id: "public-council-procedure",
    kind: "public-procedure",
    office: "regency",
    beneficiary: "public-council",
    sourceChoiceId: "day10_1_3",
    label: "朝臣公议",
    provenance: "三权已经交给公开议政会，因此只支持公开联署。",
    status: "active",
  },
];

const regencyFacts: ContextFact[] = [
  {
    id: "false-order-proven",
    sourceChoiceId: "day10_2_1",
    label: "假令已破",
    explanation: "东珠能证明口谕有假，却不能证明该由谁摄政。",
  },
  {
    id: "vacancy-witnessed",
    sourceChoiceId: "day10_2_3",
    label: "御前空缺有证",
    explanation: "医官能证明皇帝无法亲署，却不能替任何人授予权力。",
  },
];

export const playerRegencyQuestion: LegitimacyQuestion = {
  id: "player-regency",
  office: "regency",
  claimant: "player",
  alternatives: [
    {
      id: "precedent-and-coalition",
      label: "旧例与共署",
      allOf: ["old-rule-personal-review", "gu-compact-coalition"],
      beneficiary: "player",
      explanation: "旧例说明你可以复核，顾氏共署说明此刻有人承认你落笔。",
    },
    {
      id: "public-record-and-concession",
      label: "公议与自限",
      allOf: ["women-council-procedure", "balanced-regency-concession"],
      beneficiary: "player",
      explanation: "公开记录与分权承诺共同限制了这次摄政。",
    },
    {
      id: "shared-duty-and-concession",
      label: "共管与让步",
      allOf: ["joint-review-coalition", "mediator-concession"],
      beneficiary: "player",
      explanation: "两宫曾承认你的复核职责，你也以让步换取了有限授权。",
    },
  ],
  vetoCopy:
    "你证明了这道口谕不能用，却还没有说明为何该由你落笔。明日百官问起，凭哪一条旧例、哪几个人的名字，说这是摄政，不是夺权？",
  counterChoices: ["joint-palaces", "public-council", "limited-regency"],
};

export type LegitimacyEvaluation = {
  question: LegitimacyQuestion;
  bases: LegitimacyBasis[];
  facts: ContextFact[];
  acceptedAlternative?: LegitimacyAlternative;
  accepted: boolean;
};

export function evaluatePlayerRegency(
  state: Pick<GameState, "history">,
): LegitimacyEvaluation {
  const bases = regencyBases.filter((basis) =>
    state.history.includes(basis.sourceChoiceId),
  );
  const facts = regencyFacts.filter((fact) =>
    state.history.includes(fact.sourceChoiceId),
  );
  const acceptedAlternative = playerRegencyQuestion.alternatives.find(
    (alternative) =>
      alternative.beneficiary === playerRegencyQuestion.claimant &&
      alternative.allOf.every((id) =>
        bases.some(
          (basis) =>
            basis.id === id &&
            basis.office === playerRegencyQuestion.office &&
            basis.beneficiary === playerRegencyQuestion.claimant &&
            basis.status === "active",
        ),
      ),
  );
  return {
    question: playerRegencyQuestion,
    bases,
    facts,
    acceptedAlternative,
    accepted: Boolean(acceptedAlternative),
  };
}

export function legitimacyStatements(state: Pick<GameState, "history">) {
  const evaluation = evaluatePlayerRegency(state);
  const statements = evaluation.bases
    .filter(
      (basis) => basis.office === "regency" && basis.beneficiary === "player",
    )
    .map((basis) => `${basis.label}：${basis.provenance}`);
  if (statements.length === 0 && evaluation.facts.length > 0) {
    return evaluation.facts.map((fact) => `${fact.label}：${fact.explanation}`);
  }
  return statements.slice(0, 2);
}

export function resolveLegitimacyTransition(
  state: GameState,
  choiceId: string,
): GameState {
  if (choiceId !== "day10_3_1") return state;
  const evaluation = evaluatePlayerRegency(state);
  if (!evaluation.acceptedAlternative) {
    return { ...state, sceneId: "day10_legitimacy_veto" };
  }
  return {
    ...state,
    relations: {
      ...state.relations,
      崔氏: Math.min(100, state.relations.崔氏 + 10),
    },
    tags: [
      ...new Set([
        ...state.tags,
        "ch10_player_regent",
        "cui_accepts_legitimate_regency",
        `legitimacy:regency:${evaluation.acceptedAlternative.id}`,
      ]),
    ],
  };
}
