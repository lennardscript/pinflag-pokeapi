
import { create } from 'zustand'

interface FavoriteStore {
  favorites: number[]
  addFavorite: (id: number) => void
  removeFavorite: (id: number) => void
  toggleFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],
  addFavorite: (id) => set((state) => ({ favorites: [...state.favorites, id] })),
  removeFavorite: (id) =>
    set((state) => ({ favorites: state.favorites.filter((favId) => favId !== id) })),
  toggleFavorite: (id) => {
    const isFav = get().isFavorite(id)
    if (isFav) {
      get().removeFavorite(id)
    } else {
      get().addFavorite(id)
    }
  },
  isFavorite: (id) => get().favorites.includes(id),
}))

