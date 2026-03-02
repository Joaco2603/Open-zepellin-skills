skill: uups-proxy-pattern
rules:
  - Inherit UUPSUpgradeable and override _authorizeUpgrade with onlyOwner or a governance check
  - Never initialize state variables in the logic contract declaration; use initializer functions only
  - Use the @custom:oz-upgrades-unsafe-allow constructor annotation if a constructor is strictly needed
  - Store the implementation address in the EIP-1967 slot; never use a custom storage slot for it
  - Run the OpenZeppelin Upgrades plugin validation (npx hardhat check) before every upgrade deployment

skill: transparent-proxy-pattern
rules:
  - Use TransparentUpgradeableProxy when admin calls must be strictly separated from user calls
  - Deploy ProxyAdmin separately and transfer its ownership to a multisig immediately after deployment
  - Never call implementation functions from the proxy admin address to avoid selector clashes
  - Upgrade via ProxyAdmin.upgrade(proxy, newImpl), never by calling the proxy directly as admin
  - Keep ProxyAdmin ownership transfer as the last step in deployment scripts, not the first

skill: initializer-pattern
rules:
  - Mark the initializer function with the initializer modifier from Initializable
  - Call all parent __init functions in the correct order: __Ownable_init before __ERC20_init, etc.
  - Use reinitializer(N) for upgrade-time initializations, not initializer
  - Add a disableInitializers() call in the logic contract constructor to prevent direct initialization
  - Never use a constructor for state setup in upgradeable contracts; all state goes in initialize()

skill: storage-layout-upgrades
rules:
  - Never change the order or type of existing storage variables between upgrades
  - Append new variables only at the end of the storage layout, never insert in the middle
  - Use storage gaps (uint256[50] private __gap) at the end of each upgradeable base contract
  - Run storageLayout diff with the OpenZeppelin Upgrades Hardhat plugin before every upgrade
  - Document each storage slot with a comment including the version it was introduced

skill: beacon-proxy-pattern
rules:
  - Use BeaconProxy when many proxy instances need to be upgraded simultaneously to the same implementation
  - Deploy UpgradeableBeacon and transfer ownership to a governance contract, not an EOA
  - Create new instances with new BeaconProxy(beacon, initData) in a factory contract
  - Upgrade all instances at once by calling UpgradeableBeacon.upgradeTo(newImpl) from the owner
  - Emit a BeaconInstanceDeployed(proxy, owner) event from the factory for off-chain indexing
