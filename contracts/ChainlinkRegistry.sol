// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// --- Chainlink Imports ---
import "./interfaces/AggregatorV3Interface.sol"; // Price Feeds
import "./interfaces/VRFCoordinatorV2Interface.sol"; // VRF Coordinator Interface
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol"; // Keepers (Automation)
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol"; // VRF

/**
 * @title ChainlinkRegistry
 * @dev Demonstrates integration of Chainlink Price Feeds, Automation, and VRF.
 *      This is a template/extension of your Registry contract.
 */
contract ChainlinkRegistry is AutomationCompatibleInterface, VRFConsumerBaseV2 {
    // --- Chainlink Price Feed (ETH/USD) ---
    AggregatorV3Interface internal priceFeed;

    // --- Chainlink VRF ---
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 s_subscriptionId;
    bytes32 keyHash;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
    uint256 public randomResult;
    uint256 public lastRequestId;

    // --- Automation (Keepers) ---
    uint256 public lastUpkeepTime;
    uint256 public upkeepInterval = 1 days;

    // --- Example State ---
    uint256 public lastEthUsdPrice;

    // --- Events ---
    event PriceUpdated(uint256 price);
    event RandomnessRequested(uint256 requestId);
    event RandomnessFulfilled(uint256 randomValue);
    event UpkeepPerformed(uint256 time);

    // --- Constructor ---
    constructor(
        address _priceFeed,
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint64 _subscriptionId
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        priceFeed = AggregatorV3Interface(_priceFeed); // e.g., Sepolia ETH/USD
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        keyHash = _keyHash;
        s_subscriptionId = _subscriptionId;
        lastUpkeepTime = block.timestamp;
    }

    // --- Chainlink Price Feed Example ---
    function updateEthUsdPrice() public {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        lastEthUsdPrice = uint256(price);
        emit PriceUpdated(lastEthUsdPrice);
    }

    // --- Chainlink VRF Example ---
    function requestRandomWords() public returns (uint256 requestId) {
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        lastRequestId = requestId;
        emit RandomnessRequested(requestId);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        randomResult = randomWords[0];
        emit RandomnessFulfilled(randomResult);
    }

    // --- Chainlink Automation (Keepers) Example ---
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = (block.timestamp - lastUpkeepTime) > upkeepInterval;
    }

    function performUpkeep(bytes calldata) external override {
        require((block.timestamp - lastUpkeepTime) > upkeepInterval, "Upkeep not needed");
        lastUpkeepTime = block.timestamp;
        // Example: auto-update price
        updateEthUsdPrice();
        emit UpkeepPerformed(lastUpkeepTime);
    }
}

/**
 * --- Example Sepolia Addresses (as of April 2024) ---
 * ETH/USD Price Feed: 0x694AA1769357215DE4FAC081bf1f309aDC325306
 * VRF Coordinator:    0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625
 * Key Hash:           0x121a... (get from Chainlink docs)
 * Subscription ID:    (your VRF sub ID)
 */ 