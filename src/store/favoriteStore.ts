import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteStore {
  favorites: number[]
  addFavorite: (id: number) => void
  removeFavorite: (id: number) => void
  toggleFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
  getFavoritesCount: () => number
  clearAllFavorites: () => void
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites
            : [...state.favorites, id]
        })),

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((favId) => favId !== id)
        })),

      toggleFavorite: (id) => {
        const isFav = get().isFavorite(id)
        if (isFav) {
          get().removeFavorite(id)
        } else {
          get().addFavorite(id)
        }
      },

      isFavorite: (id) => get().favorites.includes(id),

      getFavoritesCount: () => get().favorites.length,

      clearAllFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'pokemon-favorites-storage',
      version: 1,
    }
  )
)
