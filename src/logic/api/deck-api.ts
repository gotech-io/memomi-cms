import { APIRequestContext } from '@playwright/test'
import { APIResponse, ApiBase } from '@testomate/framework'
import { DrawCardResponse } from './dto/draw-card-response.dto.js'
import { CreateDeckResponse } from './dto/create-deck-response.dto.js'

export class DeckApi extends ApiBase {
  constructor(apiContext: APIRequestContext) {
    super(apiContext)
  }

  get apiEndpointUrl(): string {
    return 'https://www.deckofcardsapi.com/api/deck'
  }

  public async createNewDeck(): Promise<APIResponse<CreateDeckResponse>> {
    return this.get<CreateDeckResponse>(`${this.apiEndpointUrl}/new`)
  }

  public async drawCardsFromDeck(deckId: string, count: number) {
    return this.post<DrawCardResponse>(`${this.apiEndpointUrl}/${deckId}/draw`, { params: { count: count } })
  }
}
