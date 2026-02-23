skill: erc721-nft-standard
rules:
  - Inherit from ERC721URIStorage when each token needs an individual metadata URI
  - Inherit from ERC721Enumerable only if on-chain token enumeration by owner is strictly required (adds gas cost)
  - Use _safeMint instead of _mint to prevent tokens being locked in contracts that don't implement IERC721Receiver
  - Never reuse tokenIds; use a monotonically increasing counter (e.g., Counters or a uint256 _nextTokenId)
  - Implement supportsInterface correctly when combining multiple ERC721 extensions

skill: erc721-metadata-uri
rules:
  - Store base URI in a private variable and expose it via _baseURI() override, not hardcoded in tokenURI()
  - Allow owner to update baseURI with a setBaseURI function protected by Ownable or a URI_SETTER role
  - Emit a BatchMetadataUpdate(0, type(uint256).max) event when base URI changes (ERC-4906 compliant)
  - For fully on-chain metadata, use Base64.encode from OpenZeppelin's utils/Base64.sol
  - Return a placeholder URI for unminted tokenIds to avoid reverts in marketplaces

skill: erc721-access-and-minting
rules:
  - Gate public minting behind a price check and a supply cap in the same require block
  - Use MerkleProof.verify for allowlist/whitelist minting to avoid storing per-address mappings
  - Track mints per address with a mapping(address => uint256) to enforce per-wallet limits
  - Pause minting with Pausable and emit a SalePhaseChanged event when switching between phases
  - Withdraw collected ETH with a pull-over-push pattern or a single owner-only withdraw function

skill: erc1155-multi-token
rules:
  - Use ERC1155Supply to track total supply per tokenId without manual counters
  - Batch mint with _mintBatch during deployment or airdrop to save gas over individual _mint calls
  - Define tokenId semantics as constants or an enum to make the contract self-documenting
  - Override uri() to return a base URI with {id} placeholder per ERC-1155 metadata spec
  - Implement safeTransferFrom correctly; always call _beforeTokenTransfer hook if adding custom logic

skill: erc721-royalties-eip2981
rules:
  - Inherit ERC2981 to expose standard royalty info to marketplaces
  - Set default royalty in constructor with _setDefaultRoyalty(receiver, feeNumerator)
  - Allow per-token royalty overrides with _setTokenRoyalty for 1/1 or special edition tokens
  - Express feeNumerator out of _feeDenominator() which defaults to 10000 (100 = 1%)
  - Never rely solely on EIP-2981 for royalty enforcement; document that compliance is marketplace-dependent
