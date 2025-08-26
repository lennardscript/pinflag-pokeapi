import { useNavigate } from 'react-router'
import { type Pokemon } from '../../services/pokeapi.ts'

interface PokeCardProps {
  pokemon: Pokemon
  isFavorite: boolean
  onToggleFavorite: () => void
}

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
}

export function PokeCard({ pokemon, isFavorite, onToggleFavorite }: PokeCardProps) {
  const navigate = useNavigate()

  function handleCardClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('button')) return
    navigate(`/pokedex/${pokemon.id}`)
  }

  function handleFavoriteClick(e: React.MouseEvent) {
    e.stopPropagation()
    onToggleFavorite()
  }

  const primaryType = pokemon.types[0].type.name
  const cardBgColor = typeColors[primaryType] || 'bg-gray-400'

  return (
    <div
      className="relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
      onClick={handleCardClick}
    >
      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
      >
        <span className="text-lg">{isFavorite ? '❤️' : '🩶'}</span>
      </button>

      <div className={`${cardBgColor} h-48 flex items-center justify-center relative`}>
        <img
          src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-32 h-32 object-contain drop-shadow-lg"
          loading="lazy"
        />

        <span className="absolute top-2 left-3 text-white/70 font-bold text-sm">
          #{pokemon.id.toString().padStart(3, '0')}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2 capitalize">{pokemon.name}</h3>

        <div className="flex gap-2 mb-3">
          {pokemon.types.map((typeInfo) => (
            <span
              key={typeInfo.type.name}
              className={`${typeColors[typeInfo.type.name] || 'bg-gray-400'} text-white text-xs font-semibold px-3 py-1 rounded-full capitalize`}
            >
              {typeInfo.type.name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Height:</span>
            <span className="font-semibold">{pokemon.height / 10}m</span>
          </div>
          <div className="flex justify-between">
            <span>Weight:</span>
            <span className="font-semibold">{pokemon.weight / 10}kg</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-1">Base Stat Total</div>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className={`${cardBgColor} h-2 rounded-full transition-all duration-500`}
              style={{
                width: `${Math.min(pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0) / 6, 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
    </div>
  )
}
