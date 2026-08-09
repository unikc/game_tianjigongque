import type { GameState } from "../types";

export type DocumentId =
  | "seat-register"
  | "medical-record"
  | "blank-seal"
  | "relief-ledger"
  | "military-order"
  | "phoenix-record"
  | "blood-edict";

export type DocumentStage =
  | "possessed"
  | "examined"
  | "authenticated"
  | "circulated"
  | "published"
  | "destroyed";

export type DocumentFootprintEntry = {
  id: DocumentId;
  label: string;
  stages: DocumentStage[];
};

export type DocumentFootprint = {
  entries: DocumentFootprintEntry[];
  systemsTouched: number;
  publicChains: number;
  /** Visibility: how easily others can portray the player as the network hub. */
  scapegoatExposure: "none" | "emerging" | "central";
  /** Attributable acts are separate from centrality and never imply guilt alone. */
  liabilityFlags: string[];
};

type DocumentRule = {
  id: DocumentId;
  label: string;
  stageTags: Partial<Record<DocumentStage, readonly string[]>>;
  rewardIds?: readonly string[];
  possessedTags?: readonly string[];
};

const documentRules: readonly DocumentRule[] = [
  {
    id: "seat-register",
    label: "席位名册",
    rewardIds: ["keepsake-seat-register"],
    stageTags: {
      examined: [
        "day2_kept_evidence",
        "day2_outsider_hand",
        "knows_register_forger",
      ],
      authenticated: ["knows_register_forger"],
      circulated: ["holds_register_leverage"],
    },
  },
  {
    id: "medical-record",
    label: "脉案",
    stageTags: {
      examined: ["day3_medical_record", "ch5_wen_motive_known"],
      authenticated: ["known_wen_truth", "ch8_wen_testifies"],
      circulated: ["ch5_wen_exposed", "ch8_controlled_witness"],
      published: ["ch5_truth_public", "ch8_wen_forged"],
    },
  },
  {
    id: "blank-seal",
    label: "空印原件",
    possessedTags: ["empty_seal_player"],
    stageTags: {
      examined: [
        "day4_paper_missing",
        "day4_burned_order",
        "empty_seal_traced",
      ],
      circulated: [
        "empty_seal_player",
        "empty_seal_queen",
        "day4_forgery_complicit",
        "ch11_counterfeit_retreat",
      ],
      destroyed: ["empty_seal_burned"],
    },
  },
  {
    id: "relief-ledger",
    label: "赈银与河堤账",
    stageTags: {
      examined: ["ch6_bank_trail"],
      circulated: [
        "ch6_split_ledger",
        "ch6_queen_aid",
        "ch6_gu_leverage",
        "ch6_freeze_funds",
      ],
      published: ["ch6_public_accounts", "ch11_broadcast_ledger"],
    },
  },
  {
    id: "military-order",
    label: "军粮与宫门调令",
    rewardIds: ["item-broken-arrow", "keepsake-gate-order"],
    stageTags: {
      examined: ["ch7_order_captured"],
      authenticated: ["ch7_pei_truth", "ch8_pei_disputes_evidence"],
      circulated: ["ch7_shadow_orders", "ch10_follow_false_order"],
      published: ["ch11_gate_informed_public", "ch11_gate_public_resistance"],
    },
  },
  {
    id: "phoenix-record",
    label: "凤印名册",
    rewardIds: ["item-phoenix-impression"],
    stageTags: {
      examined: ["ch8_demand_ledger", "ch8_names_heard"],
      circulated: ["ch8_council", "ch8_dual_rule", "ch8_shares_queen_guilt"],
    },
  },
  {
    id: "blood-edict",
    label: "假口谕与血诏",
    stageTags: {
      examined: ["ch10_pearl_proof", "knows_false_edict_pearl"],
      authenticated: ["imperial_private_mark", "ch10_public_signature"],
      circulated: [
        "ch10_dual_signature",
        "ch11_counterfeit_retreat",
        "ch11_truth_traded",
      ],
    },
  },
] as const;

const stageOrder: readonly DocumentStage[] = [
  "possessed",
  "examined",
  "authenticated",
  "circulated",
  "published",
  "destroyed",
];

export function deriveDocumentFootprint(state: GameState): DocumentFootprint {
  const rewards = new Set(state.rewards.map((reward) => reward.id));
  const tags = new Set(state.tags);
  const entries = documentRules.flatMap<DocumentFootprintEntry>((rule) => {
    const stages = stageOrder.filter((stage) => {
      if (
        stage === "possessed" &&
        (rule.rewardIds?.some((rewardId) => rewards.has(rewardId)) ||
          rule.possessedTags?.some((tag) => tags.has(tag)))
      )
        return true;
      return rule.stageTags[stage]?.some((tag) => tags.has(tag)) ?? false;
    });
    return stages.length ? [{ id: rule.id, label: rule.label, stages }] : [];
  });
  const publicChains = entries.filter((entry) =>
    entry.stages.includes("published"),
  ).length;
  const systemsTouched = entries.length;
  const scapegoatExposure =
    systemsTouched >= 5 && publicChains >= 2
      ? "central"
      : systemsTouched >= 3
        ? "emerging"
        : "none";
  const liabilityTags = [
    "day4_forgery_complicit",
    "liability:empty_seal_signed_archive",
    "ch7_shadow_orders",
    "ch10_follow_false_order",
    "ch10_player_regent",
    "ch11_counterfeit_retreat",
    "ch11_truth_traded",
  ];
  const liabilityFlags = liabilityTags.filter((tag) => tags.has(tag));
  return {
    entries,
    systemsTouched,
    publicChains,
    scapegoatExposure,
    liabilityFlags,
  };
}
