<script setup lang="ts">
import type { Rankings, RankingTier } from '../types'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import H2lImageViewer from './H2lImageViewer.vue'
import H2lTooltip from './H2lTooltip.vue'

const props = withDefaults(defineProps<Props>(), {
  enableImageViewer: true
})

const TIER_LABELS: Record<RankingTier, string> = {
  hang: '夯',
  upper: '顶级',
  middle: '人上人',
  lower: 'NPC',
  la: '拉完了'
}

interface Props {
  rankings: Rankings
  enableImageViewer?: boolean
}

const rootRef = ref<HTMLElement>()
const labelsRef = ref<HTMLElement>()
const rowWidth = ref(0)

// 图片查看器状态
const viewerShow = ref(false)
const viewerSrc = ref('')
const viewerUrl = ref('')
const viewerTitle = ref('')
const viewerDescription = ref('')

const rowStyle = computed(() => ({
  width: rowWidth.value > 0 ? `${rowWidth.value}px` : undefined
}))

// 计算行宽度
function updateRowWidth() {
  if (rootRef.value && labelsRef.value) {
    rowWidth.value = rootRef.value.clientWidth - labelsRef.value.clientWidth
  }
}

// 监听父元素尺寸变化
let resizeObserver: ResizeObserver | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function debouncedUpdateRowWidth() {
  if (debounceTimer)
    clearTimeout(debounceTimer)
  debounceTimer = setTimeout(updateRowWidth, 200)
}

onMounted(() => {
  nextTick(() => {
    updateRowWidth()

    // 获取父元素并监听其尺寸变化
    const parent = rootRef.value?.parentElement
    if (parent) {
      resizeObserver = new ResizeObserver(debouncedUpdateRowWidth)
      resizeObserver.observe(parent)
    }
  })
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  if (debounceTimer)
    clearTimeout(debounceTimer)
})

function handleWheel(e: WheelEvent) {
  const target = e.currentTarget as HTMLElement
  if (e.deltaY !== 0) {
    e.preventDefault()
    target.scrollLeft += e.deltaY * 0.5
  }
}

// 打开图片查看器
function openViewer(cover: string, url?: string, title?: string, description?: string) {
  if (!props.enableImageViewer)
    return
  viewerSrc.value = cover
  viewerUrl.value = url || ''
  viewerTitle.value = title || ''
  viewerDescription.value = description || ''
  viewerShow.value = true
}

// 暴露给父组件使用
defineExpose({
  openViewer
})
</script>

<template>
  <div ref="rootRef" class="h2l-ranking">
    <H2lImageViewer v-model:show="viewerShow" :src="viewerSrc" :url="viewerUrl" :title="viewerTitle" :description="viewerDescription" />

    <div ref="labelsRef" class="h2l-ranking__labels">
      <slot name="labels">
        <div
          v-for="(label, tier) in TIER_LABELS"
          :key="tier"
          :class="`h2l-ranking__label h2l-ranking__label--${tier}`"
        >
          {{ label }}
        </div>
      </slot>
    </div>

    <div class="h2l-ranking__content">
      <div
        v-for="tier in Object.keys(TIER_LABELS) as RankingTier[]"
        :key="tier"
        class="h2l-ranking__row"
        :style="rowStyle"
      >
        <slot :name="tier">
          <div class="h2l-ranking__items" @wheel="handleWheel">
            <H2lTooltip v-for="(item, index) in rankings[tier]" :key="`${tier}-${index}`">
              <template #default>
                <div class="h2l-ranking__item" @click="openViewer(item.cover, item.url, item.title, item.description)">
                  <img :src="item.cover" :alt="item.title">
                </div>
              </template>
              <template #content>
                {{ item.title }}
              </template>
              <template v-if="item.description" #description>
                {{ item.description }}
              </template>
            </H2lTooltip>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.h2l-ranking {
  display: flex;
  border: 1px solid #000;
  background-color: #1a1a1a;
  overflow: hidden;
}

.h2l-ranking__labels {
  display: flex;
  flex-direction: column;
  max-width: 120px;
  min-width: 100px;
  width: 20%;
  border-right: 1px solid #000;
}

.h2l-ranking__label {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #000;
}

.h2l-ranking__label:last-child {
  border-bottom: none;
}

.h2l-ranking__label--hang {
  background-color: #ff0000;
  color: #fff;
}

.h2l-ranking__label--upper {
  background-color: #ff9500;
  color: #fff;
}

.h2l-ranking__label--middle {
  background-color: #ffcc00;
  color: #000;
}

.h2l-ranking__label--lower {
  background-color: #fef4d1;
  color: #000;
}

.h2l-ranking__label--la {
  background-color: #ffffff;
  color: #000;
}

.h2l-ranking__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.h2l-ranking__row {
  display: flex;
  height: 100px;
  border-bottom: 1px solid #000;
  overflow: hidden;
}

.h2l-ranking__row:last-child {
  border-bottom: none;
}

.h2l-ranking__items {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  min-width: 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.h2l-ranking__items::-webkit-scrollbar {
  display: none;
}

.h2l-ranking__item {
  position: relative;
  width: 84px;
  height: 84px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #333;
  cursor: pointer;
}

.h2l-ranking__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
