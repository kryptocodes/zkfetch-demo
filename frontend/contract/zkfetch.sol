// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@reclaimprotocol/verifier-solidity-sdk/contracts/Reclaim.sol";


contract Attestor {
   address public reclaimAddress;

   constructor(){
       reclaimAddress = '0x4D1ee04EB5CeE02d4C123d4b67a86bDc7cA2E62A';
   }

   function verifyProof(Reclaim.Proof memory proof) public view{
       Reclaim(reclaimAddress).verifyProof(proof);
   }

}

