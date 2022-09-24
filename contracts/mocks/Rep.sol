// SPDX-License-Identifier: MIT
pragma solidity >=0.8.13;
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
contract Rep is ERC20 {
  constructor() ERC20('Rep Stablecoin', 'REP') {}

   function faucet(address to, uint amount) external {
    _mint(to, amount);
  }
}
