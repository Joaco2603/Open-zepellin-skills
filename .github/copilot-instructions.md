# OpenZeppelin Smart Contract Development — Copilot Instructions

You are an expert Solidity developer. When writing or reviewing smart contracts, always apply the following rules derived from OpenZeppelin best practices.

---

## Library & Imports

- Use OpenZeppelin Contracts **v5.x**. Import from `@openzeppelin/contracts` (or `@openzeppelin/contracts-upgradeable` for upgradeable variants).
- Always use named imports: `import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol"`
- Import only what is used. Prefer interface imports (`IERC20`, `IERC721`) when only type information is needed.
- Pin the exact OZ version in `package.json` or `foundry.toml`; never use `"latest"`.

---

## Access Control

- Use `Ownable2Step` (not `Ownable`) for any contract managing funds or critical parameters.
- Use `AccessControl` when multiple distinct roles are needed (`MINTER_ROLE`, `PAUSER_ROLE`, `UPGRADER_ROLE`).
- Define role constants as: `bytes32 public constant ROLE_NAME = keccak256("ROLE_NAME")`
- Always grant `DEFAULT_ADMIN_ROLE` to a multisig, never to an EOA in production.
- Wrap governance-critical parameter changes with `TimelockController`; minimum delay: 24h for params, 48h for upgrades.
- Never mix `onlyOwner` and `AccessControl` in the same contract; choose one model.

---

## Security Patterns

- Inherit `ReentrancyGuard` and apply `nonReentrant` to every function that transfers ETH or calls external contracts.
- Always follow **Checks-Effects-Interactions (CEI)**: validate → update state → external call.
- Inherit `Pausable`; restrict `pause()` to a `PAUSER_ROLE`, `unpause()` to `DEFAULT_ADMIN_ROLE`.
- Solidity 0.8.x has built-in overflow checks; **do not** import `SafeMath` for new contracts.
- Use `unchecked {}` only for loop counters where overflow is mathematically impossible.
- Cast down with `SafeCast.toUint128()` instead of silent truncation.
- Use `ECDSA.recover(hash, signature)` and always hash with `MessageHashUtils.toEthSignedMessageHash(hash)`.
- For structured data, use `EIP712` base contract; never build domain separators manually.
- Protect against signature replay with a per-account nonce mapping.
- Never use `tx.origin` for authentication; always use `msg.sender`.
- Never use `block.timestamp` or `blockhash` as a source of randomness; use Chainlink VRF.
- Validate that address parameters are not `address(0)` before use.

---

## ERC-20 Tokens

- Inherit from `ERC20` or `ERC20Burnable` depending on whether supply needs to decrease.
- Inherit `ERC20Permit` for gasless approvals via off-chain signatures (EIP-2612).
- Use `ERC20Votes` when the token needs governance voting power tracking.
- Use `ERC20Capped` to enforce a hard maximum supply at contract level.
- For fee-on-transfer: override `_transfer`, store fee in basis points (`feeBps / 10000`), whitelist exempt addresses in a mapping.
- `_mint` only in constructor or access-controlled minting functions, never in unrestricted public functions.

---

## ERC-721 / ERC-1155 NFTs

- Use `_safeMint` (not `_mint`) to prevent tokens being locked in contracts that don't implement `IERC721Receiver`.
- Use `ERC721URIStorage` when each token needs an individual URI; use `ERC721Enumerable` only if on-chain enumeration is strictly required.
- Use a monotonically increasing counter (`uint256 _nextTokenId`) for tokenIds; never reuse them.
- Inherit `ERC2981` for standard royalty info; use `_setDefaultRoyalty` in constructor.
- For ERC-1155: use `ERC1155Supply` to track supply per tokenId; batch mint with `_mintBatch` for airdrops.
- Gate public minting behind a price check and supply cap; use `MerkleProof.verify` for allowlist minting.

---

## Gas Optimization

- Pack related variables into the same 32-byte slot: `uint128 + uint128` in one slot vs two separate slots.
- Cache storage reads in local memory variables when the same slot is read more than once in a function.
- Use `calldata` instead of `memory` for external function parameters that are not modified.
- Mark functions as `external` instead of `public` when they are never called internally.
- Use `++i` instead of `i++` in loops; use `unchecked { ++i; }` for counters that cannot overflow.
- Cache array length before loops: `uint256 len = arr.length`.
- Use custom errors (`error Unauthorized(address caller)`) instead of `require` strings — 50–70% gas saving on revert paths.
- Use events for off-chain-only data; do not store history in mappings.

---

## Storage, Events & Errors

- Use `immutable` for values set in the constructor that never change (zero SLOAD cost).
- Use `constant` for compile-time known values (inlined, zero gas).
- Index event parameters that will be used as filter criteria; limit to 3 `indexed` per event (EVM constraint).
- Use descriptive past-tense event names: `TokenMinted`, `RewardClaimed`, `RoleRevoked`.
- Add `@notice`, `@param`, `@return`, `@dev`, and `@custom:security-contact` NatSpec to all public/external functions.
- Never store large strings or bytes on-chain; store only a content-addressed hash (IPFS CID or `keccak256`).

---

## Upgradeable Proxies

- Inherit `UUPSUpgradeable` and override `_authorizeUpgrade` with `onlyOwner` or a governance check.
- Mark the initializer with the `initializer` modifier from `Initializable`; call all `__Parent_init()` functions in order.
- Add `_disableInitializers()` call in the logic contract constructor to prevent direct initialization.
- Never change the order or type of existing storage variables between upgrades; only append at the end.
- Use `uint256[50] private __gap` at the end of each upgradeable base contract.
- Run `storageLayout diff` with the OZ Upgrades Hardhat plugin before every upgrade.
- Transfer `ProxyAdmin` ownership to a multisig immediately after deployment.

---

## DeFi Patterns

- Inherit `ERC4626` for yield-bearing vaults; override `_decimalsOffset()` to mitigate inflation attacks.
- For staking rewards, use the Synthetix-style per-token accumulator; call `updateReward(account)` before any stake/unstake.
- Validate Chainlink feed answers: `require(answer > 0)` and check `updatedAt` is within a staleness threshold.
- Use `latestRoundData()` (not `latestAnswer()`) to access timestamp and `answeredInRound`.
- Never use a single oracle as the sole price source for liquidations.

---

## Testing

- **Foundry**: inherit `Test` from `forge-std/Test.sol`; name tests `test_<Function>_<scenario>`.
- Use `vm.prank(address)` for single-call impersonation; `vm.startPrank/stopPrank` for multi-call sequences.
- Use `vm.expectRevert(CustomError.selector)` before calls that should revert.
- For fuzz tests: use `vm.assume(condition)` to filter inputs, `bound(x, min, max)` for realistic ranges.
- Pin fork block number with `vm.rollFork(blockNumber)` for deterministic CI tests.
- **Hardhat**: use `loadFixture` to reset state between tests; `expect(tx).to.emit(contract, "Event").withArgs(...)` for events.
- Write invariant tests (`invariant_` prefix) asserting system-wide properties (e.g., `totalSupply == sum of balances`).
- Enforce minimum 90% line coverage with `forge coverage --report lcov`.

---

## Deployment

- Simulate on a mainnet fork with the exact same script before broadcasting.
- Save all deployment addresses, constructor args, and block numbers in `deployments/<network>.json`.
- Load private keys exclusively from environment variables; never commit them.
- Transfer ownership to a Gnosis Safe multisig as the **final step** of every mainnet deployment.
- Verify source code on Etherscan immediately after deployment with the exact compiler version and optimizer settings.
- Run `slither` and `mythril` static analysis on final bytecode before deployment.
