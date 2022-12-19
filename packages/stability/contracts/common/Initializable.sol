// SPDX-License-Identifier: Apache 2.0
pragma solidity ^0.8.9;

contract Initializable {
    bool public initialized;

    constructor(bool testingDeployment) {
        if (!testingDeployment) {
            initialized = true;
        }
    }

    modifier initializer() {
        require(!initialized, "contract already initialized");
        initialized = true;
        _;
    }
}
