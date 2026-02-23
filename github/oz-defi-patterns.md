skill: erc4626-vault-standard
rules:
  - Inherit ERC4626 from OpenZeppelin for yield-bearing vaults; never implement deposit/withdraw from scratch
  - Override _decimalsOffset() to mitigate inflation attacks by returning at least 0 (consider 6 for high-value vaults)
  - Implement totalAssets() to reflect actual underlying asset balance including accrued yield, not just raw balance
  - Protect previewDeposit and previewMint from manipulation; they must match actual convertToShares output
  - Emit Deposit and Withdraw events with both assets and shares amounts for off-chain accounting accuracy

skill: staking-rewards-pattern
rules:
  - Use the Synthetix-style per-token reward accumulator: rewardPerTokenStored + (elapsed * rewardRate / totalSupply)
  - Update rewards for a user before any stake, unstake, or getReward action via an updateReward(account) modifier
  - Store rewardPerTokenPaid(account) and rewards(account) per user to allow partial claims
  - Prevent reward front-running by requiring a minimum staking duration before claiming
  - Emit RewardAdded, Staked, Withdrawn, RewardPaid events for complete off-chain event sourcing

skill: governor-governance
rules:
  - Inherit Governor + GovernorSettings + GovernorCountingSimple + GovernorVotes + GovernorTimelockControl
  - Set votingDelay to at least 1 day to prevent flash-loan governance attacks
  - Set votingPeriod to at least 3 days to allow broad participation
  - Set proposalThreshold to require meaningful token holdings before proposing
  - Connect Governor to a TimelockController so that passed proposals have a mandatory execution delay

skill: vesting-and-token-locking
rules:
  - Use VestingWallet for linear vesting of ETH or ERC20 with a cliff and duration
  - Deploy one VestingWallet per beneficiary; never share a single vesting contract between parties
  - Emit VestingScheduleCreated(beneficiary, start, duration, amount) from the factory on deployment
  - Allow revocation only via an explicit revocable flag set at creation time, not by owner override
  - On revoke, return unvested tokens to treasury and emit VestingRevoked(beneficiary, returnedAmount)

skill: oracle-price-feeds
rules:
  - Always validate Chainlink feed answers: require(answer > 0) and check updatedAt is within a staleness threshold
  - Store oracle address as an immutable or via a setter protected by ORACLE_SETTER_ROLE
  - Use latestRoundData() instead of latestAnswer() to access timestamp, round, and answeredInRound
  - Apply a circuit breaker: pause the protocol if the price deviation exceeds a configured threshold in a single update
  - Never use a single oracle as the sole price source for liquidations; use at least two independent feeds
