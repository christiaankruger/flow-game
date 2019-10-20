import { UnionFind } from '../util/union-find';

describe('Union-Find', () => {
  it('Basic test', () => {
    const UF = new UnionFind<number>(10);
    for (let i = 1; i <= 10; i++) {
      UF.register(i);
    }

    UF.union(1, 2);
    UF.union(3, 4);

    expect(UF.find(1, 2)).toBe(true);
    expect(UF.find(3, 4)).toBe(true);

    expect(UF.find(1, 4)).toBe(false);
    expect(UF.find(2, 8)).toBe(false);
    expect(UF.find(6, 7)).toBe(false);
  });

  it('Connect forests: 1', () => {
    const UF = new UnionFind<number>(10);
    for (let i = 1; i <= 10; i++) {
      UF.register(i);
    }

    UF.union(1, 2);
    UF.union(3, 4);
    UF.union(1, 3);

    UF.union(5, 6);

    expect(UF.find(1, 2)).toBe(true);
    expect(UF.find(2, 3)).toBe(true);
    expect(UF.find(3, 4)).toBe(true);
    expect(UF.find(1, 4)).toBe(true);
    expect(UF.find(5, 6)).toBe(true);

    expect(UF.find(1, 5)).toBe(false);
    expect(UF.find(2, 8)).toBe(false);
    expect(UF.find(6, 7)).toBe(false);
  });

  it('Connect forests: 2', () => {
    const UF = new UnionFind<number>(10);
    for (let i = 1; i <= 10; i++) {
      UF.register(i);
    }

    UF.union(2, 3);
    UF.union(4, 5);
    UF.union(3, 4);

    UF.union(6, 7);
    UF.union(8, 9);
    UF.union(7, 8);

    expect(UF.find(2, 5)).toBe(true);
    expect(UF.find(6, 8)).toBe(true);

    expect(UF.find(2, 8)).toBe(false);
  });

  it('Connect forests: 3', () => {
    const UF = new UnionFind<number>(10);
    for (let i = 1; i <= 10; i++) {
      UF.register(i);
    }

    UF.union(2, 3);
    UF.union(3, 4);
    UF.union(4, 5);

    UF.union(6, 7);
    UF.union(8, 9);
    UF.union(7, 8);

    UF.union(4, 7);

    expect(UF.find(2, 5)).toBe(true);
    expect(UF.find(6, 8)).toBe(true);
    expect(UF.find(4, 8)).toBe(true);

    expect(UF.find(1, 8)).toBe(false);
  });

  it('Should break when operating on unregistered item', () => {
    const UF = new UnionFind<number>(10);
    for (let i = 1; i <= 10; i++) {
      UF.register(i);
    }

    expect(() => UF.union(1, 11)).toThrowError('11 is not registered');
  });

  it('Should break when registering too many items', () => {
    const UF = new UnionFind<number>(10);
    for (let i = 1; i <= 10; i++) {
      UF.register(i);
    }

    expect(() => UF.register(11)).toThrowError('Full: Already 10 items');
  });
});
