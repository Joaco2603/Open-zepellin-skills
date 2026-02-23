skill: gas-storage-optimization
rules:
  - Pack multiple small variables into one storage slot: uint128 + uint128 costs 1 SLOAD vs 2 SLOAD for separate slots
  - Cache storage reads in local memory variables when the same slot is read more than once in a function
  - Avoid storage writes in loops; accumulate in a memory variable and write once after the loop
  - Use bytes32 instead of string for fixed-length identifiers like role names or asset symbols
  - Delete storage variables that are no longer needed (delete mapping[key]) to receive a gas refund

skill: gas-calldata-optimization
rules:
  - Use calldata instead of memory for external function parameters that are not modified inside the function
  - Pass arrays and structs as calldata in external functions to avoid copying to memory
  - Prefer multiple specific parameters over a single large struct when only a few fields are actually used
  - Avoid abi.encode when abi.encodePacked is sufficient for non-hashing purposes (saves encoding overhead)
  - Use bytes instead of bytes[] where possible; nested dynamic arrays have high encoding cost

skill: gas-loop-optimization
rules:
  - Cache array length outside the loop: uint256 len = arr.length; to avoid repeated SLOAD per iteration
  - Use ++i instead of i++ in loops; the pre-increment avoids an unnecessary temporary variable
  - Prefer mapping lookups over array iteration for O(1) access when checking membership
  - Break early from loops when the result is found to avoid unnecessary iterations
  - Use unchecked { ++i; } for loop counters when the count cannot realistically overflow uint256

skill: gas-function-visibility
rules:
  - Mark functions as external instead of public when they are never called internally (saves ~5–10 gas per call)
  - Mark all functions that do not modify state as view or pure to allow free off-chain calls
  - Declare frequently called internal helpers as private if no derived contract needs them
  - Use payable on functions expected to receive ETH; non-payable functions revert on ETH receipt automatically
  - Avoid unnecessary function overloads; each variant adds bytecode and increases contract size

skill: gas-event-vs-storage
rules:
  - Use events for data that is only needed off-chain (history, analytics); do not store it in mappings
  - Prefer indexed event parameters for filterable data (addresses, IDs) over emitting raw structs
  - Avoid emitting very large blobs of data in events; emit identifiers and let indexers query the full data
  - Replace storage-based counters used only for off-chain metrics with emitted events + subgraph aggregation
  - Do not emit events inside view functions; they have no effect and are misleading
