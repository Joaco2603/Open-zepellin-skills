skill: deployment-scripts-hardhat
rules:
  - Use Hardhat Ignition modules or custom scripts under scripts/deploy/ with one file per contract group
  - Always verify contracts on Etherscan immediately after deployment using hardhat verify or the ignition plugin
  - Save all deployment addresses, constructor args, and block numbers in a deployments/<network>.json file
  - Use getNamedAccounts() in Hardhat Deploy to avoid hardcoded addresses across different networks
  - Never deploy to mainnet without first simulating the deployment on a fork with the exact same script

skill: deployment-scripts-foundry
rules:
  - Write deployment scripts as contracts inheriting Script from forge-std/Script.sol
  - Wrap deployment logic between vm.startBroadcast(deployerKey) and vm.stopBroadcast()
  - Use run() as the entry point and return deployed addresses for composability with other scripts
  - Save output with vm.writeJson to a deployments/ directory keyed by chain ID
  - Simulate with forge script --fork-url <rpc> before executing with --broadcast --verify

skill: network-configuration
rules:
  - Define all network configs (RPC URLs, chain IDs, verifier URLs) in hardhat.config.ts or foundry.toml, not in scripts
  - Load private keys exclusively from environment variables; never commit them to version control
  - Use a .env.example file with placeholder values to document required environment variables
  - Configure gas price strategies per network: fixed for testnets, EIP-1559 with baseFeePerGas + priority for mainnet
  - Set a gasMultiplier of 1.2 to avoid underpriced transactions during network congestion

skill: multisig-deployment-handoff
rules:
  - Transfer contract ownership to a Gnosis Safe multisig as the final step of every mainnet deployment
  - Require at least 2-of-3 signers for parameter changes and 3-of-5 for upgrades and fund withdrawals
  - Verify the Safe address on-chain before transferring ownership; never trust a raw address from chat or email
  - Document the full multisig configuration (address, threshold, signers) in the deployment manifest
  - Test the full ownership transfer flow on a testnet with the same Safe configuration before mainnet

skill: deployment-checklist
rules:
  - Confirm all constructor arguments match the intended values via a post-deployment call to each getter
  - Verify source code on Etherscan/Sourcify with exact compiler version, optimizer settings, and license identifier
  - Run slither and mythril static analysis on the final bytecode before deployment
  - Record transaction hash, block number, and deployer address for every deployment step in the audit trail
  - Announce a deployment freeze period (no code changes) of at least 24h before mainnet launch
