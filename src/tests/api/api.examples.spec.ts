import { expect, test } from '@testomate/framework'
import { DeckApi } from 'src/logic/api/deck-api.js'

test.describe('DeckOfCards API example test', () => {
  test('Create a new deck', async ({ testContext }) => {
    const deckApi = await testContext.getApi(DeckApi)
    const response = await deckApi.createNewDeck()
    expect(response.statusCode).toBe(200)
    const data = await response.getJsonData()
    expect(data.success).toBeTruthy()
    expect(data.deck_id).toBeDefined()
    expect(data.remaining).toBe(52)
    expect(data.shuffled).toBeFalsy()
  })

  test('draw a card', async ({ testContext }) => {
    const deckApi = await testContext.getApi(DeckApi)
    const createDeckResponse = await deckApi.createNewDeck()
    const response = await deckApi.drawCardsFromDeck((await createDeckResponse.getJsonData()).deck_id, 3)
    const responseData = await response.getJsonData()
    expect(responseData.remaining).toBe(49)
    expect(responseData.cards.length).toBe(3)
  })
})
