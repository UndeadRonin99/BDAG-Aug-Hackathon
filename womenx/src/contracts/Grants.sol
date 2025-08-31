// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Grants {
  struct Grant { address org; address token; uint256 amount; string uri; bool funded; bool released; }
  Grant[] public grants;
  event GrantCreated(uint256 grantId, address org, address token, uint256 amount, string uri);

  function createGrant(address token, uint256 amount, string calldata uri) external returns (uint256 id) {
    id = grants.length;
    grants.push(Grant(msg.sender, token, amount, uri, false, false));
    emit GrantCreated(id, msg.sender, token, amount, uri);
  }

  function fund(uint256 grantId) external payable {
    Grant storage g = grants[grantId];
    require(!g.funded, "funded");
    if (g.token == address(0)) { require(msg.value == g.amount, "bad amount"); }
    // (ERC20 path omitted for brevity)
    g.funded = true;
  }

  function release(uint256 grantId, address payable to) external {
    Grant storage g = grants[grantId];
    require(msg.sender == g.org, "only org");
    require(g.funded && !g.released, "bad state");
    g.released = true;
    if (g.token == address(0)) { (bool ok,) = to.call{value:g.amount}(""); require(ok,"xfer"); }
  }
}
