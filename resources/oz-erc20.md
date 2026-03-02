skill: erc20-token-standard
rules:
  - Inherit from OpenZeppelin ERC20 or ERC20Burnable depending on whether token supply needs to decrease
  - Always emit Transfer and Approval events as required by EIP-20; do not suppress them
  - Use _mint only in constructor or controlled minting functions, never in public functions without access control
  - Override decimals() to return 6 for stablecoins, leave default 18 for governance/utility tokens
  - Never transfer tokens directly from a contract address without explicit allowance logic

skill: erc20-permit-eip2612
rules:
  - Inherit ERC20Permit to enable gasless approvals via off-chain signatures
  - Always validate the deadline parameter in permit() calls before processing
  - Use nonces(owner) to prevent signature replay attacks
  - Prefer permit + transferFrom pattern over two-step approve + transferFrom in integrations
  - Never store the raw permit signature on-chain; validate and discard immediately

skill: erc20-snapshots-votes
rules:
  - Use ERC20Votes when the token needs governance voting power tracking
  - Call _delegate in constructor if self-delegation by default is required
  - Use getPastVotes(account, blockNumber) instead of balanceOf for historical vote queries
  - Combine with ERC20Snapshot only if point-in-time balance queries are needed separately from votes
  - Avoid minting or burning tokens inside the same block used as a governance snapshot

skill: erc20-supply-control
rules:
  - Use ERC20Capped to enforce a hard maximum supply at contract level, not in application logic
  - Implement a minter role using AccessControl instead of relying on Ownable for multi-party minting
  - Track total minted and total burned with explicit counters if external dashboards need them
  - Emit a custom MintingPaused event when minting is halted, beyond the standard Transfer(0x0, to, amount)
  - Validate that cap > 0 in constructor and that initial supply does not exceed cap

skill: erc20-fee-on-transfer
rules:
  - Override _transfer to deduct fees before crediting recipient; never modify balanceOf directly
  - Store fee basis points (e.g., 100 = 1%) rather than fixed amounts to allow future adjustments
  - Always calculate fee as (amount * feeBps) / 10000 using uint256 to avoid overflow
  - Whitelist fee-exempt addresses (routers, treasury) in a mapping, not hardcoded
  - Emit a FeeCollected(from, to, feeAmount) event on every fee deduction for off-chain indexing
