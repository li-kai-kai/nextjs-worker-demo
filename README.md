# Next.js Worker Pool + Polars Demo

A modern Next.js application demonstrating advanced worker pool management and data analysis using nodejs-polars.

## Features

- 🚀 **Worker Pool Management**: Efficient background processing with workerpool
- 📊 **Data Analysis**: High-performance parquet file processing with nodejs-polars
- ⚡ **Complex Calculations**: Mathematical computations and matrix operations
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS
- 🏗️ **Clean Architecture**: Well-organized src/ directory structure
- 🔧 **TypeScript**: Full type safety with shared interfaces

## Architecture

```
src/
├── app/                    # Next.js frontend application  
│   ├── api/               # API routes
│   ├── components/        # React components
│   └── ...
├── server/                # Backend services
│   ├── lib/               # Core services
│   ├── utils/             # Utilities
│   └── workers/           # Worker implementations
├── shared/                # Shared code
│   └── types/             # TypeScript definitions
└── data/                  # Sample data files
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd next-demo
```

2. Install dependencies:
```bash
pnpm install
```

3. Generate sample data (optional):
```bash
node src/server/utils/generate-sample-data.js
```

4. Start the development server:
```bash
pnpm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Demo

### 1. Basic API Testing
- Simple GET/POST requests to test API connectivity

### 2. Complex Worker Calculations
- **Complex Math**: Prime number detection + Fibonacci calculations
- **Matrix Operations**: Large matrix multiplication with performance metrics

### 3. Polars Data Analysis
- **Sales Data Analysis**: 10k records with revenue, product, and regional analytics
- **User Data Analysis**: 5k user records with demographic and subscription insights
- **Advanced Analytics**: Deep statistical analysis with visualization

## Sample Data

The application includes two sample datasets:

- **Sales Data** (10k records): Product sales with revenue calculations
- **User Data** (5k records): User demographics and subscription information

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Worker Management**: workerpool
- **Data Processing**: nodejs-polars
- **Development**: pnpm

## API Endpoints

### GET `/api/calculate`
Query parameters:
- `type`: 'complex' | 'matrix' | 'sales' | 'users'
- `analysis`: 'basic' | 'advanced'
- `iterations`: number (for complex calculations)
- `size`: number (for matrix calculations)

### POST `/api/calculate`
Request body supports the same parameters as query params.

## Performance

- **Worker Pool**: Up to 4 concurrent worker processes
- **Memory Efficient**: Optimized data processing with Polars
- **Type Safe**: Full TypeScript coverage
- **Scalable**: Clean architecture for easy expansion

## Development

### Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint

### Project Structure

The project follows a clean architecture pattern with clear separation between:

- **Frontend**: React components and pages
- **Backend**: API routes and business logic
- **Workers**: Background processing tasks
- **Shared**: Common types and utilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).