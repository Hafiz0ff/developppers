export type MemoryCollection = {
  id: string;
  shareCode: string;
  agentId: string;
  agentName: string;
  agentPhone: string;
  agentAvatar: string;
  agentAgency: string;
  title: string;
  notes: string;
  propertyIds: string;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export const DEFAULT_DEMO_COLLECTIONS: MemoryCollection[] = [
  {
    id: "col-demo-1",
    shareCode: "khujand-top3",
    agentId: "agent-default",
    agentName: "Рустам Ахмедов",
    agentPhone: "+992 92 777 00 22",
    agentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop",
    agentAgency: "Агентство «Сугд-Инвест»",
    title: "Эксклюзивная подборка квартир в 18 и 19 мкр (Худжанд)",
    notes: "Отобрал лучшие варианты с евроремонтом и готовыми документами для вашей семьи.",
    propertyIds: JSON.stringify(["c1", "c4", "c2"]),
    viewsCount: 14,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

const globalForCollections = globalThis as typeof globalThis & {
  sogdInMemoryCollections?: MemoryCollection[];
};

function getStore(): MemoryCollection[] {
  if (!globalForCollections.sogdInMemoryCollections) {
    globalForCollections.sogdInMemoryCollections = [...DEFAULT_DEMO_COLLECTIONS];
  }
  return globalForCollections.sogdInMemoryCollections;
}

function setStore(next: MemoryCollection[]) {
  globalForCollections.sogdInMemoryCollections = next;
}

export function listInMemoryCollections(agentId?: string): MemoryCollection[] {
  const store = getStore();
  if (!agentId) return store;
  return store.filter((collection) => collection.agentId === agentId);
}

export function addInMemoryCollection(collection: MemoryCollection): MemoryCollection {
  setStore([collection, ...getStore()]);
  return collection;
}

export function findInMemoryCollection(shareCode: string): MemoryCollection | null {
  return getStore().find((collection) => collection.shareCode === shareCode) ?? null;
}

export function incrementInMemoryViews(id: string): MemoryCollection | null {
  let updated: MemoryCollection | null = null;
  setStore(
    getStore().map((collection) => {
      if (collection.id !== id) return collection;
      updated = { ...collection, viewsCount: (collection.viewsCount || 0) + 1 };
      return updated;
    })
  );
  return updated;
}

export function resetInMemoryCollectionsForTests(): void {
  setStore([...DEFAULT_DEMO_COLLECTIONS]);
}
