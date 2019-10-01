export interface WebhookPayload {
  event: string,
  Account: {
    thumb: string,
    title: string
  },
  Metadata: {
    grandparentTitle: string,
    parentTitle: string,
    ratingKey: string,
    skipParent: boolean,
    tagline: string,
    title: string,
    type: string
  },
  Player: {
    title: string
  },
  Server: {
    title: string,
    uuid: string
  }
}
