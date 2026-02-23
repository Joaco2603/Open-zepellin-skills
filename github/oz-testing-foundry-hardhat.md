skill: foundry-unit-testing
rules:
  - Inherit Test from forge-std/Test.sol; never write raw assembly test harnesses
  - Name test functions test_<FunctionName>_<scenario> for clear failure messages (e.g., test_Mint_RevertsWhenPaused)
  - Use vm.prank(address) to impersonate a caller for exactly one call; use vm.startPrank/stopPrank for multi-call sequences
  - Use vm.expectRevert(CustomError.selector) before the call that should revert; never catch reverts manually
  - Assert with assertEq, assertGt, assertApproxEqRel instead of assertTrue(a == b) for readable failure output

skill: foundry-fuzz-testing
rules:
  - Mark fuzz tests with function testFuzz_<Name>(uint256 amount) and let Foundry generate inputs
  - Use vm.assume(condition) to filter invalid inputs instead of if-return patterns
  - Bound inputs with bound(amount, min, max) helper to keep values in realistic ranges
  - Run at least 10000 fuzz runs (FOUNDRY_FUZZ_RUNS=10000) for security-critical arithmetic functions
  - Log fuzz counter-examples by running forge test --ffi -vvvv and check the counterexample section

skill: foundry-fork-testing
rules:
  - Use vm.createFork(rpcUrl) or vm.createSelectFork(rpcUrl, blockNumber) for mainnet fork tests
  - Pin the fork block number with vm.rollFork(blockNumber) to ensure test determinism across CI runs
  - Use deal(token, address, amount) to seed ERC20 balances without needing actual whale addresses
  - Test upgrade scenarios by deploying the new implementation on the fork and calling upgradeToAndCall
  - Separate fork tests into a dedicated test/fork/ directory and gate them with a FORK_TEST=true env flag in CI

skill: hardhat-testing-patterns
rules:
  - Use loadFixture from @nomicfoundation/hardhat-toolbox to reset state between tests efficiently
  - Deploy contracts in fixtures using deployContract or ContractFactory, not manual new calls
  - Use anyValue from @nomicfoundation/hardhat-chai-matchers for event args you don't need to assert precisely
  - Check emitted events with await expect(tx).to.emit(contract, "EventName").withArgs(...)
  - Use hardhat_mine to advance multiple blocks in one call for testing time-dependent logic

skill: invariant-and-integration-testing
rules:
  - Write invariant tests (stateful fuzz) with Foundry's invariant_ prefix to assert system-wide properties
  - Define invariants such as: totalSupply == sum of all balances, totalAssets >= totalShares * pricePerShare
  - Use targetContract(address) and targetSelector to scope which functions the fuzzer can call
  - Combine unit tests (isolated), integration tests (multi-contract), and fork tests (live state) in separate suites
  - Measure coverage with forge coverage --report lcov and enforce minimum 90% line coverage in CI
