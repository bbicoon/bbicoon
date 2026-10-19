const pptxgen = require("pptxgenjs");
const { applyTheme } = require("/root/.claude/skills/synced/0cfa6e3e-0d27-4a3b-93cd-9b0b3ccaa1cd_c6a5fa69-1ead-4e73-b6d2-83b2b51db138/pptx/scripts/apply_theme.js");

const HEAD = "나눔명조";
const BODY = "맑은 고딕";
const GOLD = "D4AF5F", GOLD_L = "F0D696", NAVY = "0A1230";

const THEME = {
  name: "Gala Deco",
  headFontFace: HEAD, bodyFontFace: BODY,
  colors: { dk1: "070B18", lt1: "FFFFFF", dk2: "16224A", lt2: "F5EEDC",
    accent1: GOLD, accent2: GOLD_L, accent3: "9AA6C4", accent4: "B8933F", accent5: "2A3A6E", accent6: "FFF4D6",
    hlink: GOLD, folHlink: GOLD_L },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };
pres.title = "내빈 행사 식순";
pres.author = "Event Office";
const C = pres.SchemeColor;
const W = 13.333;

const glow = () => ({ size: 5, opacity: 0.35, color: GOLD });
const softGlow = () => ({ size: 5, opacity: 0.3, color: GOLD });

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "TITLE", background: { path: "bg_title.png" },
  objects: [
    { placeholder: { options: { name: "eyebrow", type: "body", x: 1.5, y: 2.15, w: 10.333, h: 0.45, align: "center", fontSize: 17, color: C.accent2, charSpacing: 10, margin: 0 }, text: "부제" } },
    { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.75, w: 11.733, h: 1.55, align: "center", fontSize: 58, bold: true, color: C.accent2, charSpacing: 4, margin: 0, glow: glow() }, text: "행사명" } },
    { placeholder: { options: { name: "sub", type: "body", x: 1.5, y: 4.55, w: 10.333, h: 0.5, align: "center", fontSize: 19, color: C.background1, margin: 0 }, text: "일시 · 장소" } },
    { placeholder: { options: { name: "sub2", type: "body", x: 1.5, y: 5.05, w: 10.333, h: 0.4, align: "center", fontSize: 14, color: C.accent3, charSpacing: 3, margin: 0 }, text: "주최" } },
  ],
});

pres.defineSlideMaster({
  title: "FOCUS", background: { path: "bg_title.png" },
  objects: [
    { placeholder: { options: { name: "num", type: "body", x: 1.5, y: 2.12, w: 10.333, h: 0.5, align: "center", fontSize: 18, color: C.accent2, charSpacing: 12, margin: 0 }, text: "순서" } },
    { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.7, w: 11.733, h: 1.6, align: "center", fontSize: 66, bold: true, color: C.accent2, charSpacing: 10, margin: 0, glow: glow() }, text: "순서명" } },
    { placeholder: { options: { name: "desc", type: "body", x: 1.8, y: 4.5, w: 9.733, h: 1.2, align: "center", fontSize: 20, color: C.background1, margin: 0, lineSpacingMultiple: 1.3 }, text: "설명" } },
  ],
});

pres.defineSlideMaster({
  title: "CONTENT", background: { path: "bg_content.png" },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.95, y: 0.8, w: 9.5, h: 0.95, align: "left", fontSize: 40, bold: true, color: C.accent2, charSpacing: 6, margin: 0, glow: softGlow() }, text: "제목" } },
    { placeholder: { options: { name: "caption", type: "body", x: 0.95, y: 1.72, w: 9.5, h: 0.35, align: "left", fontSize: 11, color: C.accent1, charSpacing: 7, margin: 0 }, text: "CAPTION" } },
  ],
});

// ---------- Helpers ----------
function diamondBadge(slide, cx, cy, size, label, tag) {
  slide.addShape(pres.ShapeType.diamond, { x: cx - size / 2 - 0.05, y: cy - size / 2 - 0.05, w: size + 0.1, h: size + 0.1, fill: { color: C.text2 }, line: { color: C.accent1, width: 1 }, objectName: `${tag} outer` });
  slide.addShape(pres.ShapeType.diamond, { x: cx - size / 2, y: cy - size / 2, w: size, h: size, fill: { color: C.text1 }, line: { color: C.accent2, width: 0.5 }, objectName: `${tag} inner` });
  slide.addText(label, { x: cx - size / 2, y: cy - size / 2, w: size, h: size, align: "center", valign: "middle", fontSize: 13, fontFace: HEAD, bold: true, color: C.accent2, margin: 0, isTextBox: true, objectName: `${tag} label` });
}
function sideDiamonds(slide, cx, cy, span, tag) {
  for (const sx of [-1, 1]) {
    slide.addShape(pres.ShapeType.diamond, { x: cx + sx * span - 0.07, y: cy - 0.07, w: 0.14, h: 0.14, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 }, objectName: `${tag} diamond ${sx}` });
    slide.addShape(pres.ShapeType.line, { x: sx < 0 ? cx - span + 0.1 : cx + span - 0.9, y: cy, w: 0.8, h: 0, line: { color: C.accent1, width: 0.75 }, objectName: `${tag} line ${sx}` });
  }
}

// ---------- Data ----------
const EVENT = { eyebrow: "내빈 초청 행사", title: "2026 창립 30주년 기념식", when: "2026. 11. 20. (금)  14:00", where: "그랜드볼룸 (본관 3층)", host: "주최  ○○○○협회   |   주관  창립30주년기념사업추진위원회" };
const PROGRAMME = [
  { title: "개회 선언", who: "사회자", desc: "행사의 시작을 알립니다." },
  { title: "국민의례", who: "참석자 전원", desc: "국기에 대한 경례 · 애국가 제창 · 순국선열 및 호국영령에 대한 묵념" },
  { title: "내빈 소개", who: "사회자", desc: "자리를 빛내 주신 내빈 여러분을 소개합니다." },
  { title: "경과보고", who: "사무총장", desc: "창립 이후 30년의 발자취를 보고드립니다." },
  { title: "기념사", who: "회장", desc: "창립 30주년을 맞이하는 소회와 비전" },
  { title: "축사", who: "내빈 대표", desc: "축하의 말씀을 전해 주십니다." },
  { title: "감사패 수여", who: "회장", desc: "공로자 및 유공 단체에 감사의 뜻을 전합니다." },
  { title: "기념 촬영", who: "참석자 전원", desc: "무대 앞으로 모여 주시기 바랍니다." },
  { title: "폐회", who: "사회자", desc: "만찬은 2층 연회장에서 이어집니다." },
];

// ---------- 1. 타이틀 ----------
pres.addSection({ title: "오프닝" });
let s = pres.addSlide({ masterName: "TITLE", sectionTitle: "오프닝" });
s.addText(EVENT.eyebrow, { placeholder: "eyebrow" });
s.addText(EVENT.title, { placeholder: "title" });
s.addText(`${EVENT.when}   |   ${EVENT.where}`, { placeholder: "sub" });
s.addText(EVENT.host, { placeholder: "sub2" });
sideDiamonds(s, W / 2, 2.37, 3.1, "Eyebrow");
s.addNotes("개회 타이틀 화면. 행사명·일시·장소·주최는 텍스트만 교체하세요.");

// ---------- 2. 대기 ----------
s = pres.addSlide({ masterName: "TITLE", sectionTitle: "오프닝" });
s.addText("WELCOME", { placeholder: "eyebrow" });
s.addText("잠시 후 행사가 시작됩니다", { placeholder: "title" });
s.addText("내빈 여러분께서는 자리에 착석해 주시기 바랍니다", { placeholder: "sub" });
s.addText("휴대전화는 진동으로 전환해 주시면 감사하겠습니다", { placeholder: "sub2" });
sideDiamonds(s, W / 2, 2.37, 2.2, "Eyebrow");
s.addNotes("착석 안내 대기 화면.");

// ---------- 3. 전체 식순 ----------
pres.addSection({ title: "식순" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "식순" });
s.addText("식  순", { placeholder: "title" });
s.addText("ORDER OF CEREMONY", { placeholder: "caption" });
const colX = [1.0, 7.0], colW = 5.4, rowY0 = 2.45, rowH = 0.86;
PROGRAMME.forEach((p, i) => {
  const col = i < 5 ? 0 : 1, row = i < 5 ? i : i - 5;
  const x = colX[col], y = rowY0 + row * rowH;
  diamondBadge(s, x + 0.3, y + 0.34, 0.42, String(i + 1), `Badge ${i + 1}`);
  s.addText([
    { text: p.title, options: { fontSize: 22, fontFace: HEAD, bold: true, color: C.background1, charSpacing: 3 } },
    { text: `    ${p.who}`, options: { fontSize: 13, fontFace: BODY, color: C.accent2 } },
  ], { x: x + 0.85, y, w: colW - 0.85, h: 0.68, valign: "middle", margin: 0, isTextBox: true, objectName: `Item ${i + 1}` });
  if (row < 4) {
    s.addShape(pres.ShapeType.line, { x: x + 0.85, y: y + rowH - 0.08, w: colW - 0.85, h: 0, line: { color: C.accent4, width: 0.5 }, objectName: `Rule ${i + 1}` });
    s.addShape(pres.ShapeType.diamond, { x: x + colW - 0.06, y: y + rowH - 0.14, w: 0.12, h: 0.12, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 }, objectName: `Rule end ${i + 1}` });
  }
});
s.addNotes("전체 식순 화면. 담당자 직함은 실제 직함·성함으로 교체하세요.");

// ---------- 4~12. 순서별 ----------
PROGRAMME.forEach((p, i) => {
  const f = pres.addSlide({ masterName: "FOCUS", sectionTitle: "식순" });
  f.addText(`제 ${i + 1} 순서`, { placeholder: "num" });
  f.addText(p.title, { placeholder: "title" });
  f.addText([
    { text: p.who, options: { bold: true, color: C.accent2, charSpacing: 3, breakLine: true } },
    { text: p.desc, options: {} },
  ], { placeholder: "desc" });
  sideDiamonds(f, W / 2, 2.37, 2.3, "Eyebrow");
  f.addNotes(`${i + 1}. ${p.title} - ${p.who}`);
});

// ---------- 13. 내빈 소개 ----------
pres.addSection({ title: "내빈" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "내빈" });
s.addText("내빈 소개", { placeholder: "title" });
s.addText("DISTINGUISHED GUESTS", { placeholder: "caption" });
const guests = [["○○○", "○○시장"], ["○○○", "○○시의회 의장"], ["○○○", "○○대학교 총장"], ["○○○", "○○상공회의소 회장"], ["○○○", "○○재단 이사장"], ["○○○", "○○협회 명예회장"]];
const gx0 = 1.0, gy0 = 2.4, gw = 3.6, gh = 1.95, gap = 0.3;
guests.forEach((g, i) => {
  const x = gx0 + (i % 3) * (gw + gap), y = gy0 + Math.floor(i / 3) * (gh + gap);
  s.addShape(pres.ShapeType.rect, { x, y, w: gw, h: gh, fill: { color: C.text2, transparency: 25 }, line: { color: C.accent1, width: 1.25 }, shadow: { type: "outer", color: "000000", blur: 10, offset: 3, angle: 90, opacity: 0.45 }, objectName: `Guest card ${i + 1}` });
  s.addShape(pres.ShapeType.rect, { x: x + 0.1, y: y + 0.1, w: gw - 0.2, h: gh - 0.2, fill: { color: C.text2, transparency: 100 }, line: { color: C.accent4, width: 0.5 }, objectName: `Guest inner ${i + 1}` });
  s.addShape(pres.ShapeType.diamond, { x: x + gw / 2 - 0.09, y: y + 0.32, w: 0.18, h: 0.18, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 }, objectName: `Guest mark ${i + 1}` });
  s.addText(g[0], { x, y: y + 0.6, w: gw, h: 0.7, align: "center", fontSize: 28, fontFace: HEAD, bold: true, color: C.accent2, charSpacing: 6, margin: 0, isTextBox: true, glow: softGlow(), objectName: `Guest name ${i + 1}` });
  s.addText(g[1], { x, y: y + 1.32, w: gw, h: 0.4, align: "center", fontSize: 14, fontFace: BODY, color: C.background1, margin: 0, isTextBox: true, objectName: `Guest role ${i + 1}` });
});
s.addNotes("내빈 명단 카드. 카드 수는 복사/삭제로 조정하세요.");

// ---------- 14. 마무리 ----------
pres.addSection({ title: "클로징" });
s = pres.addSlide({ masterName: "TITLE", sectionTitle: "클로징" });
s.addText("THANK YOU", { placeholder: "eyebrow" });
s.addText("감사합니다", { placeholder: "title" });
s.addText("함께해 주신 내빈 여러분께 깊이 감사드립니다", { placeholder: "sub" });
s.addText("만찬은 2층 연회장에서 이어집니다", { placeholder: "sub2" });
sideDiamonds(s, W / 2, 2.37, 2.4, "Eyebrow");
s.addNotes("폐회 후 퇴장 안내 화면.");

(async () => {
  await pres.writeFile({ fileName: "내빈행사_식순.pptx" });
  await applyTheme("내빈행사_식순.pptx", THEME);
  console.log("written");
})();
