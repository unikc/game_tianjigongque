# Structured production backlog

Status and completion rules are defined by `AGENTS/ImperialProducer.md`. Complexity is relative: S, M, L, XL.

## F01 — 叙事记忆与策略画像基础

- **Status / priority / owner / complexity:** DONE · P0 · Gameplay / Codex · M
- **Narrative purpose:** Provide one bounded, typed memory grammar instead of incompatible ad-hoc tags.
- **Player value:** Coherent callbacks and adaptive replay that remember what the player actually did.
- **Mechanic:** Pure-derived event memories and five coexisting observed methods with explicit source, visibility, provenance and resolution state; never expose hidden scoring.
- **Dependencies:** E08 and E11 domain requirements; current versioned save and tags.
- **Implementation plan:** Derive taxonomy from the first two epics → add pure transitions and migration only when required → instrument existing choices gradually.
- **Required assets:** None initially.
- **Required state/tags:** Existing stable choice history plus typed memory IDs, bounded internal counters, source actors, visibility and active/resolved/superseded state. No save field or migration required.
- **Test cases:** Deterministic replay, capped growth, choice-level deduplication, ambiguous tags cannot invent a choice, private actions are not observed, actor/court/public visibility, hidden truths ignored and unknown old tags safe.
- **Acceptance criteria:** E02/E03/E05/E07/E11 can reuse it without inventing parallel storage.
- **Risks:** Premature abstraction; hidden optimization meter; oversized saves.
- **Future hooks:** Rival learning, secret ledger, ruler style, new-game-plus recall.
- **Notes:** Completed after E08/E11. First four chapters supply representative memories; 行录 contains a read-only, scoreless 处世录. No gameplay gate consumes the profile yet.

## F02 — 政治合法性与体面台阶

- **Status / priority / owner / complexity:** DONE · P0 · Gameplay + Narrative · L
- **Narrative purpose:** Distinguish political acceptability from evidence, favor and raw power.
- **Player value:** Players must build a transition others can live with, not merely win an argument.
- **Mechanic:** Contextual legitimacy bases—ritual precedent, coalition, succession, public procedure and concession—queried by veto/outcome logic; no universal bar.
- **Dependencies:** E08 document authority, existing promotion routes, Cui worldview.
- **Implementation plan:** Audit Ch8/10/11/12 decisions → define contextual requirements → prototype one transparent warning and counter path.
- **Required assets:** Reuse seals/decrees initially; later ceremonial feedback reviewed by Art Director.
- **Required state/tags:** Named legitimacy bases and concessions, not one morality score.
- **Test cases:** Evidence alone may fail; multiple political bases work; requirements are anticipatable; old endings remain reachable.
- **Acceptance criteria:** Supports E01 without making Cui a stat gate and strengthens existing succession choices.
- **Risks:** Opaque rules; duplicated promotion system; overcomplicated UI.
- **Future hooks:** Regent appointment, negotiated reform, ceremonial succession.
- **Notes:** 第十章“谁来签字”现有三套个人摄政依据；事实证据、帝宠、位分与主张本身均不能授权。依据不足时可改两宫共署、朝臣联署或旧例限期代行。Narrative 与 Art 最终复审通过。

## E01 — 太后·崔氏「最后一道墙」

- **Status / priority / owner / complexity:** DONE · P1 · Narrative + Gameplay · XL
- **Narrative purpose:** Embody institutional legitimacy, ritual continuity and the difference between proving truth and governing afterward.
- **Player value:** A political opponent who cannot be defeated by collecting one more piece of evidence.
- **Mechanic:** One contextual veto against promotions/appointments/outcomes that visibly violate custom; countered by a face-saving transition, coalition, precedent or concession—not stats alone.
- **Dependencies:** F02 legitimacy; E08 provenance; Cui character bible; distinction among Cui's order, her tolerance and clan action.
- **Implementation plan:** Define worldview/non-negotiables → model legitimacy signals and advance warning → prototype one late-game veto → integrate alternatives and costs.
- **Required assets:** Portrait/expression set, ceremonial chamber background or reusable throne-room framing, veto/ritual feedback motif.
- **Required state/tags:** `dowager_knowledge`, `legitimacy_basis`, `ritual_precedent`, `coalition_support`, `dowager_veto_spent`; must respect seeded `arsonPatron`.
- **Test cases:** Veto predictable; evidence alone fails; at least three distinct counters; old saves derive safe defaults; royal/dowager arson seeds do not contradict Cui's culpability.
- **Acceptance criteria:** Players understand her power comes from the system; she compromises for coherent reasons; no “higher stat boss”.
- **Risks:** Collapsing 太后母族 into Cui; duplicating Shen's order role; opaque veto frustration.
- **Future hooks:** Succession, ceremonial reform, negotiated retirement, regency.
- **Notes:** Reuse Ch1, Ch5, Ch6 and Ch10 references before adding exposition.

## E02 — 谢明微「镜中敌手」

- **Status / priority / owner / complexity:** DONE · P0 · Narrative + Gameplay · XL
- **Narrative purpose:** Show what the protagonist might become by learning different lessons from the same palace.
- **Player value:** Adaptive rivalry and materially different replays without flat stat inflation.
- **Mechanic:** Track only strategies Xie could plausibly observe; derive bounded learned counters and occasional collaboration/admiration.
- **Dependencies:** E08 document process; E11 memory grammar; strategy taxonomy; character bible and role distinct from Lin/Gao/Wen.
- **Implementation plan:** Assign unique institutional role → annotate existing choices with strategy categories → define observation windows → author counter/collaboration scenes → cap adaptation.
- **Required assets:** Original portrait with expression variants, rival dossier treatment, limited event CG budget.
- **Required state/tags:** Bounded counts for evidence, leverage, alliance, imperial favor, confrontation, secrecy and procedure; `xie_observed_*`, `xie_learned_*`.
- **Test cases:** Different strategies yield different tactics; unobserved private choices are not learned; counters never remove every option; deterministic saves/replays.
- **Acceptance criteria:** Two players meet meaningfully different Xie behavior; she has independent goals, admires and collaborates at credible moments.
- **Risks:** Omniscience; duplicating existing information characters; one dominant strategy category.
- **Future hooks:** Rival romance, alliance ending, mutual destruction, succession office.
- **Notes:** Completed as 尚仪局司籍女史. Ch4/5/6 provide an explicit official/public observation window; Ch8 contains four tradeoff-bearing review routes and at most two learned responses; Ch10 states provenance verification cannot grant political authority. Private leverage remains intentionally unlearned until the player formally exposes it.

## E03 — 天机阁主「盲眼史官」

- **Status / priority / owner / complexity:** PLANNED · P0 · Narrative + Gameplay · L
- **Narrative purpose:** Make foresight useful and dangerous while exploring who owns the player's private truth.
- **Player value:** Optional prediction transactions with long-tail liability.
- **Mechanic:** Receive a partial forecast, then surrender a genuine player secret (chosen or deterministic unknown); permanently record provenance.
- **Dependencies:** E08 provenance; E11 memory; institutional definition; E06 causality plan.
- **Implementation plan:** Define 天机阁 as calendrical/disaster/archive institution → author Archivist bible → secret-price taxonomy → one transaction prototype → Chapter 11 liability.
- **Required assets:** Archivist portrait/expression set, archive observatory background, sealed personal ledger prop.
- **Required state/tags:** `tianji_forecast:*`, `secret_surrendered:*`, `secret_source:tianji`, bounded ledger entries.
- **Test cases:** No free forecast; surrendered secret is real and later addressable; no omniscient answers; deterministic unknown selection; old saves safe.
- **Acceptance criteria:** Every use feels helpful and slightly dangerous; her ledger can become more threatening than the player's evidence.
- **Risks:** Supernatural omniscience; duplicating Gao; disability used as exotic shorthand.
- **Future hooks:** Archive trial, secret ransom, authored/forged prophecy.
- **Notes:** Completed. 天机阁实现为 `hidden-truth` 的玩家界面而非独立系统：谶语只产出 `tianji_hint:*` / `tianji_excluded:*`，signpost 类文本与真相无关（有测试断言两个相反种子输出一字不差），exclusion 类只划掉一个假选项。价目取自 `narrative-memory` 中 `visibility === "private"` 的真实记忆，因此全程走明路的玩家无秘可付、买不到谶语——这是取舍不是门槛。交出的秘密以 `direct` 渠道形成 `tianji-ledger-called-in` 延迟旧账，唯一化解方式是第九章宫火中烧掉册子。她的失明在登场时不作解释，与能力不构成因果：她的本事是听过太多卷档，不是通神。详见 `docs/narrative/tianji-pavilion.md`。

## E04 — 前朝废后「已经赢过的人」

- **Status / priority / owner / complexity:** PLANNED · P1 · Narrative · L
- **Narrative purpose:** Show the possible end-state of “winning” and the distortion created by surviving an old order.
- **Player value:** Advice that helps one decision while potentially poisoning another.
- **Mechanic:** Source-aware unreliable advice with truth/partial/outdated/manipulated states; credibility learned across meetings.
- **Dependencies:** E08 provenance; E11 callback model; canonical reign timeline; unreliable-information rules.
- **Implementation plan:** Establish as previous-reign figure/Ch9 cold-palace witness → define claims and temporal validity → attach two decisions with asymmetric consequences.
- **Required assets:** Aged former-empress portrait, cold-palace environment, old seal/record prop.
- **Required state/tags:** `former_empress_claim:*`, `claim_verified:*`, `advice_followed:*`, survival/location state.
- **Test cases:** No claim is pure random punishment; outdated advice has explainable history; she is never rewritten as Xiao Chengyuan's former wife.
- **Acceptance criteria:** Players cannot be certain whether she saved or manipulated them, but can retrospectively trace why.
- **Risks:** Timeline contradiction; duplicating Tianji oracle; trauma reduced to twist delivery.
- **Future hooks:** Restoration faction, memoir, mercy/revenge judgment.
- **Notes:** Prefer reuse of Ch9's “declared dead” witness and Ch8's earlier institutional precedent.

## E05 — 必要的背叛

- **Status / priority / owner / complexity:** PLANNED · P1 · Narrative · XL
- **Narrative purpose:** Force conflict between two promises/values after relationships have earned emotional weight.
- **Player value:** A memorable no-clean-answer decision players debate after play.
- **Mechanic:** Available sacrifices depend on earlier promises, survival and trust; each preserves a different value. Self-sacrifice may refuse betrayal but cannot be free.
- **Dependencies:** E11 commitment/debt memory; E08 provenance; sufficient scenes for Gao/Wen/Pei; Ch10–11 logic.
- **Implementation plan:** Build commitment matrix → validate candidate attachment → define evidence/legitimacy/trust outcomes → author aftermath callbacks and endings.
- **Required assets:** Candidate-specific reaction portraits, one major decision CG or restrained ceremonial composition.
- **Required state/tags:** `promise:*`, `betrayed:*`, `sacrifice_result:*`, candidate alive/dead/available, permanent memory.
- **Test cases:** Dead/unmet characters cannot be sacrificed; no universal best choice; refusal has meaningful cost; endings remember exact betrayal.
- **Acceptance criteria:** Different sacrifices solve different problems; the player understands what was preserved and what was broken.
- **Risks:** Forced shock; punishing attachment; canon contradictions with Ch11 requests.
- **Future hooks:** Revenge, reconciliation impossible/possible by target, ruler-style reflection.
- **Notes:** “Betrayal” means violating an earned commitment, not merely choosing one NPC over another.

## E06 — 自证预言

- **Status / priority / owner / complexity:** PLANNED · P1 · Narrative + Gameplay · L
- **Narrative purpose:** Show prediction as political intervention: behavior creates the future it fears.
- **Player value:** A replay revelation that the player's own precautions completed the chain.
- **Mechanic:** Hearing the surname prophecy unlocks attention/actions; pursuing them raises causal probability through alliances, suspicion and prevention.
- **Dependencies:** E03; E08/E11 provenance and memory; a written causality graph; non-supernatural world rule.
- **Implementation plan:** Define author/audience/beneficiary → map each pursuit choice to causal links → make non-heard outcome unlikely/impossible → author retrospective explanation.
- **Required assets:** Prophecy slip/ledger prop, Tianji setting; no separate fantasy effects system.
- **Required state/tags:** `heard_surname_prophecy`, `pursued_surname:*`, `prophecy_causal_link:*`, fulfillment state.
- **Test cases:** Same seed without hearing does not follow same chain; hidden truths remain independent; player can abandon pursuit; causality is reconstructible.
- **Acceptance criteria:** On replay, players can identify how their actions made the prophecy true.
- **Risks:** Objective magic; surname surveillance becoming arbitrary; prophecy spoils culprit.
- **Future hooks:** Forged prophecies, political rumor campaigns, resisting prediction.
- **Notes:** Zodiac affects disposition only and never guarantees prophecy.

## E07 — 宫中内奸调查

- **Status / priority / owner / complexity:** PLANNED · P0 · Gameplay + Narrative · XL
- **Narrative purpose:** Turn information provenance into deduction rather than stat accumulation.
- **Player value:** A logically solvable, seed-variable investigation with meaningful false accusations.
- **Mechanic:** Give three suspects distinct false facts; observe which fact escapes. Seed chooses the leaking link, with explainable false positives.
- **Dependencies:** E08 provenance; E11 memory; independent hidden-truth seed channel; suspect knowledge graph.
- **Implementation plan:** Define leak process (not one evil mastermind) → suspects/motives → planted facts → observation/payoff → accusation and recovery outcomes.
- **Required assets:** Suspect portraits already available where possible, three distinguishable sealed notes, investigation ledger UI.
- **Required state/tags:** New independent truth key, `false_fact_given:*`, `leak_observed:*`, `mole_accused:*`, provenance chain.
- **Test cases:** Every seed logically solvable; no collision with Wen/arson truths; false positive traceable; incorrect accusation remains playable.
- **Acceptance criteria:** Careful reasoning can solve it; different seeds change the leaking link and consequences.
- **Risks:** Reducing systemic complicity to a culprit quiz; hidden seed feels random; too much text.
- **Future hooks:** Double agent, coerced leak, Xie's counter-intelligence.
- **Notes:** Investigate which document-processing link leaks or substitutes information, not a generic “traitor”.

## E08 — 文书权力与替罪弧

- **Status / priority / owner / complexity:** READY · P0 · Gameplay + Narrative · L
- **Narrative purpose:** Make the existing first-season spine legible: who can write, seal, witness, archive, circulate and publicly authenticate truth.
- **Player value:** Earlier record mastery becomes real agency, then credible late-game liability.
- **Mechanic:** Typed document lifecycle/provenance and a derived “systems touched” footprint; no visible power meter.
- **Dependencies:** Existing rewards/tags, seeded truths and 12 endings.
- **Implementation plan:** Canon matrix → pure derived footprint over current state → tests → scene hooks only after review → integrate existing scapegoat ending.
- **Required assets:** Reuse existing document/prop art; later add one provenance visualization only if comprehension requires it.
- **Required state/tags:** Stable document IDs; stages `drafted/sealed/witnessed/archived/circulated/public`; actor/source ownership; current evidence tags.
- **Test cases:** Existing routes derive correct footprint; lost/gifted/burned evidence respected; no hidden truth leaked; same state deterministic; no save migration for derived data.
- **Acceptance criteria:** Early document touch creates options; accumulated centrality later explains why the player becomes indispensable and blameable.
- **Risks:** Re-explaining existing clues; hidden liability feels unfair; duplicate scapegoat ending.
- **Future hooks:** Xie provenance challenges, mole leaks, public audit, archive governance.
- **Notes:** First approved implementation slice; do not add new documents yet.

## E09 — 胜利与道德转型

- **Status / priority / owner / complexity:** PLANNED · P1 · Narrative · XL
- **Narrative purpose:** Reflect how the player uses power without declaring a single moral score.
- **Player value:** Endings respond to accumulated political style, not only final choice or stats.
- **Mechanic:** Named method patterns—public procedure, secret control, concrete rescue, private revenge, rehabilitation, humiliation—feed ending narration and available governance actions.
- **Dependencies:** Stable E08/E11 memory; existing 12 endings; treatment choices over earlier harms.
- **Implementation plan:** Audit existing choices → classify observable methods → add late-game response set → integrate prose variants into current endings.
- **Required assets:** Ending/result variants and character reactions; reuse current ending art where possible.
- **Required state/tags:** Bounded method counts or event memories; no good/evil scalar.
- **Test cases:** Same final action differs by accumulated style; no method guarantees “best ending”; all current endings remain reachable.
- **Acceptance criteria:** Ending meaningfully answers whether the player created a new order or inherited the old methods.
- **Risks:** Moralizing, hidden score optimization, invalidating existing endings.
- **Future hooks:** New-game-plus reflections, legacy epilogues.
- **Notes:** Implement last, when input memories are stable.

## E10 — 十二章章首谶诗

- **Status / priority / owner / complexity:** PLANNED · P2 · Narrative + Art · M
- **Narrative purpose:** Foreshadow each chapter's concrete event and deeper institutional consequence.
- **Player value:** Atmospheric openings and chilling retrospective recognition on replay.
- **Mechanic:** Original 2–4-line verse in chapter metadata; skippable and reviewable in journal.
- **Dependencies:** E03/E06 truth and causality; final chapter facts; metadata schema; art/typography review.
- **Implementation plan:** Define clue table → write original verses → spoiler/voice review → metadata integration → journal replay presentation.
- **Required assets:** One reusable verse presentation; no twelve bespoke heavy scenes required.
- **Required state/tags:** Chapter metadata and first-seen/replay state only.
- **Test cases:** Every verse has one concrete interpretable clue; none reveals seeded truth; all mobile sizes readable/skippable.
- **Acceptance criteria:** First read is atmospheric; replay meaning is specific and earned; no copied judgment verses.
- **Risks:** Copyright imitation, vague poetry, pacing drag, spoilers.
- **Future hooks:** Variant readings, character annotations, archival commentary.
- **Notes:** Do not write before self-fulfilling prophecy logic stabilizes.

## E11 — 延迟复仇

- **Status / priority / owner / complexity:** DONE · P0 · Narrative + Gameplay · L
- **Narrative purpose:** Make minor early treatment matter through believable knowledge, motive and timing.
- **Player value:** Earned “I forgot I did that” callbacks with negotiation, anticipation and consequence.
- **Mechanic:** Structured chain: old cause → how the character knows → why they wait → present goal → player responses. Not simply low relation = attack.
- **Dependencies:** E08 provenance; relationship/survival states; bounded event memory.
- **Implementation plan:** Define memory schema → audit early minor characters → choose one callback prototype → author warning/negotiation/endurance routes → test reconciliation/death rules.
- **Required assets:** Reuse early character art where possible; one later-state portrait variant if role materially changes.
- **Required state/tags:** Existing named cause, knowledge, alive/dead and reconciliation tags; one-shot `revenge_answered:*` response memory. No parallel queue or hidden-truth reads.
- **Test cases:** Dead characters do not return; per-cause reconciliation cannot erase a later grievance; resolved grievances do not retrigger; hidden seeds do not create knowledge; every playable response carries a cost or lasting responsibility.
- **Acceptance criteria:** Callback is surprising but traceable to an early choice and believable information channel.
- **Risks:** Numeric punishment, arbitrary resurrection, every slight becoming revenge, content explosion.
- **Future hooks:** Necessary betrayal fallout, Xie learning, court factions remembering precedent.
- **Notes:** Completed after E08 provenance stabilized. Gu and Gao are playable vertical slices; Pei is modeled but intentionally not attached to a new scene.
