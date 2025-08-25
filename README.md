# 🚀 Pokédex App - Pinflag Tech Challenge

A modern Pokédex application developed as part of the **Pinflag Technical Challenge** (2nd recruitment phase), implemented with **React**, **TypeScript**, and **Vite**, following **Clean Architecture** principles and **Test-Driven Development (TDD)**.

## ✨ Key Features

### 🎯 Challenge Requirements Implementation

- **🏠 Landing Page**: Custom homepage with "START" button and creative visual elements
- **📱 PokeGrid**: Responsive 3-column grid with Pokémon cards
- **📖 Pokedex**: Detailed view of each Pokémon (inspired by Pokémon Platinum)
- **🔍 Filtering**: Real-time search by Pokémon name
- **⭐ Favorites System**: Add/remove favorites and filter by favorites
- **📄 Pagination**: 30 Pokémon per page for performance optimization
- **⚡ Loading States**: Loading indicators during API requests
- **📱 Responsive Design**: Adaptive design for all devices

### 🏗️ Architecture & Code Quality

- 🎯 **Clean Architecture**: Clear separation of concerns and well-defined layers
- 🧪 **TDD (Test-Driven Development)**: Test-driven development for higher code quality
- ⚡ **Vite**: Ultra-fast build tool for modern development
- 🔷 **TypeScript**: Static typing for greater robustness and maintainability
- 📝 **Clean Code**: English code, self-descriptive variables, no comments
- 🔄 **API Integration**: Complete integration with the official PokeAPI

## 🏗️ Project Structure

```
📦 pingflag-pokeapi
├── 📄 eslint.config.js          # ESLint configuration
├── 📄 index.html                # HTML entry point
├── 📄 package.json              # Dependencies and scripts
├── 📄 pnpm-lock.yaml           # pnpm lock file
├── 📁 public/                   # Static public files
├── 📄 README.md                 # Project documentation
├── 📁 src/                      # Main source code
│   ├── 📄 App.tsx              # Application root component
│   ├── 📁 assets/              # Static resources (images, icons)
│   ├── 📁 components/          # Reusable components
│   ├── 📁 features/            # Main features/modules
│   │   ├── 📁 Landing/         # Landing page
│   │   │   └── 📄 Landing.tsx   # Landing page component
│   │   ├── 📁 Pokedex/         # Pokedex module
│   │   │   ├── 📄 Pokedex.tsx  # Main Pokedex component
│   │   │   └── 📁 test/        # Pokedex module tests
│   │   └── 📁 PokeGrid/        # Pokemon grid module
│   │       ├── 📄 PokeCard.tsx # Pokemon card component
│   │       ├── 📄 PokeGrid.tsx # Grid component
│   │       └── 📁 test/        # PokeGrid module tests
│   ├── 📁 hooks/               # React custom hooks
│   ├── 📄 main.tsx             # React entry point
│   ├── 📁 routes/              # Routes configuration
│   │   ├── 📄 AppRoutes.tsx    # Main routes definition
│   │   └── 📄 index.tsx        # Routes exports
│   ├── 📁 services/            # External services and APIs
│   │   └── 📄 pokeapi.ts       # PokeAPI client
│   ├── 📁 store/               # Global state management
│   │   └── 📄 favoriteStore.ts # Favorite Pokémon store
│   ├── 📁 styles/              # Global styles
│   │   └── 📄 global.css       # Application global CSS
│   ├── 📁 utils/               # Utilities and helpers
│   └── 📄 vite-env.d.ts       # Vite types
├── 📄 tsconfig.app.json        # TypeScript config for app
├── 📄 tsconfig.json            # Main TypeScript configuration
├── 📄 tsconfig.node.json       # TypeScript config for Node
└── 📄 vite.config.ts           # Vite configuration
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Linting**: ESLint with modern configuration
- **Testing**: Testing framework for TDD
- **API**: PokeAPI (https://pokeapi.co/)
- **State Management**: Custom store implementation

## 🚀 Installation & Usage

```bash
# Clone the repository
git clone https://github.com/lennardscript/pinflag-pokeapi

# Navigate to directory
cd pingflag-pokeapi

# Install dependencies with pnpm
pnpm install

# Run in development mode
pnpm dev

# Run unit tests
pnpm test

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### 🌐 Application Access
- **Development**: `http://localhost:5173`
- **Production**: Available after build

## 🎯 Challenge Requirements Compliance

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Landing Page with START button | ✅ | Landing component with navigation |
| Responsive PokeGrid 3 columns | ✅ | CSS Grid with breakpoints |
| Pokedex with complete information | ✅ | 7 required fields implemented |
| Filter by name | ✅ | Real-time search |
| Favorites system | ✅ | Persistent store + filters |
| Pagination (30/page) | ✅ | Optimized pagination |
| Loading states | ✅ | Loaders in all requests |
| Unit tests | ✅ | Key components coverage |
| Clean and organized code | ✅ | ESLint + TypeScript + Clean Code |

## 📋 Implemented Features

### 🏠 Landing Page
- ✅ Custom homepage with creative design
- ✅ "START" button directing to PokeGrid
- ✅ Animations and transitions for enhanced UX

### 📱 PokeGrid
- ✅ Responsive 3-column grid with Pokémon cards
- ✅ Displays Pokémon name and official sprite
- ✅ Loader during data fetching
- ✅ Real-time name search filter
- ✅ Favorites system (add/remove)
- ✅ Filter to show favorites only
- ✅ Pagination of 30 Pokémon per page
- ✅ Complete unit tests

### 📖 Pokedex
- ✅ **Pokémon Number**: Unique Pokédex ID
- ✅ **Name**: Official Pokémon name
- ✅ **Type(s)**: Elemental types with representative colors
- ✅ **Description**: Official Pokémon description
- ✅ **Image**: High-quality official artwork
- ✅ **Weight (WT)**: Weight in kilograms
- ✅ **Height (HT)**: Height in meters
- ✅ Back button to return to PokeGrid

### 🔄 Navigation Flow
**Landing → PokeGrid → Pokedex → PokeGrid**

## 🧪 TDD Methodology

This project implements **Test-Driven Development** following the cycle:

1. **Red**: Write a failing test
2. **Green**: Write minimal code to make it pass
3. **Refactor**: Improve code while keeping tests green

Each feature has its corresponding `test/` directory with unit and integration tests.

## 🏛️ Clean Architecture

The application follows Clean Architecture principles:

- **Presentation Layer**: Components and UI
- **Application Layer**: Hooks and application logic
- **Domain Layer**: Models and business rules
- **Infrastructure Layer**: Services and API calls

---

⚡ **Developed with passion for clean code and user experience** 🎮✨
