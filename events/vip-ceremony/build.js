const pptxgen = require("pptxgenjs");
const { applyTheme } = require("/root/.claude/skills/synced/0cfa6e3e-0d27-4a3b-93cd-9b0b3ccaa1cd_c6a5fa69-1ead-4e73-b6d2-83b2b51db138/pptx/scripts/apply_theme.js");

const HEAD = "나눔명조";      // 식순·제목용 명조체 (고급스러운 세리프)
const BODY = "맑은 고딕";     // 본문·설명용

const THEME = {
  name: "Royal Navy Gala",
  headFontFace: HEAD,
  bodyFontFace: BODY,
  colors: {
    dk1: "0B1222", lt1: "FFFFFF", dk2: "1A2848", lt2: "EFE8D6",
    accent1: "C9A961", accent2: "E8D9A8", accent3: "8C98B5",
    accent4: "D9B96A", accent5: "5B6B8F", accent6: "F3EBD3",
    hlink: "C9A961", folHlink: "E8D9A8",
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };
pres.title = "내빈 행사 식순";
pres.author = "Event Office";
const C = pres.SchemeColor;
const W = 13.333, H = 7.5;

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "TITLE",
  background: { path: "bg_title.png" },
  objects: [
    { placeholder: { options: { name: "eyebrow", type: "body", x: 1.5, y: 1.55, w: 10.333, h: 0.5,
        align: "center", fontSize: 18, color: C.accent1, charSpacing: 8, margin: 0 }, text: "행사 부제" } },
    { placeholder: { options: { name: "title", type: "title", x: 1.0, y: 2.45, w: 11.333, h: 1.6,
        align: "center", fontSize: 54, bold: true, color: C.background1, margin: 0 }, text: "행사명" } },
    { placeholder: { options: { name: "sub", type: "body", x: 1.5, y: 4.55, w: 10.333, h: 0.55,
        align: "center", fontSize: 20, color: C.accent2, margin: 0 }, text: "일시 · 장소" } },
  ],
});

pres.defineSlideMaster({
  title: "CONTENT",
  background: { path: "bg_content.png" },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.9, y: 0.75, w: 11.533, h: 0.9,
        align: "left", fontSize: 36, bold: true, color: C.background1, margin: 0 }, text: "제목" } },
    { text: { text: "2026 창립 30주년 기념식", options: { x: 7.4, y: 0.8, w: 5.0, h: 0.4, align: "right", fontSize: 12,
        fontFace: HEAD, color: C.accent1, charSpacing: 6, margin: 0, isTextBox: true, objectName: "Corner label" } } },
  ],
});

pres.defineSlideMaster({
  title: "FOCUS",
  background: { path: "bg_title.png" },
  objects: [
    { placeholder: { options: { name: "num", type: "body", x: 1.0, y: 1.75, w: 11.333, h: 0.7,
        align: "center", fontSize: 22, color: C.accent1, charSpacing: 10, margin: 0 }, text: "순서" } },
    { placeholder: { options: { name: "title", type: "title", x: 1.0, y: 2.6, w: 11.333, h: 1.4,
        align: "center", fontSize: 60, bold: true, color: C.background1, charSpacing: 6, margin: 0 }, text: "순서명" } },
    { placeholder: { options: { name: "desc", type: "body", x: 1.8, y: 4.55, w: 9.733, h: 1.1,
        align: "center", fontSize: 20, color: C.accent2, margin: 0, lineSpacingMultiple: 1.3 }, text: "설명" } },
  ],
});

// ---------- Helpers ----------
const diamond = (slide, x, y, s, name) =>
  slide.addShape(pres.ShapeType.diamond, { x, y, w: s, h: s, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 }, objectName: name });

// 양옆에 짧은 금색 선 + 가운데 다이아몬드 (장식 모티프: 모든 슬라이드에 반복)
function ornament(slide, cx, cy, span, tag) {
  const g = 0.16;
  slide.addShape(pres.ShapeType.line, { x: cx - span / 2, y: cy, w: span / 2 - g, h: 0, line: { color: C.accent1, width: 1 }, objectName: `${tag} line L` });
  slide.addShape(pres.ShapeType.line, { x: cx + g, y: cy, w: span / 2 - g, h: 0, line: { color: C.accent1, width: 1 }, objectName: `${tag} line R` });
  diamond(slide, cx - 0.06, cy - 0.06, 0.12, `${tag} diamond`);
}

// ---------- Programme data ----------
const EVENT = {
  eyebrow: "내빈 초청 행사",
  title: "2026 창립 30주년 기념식",
  when: "2026. 11. 20. (금)  14:00",
  where: "그랜드볼룸 (본관 3층)",
};

const PROGRAMME = [
  { no: "一", title: "개회 선언", who: "사회자", desc: "행사의 시작을 알립니다." },
  { no: "二", title: "국민의례", who: "참석자 전원", desc: "국기에 대한 경례 · 애국가 제창 · 순국선열 및 호국영령에 대한 묵념" },
  { no: "三", title: "내빈 소개", who: "사회자", desc: "자리를 빛내 주신 내빈 여러분을 소개합니다." },
  { no: "四", title: "경과보고", who: "사무총장", desc: "창립 이후 30년의 발자취를 보고드립니다." },
  { no: "五", title: "기념사", who: "회장", desc: "창립 30주년을 맞이하는 소회와 비전" },
  { no: "六", title: "축사", who: "내빈 대표", desc: "축하의 말씀을 전해 주십니다." },
  { no: "七", title: "감사패 수여", who: "회장", desc: "공로자 및 유공 단체에 감사의 뜻을 전합니다." },
  { no: "八", title: "기념 촬영", who: "참석자 전원", desc: "무대 앞으로 모여 주시기 바랍니다." },
  { no: "九", title: "폐회", who: "사회자", desc: "만찬은 2층 연회장에서 이어집니다." },
];

// ---------- 1. 타이틀 ----------
pres.addSection({ title: "오프닝" });
let s = pres.addSlide({ masterName: "TITLE", sectionTitle: "오프닝" });
s.addText(EVENT.eyebrow, { placeholder: "eyebrow" });
s.addText(EVENT.title, { placeholder: "title" });
s.addText(`${EVENT.when}   |   ${EVENT.where}`, { placeholder: "sub" });
ornament(s, W / 2, 2.25, 3.2, "Top");
ornament(s, W / 2, 5.4, 3.2, "Bottom");
s.addNotes("행사 시작 전 대기 화면 및 개회 시 타이틀 화면으로 사용합니다. 행사명·일시·장소는 텍스트만 교체하면 됩니다.");

// ---------- 2. 대기 화면 ----------
s = pres.addSlide({ masterName: "TITLE", sectionTitle: "오프닝" });
s.addText("WELCOME", { placeholder: "eyebrow" });
s.addText("잠시 후 행사가 시작됩니다", { placeholder: "title", options: {} });
s.addText("내빈 여러분께서는 자리에 착석해 주시기 바랍니다", { placeholder: "sub" });
ornament(s, W / 2, 2.25, 3.2, "Top");
ornament(s, W / 2, 5.4, 3.2, "Bottom");
s.addNotes("착석 안내용 대기 화면입니다. 휴대전화 진동 전환 안내 문구를 추가해도 좋습니다.");

// ---------- 3. 전체 식순 ----------
pres.addSection({ title: "식순" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "식순" });
s.addText("식  순", { placeholder: "title" });
s.addText("PROGRAMME", { x: 0.9, y: 1.62, w: 6, h: 0.35, fontSize: 12, fontFace: HEAD, color: C.accent1, charSpacing: 6, margin: 0, isTextBox: true, objectName: "Programme caption" });

// 2단 배치: 좌 5개, 우 4개
const colX = [0.95, 6.95], colW = 5.45, rowY0 = 2.3, rowH = 0.86;
PROGRAMME.forEach((p, i) => {
  const col = i < 5 ? 0 : 1, row = i < 5 ? i : i - 5;
  const x = colX[col], y = rowY0 + row * rowH;
  // 번호 원형 배지
  s.addShape(pres.ShapeType.ellipse, { x, y: y + 0.1, w: 0.52, h: 0.52, fill: { color: C.text2 }, line: { color: C.accent1, width: 1 }, objectName: `Badge ${i + 1}` });
  s.addText(String(i + 1), { x, y: y + 0.1, w: 0.52, h: 0.52, align: "center", valign: "middle", fontSize: 14, fontFace: HEAD, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: `Badge no ${i + 1}` });
  // 순서명 + 담당
  s.addText([
    { text: p.title, options: { fontSize: 22, fontFace: HEAD, bold: true, color: C.background1, charSpacing: 2 } },
    { text: `    ${p.who}`, options: { fontSize: 13, fontFace: BODY, color: C.accent3 } },
  ], { x: x + 0.72, y, w: colW - 0.72, h: 0.72, valign: "middle", margin: 0, isTextBox: true, objectName: `Item ${i + 1}` });
  // 구분 하선 (항목 아래 얇은 선)
  if (row < 4) s.addShape(pres.ShapeType.line, { x: x + 0.72, y: y + rowH - 0.07, w: colW - 0.72, h: 0, line: { color: C.accent5, width: 0.5, dashType: "sysDot" }, objectName: `Rule ${i + 1}` });
});
s.addNotes("전체 식순을 한눈에 보여 주는 화면입니다. 담당자명(회장, 사무총장 등)은 실제 직함·성함으로 바꿔 주세요.");

// ---------- 4~12. 순서별 화면 ----------
PROGRAMME.forEach((p, i) => {
  const f = pres.addSlide({ masterName: "FOCUS", sectionTitle: "식순" });
  f.addText(`제 ${i + 1} 순서`, { placeholder: "num" });
  f.addText(p.title, { placeholder: "title" });
  f.addText([
    { text: p.who, options: { bold: true, color: C.accent1, breakLine: true } },
    { text: p.desc, options: {} },
  ], { placeholder: "desc" });
  ornament(f, W / 2, 2.4, 2.6, "Top");
  ornament(f, W / 2, 4.3, 2.6, "Bottom");
  f.addNotes(`${i + 1}. ${p.title} - ${p.who}. 설명 문구는 행사에 맞게 수정하세요.`);
});

// ---------- 13. 내빈 소개 (명단형) ----------
pres.addSection({ title: "내빈" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "내빈" });
s.addText("내빈 소개", { placeholder: "title" });
s.addText("DISTINGUISHED GUESTS", { x: 0.9, y: 1.62, w: 6, h: 0.35, fontSize: 12, fontFace: HEAD, color: C.accent1, charSpacing: 6, margin: 0, isTextBox: true, objectName: "Guests caption" });
const guests = [
  ["○○○", "○○시장"], ["○○○", "○○시의회 의장"], ["○○○", "○○대학교 총장"],
  ["○○○", "○○상공회의소 회장"], ["○○○", "○○재단 이사장"], ["○○○", "○○협회 명예회장"],
];
const gx0 = 0.95, gy0 = 2.3, gw = 3.65, gh = 1.95, gap = 0.3;
guests.forEach((g, i) => {
  const x = gx0 + (i % 3) * (gw + gap), y = gy0 + Math.floor(i / 3) * (gh + gap);
  s.addShape(pres.ShapeType.rect, { x, y, w: gw, h: gh, fill: { color: C.text2, transparency: 35 }, line: { color: C.accent1, width: 0.75 }, objectName: `Guest card ${i + 1}` });
  diamond(s, x + gw / 2 - 0.07, y + 0.3, 0.14, `Guest mark ${i + 1}`);
  s.addText(g[0], { x, y: y + 0.6, w: gw, h: 0.65, align: "center", fontSize: 26, fontFace: HEAD, bold: true, color: C.background1, charSpacing: 4, margin: 0, isTextBox: true, objectName: `Guest name ${i + 1}` });
  s.addText(g[1], { x, y: y + 1.3, w: gw, h: 0.4, align: "center", fontSize: 14, fontFace: BODY, color: C.accent2, margin: 0, isTextBox: true, objectName: `Guest role ${i + 1}` });
});
s.addNotes("내빈 명단 카드입니다. 카드 수가 다르면 카드를 복사/삭제해 사용하세요. 좌석 순서 또는 소개 순서대로 배치합니다.");

// ---------- 14. 마무리 ----------
pres.addSection({ title: "클로징" });
s = pres.addSlide({ masterName: "TITLE", sectionTitle: "클로징" });
s.addText("THANK YOU", { placeholder: "eyebrow" });
s.addText("감사합니다", { placeholder: "title" });
s.addText("함께해 주신 내빈 여러분께 깊이 감사드립니다", { placeholder: "sub" });
ornament(s, W / 2, 2.25, 3.2, "Top");
ornament(s, W / 2, 5.4, 3.2, "Bottom");
s.addNotes("폐회 후 퇴장 안내 화면입니다.");

(async () => {
  await pres.writeFile({ fileName: "내빈행사_식순.pptx" });
  await applyTheme("내빈행사_식순.pptx", THEME);
  console.log("written");
})();
