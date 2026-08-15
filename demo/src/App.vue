<script setup lang="ts">
import H2lRanking from '../../src/index'

const palettes = [
  ['#f43f5e', '#7c3aed'], ['#f97316', '#db2777'], ['#eab308', '#ea580c'], ['#22c55e', '#0f766e'],
  ['#06b6d4', '#2563eb'], ['#3b82f6', '#7c3aed'], ['#8b5cf6', '#c026d3'], ['#ec4899', '#be123c'],
  ['#14b8a6', '#0f766e'], ['#64748b', '#312e81'], ['#65a30d', '#0f766e'], ['#0ea5e9', '#1d4ed8'],
  ['#f59e0b', '#dc2626'], ['#a855f7', '#4338ca'], ['#fb7185', '#9333ea'], ['#38bdf8', '#1e40af'],
  ['#f472b6', '#9d174d'], ['#818cf8', '#4f46e5'], ['#facc15', '#ca8a04'], ['#34d399', '#047857'],
  ['#60a5fa', '#1d4ed8'], ['#f9a8d4', '#db2777'], ['#a3e635', '#15803d'], ['#fb923c', '#c2410c']
]

function createCover(title: string, index: number) {
  const [from, to] = palettes[index]
  const label = title.replace(/[《》]/g, '').slice(0, 4)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="300" height="420" fill="url(#g)"/><circle cx="250" cy="68" r="100" fill="white" fill-opacity=".12"/><circle cx="45" cy="372" r="120" fill="white" fill-opacity=".08"/><text x="150" y="220" fill="white" font-family="sans-serif" font-size="38" font-weight="700" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const hangTitles = ['中二病也要谈恋爱', '玉子爱情故事', '葬送的芙莉莲', '我心里危险的东西', '碧蓝之海 第一季', '双城之战', '男子高中生的日常', '樱花庄的宠物女孩', 'NO GAME NO LIFE 游戏人生', 'OVERLORD', '言叶之庭', '命运石之门']
const upperTitles = ['搞笑漫画日和', '胆大党', '荒川爆笑团', '银魂', '某科学的超电磁炮', '魔法禁书目录', '花牌情缘', '热带雨林的爆笑生活', '零之使魔', '魔法少女小圆', '齐木楠雄的灾难', 'Re：从零开始的异世界生活']

const rankings = {
  hang: hangTitles.map((title, index) => ({
    title: `《${title}》`,
    cover: createCover(title, index),
    ...(index < 4 ? {
      url: `https://example.com/anime/${index + 1}`,
      description: ['我的私藏恋爱动画。', '温柔又明亮的青春故事。', '跨越漫长时光的奇幻旅程。', '细腻得让人心动的校园恋爱。'][index]
    } : {})
  })),
  upper: upperTitles.map((title, index) => ({
    title: `《${title}》`,
    cover: createCover(title, index + hangTitles.length),
    ...(index < 2 ? {
      url: `https://example.com/anime/${index + 13}`,
      description: ['节奏轻快，笑点密集。', '超自然日常的热血开场。'][index]
    } : {})
  })),
  middle: [],
  lower: [],
  la: []
}
</script>

<template>
  <main class="page-shell">
    <header class="hero">
      <p class="eyebrow">H2L RANKING · ANIME EDITION</p>
      <h1>从夯到拉 · 动漫排行</h1>
      <p class="subtitle">滚动封面浏览我的 24 部动画清单，点击任意封面可打开详情。</p>
    </header>

    <section class="ranking-panel" aria-label="动漫排行榜">
      <H2lRanking :rankings="rankings" />
    </section>

    <div class="bottom-space" aria-hidden="true" />
  </main>
</template>

<style>
:root {
  color: #f8fafc;
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #1a1a2e;
}

* { box-sizing: border-box; }

body { margin: 0; min-width: 320px; }

.page-shell {
  min-height: 100vh;
  padding: 72px 32px 0;
  background: radial-gradient(circle at 12% 2%, #37306b 0, transparent 32rem), radial-gradient(circle at 88% 18%, #182d5c 0, transparent 28rem), #1a1a2e;
}

.hero { max-width: 1120px; margin: 0 auto 36px; }
.eyebrow { margin: 0 0 12px; color: #a5b4fc; font-size: 12px; font-weight: 700; letter-spacing: .16em; }
h1 { margin: 0; font-size: clamp(32px, 5vw, 52px); letter-spacing: -.04em; }
.subtitle { margin: 14px 0 0; color: #cbd5e1; font-size: 16px; }

.ranking-panel {
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 20px;
  background: rgb(15 23 42 / 58%);
  box-shadow: 0 24px 70px rgb(0 0 0 / 24%);
  backdrop-filter: blur(14px);
}

.bottom-space { height: 140px; }

@media (max-width: 640px) {
  .page-shell { padding: 44px 16px 0; }
  .ranking-panel { padding: 14px; border-radius: 14px; }
  .subtitle { font-size: 14px; line-height: 1.6; }
}
</style>
