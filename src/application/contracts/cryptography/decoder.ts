export interface Decoder {
  decode(token: string): Promise<Record<string, unknown> | undefined>
}
