skill: storage-layout-best-practices
rules:
  - Pack related variables into the same 32-byte slot: place uint128, uint128 together rather than on separate lines
  - Declare mappings and dynamic arrays at their own slots; they cannot be packed with other variables
  - Use immutable for values set in the constructor that never change to eliminate SLOAD costs entirely
  - Use constant for compile-time known values; they are inlined and cost zero gas at runtime
  - Never store large strings or bytes on-chain; store only a content-addressed hash (IPFS CID or keccak256)

skill: events-for-indexing
rules:
  - Index (with the indexed keyword) parameters that will be used as filter criteria in off-chain queries
  - Limit indexed parameters to 3 per event as per EVM constraint; prioritize addresses and tokenIds
  - Emit an event for every state change that off-chain systems (subgraphs, explorers) need to track
  - Use descriptive past-tense event names: TokenMinted, RewardClaimed, RoleRevoked
  - Never use events as a gas-saving alternative to storage when the data is needed on-chain

skill: custom-errors-vs-require
rules:
  - Use custom errors (error Unauthorized(address caller)) instead of require with string messages in Solidity 0.8.4+
  - Define custom errors at the file level or inside the contract to keep them namespaced
  - Include the relevant context in error parameters: error InsufficientBalance(uint256 available, uint256 required)
  - Reserve require with string only for external libraries or interfaces that may be used with older compilers
  - Use revert CustomError() instead of revert("string") for 50–70% gas savings on revert paths

skill: natspec-documentation
rules:
  - Add @notice to every public and external function describing what it does for end-users
  - Add @param for every parameter and @return for every return value
  - Add @dev for implementation details relevant to developers but not end-users
  - Add @custom:security-contact with a security disclosure email to the contract-level NatSpec
  - Document storage variables with @dev comments explaining units, precision, and invariants

skill: contract-size-optimization
rules:
  - Split large contracts into a main contract and a library using library for syntax to stay under 24KB
  - Move view/pure helper logic into external libraries; they are deployed once and called via DELEGATECALL
  - Use internal functions to share logic instead of duplicating code across multiple public entry points
  - Enable the Solidity optimizer with at least 200 runs for deployment cost vs runtime cost balance
  - Remove unused imports and inherited contracts that add bytecode without being called
