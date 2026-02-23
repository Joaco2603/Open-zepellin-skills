skill: ownable-pattern
rules:
  - Use Ownable2Step instead of Ownable for any contract managing funds or critical parameters
  - Never call renounceOwnership on contracts that would become permanently unmanageable
  - Protect all admin setters (setFee, setOracle, pause) with the onlyOwner modifier
  - Emit an OwnerActionExecuted custom event for audit trails beyond the standard OwnershipTransferred
  - In upgradeable contracts, use OwnableUpgradeable and call __Ownable_init(initialOwner) in initializer

skill: access-control-roles
rules:
  - Use AccessControl when multiple distinct roles are needed (MINTER_ROLE, PAUSER_ROLE, UPGRADER_ROLE)
  - Define role constants as: bytes32 public constant ROLE_NAME = keccak256("ROLE_NAME")
  - Always grant DEFAULT_ADMIN_ROLE to a multisig, never to an EOA in production
  - Use hasRole(role, account) in modifiers rather than duplicating role logic inline
  - Revoke roles explicitly when decommissioning an address; do not rely on contract destruction

skill: access-control-enumerable
rules:
  - Use AccessControlEnumerable when you need to list all members of a role on-chain
  - Call getRoleMemberCount(role) + getRoleMember(role, index) for enumeration; be aware of gas costs
  - Avoid enumeration inside contract logic; reserve it for off-chain queries or admin views
  - Combine with a role registry mapping(bytes32 => string) for human-readable role name lookups
  - Emit a RoleGranted event (built-in) and a custom RoleMemberAdded event for richer indexing

skill: access-control-timelocks
rules:
  - Wrap AccessControl with TimelockController for governance-critical parameter changes
  - Set minimum delay based on protocol risk: at least 24h for parameter changes, 48h for upgrades
  - Grant PROPOSER_ROLE only to governance contract or multisig, never to automated bots alone
  - Grant EXECUTOR_ROLE to address(0) to allow public execution after delay expiry
  - Always schedule, not execute directly, to preserve timelock guarantees

skill: role-based-function-guards
rules:
  - Create custom modifiers per role instead of repeating hasRole checks inline
  - Use _checkRole(role) helper which reverts with AccessControlUnauthorizedAccount error (OZ v5+)
  - Never mix onlyOwner and AccessControl in the same contract; choose one model and be consistent
  - For two-role operations (e.g., both ADMIN and OPERATOR can call), use: require(hasRole(A) || hasRole(B))
  - Document each role's purpose and trust level in NatSpec @dev comments
