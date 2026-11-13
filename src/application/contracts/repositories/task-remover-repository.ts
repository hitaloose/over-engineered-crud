export interface TaskRemoverRepository {
  remove(id: string): Promise<void>
}
