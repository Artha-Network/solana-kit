# Contributing to Artha Network Solana Kit

Thank you for your interest in contributing! This document provides guidelines for contributing to the solana-kit SDK.

## Development Setup

1. **Clone and Install**
   ```bash
   cd solana-kit
   npm install
   ```

2. **Build the Project**
   ```bash
   npm run build
   ```

3. **Run Type Checking**
   ```bash
   npm run type-check
   ```

4. **Run Linting**
   ```bash
   npm run lint
   ```

## Code Standards

### TypeScript Style
- Use TypeScript for all new code
- Maintain strict type checking
- Document public APIs with JSDoc comments
- Export types alongside implementations

### File Organization
```
src/
├── builders/      # Transaction builders (existing)
├── clients/       # Client implementations (existing)
├── types/         # TypeScript type definitions
├── constants/     # Constants and configuration
├── utils/         # Utility functions
│   ├── pda.ts           # PDA derivation
│   ├── formatting.ts    # Display formatting
│   ├── validation.ts    # Input validation
│   └── index.ts         # Exports
└── index.ts       # Main exports
```

### Commit Messages
Follow conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/tooling changes

Example:
```
feat: add PDA derivation utilities

- Add deriveEscrowStatePDA function
- Add deriveVaultAuthorityPDA function
- Include comprehensive JSDoc comments
```

## What Can You Contribute?

### ✅ Safe Contributions (No Breaking Changes)
1. **Utility Functions**
   - Additional formatting helpers
   - More validation functions
   - Calculation utilities

2. **Type Definitions**
   - More precise types
   - Additional interfaces
   - Better documentation

3. **Constants**
   - Network-specific values
   - Configuration presets
   - Common defaults

4. **Documentation**
   - API documentation
   - Usage examples
   - Guides and tutorials

5. **Tests**
   - Unit tests for utilities
   - Integration examples
   - Edge case coverage

### ⚠️ Requires Discussion
- Changes to existing builders
- Modifications to core client
- Breaking API changes
- New major features

## Pull Request Process

1. **Before Starting**
   - Open an issue to discuss significant changes
   - Ensure your contribution aligns with project goals
   - Check existing PRs to avoid duplication

2. **Development**
   - Create a feature branch: `git checkout -b feat/your-feature`
   - Write clean, documented code
   - Add tests if applicable
   - Run lint and type-check

3. **Submitting**
   - Push your branch to GitHub
   - Open a PR with clear description
   - Reference related issues
   - Ensure CI passes

4. **Review**
   - Address review comments
   - Keep commits clean and logical
   - Update documentation if needed

## Testing Guidelines

### Unit Tests
```typescript
describe("formatTokenAmount", () => {
  it("should format USDC amounts correctly", () => {
    expect(formatTokenAmount(1_000_000)).toBe("1");
    expect(formatTokenAmount(1_500_000)).toBe("1.5");
  });
});
```

### Integration Tests
- Test against devnet when possible
- Use realistic scenarios
- Document test setup requirements

## Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] All functions have JSDoc comments
- [ ] Types are properly exported
- [ ] No breaking changes to existing APIs
- [ ] Linting passes without warnings
- [ ] Type checking passes
- [ ] Documentation is updated
- [ ] Examples work correctly

## Questions?

- Open an issue for bugs or feature requests
- Tag maintainers for urgent matters
- Join community discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
