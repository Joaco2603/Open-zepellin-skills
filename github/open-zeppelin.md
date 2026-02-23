skill: secure-smart-contracts
rules:
  - Always use Ownable or AccessControl for admin functions
  - Prevent reentrancy in external calls
  - Validate inputs and use require statements

skill: clean-architecture
rules:
  - Separate business logic from controllers
  - Use services for external integrations
  - Avoid direct database calls in routes

skill: clean-architecture
rules:
  - Separate business logic from controllers
  - Use services for external integrations
  - Avoid direct database calls in routes

skill: gas-optimization
rules:
  - Prefer uint256 over smaller ints
  - Use calldata instead of memory when possible
  - Avoid storage writes inside loops

skill: testing-first
rules:
  - Generate unit tests for each public function
  - Include edge cases and failure scenarios

skill: avoid-common-vulns
rules:
  - No use tx.origin for auth
  - Avoid block.timestamp for randomness
  - Check return values of external calls