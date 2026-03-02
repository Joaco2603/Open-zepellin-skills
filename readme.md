# OpenZeppelin Smart Contract Skills

A curated set of OpenZeppelin v5.x best-practice rules for Solidity smart contract development — formatted for use as AI coding assistant skills in VS Code (GitHub Copilot), Cursor, Claude, Cline, Roo Code, Windsurf, and similar tools.

---

## Quick Start

Add rules to your project in seconds with the CLI:

```bash
# Interactive picker — choose which tools to add
npx oz-skills add

# Add all integrations at once
npx oz-skills add --all

# Add only the tools you use
npx oz-skills add copilot
npx oz-skills add cursor
npx oz-skills add claude
npx oz-skills add cline
npx oz-skills add copilot cursor claude cline

# Add skills from any GitHub repo (before auditing / publishing to npm)
npx oz-skills add https://github.com/Joaco2603/Open-zepellin-skills.git
npx oz-skills add user/my-skills-repo          # shorthand
npx oz-skills add github:user/my-skills-repo   # explicit prefix
```

The remote command clones the repo (`git clone --depth 1`) and copies any recognised skill files it finds:
`.github/copilot-instructions.md`, `.cursorrules`, `.cursor/rules/`, `CLAUDE.md`, `.clinerules`, `resources/`.

**Available tool keys:**

| Key | Aliases | Creates |
|-----|---------|---------|
| `copilot` | `vscode`, `vs-code` | `.github/copilot-instructions.md` |
| `cursor-legacy` | `cursorrules` | `.cursorrules` |
| `cursor` | `cursor-modern` | `.cursor/rules/*.mdc` (8 files) |
| `claude` | `claude-code`, `anthropic` | `CLAUDE.md` |
| `cline` | `roo`, `roocode`, `windsurf` | `.clinerules` |

---

## AI Tool Integration

### GitHub Copilot — VS Code
File: [`.github/copilot-instructions.md`](.github/copilot-instructions.md)

GitHub Copilot automatically reads `.github/copilot-instructions.md` from the workspace root. No configuration needed — open any `.sol` file and Copilot will follow the OZ rules.

> **How to use this repo as a skill:** copy `.github/copilot-instructions.md` into the `.github/` folder of your own project.

---

### Cursor IDE (Legacy)
File: [`.cursorrules`](.cursorrules)

Cursor reads `.cursorrules` from the project root automatically.

> **How to use:** copy `.cursorrules` into the root of your project.

---

### Cursor IDE (Modern — recommended)
Directory: [`.cursor/rules/`](.cursor/rules/)

Cursor's new rule system uses `.mdc` files with YAML frontmatter. Rules can be scoped by glob pattern or set to `alwaysApply: true`.

| Rule File | Scope | Topic |
|-----------|-------|-------|
| [`oz-core.mdc`](.cursor/rules/oz-core.mdc) | `**/*.sol` | Library, imports, v5 changes |
| [`oz-security.mdc`](.cursor/rules/oz-security.mdc) | `**/*.sol` | Reentrancy, signatures, vulns |
| [`oz-access-control.mdc`](.cursor/rules/oz-access-control.mdc) | `**/*.sol` | Ownable2Step, roles, timelocks |
| [`oz-tokens.mdc`](.cursor/rules/oz-tokens.mdc) | `**/*.sol` | ERC-20, ERC-721, ERC-1155 |
| [`oz-gas.mdc`](.cursor/rules/oz-gas.mdc) | `**/*.sol` | Gas optimization |
| [`oz-upgrades.mdc`](.cursor/rules/oz-upgrades.mdc) | `**/*.sol`, scripts | UUPS, Transparent, Beacon |
| [`oz-testing.mdc`](.cursor/rules/oz-testing.mdc) | `**/*.t.sol`, test files | Foundry, Hardhat, invariants |
| [`oz-deployment.mdc`](.cursor/rules/oz-deployment.mdc) | scripts, `**/*.s.sol` | Deploy scripts, multisig handoff |

> **How to use:** copy the `.cursor/rules/` directory into the root of your project.

---

### Claude (Claude Code / Claude.ai Projects)
File: [`CLAUDE.md`](CLAUDE.md)

Claude Code reads `CLAUDE.md` from the project root as persistent project context. Claude.ai Projects can be configured to reference this file.

> **How to use:** copy `CLAUDE.md` into the root of your project.

---

### Cline / Roo Code / Windsurf
File: [`.clinerules`](.clinerules)

These tools read `.clinerules` from the project root automatically.

> **How to use:** copy `.clinerules` into the root of your project.

---

## Skill Files Reference

Each file in `github/` contains YAML-formatted skill definitions with fine-grained rules per topic. These are the authoritative source of truth for all integration files above.

| File | Skills Defined |
|------|---------------|
| [`resources/open-zeppelin.md`](resources/open-zeppelin.md) | `oz-library-overview`, `oz-core-contracts-selection`, `oz-v5-breaking-changes`, `oz-import-patterns` |
| [`resources/oz-access-control.md`](resources/oz-access-control.md) | `ownable-pattern`, `access-control-roles`, `access-control-enumerable`, `access-control-timelocks`, `role-based-function-guards` |
| [`resources/oz-security-patterns.md`](resources/oz-security-patterns.md) | `reentrancy-guard`, `pausable-emergency-stop`, `integer-overflow-and-safemath`, `signature-verification`, `merkle-proof-allowlists`, `access-tx-origin-and-blockhash` |
| [`resources/oz-erc20.md`](resources/oz-erc20.md) | `erc20-token-standard`, `erc20-permit-eip2612`, `erc20-snapshots-votes`, `erc20-supply-control`, `erc20-fee-on-transfer` |
| [`resources/oz-erc721-erc1155.md`](resources/oz-erc721-erc1155.md) | `erc721-nft-standard`, `erc721-metadata-uri`, `erc721-access-and-minting`, `erc1155-multi-token`, `erc721-royalties-eip2981` |
| [`resources/oz-gas-optimization.md`](resources/oz-gas-optimization.md) | `gas-storage-optimization`, `gas-calldata-optimization`, `gas-loop-optimization`, `gas-function-visibility`, `gas-event-vs-storage` |
| [`resources/oz-storage-events-errors.md`](resources/oz-storage-events-errors.md) | `storage-layout-best-practices`, `events-for-indexing`, `custom-errors-vs-require`, `natspec-documentation`, `contract-size-optimization` |
| [`resources/oz-upgradeable-proxies.md`](resources/oz-upgradeable-proxies.md) | `uups-proxy-pattern`, `transparent-proxy-pattern`, `initializer-pattern`, `storage-layout-upgrades`, `beacon-proxy-pattern` |
| [`resources/oz-defi-patterns.md`](resources/oz-defi-patterns.md) | `erc4626-vault-standard`, `staking-rewards-pattern`, `governor-governance`, `vesting-and-token-locking`, `oracle-price-feeds` |
| [`resources/oz-testing-foundry-hardhat.md`](resources/oz-testing-foundry-hardhat.md) | `foundry-unit-testing`, `foundry-fuzz-testing`, `foundry-fork-testing`, `hardhat-testing-patterns`, `invariant-and-integration-testing` |
| [`resources/oz-deployment-scripts.md`](resources/oz-deployment-scripts.md) | `deployment-scripts-hardhat`, `deployment-scripts-foundry`, `network-configuration`, `multisig-deployment-handoff`, `deployment-checklist` |

---

## Suggested Reading Order

1. [open-zeppelin.md](resources/open-zeppelin.md) — Overview and setup
2. [oz-access-control.md](resources/oz-access-control.md) — Who can call what
3. [oz-security-patterns.md](resources/oz-security-patterns.md) — Core defenses
4. [oz-erc20.md](resources/oz-erc20.md) / [oz-erc721-erc1155.md](resources/oz-erc721-erc1155.md) — Token standards
5. [oz-gas-optimization.md](resources/oz-gas-optimization.md) — Efficiency
6. [oz-storage-events-errors.md](resources/oz-storage-events-errors.md) — Data design
7. [oz-upgradeable-proxies.md](resources/oz-upgradeable-proxies.md) — Upgrade patterns
8. [oz-defi-patterns.md](resources/oz-defi-patterns.md) — DeFi primitives
9. [oz-testing-foundry-hardhat.md](resources/oz-testing-foundry-hardhat.md) — Testing
10. [oz-deployment-scripts.md](resources/oz-deployment-scripts.md) — Deployment

---

## Contributing

Open an issue or pull request with improvements, corrections, or new skill definitions. Follow the existing `skill: name` + `rules:` YAML format in the `resources/` files so they remain compatible with the integration files above.


