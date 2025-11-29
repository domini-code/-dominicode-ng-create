# @dominicode/ng-create

A CLI tool to generate customized Angular 21 projects with all modern tools and best practices.

## 🚀 Installation

### Global Installation

```bash
npm install -g @dominicode/ng-create
```

### Using with npx (Recommended)

```bash
npx @dominicode/ng-create
```

## 📋 Prerequisites

- **Node.js**: >= 20.0.0
- **npm**: >= 9.0.0 (or yarn/pnpm)

## 🎯 Features

- ✅ Angular 21 project generation (SPA or SSR)
- ✅ Tailwind CSS configuration
- ✅ Test runners: Vitest or Jest
- ✅ Angular Testing Library integration
- ✅ ESLint configuration
- ✅ Husky + lint-staged for Git hooks
- ✅ AI editor configuration (Cursor/VSCode)

## 📝 Usage

Run the CLI and answer the interactive questions:

```bash
create-dominicode-ng
```

The CLI will ask you:
- Project name
- Project type (SPA/SSR)
- Style preprocessor (CSS/SCSS)
- Whether to include Tailwind CSS
- Test runner (Vitest/Jest/None)
- Whether to include Angular Testing Library
- Whether to include ESLint
- Whether to include Husky
- Whether to include AI editor configuration

### Example

```bash
$ create-dominicode-ng
? Project name: my-awesome-app
? Project type: SPA
? Style preprocessor: SCSS
? Include Tailwind CSS? Yes
? Test runner: Vitest
? Include Angular Testing Library? Yes
? Include ESLint? Yes
? Include Husky? Yes
? Include AI editor configuration? Yes

Creating Angular project...
✓ Project created successfully!
```

## 🏗️ Project Structure

```
ng-create-cli/
├── bin/
│   └── index.js          # CLI entry point
├── src/
│   ├── cli.ts            # Main logic and prompts
│   ├── types.ts          # TypeScript types
│   ├── steps/            # Configuration steps
│   │   ├── create-angular-app.ts
│   │   ├── add-tailwind.ts
│   │   ├── add-vitest.ts
│   │   ├── add-jest.ts
│   │   ├── add-testing-library.ts
│   │   ├── add-eslint.ts
│   │   ├── add-husky.ts
│   │   └── add-ai-editor-config.ts
│   └── utils/            # Utilities
│       ├── run-command.ts
│       ├── modify-json.ts
│       └── package-manager.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## 🔧 Development

### Local Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development mode
npm start

# Or create a local link
npm link
create-dominicode-ng
```

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Compile in watch mode
- `npm run test` - Run tests with Vitest
- `npm start` - Execute the compiled CLI
- `npm run prepublishOnly` - Build before publishing

## 🧪 Testing

Run tests with:

```bash
npm test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Follow conventional commits format
- Ensure all tests pass before submitting

## 🐛 Troubleshooting

### Common Issues

**Issue**: Command not found after installation
- **Solution**: Make sure npm global bin directory is in your PATH

**Issue**: Permission errors on macOS/Linux
- **Solution**: Use `sudo npm install -g @dominicode/ng-create` or configure npm to use a different directory

**Issue**: Angular CLI version conflicts
- **Solution**: Ensure you have the latest Angular CLI installed globally or use npx

## 📚 Related Resources

- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [Angular Testing Library](https://testing-library.com/angular)

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Dominicode**

- GitHub: [@dominicode](https://github.com/dominicode)

## 🙏 Acknowledgments

- Angular team for the amazing framework
- All contributors and users of this tool

