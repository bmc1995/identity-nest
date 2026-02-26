export class InMemoryStore<T> {
  private store: Map<string, T> = new Map<string, T>();
  private idCounter: number = 0;

  create(item: Omit<T, 'id'>): T {
    const id = (this.idCounter++).toString();
    const newItem = { ...item, id } as T;
    this.store.set(id, newItem);
    return newItem;
  }
  findById(id: string): T | undefined {
    return this.store.get(id);
  }
  findAll(): T[] {
    return Array.from(this.store.values());
  }
  update(id: string, item: Partial<Omit<T, 'id'>>): T | undefined {
    const existingItem = this.store.get(id);
    if (!existingItem) {
      return undefined;
    }
    const updatedItem = { ...existingItem, ...item } as T;
    this.store.set(id, updatedItem);
    return updatedItem;
  }
  delete(id: string): boolean {
    return this.store.delete(id);
  }
}
