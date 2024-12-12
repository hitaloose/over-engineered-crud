export interface Hasher {
  hash(plainValue: string): Promise<string>
}
