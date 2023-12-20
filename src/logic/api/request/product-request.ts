import { ProductStatus } from '../../enum/product-status.js'

export interface ProductRequest {
  _id: string
  schemaId: string
  status: ProductStatus
  gtin: string
  timelineEvents: TimelineEvent[]
}

interface TimelineEvent {
  changeType: string
  value: string
  user: string
  _id: string
}

export const productRequest = (gtin: string): ProductRequest => {
  return {
    _id: gtin,
    schemaId: '64c6b54145a76223cc2c600d',
    status: ProductStatus.Unassigned,
    gtin: gtin,
    timelineEvents: [
      {
        changeType: 'Created',
        value: '',
        user: 'auto',
        _id: '',
      },
    ],
  }
}
