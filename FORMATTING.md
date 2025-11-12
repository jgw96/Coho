# Code Formatting with Prettier

This project uses Prettier for consistent code formatting across all TypeScript, JavaScript, CSS, and HTML files.

## Quick Start

### Format all files
```bash
npm run format
```

### Check formatting without making changes
```bash
npm run format:check
```

## Editor Integration

### VS Code
1. Install the recommended Prettier extension (`esbenp.prettier-vscode`)
2. The workspace is configured to format on save automatically
3. Settings are in `.vscode/settings.json`

### Other Editors
Prettier has plugins for most editors. See [Prettier Editor Integration](https://prettier.io/docs/en/editors.html).

## Configuration

Prettier configuration is in `.prettierrc.json`:
- **Tab Width**: 2 spaces
- **Quotes**: Single quotes for JS/TS, double quotes for CSS
- **Semicolons**: Always
- **Trailing Commas**: ES5 style
- **Line Endings**: LF (Unix style)
- **Print Width**: 80 characters

## Ignored Files

See `.prettierignore` for files excluded from formatting:
- `node_modules/`
- Build outputs (`dist/`, `lib/`)
- Generated files
- Some JSON files (except `package.json` and `tsconfig.json`)

## Pre-commit Hook (Optional)

To automatically format files before committing, you can add a Git pre-commit hook using tools like:
- [husky](https://github.com/typicode/husky) + [lint-staged](https://github.com/okonet/lint-staged)
- [pre-commit](https://pre-commit.com/)

Example with husky and lint-staged:
```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .git/hooks/pre-commit "npx lint-staged"
```

Add to `package.json`:
```json
{
  "lint-staged": {
    "*.{ts,js,css,html}": "prettier --write"
  }
}
```

## CI/CD Integration

The `format:check` command can be added to CI pipelines to ensure all committed code is properly formatted:
```bash
npm run format:check
```

This command will fail with exit code 1 if any files are not formatted correctly.
