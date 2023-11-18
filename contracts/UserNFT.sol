// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract UserNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    /**
     * @dev 
     * Event 
     * Who minted the NFT with which TokenId
     */
    event TokenURIChanged(address indexed to , uint256 indexed tokenId, string uri);

    constructor() ERC721("UserNFT", "USN") Ownable(msg.sender) {
    }

    /**
     * @dev
     * nft Mint
     * storage: 永続的なデータ（状態変数）
     * memory: 一時的 変更不可
     * calldata: 一時的 変更不可
     * external: smartcontract の外から呼べる。中からは呼べない
     */
    function nftMint(address to, string calldata uri) external onlyOwner {
        _tokenIdCounter += 1;
        _mint(to, _tokenIdCounter);
        _setTokenURI(_tokenIdCounter, uri);
        emit TokenURIChanged(to, _tokenIdCounter, uri);
    }

    function awardItem(address player, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIdCounter += 1;
        _mint(player, _tokenIdCounter);
        _setTokenURI(_tokenIdCounter, tokenURI);

        return _tokenIdCounter;
    }
}
