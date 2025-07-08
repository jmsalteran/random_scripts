# TypeScript Scripts Project

This project contains a collection of TypeScript scripts organized into separate folders. Each script is designed to perform a specific task and can be executed independently. The project also includes shared types and utility functions to promote code reuse and maintainability.

## Project Structure

```
typescript-scripts
├── scripts
│   ├── script1
│   │   └── index.ts
│   ├── script2
│   │   └── index.ts
│   └── script3
│       └── index.ts
├── shared
│   ├── types
│   │   └── index.ts
│   └── utils
│       └── helpers.ts
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd typescript-scripts
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run a script**:
   Navigate to the desired script folder and run the script using `ts-node` or compile it first and then run the output JavaScript file.

   Example for script1:
   ```bash
   cd scripts/script1
   ts-node index.ts
   ```

## Scripts Overview

- **script1**: Contains functionality for the first task.
- **script2**: Contains functionality for the second task.
- **script3**: Contains functionality for the third task.

## Shared Resources

- **Types**: Shared interfaces and types can be found in `shared/types/index.ts`.
- **Utilities**: Common helper functions are located in `shared/utils/helpers.ts`.

## Testing

This project uses Jest for testing. To run the tests, use the following command:

```bash
npm test
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.