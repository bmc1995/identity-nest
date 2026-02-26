import { InMemoryStore } from './InMemoryStore';

describe('InMemoryStore', () => {
  it('should be defined', () => {
    expect(new InMemoryStore()).toBeDefined();
  });

  it('should create, find, update, and delete items', () => {
    interface TestItem {
      id: string;
      name: string;
      value: number;
    }

    const store = new InMemoryStore<TestItem>();

    // Create
    const item1 = store.create({ name: 'Item 1', value: 10 });
    expect(item1).toHaveProperty('id');
    expect(item1.name).toBe('Item 1');
    expect(item1.value).toBe(10);

    const item2 = store.create({ name: 'Item 2', value: 20 });
    expect(item2).toHaveProperty('id');
    expect(item2.name).toBe('Item 2');
    expect(item2.value).toBe(20);

    // Find by ID
    const foundItem1 = store.findById(item1.id);
    expect(foundItem1).toEqual(item1);

    const foundItem2 = store.findById(item2.id);
    expect(foundItem2).toEqual(item2);

    // Find all
    const allItems = store.findAll();
    expect(allItems.length).toBe(2);
    expect(allItems).toContainEqual(item1);
    expect(allItems).toContainEqual(item2);

    // Update
    const updatedItem1 = store.update(item1.id, { value: 15 });
    expect(updatedItem1).toHaveProperty('id', item1.id);
    expect(updatedItem1).toHaveProperty('name', 'Item 1');
    expect(updatedItem1).toHaveProperty('value', 15);

    const nonExistentUpdate = store.update('non-existent-id', { value: 30 });
    expect(nonExistentUpdate).toBeUndefined();

    // Delete
    const deleteResult = store.delete(item1.id);
    expect(deleteResult).toBe(true);

    const postDeleteItem = store.findById(item1.id);
    expect(postDeleteItem).toBeUndefined();

    const deleteNonExistent = store.delete('non-existent-id');
    expect(deleteNonExistent).toBe(false);

    const remainingItems = store.findAll();
    expect(remainingItems.length).toBe(1);
    expect(remainingItems).toContainEqual(item2);
  });
});
