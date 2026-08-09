import type { RelationKey } from "./types";

export type RelationshipProfile = {
  label: string;
  knownAfter: number;
  initialValue: number;
};

/** Adding a relation key without a visible spectrum is a type error. */
export const relationshipProfiles: Record<RelationKey, RelationshipProfile> = {
  崔氏: { label: "责任与承认", knownAfter: 4, initialValue: 0 },
  谢明微: { label: "互认与争锋", knownAfter: 4, initialValue: 0 },
  沈令仪: { label: "制度互信", knownAfter: 0, initialValue: 0 },
  顾明华: { label: "联盟与竞争", knownAfter: 0, initialValue: 0 },
  高福安: { label: "互信与消息", knownAfter: 0, initialValue: 0 },
  林栖梧: { label: "信赖", knownAfter: 1, initialValue: 0 },
  温疏雨: { label: "医者信任", knownAfter: 2, initialValue: 0 },
  裴照南: { label: "并肩与托付", knownAfter: 3, initialValue: 0 },
  卫夷则: { label: "交换与欠录", knownAfter: 4, initialValue: 0 },
};

export const relationKeys = Object.keys(relationshipProfiles) as RelationKey[];
