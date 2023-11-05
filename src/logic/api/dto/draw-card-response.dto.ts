export interface DrawCardResponse {
  success: boolean
  deck_id: string
  cards: CardResponseItem[]
  remaining: number
}

export interface CardResponseItem {
  code: string
  image: string
  images: {
    svg: string
    png: string
  }
  value: string
  suit: string
}
