export interface ProductResponse {
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