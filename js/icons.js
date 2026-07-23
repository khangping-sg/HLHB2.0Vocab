/* ============================================================
   华文小乐园 — custom SVG icon library
   Keys = the Chinese word/character they illustrate.
   Icons whose class list includes "icon-anim" have a matching
   @keyframes rule in style.css (verbs get motion).
   ============================================================ */

const ICONS = {
  "鸡蛋": `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="56" rx="26" ry="34" fill="#FFF3D6" stroke="var(--ink)" stroke-width="3"/><ellipse cx="42" cy="46" rx="7" ry="9" fill="#FFFFFF" opacity=".8"/></svg>`,

  "米饭": `<svg viewBox="0 0 100 100"><path d="M20 55 Q50 40 80 55 L74 78 Q50 88 26 78 Z" fill="var(--sky)" stroke="var(--ink)" stroke-width="3"/><ellipse cx="42" cy="52" rx="4" ry="6" fill="#fff"/><ellipse cx="55" cy="48" rx="4" ry="6" fill="#fff"/><ellipse cx="63" cy="55" rx="4" ry="6" fill="#fff"/><ellipse cx="48" cy="58" rx="4" ry="6" fill="#fff"/></svg>`,

  "鸭子": `<svg viewBox="0 0 100 100"><ellipse cx="45" cy="62" rx="30" ry="22" fill="#FFF3D6" stroke="var(--ink)" stroke-width="3"/><circle cx="68" cy="40" r="16" fill="#FFF3D6" stroke="var(--ink)" stroke-width="3"/><path d="M82 40 L94 36 L94 46 Z" fill="var(--gold)" stroke="var(--ink)" stroke-width="2"/><circle cx="72" cy="36" r="2.5" fill="var(--ink)"/></svg>`,

  "小狗": `<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="28" fill="#E9C9A0" stroke="var(--ink)" stroke-width="3"/><path d="M26 40 Q14 30 20 55 Q26 55 30 46Z" fill="#C99B65" stroke="var(--ink)" stroke-width="2.5"/><path d="M74 40 Q86 30 80 55 Q74 55 70 46Z" fill="#C99B65" stroke="var(--ink)" stroke-width="2.5"/><circle cx="40" cy="52" r="3" fill="var(--ink)"/><circle cx="60" cy="52" r="3" fill="var(--ink)"/><ellipse cx="50" cy="64" rx="6" ry="4" fill="var(--ink)"/></svg>`,

  "唱歌": `<svg viewBox="0 0 100 100" class="icon-anim icon-anim-bounce"><circle cx="42" cy="42" r="20" fill="#FFE1C4" stroke="var(--ink)" stroke-width="3"/><ellipse cx="42" cy="52" rx="7" ry="5" fill="var(--red)"/><path d="M66 30 Q80 20 84 34 Q88 46 74 46 Q78 34 66 34Z" fill="var(--green)" stroke="var(--ink)" stroke-width="2.5" class="icon-note"/></svg>`,

  "青菜": `<svg viewBox="0 0 100 100"><path d="M50 90 Q46 60 50 20 Q58 45 60 20 Q70 50 62 90 Z" fill="var(--green)" stroke="var(--ink)" stroke-width="3"/><path d="M50 90 Q40 60 30 20 Q40 48 44 20" fill="var(--green)" stroke="var(--ink)" stroke-width="3"/></svg>`,

  "刷牙": `<svg viewBox="0 0 100 100"><path d="M35 60 Q50 40 65 60 Q65 78 50 78 Q35 78 35 60Z" fill="#fff" stroke="var(--ink)" stroke-width="3"/><rect x="46" y="18" width="8" height="30" rx="3" fill="var(--sky)" stroke="var(--ink)" stroke-width="2.5" class="icon-brush"/><rect x="42" y="14" width="16" height="8" rx="2" fill="var(--ink)" class="icon-brush"/></svg>`,

  "洗脸": `<svg viewBox="0 0 100 100"><circle cx="50" cy="46" r="24" fill="#FFE1C4" stroke="var(--ink)" stroke-width="3"/><circle cx="42" cy="44" r="2.5" fill="var(--ink)"/><circle cx="58" cy="44" r="2.5" fill="var(--ink)"/><path d="M44 56 Q50 60 56 56" stroke="var(--ink)" stroke-width="2.5" fill="none"/><path class="icon-anim icon-drop" d="M50 70 Q54 78 50 84 Q46 78 50 70Z" fill="var(--sky)"/></svg>`,

  "毛巾": `<svg viewBox="0 0 100 100"><rect x="22" y="30" width="56" height="42" rx="4" fill="var(--sky)" stroke="var(--ink)" stroke-width="3"/><rect x="22" y="38" width="56" height="6" fill="#fff" opacity=".7"/><rect x="22" y="54" width="56" height="6" fill="#fff" opacity=".7"/></svg>`,

  "袜子": `<svg viewBox="0 0 100 100"><path d="M40 15 h20 v35 q0 8 12 12 q10 4 10 18 q0 8 -10 8 h-32 q-8 0-8-10 v-63Z" fill="var(--red)" stroke="var(--ink)" stroke-width="3"/><rect x="40" y="15" width="20" height="10" fill="#fff" opacity=".5"/></svg>`,

  "皮鞋": `<svg viewBox="0 0 100 100"><path d="M18 68 Q18 50 34 48 L60 48 Q70 48 78 58 L86 66 Q88 72 80 72 L20 72 Q16 72 18 68Z" fill="#8B5A2B" stroke="var(--ink)" stroke-width="3"/><path d="M34 48 L34 60" stroke="var(--ink)" stroke-width="2"/></svg>`,

  "衣服": `<svg viewBox="0 0 100 100"><path d="M38 22 L50 30 L62 22 L78 34 L70 46 L64 42 L64 80 L36 80 L36 42 L30 46 L22 34Z" fill="var(--sky)" stroke="var(--ink)" stroke-width="3"/></svg>`,

  "被子": `<svg viewBox="0 0 100 100"><rect x="16" y="30" width="68" height="46" rx="6" fill="var(--gold)" stroke="var(--ink)" stroke-width="3"/><path d="M16 46 h68 M16 60 h68" stroke="#fff" stroke-width="4" opacity=".6"/></svg>`,

  "红色": `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="32" fill="var(--red)" stroke="var(--ink)" stroke-width="3"/></svg>`,

  "果汁": `<svg viewBox="0 0 100 100"><path d="M34 24 h32 l-6 56 q-1 8-10 8 q-9 0-10-8 Z" fill="#FFE9A8" stroke="var(--ink)" stroke-width="3"/><rect x="46" y="10" width="4" height="20" fill="var(--sky)" stroke="var(--ink)" stroke-width="1.5"/></svg>`,

  "圆圈": `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="none" stroke="var(--green)" stroke-width="7"/></svg>`,

  "打扫": `<svg viewBox="0 0 100 100" class="icon-anim icon-sweep"><rect x="47" y="16" width="6" height="46" fill="#B08347" stroke="var(--ink)" stroke-width="2"/><path d="M30 60 L70 60 L62 84 L38 84 Z" fill="var(--gold)" stroke="var(--ink)" stroke-width="2.5"/></svg>`,

  "窗户": `<svg viewBox="0 0 100 100"><rect x="18" y="18" width="64" height="64" rx="4" fill="var(--sky)" opacity=".35" stroke="var(--ink)" stroke-width="3"/><path d="M50 18 v64 M18 50 h64" stroke="var(--ink)" stroke-width="3"/></svg>`,

  "桌子": `<svg viewBox="0 0 100 100"><rect x="14" y="34" width="72" height="8" fill="#B08347" stroke="var(--ink)" stroke-width="2.5"/><rect x="20" y="42" width="6" height="36" fill="#8B5A2B" stroke="var(--ink)" stroke-width="2"/><rect x="74" y="42" width="6" height="36" fill="#8B5A2B" stroke="var(--ink)" stroke-width="2"/></svg>`,

  "听话": `<svg viewBox="0 0 100 100" class="icon-anim"><path d="M40 30 Q20 30 24 55 Q26 74 44 74 Q46 60 40 30Z" fill="#FFE1C4" stroke="var(--ink)" stroke-width="3"/><path class="icon-wave" d="M56 40 Q66 50 56 62" stroke="var(--green)" stroke-width="4" fill="none" stroke-linecap="round"/><path class="icon-wave icon-wave2" d="M66 34 Q82 50 66 68" stroke="var(--green)" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,

  "星星": `<svg viewBox="0 0 100 100" class="icon-anim icon-twinkle"><path d="M50 12 L59 38 L86 38 L64 54 L72 80 L50 64 L28 80 L36 54 L14 38 L41 38Z" fill="var(--gold)" stroke="var(--ink)" stroke-width="2.5"/></svg>`,

  "明天": `<svg viewBox="0 0 100 100"><circle cx="38" cy="50" r="22" fill="var(--gold)" stroke="var(--ink)" stroke-width="3"/><path d="M64 30 Q78 34 78 50 Q78 66 64 70 Q74 60 74 50 Q74 40 64 30Z" fill="#6A6FB0" stroke="var(--ink)" stroke-width="2.5"/></svg>`,

  "庆祝": `<svg viewBox="0 0 100 100" class="icon-anim icon-confetti"><rect x="20" y="20" width="8" height="8" fill="var(--red)"/><rect x="70" y="26" width="8" height="8" fill="var(--gold)"/><rect x="46" y="14" width="8" height="8" fill="var(--sky)"/><rect x="30" y="60" width="8" height="8" fill="var(--gold)"/><rect x="64" y="64" width="8" height="8" fill="var(--red)"/><path d="M50 40 L38 84 L62 84 Z" fill="var(--sky)" stroke="var(--ink)" stroke-width="2.5"/></svg>`,

  "故事": `<svg viewBox="0 0 100 100"><path d="M50 26 Q30 18 16 24 V76 Q30 70 50 78 Z" fill="var(--sky)" stroke="var(--ink)" stroke-width="3"/><path d="M50 26 Q70 18 84 24 V76 Q70 70 50 78 Z" fill="var(--gold)" stroke="var(--ink)" stroke-width="3"/></svg>`,

  "兔子": `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="24" ry="20" fill="#fff" stroke="var(--ink)" stroke-width="3"/><ellipse cx="38" cy="24" rx="7" ry="20" fill="#fff" stroke="var(--ink)" stroke-width="2.5"/><ellipse cx="60" cy="24" rx="7" ry="20" fill="#fff" stroke="var(--ink)" stroke-width="2.5"/><circle cx="42" cy="58" r="2.5" fill="var(--ink)"/><circle cx="58" cy="58" r="2.5" fill="var(--ink)"/><ellipse cx="50" cy="68" rx="4" ry="3" fill="var(--red)"/></svg>`,

  "眼睛": `<svg viewBox="0 0 100 100" class="icon-anim icon-blink"><path d="M12 50 Q50 20 88 50 Q50 80 12 50Z" fill="#fff" stroke="var(--ink)" stroke-width="3"/><circle cx="50" cy="50" r="14" fill="#6A6FB0" stroke="var(--ink)" stroke-width="2.5"/><circle cx="50" cy="50" r="6" fill="var(--ink)"/></svg>`,

  "老虎": `<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="30" fill="var(--gold)" stroke="var(--ink)" stroke-width="3"/><path d="M28 30 L34 44 M72 30 L66 44 M40 22 L42 38 M60 22 L58 38" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/><circle cx="40" cy="50" r="3" fill="var(--ink)"/><circle cx="60" cy="50" r="3" fill="var(--ink)"/><ellipse cx="50" cy="62" rx="6" ry="4" fill="var(--red)"/></svg>`,

  "狮子": `<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="18" fill="#E9C9A0" stroke="var(--ink)" stroke-width="3"/><circle cx="50" cy="52" r="30" fill="none" stroke="var(--gold)" stroke-width="10" stroke-dasharray="6 6"/><circle cx="42" cy="50" r="2.5" fill="var(--ink)"/><circle cx="58" cy="50" r="2.5" fill="var(--ink)"/><ellipse cx="50" cy="60" rx="5" ry="3" fill="var(--ink)"/></svg>`,

  "孩子": `<svg viewBox="0 0 100 100"><circle cx="50" cy="34" r="16" fill="#FFE1C4" stroke="var(--ink)" stroke-width="3"/><path d="M32 90 Q32 58 50 58 Q68 58 68 90Z" fill="var(--sky)" stroke="var(--ink)" stroke-width="3"/></svg>`,

  "学校": `<svg viewBox="0 0 100 100"><rect x="20" y="42" width="60" height="42" fill="#F4E1C1" stroke="var(--ink)" stroke-width="3"/><path d="M14 42 L50 16 L86 42Z" fill="var(--red)" stroke="var(--ink)" stroke-width="3"/><rect x="44" y="60" width="12" height="24" fill="var(--sky)" stroke="var(--ink)" stroke-width="2"/></svg>`,

  "商店": `<svg viewBox="0 0 100 100"><rect x="18" y="42" width="64" height="40" fill="#fff" stroke="var(--ink)" stroke-width="3"/><path d="M14 42 L26 20 L74 20 L86 42Z" fill="var(--red)" stroke="var(--ink)" stroke-width="3"/><rect x="42" y="58" width="16" height="24" fill="var(--gold)" stroke="var(--ink)" stroke-width="2"/></svg>`,

  "楼梯": `<svg viewBox="0 0 100 100"><path d="M14 84 h16 v-16 h16 v-16 h16 v-16 h16 v-16 h16 v64 Z" fill="var(--sky)" stroke="var(--ink)" stroke-width="3"/></svg>`,

  "高兴": `<svg viewBox="0 0 100 100" class="icon-anim icon-bounce"><circle cx="50" cy="50" r="30" fill="var(--gold)" stroke="var(--ink)" stroke-width="3"/><circle cx="40" cy="44" r="3" fill="var(--ink)"/><circle cx="60" cy="44" r="3" fill="var(--ink)"/><path d="M36 58 Q50 72 64 58" stroke="var(--ink)" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>`,

  "游戏": `<svg viewBox="0 0 100 100"><rect x="18" y="34" width="64" height="34" rx="14" fill="#6A6FB0" stroke="var(--ink)" stroke-width="3"/><circle cx="34" cy="51" r="4" fill="#fff"/><circle cx="46" cy="51" r="4" fill="#fff"/><circle cx="40" cy="45" r="4" fill="#fff"/><circle cx="40" cy="57" r="4" fill="#fff"/><circle cx="66" cy="45" r="4" fill="var(--gold)"/><circle cx="66" cy="57" r="4" fill="var(--red)"/></svg>`,

  "喜欢": `<svg viewBox="0 0 100 100" class="icon-anim icon-bounce"><path d="M50 84 C10 58 18 24 40 24 C48 24 50 32 50 32 C50 32 52 24 60 24 C82 24 90 58 50 84Z" fill="var(--red)" stroke="var(--ink)" stroke-width="3"/></svg>`
};
