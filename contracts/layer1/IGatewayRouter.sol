// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

interface IGatewayRouter {
    function outboundTransfer(
        address _l1Token,
        address _to,
        uint256 _amount,
        uint256 _maxGas,
        uint256 _gasPriceBid,
        bytes calldata _data
    ) external payable returns(bytes memory);
}