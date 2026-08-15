export interface RankingItem {
  title: string
  cover: string
  url?: string
  description?: string
}

export interface TierConfig {
  id: string
  label: string
  background: string
  color: string
}

export const DEFAULT_TIERS: TierConfig[] = [
  { id: 'hang', label: '夯', background: '#ff0000', color: '#ffffff' },
  { id: 'upper', label: '顶级', background: '#ff9500', color: '#ffffff' },
  { id: 'middle', label: '人上人', background: '#ffcc00', color: '#000000' },
  { id: 'lower', label: 'NPC', background: '#fef4d1', color: '#000000' },
  { id: 'la', label: '拉完了', background: '#ffffff', color: '#000000' }
]

export type RankingTier = string

export type Rankings = Record<string, RankingItem[]>
