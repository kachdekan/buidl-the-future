// SPDX-License-Identifier: Apache 2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./common/Initializable.sol";
import "./common/FixidityLib.sol";
import "./common/UsingPrecompiles.sol";

/**
 * @title An ERC20 compliant token with adjustable supply.
 */

contract StableToken is IERC20, Ownable, Initializable, UsingPrecompiles {
    using SafeMath for uint256;
    using FixidityLib for FixidityLib.Fraction;

    string internal name_;
    string internal symbol_;
    uint8 internal decimals_;

    // Stored as units. Value can be found using unitsToValue().
    mapping(address => uint256) internal balances;
    uint256 internal totalSupply_;

    // Stored as values. Units can be found using valueToUnits().
    mapping(address => mapping(address => uint256)) internal allowed;

    //Some Events
    event InflationFactorUpdated(uint256 factor, uint256 lastUpdated);

    event InflationParametersUpdated(
        uint256 rate,
        uint256 updatePeriod,
        uint256 lastUpdated
    );

    event TransferComment(string comment);

    // STABILITY FEE PARAMETERS

    // The `rate` is how much the `factor` is adjusted by per `updatePeriod`.
    // The `factor` describes units/value of StableToken, and is greater than or equal to 1.
    // The `updatePeriod` governs how often the `factor` is updated.
    // `factorLastUpdated` indicates when the inflation factor was last updated.
    struct InflationState {
        FixidityLib.Fraction rate;
        FixidityLib.Fraction factor;
        uint256 updatePeriod;
        uint256 factorLastUpdated;
    }

    InflationState inflationState;

    /**
     * @notice Recomputes and updates inflation factor if more than `updatePeriod`
     * has passed since last update.
     */
    modifier updateInflationFactor() {
        FixidityLib.Fraction memory updatedInflationFactor;
        uint256 lastUpdated;

        (updatedInflationFactor, lastUpdated) = getUpdatedInflationFactor();

        if (lastUpdated != inflationState.factorLastUpdated) {
            inflationState.factor = updatedInflationFactor;
            inflationState.factorLastUpdated = lastUpdated;
            emit InflationFactorUpdated(
                inflationState.factor.unwrap(),
                inflationState.factorLastUpdated
            );
        }
        _;
    }

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
     * @param _symbol A short symbol identifying the token (e.g. "xKES")
     * @param _decimals Tokens are divisible to this many decimal places.
     * @param inflationRate Weekly inflation rate.
     * @param inflationFactorUpdatePeriod How often the inflation factor is updated, in seconds.
     * @param initialBalanceAddresses Array of addresses with an initial balance.
     * @param initialBalanceValues Array of balance values corresponding to initialBalanceAddresses.
     */
    function initialize(
        string calldata _name,
        string calldata _symbol,
        uint8 _decimals,
        uint256 inflationRate,
        uint256 inflationFactorUpdatePeriod,
        address[] calldata initialBalanceAddresses,
        uint256[] calldata initialBalanceValues
    ) external initializer {
        require(inflationRate != 0, "Must provide a non-zero inflation rate");
        require(
            inflationFactorUpdatePeriod > 0,
            "inflationFactorUpdatePeriod must be > 0"
        );
        _transferOwnership(msg.sender);

        totalSupply_ = 0;
        name_ = _name;
        symbol_ = _symbol;
        decimals_ = _decimals;

        inflationState.rate = FixidityLib.wrap(inflationRate);
        inflationState.factor = FixidityLib.fixed1();
        inflationState.updatePeriod = inflationFactorUpdatePeriod;
        inflationState.factorLastUpdated = block.timestamp;

        require(
            initialBalanceAddresses.length == initialBalanceValues.length,
            "Array length mismatch"
        );
        for (uint256 i = 0; i < initialBalanceAddresses.length; i = i.add(1)) {
            _mint(initialBalanceAddresses[i], initialBalanceValues[i]);
        }
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
        return unitsToValue(balances[accountOwner]);
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
    ) external updateInflationFactor returns (bool) {
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
    ) external updateInflationFactor returns (bool) {
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
    function approve(
        address spender,
        uint256 value
    ) external updateInflationFactor returns (bool) {
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
    function mint(
        address to,
        uint256 value
    ) external updateInflationFactor onlyOwner returns (bool) {
        //add requirement to check registry
        return _mint(to, value);
    }

    /**
     * @notice Mints new StableToken and gives it to 'to'.
     * @param to The account for which to mint tokens.
     * @param value The amount of StableToken to mint.
     */
    function _mint(address to, uint256 value) private returns (bool) {
        require(to != address(0), "0 is a reserved address");
        if (value == 0) {
            return true;
        }

        uint256 units = _valueToUnits(inflationState.factor, value);
        totalSupply_ = totalSupply_.add(units);
        balances[to] = balances[to].add(units);
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
    ) external updateInflationFactor returns (bool) {
        uint256 units = _valueToUnits(inflationState.factor, value);
        require(to != address(0), "transfer attempted to reserved address 0x0");
        require(
            units <= balances[from],
            "transfer value exceeded balance of sender"
        );
        require(
            value <= allowed[from][msg.sender],
            "transfer value exceeded sender's allowance for recipient"
        );

        balances[to] = balances[to].add(units);
        balances[from] = balances[from].sub(units);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
        emit Transfer(from, to, value);
        return true;
    }

    /**
     * @notice Transfers StableToken from one address to another
     * @param to The address to transfer StableToken to.
     * @param value The amount of StableToken to be transferred.
     */
    function transfer(
        address to,
        uint256 value
    ) external updateInflationFactor returns (bool) {
        return _transfer(to, value);
    }

    /**
     * @notice Transfers StableToken from one address to another
     * @param to The address to transfer StableToken to.
     * @param value The amount of StableToken to be transferred.
     */
    function _transfer(address to, uint256 value) internal returns (bool) {
        require(to != address(0), "transfer attempted to reserved address 0x0");
        uint256 units = _valueToUnits(inflationState.factor, value);
        require(
            balances[msg.sender] >= units,
            "transfer value exceeded balance of sender"
        );
        balances[msg.sender] = balances[msg.sender].sub(units);
        balances[to] = balances[to].add(units);
        emit Transfer(msg.sender, to, value);
        return true;
    }

    /**
     * @return The total value of StableToken in existence
     * @dev Though totalSupply_ is stored in units, this returns value.
     */
    function totalSupply() external view returns (uint256) {
        return unitsToValue(totalSupply_);
    }

    /**
     * @notice Updates Inflation Parameters.
     * @param rate New rate.
     * @param updatePeriod How often inflationFactor is updated.
     */
    function setInflationParameters(
        uint256 rate,
        uint256 updatePeriod
    ) external onlyOwner updateInflationFactor {
        require(rate != 0, "Must provide a non-zero inflation rate.");
        require(updatePeriod > 0, "updatePeriod must be > 0");
        inflationState.rate = FixidityLib.wrap(rate);
        inflationState.updatePeriod = updatePeriod;
        emit InflationParametersUpdated(rate, updatePeriod, block.timestamp);
    }

    /**
     * @notice gets inflation parameters.
     * @return rate
     * @return factor
     * @return updatePeriod
     * @return factorLastUpdated
     */
    function getInflationParameters()
        external
        view
        returns (uint256, uint256, uint256, uint256)
    {
        return (
            inflationState.rate.unwrap(),
            inflationState.factor.unwrap(),
            inflationState.updatePeriod,
            inflationState.factorLastUpdated
        );
    }

    /**
     * @notice Computes the up-to-date inflation factor.
     * @return Current inflation factor.
     * @return Last time when the returned inflation factor was updated.
     */
    function getUpdatedInflationFactor()
        private
        view
        returns (FixidityLib.Fraction memory, uint256)
    {
        if (
            block.timestamp <
            inflationState.factorLastUpdated.add(inflationState.updatePeriod)
        ) {
            return (inflationState.factor, inflationState.factorLastUpdated);
        }

        uint256 numerator;
        uint256 denominator;

        // TODO: handle retroactive updates given decreases to updatePeriod
        uint256 timesToApplyInflation = block
            .timestamp
            .sub(inflationState.factorLastUpdated)
            .div(inflationState.updatePeriod);

        (numerator, denominator) = fractionMulExp(
            inflationState.factor.unwrap(),
            FixidityLib.fixed1().unwrap(),
            inflationState.rate.unwrap(),
            FixidityLib.fixed1().unwrap(),
            timesToApplyInflation,
            decimals_
        );

        // This should never happen. If something went wrong updating the
        // inflation factor, keep the previous factor
        if (numerator == 0 || denominator == 0) {
            return (inflationState.factor, inflationState.factorLastUpdated);
        }

        FixidityLib.Fraction memory currentInflationFactor = FixidityLib
            .wrap(numerator)
            .divide(FixidityLib.wrap(denominator));
        uint256 lastUpdated = inflationState.factorLastUpdated.add(
            inflationState.updatePeriod.mul(timesToApplyInflation)
        );

        return (currentInflationFactor, lastUpdated);
    }

    /**
     * @notice Returns the units for a given value given the current inflation factor.
     * @param value The value to convert to units.
     * @return The units corresponding to `value` given the current inflation factor.
     * @dev We don't compute the updated inflationFactor here because
     * we assume any function calling this will have updated the inflation factor.
     */
    function valueToUnits(uint256 value) external view returns (uint256) {
        FixidityLib.Fraction memory updatedInflationFactor;

        (updatedInflationFactor, ) = getUpdatedInflationFactor();
        return _valueToUnits(updatedInflationFactor, value);
    }

    /**
     * @notice Returns the units for a given value given the current inflation factor.
     * @param inflationFactor The current inflation factor.
     * @param value The value to convert to units.
     * @return The units corresponding to `value` given the current inflation factor.
     * @dev We assume any function calling this will have updated the inflation factor.
     */
    function _valueToUnits(
        FixidityLib.Fraction memory inflationFactor,
        uint256 value
    ) private pure returns (uint256) {
        return
            inflationFactor.multiply(FixidityLib.newFixed(value)).fromFixed();
    }

    /**
     * @notice Returns the value of a given number of units given the current inflation factor.
     * @param units The units to convert to value.
     * @return The value corresponding to `units` given the current inflation factor.
     */
    function unitsToValue(uint256 units) public view returns (uint256) {
        FixidityLib.Fraction memory updatedInflationFactor;

        (updatedInflationFactor, ) = getUpdatedInflationFactor();

        // We're ok using FixidityLib.divide here because updatedInflationFactor is
        // not going to surpass maxFixedDivisor any time soon.
        // Quick upper-bound estimation: if annual inflation were 5% (an order of
        // magnitude more than the initial proposal of 0.5%), in 500 years, the
        // inflation factor would be on the order of 10**10, which is still a safe
        // divisor.
        return
            FixidityLib
                .newFixed(units)
                .divide(updatedInflationFactor)
                .fromFixed();
    }
}
