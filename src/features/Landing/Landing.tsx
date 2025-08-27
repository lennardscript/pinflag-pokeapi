import { useNavigate } from "react-router"

export function Landing() {
  const navigate = useNavigate()

  function handleStartClick() {
    navigate('/pokegrid')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-bounce animation-delay-1000"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-red-400 rounded-full opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-green-400 rounded-full opacity-25 animate-ping animation-delay-3000"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-purple-400 rounded-full opacity-20 animate-bounce animation-delay-500"></div>
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-8xl md:text-9xl font-black mb-8 bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
          POKÉDEX
        </h1>

        <p className="text-xl md:text-2xl text-white/80 mb-12 font-light tracking-wide">
          Discover the world of Pokémon
        </p>

        <button
          onClick={handleStartClick}
          className="group relative px-12 py-4 text-2xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-red-500/50 active:scale-95"
        >
          <span className="relative z-10">START</span>

          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover:border-white/60 transition-colors duration-300"></div>
        </button>

        <div className="absolute -top-20 -right-20 w-32 h-32 opacity-30">
          <div className="w-full h-full border-4 border-white rounded-full relative animate-spin-slow">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 border-4 border-gray-800"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

