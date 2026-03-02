skill: reentrancy-guard
rules:
  - Inherit ReentrancyGuard and apply nonReentrant to every function that transfers ETH or calls external contracts
  - Follow the Checks-Effects-Interactions (CEI) pattern: validate, update state, then make external calls
  - Never call an external contract before updating internal accounting (e.g., balances, shares)
  - In upgradeable contracts use ReentrancyGuardUpgradeable and call __ReentrancyGuard_init() in initializer
  - Apply nonReentrant to internal functions that can be called from multiple public entry points

skill: pausable-emergency-stop
rules:
  - Inherit Pausable and apply whenNotPaused to all state-changing user-facing functions
  - Restrict pause() to a PAUSER_ROLE, not to the contract owner exclusively in high-value protocols
  - Allow unpause() only from a higher-trust role (e.g., DEFAULT_ADMIN_ROLE) to prevent abuse
  - Emit a custom EmergencyTriggered(reason, caller) event alongside the built-in Paused event
  - Never leave the contract permanently paused without a governance path to unpause or upgrade

skill: integer-overflow-and-safemath
rules:
  - Solidity 0.8.x has built-in overflow checks; do not import SafeMath for new contracts
  - Use unchecked { } blocks only for gas optimization in loop counters where overflow is mathematically impossible
  - Never use unchecked for arithmetic involving user-supplied values or external balances
  - Use Math.mulDiv(a, b, denominator) from OZ for precision-safe fixed-point multiplication
  - Cast down (uint256 to uint128) with explicit SafeCast.toUint128() to get a revert instead of silent truncation

skill: signature-verification
rules:
  - Use ECDSA.recover(hash, signature) and never compare raw signatures; always recover and compare addresses
  - Always hash messages with MessageHashUtils.toEthSignedMessageHash(hash) for personal_sign compatibility
  - For structured data, use EIP-712 via EIP712 base contract; never build domain separators manually
  - Protect against signature replay with a per-account nonce mapping incremented after each use
  - Validate that recovered address != address(0) before using it; ECDSA.recover returns 0 on failure

skill: merkle-proof-allowlists
rules:
  - Use MerkleProof.verify(proof, root, leaf) to validate membership without storing the full list on-chain
  - Compute leaf as keccak256(abi.encodePacked(account, amount)) using double-hashing to prevent preimage attacks
  - Store only the merkle root on-chain; update it via an owner-only setMerkleRoot function
  - Emit a MerkleRootUpdated(oldRoot, newRoot, updatedBy) event on every root change for auditability
  - Track claimed leaves with a mapping(bytes32 => bool) keyed on the leaf hash to prevent double-claiming

skill: access-tx-origin-and-blockhash
rules:
  - Never use tx.origin for authentication; always use msg.sender
  - Never use block.timestamp or blockhash as a source of randomness; use Chainlink VRF instead
  - Avoid block.number for time-sensitive logic; use block.timestamp with reasonable tolerances
  - Never assume msg.sender is an EOA; use Address.isContract() only for informational purposes, not security
  - Validate that address parameters are not address(0) before use with require(addr != address(0))
