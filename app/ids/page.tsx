import Link from "next/link";
import {
  ChoiceButton,
  ImperialSeal,
  ProgressBar,
  RelationshipCard,
  SaveIndicator,
  StatChip,
  visualSemantics,
} from "../../imperial-design-system";
import "../../imperial-design-system/themes/handbook.css";

const nav = [
  ["principles", "设计原则"],
  ["language", "视觉语义"],
  ["tokens", "设计令牌"],
  ["layout", "手机布局"],
  ["components", "组件图录"],
  ["narrative", "叙事组件"],
  ["art", "美术系统"],
  ["motion", "动效反馈"],
  ["accessibility", "无障碍"],
  ["rules", "使用禁令"],
] as const;

export default function ImperialHandbook() {
  return (
    <main className="ids-present">
      <aside className="ids-present-nav">
        <div className="ids-nav-seal">IDS</div>
        <p>内务府制式总册</p>
        <nav aria-label="设计系统目录">
          {nav.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <Link href="/">返回游戏</Link>
      </aside>

      <article className="ids-present-book">
        <header className="ids-cover">
          <div>
            <span>IMPERIAL DESIGN SYSTEM · VERSION 1.0</span>
            <h1>宫制图录</h1>
            <p>《天机宫阙》的视觉、交互、叙事与美术规则</p>
          </div>
          <ImperialSeal>
            御用
            <br />
            制式
          </ImperialSeal>
        </header>

        <section id="principles" className="ids-section">
          <SectionTitle number="壹" eyebrow="FOUNDATION" title="设计原则" />
          <div className="ids-principles">
            <RuleCard title="一屏一回合" mark="屏">
              核心剧情、反馈和选择必须在 320×568 内完成，不要求滚动。
            </RuleCard>
            <RuleCard title="画面服务权谋" mark="意">
              颜色、物件、位置和留白都传递政治含义，不做无意义装饰。
            </RuleCard>
            <RuleCard title="选择必有代价" mark="衡">
              不使用明显正确答案；收益、关系、证据和风险至少牵动两项。
            </RuleCard>
            <RuleCard title="信息随时可取" mark="录">
              章节、修习、珍藏通过行录常驻可达，不挤占剧情画面。
            </RuleCard>
          </div>
        </section>

        <section id="language" className="ids-section">
          <SectionTitle number="贰" eyebrow="SEMANTICS" title="《御用色谱》" />
          <p className="ids-lead">
            颜色不是装饰，而是玩家可以逐渐学会的宫廷语言。
          </p>
          <div className="ids-semantic-grid">
            {Object.entries(visualSemantics).map(([key, value]) => (
              <article key={key} className={`ids-semantic ids-${key}`}>
                <i aria-hidden="true" />
                <b>{value.split(" — ")[0]}</b>
                <p>{value.split(" — ")[1]}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="tokens" className="ids-section">
          <SectionTitle number="叁" eyebrow="TOKENS" title="尺寸与材质" />
          <div className="ids-token-board">
            <div>
              <h3>间距</h3>
              <div className="ids-space-scale">
                {[4, 8, 12, 16, 24, 32, 40].map((size) => (
                  <span key={size} style={{ width: size, height: size }}>
                    {size}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3>触控</h3>
              <div className="ids-touch-demo">44×44 最小目标</div>
            </div>
            <div>
              <h3>字体</h3>
              <p className="ids-type-display">天机宫阙</p>
              <p className="ids-type-body">
                叙事使用宋体，操作信息使用系统黑体。
              </p>
            </div>
            <div>
              <h3>边界</h3>
              <p>1px 分隔 · 2px 强调 · 3–6px 仪式双线</p>
              <p>圆角只用于抽屉与现代系统层；诏书、卡片保持方正。</p>
            </div>
          </div>
        </section>

        <section id="layout" className="ids-section">
          <SectionTitle
            number="肆"
            eyebrow="MOBILE LAYOUT"
            title="一屏叙事布局"
          />
          <div className="ids-layout-demo">
            <div className="ids-phone-wireframe">
              <div>状态与行录 · 44px</div>
              <div>场景 / 立绘 · 18–22svh</div>
              <div>对白与即时反馈</div>
              <div>选择 · 底部对齐</div>
            </div>
            <div className="ids-layout-rules">
              <h3>硬性规则</h3>
              <ul>
                <li>玩家路径基准：320×568 与 390×844。</li>
                <li>剧情页禁止纵向滚动和横向溢出。</li>
                <li>超过三个选择时分页，每页最多三个。</li>
                <li>背景不得穿过标题、标签或表单边界。</li>
                <li>人物簿与长资料使用底部抽屉。</li>
                <li>安全区必须包含刘海与 Home Indicator。</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="components" className="ids-section">
          <SectionTitle number="伍" eyebrow="COMPONENTS" title="《宫制图录》" />
          <div className="ids-component-grid">
            <Specimen title="Buttons / 按钮">
              <button className="primary">确认入宫</button>
              <button className="secondary">暂且退下</button>
              <button className="text-button">查看行录</button>
            </Specimen>
            <Specimen title="Choice / 剧情选择">
              <ChoiceButton index={0}>保住证据，但不当众点破。</ChoiceButton>
              <ChoiceButton index={1}>先救眼前的人，再追问责任。</ChoiceButton>
            </Specimen>
            <Specimen title="Status / 状态">
              <SaveIndicator label="进度已存" />
              <ProgressBar label="章节进度示例" value={64} />
              <div className="stat-grid ids-mini-stats">
                <StatChip label="谋略" value={4} />
                <StatChip label="名望" value={2} />
              </div>
            </Specimen>
            <Specimen title="Relationships / 关系">
              <div className="relations ids-demo-relations">
                <RelationshipCard label="沈令仪" value={2} />
                <RelationshipCard label="顾明华" value={-1} />
                <RelationshipCard label="高福安" value={0} />
              </div>
            </Specimen>
          </div>
        </section>

        <section id="narrative" className="ids-section">
          <SectionTitle number="陆" eyebrow="NARRATIVE" title="对话与反馈" />
          <div className="ids-dialogue-specimen">
            <div className="ids-scene-art">
              <span className="speaker">皇后 · 沈令仪</span>
              <h3>坤宁问训</h3>
            </div>
            <div className="outcome">
              <span className="outcome-label">方才</span>
              <p>皇后微微颔首。她喜欢懂规矩的人，但宫里从不缺这样的话。</p>
              <div className="change-list">
                <span>礼仪 +1</span>
                <span>沈令仪 +1</span>
              </div>
            </div>
            <p className="ids-dialogue-copy">
              一屏只承担一个戏剧动作。反馈解释发生了什么，不评价玩家聪明或愚蠢。
            </p>
          </div>
        </section>

        <section id="art" className="ids-section">
          <SectionTitle
            number="柒"
            eyebrow="ART SYSTEM"
            title="角色、场景与珍藏"
          />
          <div className="ids-art-grid">
            <ArtCard
              image="/characters/shen-lingyi-rabbit-formal-v01.webp"
              title="正式立绘"
              copy="固定身份特征；表情、服装和姿态通过资产注册表替换。"
            />
            <ArtCard
              image="/backgrounds/banquet-hall-empty-seat-v01.webp"
              title="场景画幅"
              copy="中央保留低对比对白安全区；时间、地点、情绪均有元数据。"
            />
            <ArtCard
              image="/items/imperial-pearl-v01.webp"
              title="珍藏道具"
              copy="小尺寸仍有明确轮廓；来源、稀有度、消耗与剧情用途可追踪。"
            />
          </div>
        </section>

        <section id="motion" className="ids-section">
          <SectionTitle
            number="捌"
            eyebrow="MOTION & FEEDBACK"
            title="《礼制动态》"
          />
          <div className="ids-motion-list">
            <p>
              <b>120ms</b>
              <span>按钮反馈、数字变化</span>
            </p>
            <p>
              <b>240ms</b>
              <span>抽屉、标签、结果出现</span>
            </p>
            <p>
              <b>480ms</b>
              <span>场景转换、人物入场</span>
            </p>
          </div>
          <p>
            动效必须表达因果。减少动态效果开启时压缩至 1ms，所有信息仍可理解。
          </p>
        </section>

        <section id="accessibility" className="ids-section">
          <SectionTitle
            number="玖"
            eyebrow="ACCESSIBILITY"
            title="可达性规则"
          />
          <div className="ids-check-grid">
            {[
              "WCAG 2.2 AA 对比度",
              "44×44 最小触控目标",
              "键盘焦点始终可见",
              "颜色不是唯一反馈",
              "结果使用礼貌播报区域",
              "装饰背景不进入朗读顺序",
              "200% 文字不裁切操作",
              "配音必须配编辑字幕",
            ].map((rule) => (
              <p key={rule}>✓ {rule}</p>
            ))}
          </div>
        </section>

        <section id="rules" className="ids-section">
          <SectionTitle number="拾" eyebrow="DO / DON'T" title="使用禁令" />
          <div className="ids-do-dont">
            <div>
              <h3>应当</h3>
              <ul>
                <li>用留白突出权力距离</li>
                <li>让道具拥有来源与代价</li>
                <li>先验证最小手机尺寸</li>
                <li>用稳定 ID 替换美术资产</li>
              </ul>
            </div>
            <div>
              <h3>禁止</h3>
              <ul>
                <li>背景边线穿过标题或表单</li>
                <li>用 SaaS 风玻璃卡片和霓虹渐变</li>
                <li>为了塞进一屏而缩小触控目标</li>
                <li>用颜色或动画承载唯一信息</li>
              </ul>
            </div>
          </div>
        </section>

        <footer>内务府造办处 · Imperial Design System · 天机宫阙</footer>
      </article>
    </main>
  );
}

function SectionTitle({
  number,
  eyebrow,
  title,
}: {
  number: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="ids-section-title">
      <span>{number}</span>
      <div>
        <small>{eyebrow}</small>
        <h2>{title}</h2>
      </div>
    </div>
  );
}
function RuleCard({
  title,
  mark,
  children,
}: {
  title: string;
  mark: string;
  children: React.ReactNode;
}) {
  return (
    <article>
      <i>{mark}</i>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}
function Specimen({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="ids-specimen">
      <h3>{title}</h3>
      <div>{children}</div>
    </article>
  );
}
function ArtCard({
  image,
  title,
  copy,
}: {
  image: string;
  title: string;
  copy: string;
}) {
  return (
    <article>
      <div
        style={{ backgroundImage: `url(${image})` }}
        role="img"
        aria-label={`${title}示例`}
      />
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}
