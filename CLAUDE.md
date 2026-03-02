# OpenZeppelin Smart Contract Skills — Project Memory

This repository contains a curated set of OpenZeppelin best-practice rules for Solidity smart contract development. When working in this project or any Solidity project using OpenZeppelin, apply the rules defined here.

## What This Repo Contains

| File | Topic |
|------|-------|
| `resources/open-zeppelin.md` | OZ library overview, v5 breaking changes, import patterns |
| `resources/oz-access-control.md` | Ownable2Step, AccessControl, roles, timelocks |
| `resources/oz-security-patterns.md` | Reentrancy, Pausable, signatures, CEI, common vulns |
| `resources/oz-erc20.md` | ERC-20, Permit, Votes, Capped, fee-on-transfer |
| `resources/oz-erc721-erc1155.md` | ERC-721 (_safeMint, URIStorage), ERC-1155, ERC-2981 royalties |
| `resources/oz-gas-optimization.md` | Storage packing, calldata, loops, custom errors |
| `resources/oz-storage-events-errors.md` | Storage layout, indexed events, custom errors, NatSpec |
| `resources/oz-upgradeable-proxies.md` | UUPS, Transparent, Beacon, initializers, storage gaps |
| `resources/oz-defi-patterns.md` | ERC-4626 vaults, staking, Governor, oracles |
| `resources/oz-testing-foundry-hardhat.md` | Foundry unit/fuzz/fork tests, Hardhat patterns, invariants |
| `resources/oz-deployment-scripts.md` | Hardhat/Foundry scripts, multisig handoff, deployment checklist |

## Core Rules (Always Apply)

### Imports & Library
- OZ v5.x. Named imports only: `import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol"`
- Pin exact version in `package.json` / `foundry.toml`. Never `"latest"`.
- Import interfaces (`IERC20`, `IERC721`) when only type info is needed.

### Access Control
- `Ownable2Step` not `Ownable`. `AccessControl` for multi-role.
- `DEFAULT_ADMIN_ROLE` → multisig only. `TimelockController` for governance.
- Role constants: `bytes32 public constant ROLE = keccak256("ROLE")`

### Security
- `ReentrancyGuard` + `nonReentrant` on all ETH-sending / external-calling functions.
- CEI order: validate → update state → external call.
- No `tx.origin` auth. No `block.timestamp` randomness. Validate `!= address(0)`.
- Signatures: `ECDSA.recover` + `MessageHashUtils.toEthSignedMessageHash` + nonce replay protection.
- Custom errors over `require` strings (50–70% gas savings on reverts).

### Tokens
- ERC-721: `_safeMint`, monotonic `_nextTokenId`, `ERC721URIStorage`, `ERC2981`.
- ERC-20: `ERC20Permit` for gasless, `ERC20Votes` for governance, `_mint` only with access control.
- ERC-1155: `ERC1155Supply`, `_mintBatch` for airdrops.

### Gas
- Pack slots (`uint128 + uint128`). Cache storage reads in locals. `calldata` over `memory`.
- `external` over `public` when not called internally. `++i` not `i++`. Cache `arr.length`.

### Upgrades
- `UUPSUpgradeable` + `_authorizeUpgrade`. No state in constructors.
- `initializer` modifier + all `__Parent_init()`. `_disableInitializers()` in constructor.
- Never reorder storage. Append only. `uint256[50] private __gap` in every upgradeable base.

### Testing
- Foundry: `test_<Function>_<scenario>`, `vm.prank`, `vm.expectRevert(Error.selector)`.
- Invariant tests (`invariant_` prefix). Min 90% coverage (`forge coverage`).

### Deployment
- Fork-simulate before broadcast. Secrets via env vars only.
- `deployments/<network>.json` for all addresses + args. Transfer to Gnosis Safe as last step.
- Verify on Etherscan. Run `slither` + `mythril` before mainnet.

## AI Tool Integration Files

| Tool | File |
|------|------|
| GitHub Copilot (VS Code) | `.github/copilot-instructions.md` |
| Cursor (legacy) | `.cursorrules` |
| Cursor (modern) | `.cursor/rules/*.mdc` |
| Claude Code / Claude.ai | `CLAUDE.md` (this file) |
| Cline / Roo Code / Windsurf | `.clinerules` |
