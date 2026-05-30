export interface SavedTab {
  id: string
  url: string
  title: string
  favicon: string
  domain: string
  savedAt: number
}

export interface StorageData {
  tabs: SavedTab[]
}
