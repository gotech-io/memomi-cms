export interface ProductRequest {
  _id: string
  schemaId: string
  status: string
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
    _id: 'auto',
    schemaId: '64c6b54145a76223cc2c600d',
    status: 'Unassigned',
    gtin,
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
