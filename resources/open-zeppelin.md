```markdown
skill: oz-library-overview
rules:
  - Use OpenZeppelin Contracts v5.x for all new projects; import from @openzeppelin/contracts
  - For upgradeable contracts, import from @openzeppelin/contracts-upgradeable and use the Upgradeable-suffixed variants
  - Always use named imports: import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol"
  - Pin the exact OZ version in package.json or foundry.toml; never use "latest" or wildcard ranges
  - Review the OZ Contracts changelog before upgrading versions; storage layout and hook changes can break upgrades

skill: oz-core-contracts-selection
rules:
  - Access control: use Ownable2Step for single-owner contracts, AccessControl for multi-role architectures
  - Token standards: use ERC20, ERC721URIStorage, or ERC1155Supply as the appropriate base contract
  - Security: always include ReentrancyGuard and Pausable in any contract that handles funds
  - Upgrade patterns: choose UUPSUpgradeable for gas-efficient upgrades, TransparentUpgradeableProxy for strict admin separation
  - Governance: compose Governor + GovernorTimelockControl + GovernorVotes for on-chain governance

skill: oz-v5-breaking-changes
rules:
  - OZ v5 removed SafeMath; rely on Solidity 0.8.x built-in overflow protection instead
  - AccessControl v5 uses _checkRole() which reverts with AccessControlUnauthorizedAccount(account, role), not a string message
  - Ownable v5 requires passing initialOwner to the constructor; passing address(0) reverts at deployment
  - ERC721 v5 replaced _beforeTokenTransfer and _afterTokenTransfer with a single _update(to, tokenId, auth) hook
  - ERC20 v5 replaced _beforeTokenTransfer with _update(from, to, value); update custom hooks accordingly

skill: oz-import-patterns
rules:
  - Import only what is used; each unused import increases compilation time and final bytecode size
  - Prefer interface imports (IERC20, IERC721) when only type information or external calls are needed
  - Use remappings in foundry.toml or compilerOptions.paths in hardhat.config.ts to normalize OZ paths across tools
  - When inheriting multiple OZ contracts, declare them left-to-right from most-base to most-derived in the is clause
  - Avoid importing the full library re-export barrel files; use the direct contract path for faster CI compilation
```
