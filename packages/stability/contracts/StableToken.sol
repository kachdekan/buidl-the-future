// SPDX-License-Identifier: Apache 2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./common/Initializable.sol";

/**
 * @title An ERC20 compliant token with adjustable supply.
 */

contract StableToken is IERC20, Ownable, Initializable {
    using SafeMath for uint256;

    string internal name_;
    string internal symbol_;
    uint8 internal decimals_;

    // Stored as units. Value can be found using unitsToValue().
    mapping(address => uint256) internal balances;
    uint256 internal totalSupply_;

    // Stored as values. Units can be found using valueToUnits().
    mapping(address => mapping(address => uint256)) internal allowed;

    /**
     * @notice Returns the storage, major, minor, and patch version of the contract.
     * @return Storage version of the contract.
     * @return Major version of the contract.
     * @return Minor version of the contract.
     * @return Patch version of the contract.
     */
    function getVersionNumber()
        external
        pure
        returns (uint256, uint256, uint256, uint256)
    {
        return (1, 0, 0, 0);
    }

    /**
     * @notice Sets initialized == true on implementation contracts
     * @param test Set to true to skip implementation initialization
     */
    constructor(bool test) Initializable(test) {}

    /**
     * @param _name The name of the stable token (English)
     * @param _symbol A short symbol identifying the token (e.g. "cUSD")
     * @param _decimals Tokens are divisible to this many decimal places.
     */
    function initialize(
        string calldata _name,
        string calldata _symbol,
        uint8 _decimals
    ) external initializer {
        _transferOwnership(msg.sender);

        totalSupply_ = 0;
        name_ = _name;
        symbol_ = _symbol;
        decimals_ = _decimals;
    }

    /**
     * @return The name of the stable token.
     */
    function name() external view returns (string memory) {
        return name_;
    }

    /**
     * @return The symbol of the stable token.
     */
    function symbol() external view returns (string memory) {
        return symbol_;
    }

    /**
     * @return The number of decimal places to which StableToken is divisible.
     */
    function decimals() external view returns (uint8) {
        return decimals_;
    }

    /**
     * @notice Gets the balance of the specified address using the presently stored inflation factor.
     * @param accountOwner The address to query the balance of.
     * @return The balance of the specified address.
     */
    function balanceOf(address accountOwner) external view returns (uint256) {
        return balances[accountOwner];
    }

    /**
     * @notice Gets the amount of owner's StableToken allowed to be spent by spender.
     * @param accountOwner The owner of the StableToken.
     * @param spender The spender of the StableToken.
     * @return The amount of StableToken owner is allowing spender to spend.
     */
    function allowance(
        address accountOwner,
        address spender
    ) external view returns (uint256) {
        return allowed[accountOwner][spender];
    }

    /**
     * @notice Increase the allowance of another user.
     * @param spender The address which is being approved to spend StableToken.
     * @param value The increment of the amount of StableToken approved to the spender.
     * @return True if the transaction succeeds.
     */
    function increaseAllowance(
        address spender,
        uint256 value
    ) external returns (bool) {
        require(
            spender != address(0),
            "reserved address 0x0 cannot have allowance"
        );
        uint256 oldValue = allowed[msg.sender][spender];
        uint256 newValue = oldValue.add(value);
        allowed[msg.sender][spender] = newValue;
        emit Approval(msg.sender, spender, newValue);
        return true;
    }

    /**
     * @notice Decrease the allowance of another user.
     * @param spender The address which is being approved to spend StableToken.
     * @param value The decrement of the amount of StableToken approved to the spender.
     * @return True if the transaction succeeds.
     */
    function decreaseAllowance(
        address spender,
        uint256 value
    ) external returns (bool) {
        uint256 oldValue = allowed[msg.sender][spender];
        uint256 newValue = oldValue.sub(value);
        allowed[msg.sender][spender] = newValue;
        emit Approval(msg.sender, spender, newValue);
        return true;
    }

    /**
     * @notice Approve a user to transfer StableToken on behalf of another user.
     * @param spender The address which is being approved to spend StableToken.
     * @param value The amount of StableToken approved to the spender.
     * @return True if the transaction succeeds.
     */
    function approve(address spender, uint256 value) external returns (bool) {
        require(
            spender != address(0),
            "reserved address 0x0 cannot have allowance"
        );
        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    /**
     * @notice Mints new StableToken and gives it to 'to'.
     * @param to The account for which to mint tokens.
     * @param value The amount of StableToken to mint.
     */
    function mint(address to, uint256 value) external returns (bool) {
        require(to != address(0), "0 is a reserved address");
        if (value == 0) {
            return true;
        }

        //uint256 units = _valueToUnits(inflationState.factor, value);
        totalSupply_ = totalSupply_.add(value);
        balances[to] = balances[to].add(value);
        emit Transfer(address(0), to, value);
        return true;
    }

    /**
     * @notice Transfers StableToken from one address to another on behalf of a user.
     * @param from The address to transfer StableToken from.
     * @param to The address to transfer StableToken to.
     * @param value The amount of StableToken to transfer.
     * @return True if the transaction succeeds.
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool) {
        //uint256 units = _valueToUnits(inflationState.factor, value);
        require(to != address(0), "transfer attempted to reserved address 0x0");
        require(
            value <= balances[from],
            "transfer value exceeded balance of sender"
        );
        require(
            value <= allowed[from][msg.sender],
            "transfer value exceeded sender's allowance for recipient"
        );

        balances[to] = balances[to].add(value);
        balances[from] = balances[from].sub(value);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
        emit Transfer(from, to, value);
        return true;
    }

    /**
     * @notice Transfers StableToken from one address to another
     * @param to The address to transfer StableToken to.
     * @param value The amount of StableToken to be transferred.
     */
    function transfer(address to, uint256 value) external returns (bool) {
        require(to != address(0), "transfer attempted to reserved address 0x0");
        //uint256 units = _valueToUnits(inflationState.factor, value);
        require(
            balances[msg.sender] >= value,
            "transfer value exceeded balance of sender"
        );
        balances[msg.sender] = balances[msg.sender].sub(value);
        balances[to] = balances[to].add(value);
        emit Transfer(msg.sender, to, value);
        return true;
    }

    /**
     * @return The total value of StableToken in existence
     * @dev Though totalSupply_ is stored in units, this returns value.
     */
    function totalSupply() external view returns (uint256) {
        return totalSupply_;
    }
}
