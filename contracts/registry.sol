// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// --- Chainlink Imports ---
import "./interfaces/AggregatorV3Interface.sol"; // Price Feeds
import "./interfaces/VRFCoordinatorV2Interface.sol"; // VRF Coordinator Interface
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol"; // Keepers (Automation)
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol"; // VRF
// --- Security ---
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Registry is 
    AutomationCompatibleInterface, 
    VRFConsumerBaseV2,
    ReentrancyGuard,
    Ownable
{
    // --- Chainlink Price Feed (ETH/USD) ---
    AggregatorV3Interface internal priceFeed;

    // --- Chainlink VRF ---
    VRFCoordinatorV2Interface coordinator;
    uint64 s_subscriptionId;
    bytes32 keyHash;
    uint32 callbackGasLimit = 200000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
    uint256 public randomResult;
    uint256 public lastRequestId;
    mapping(uint256 => bool) public pendingRandomRequests;

    // --- Automation (Keepers) ---
    uint256 public lastUpkeepTime;
    uint256 public upkeepInterval = 1 days;
    uint256 public lastOptionCheckTime;

    // --- Price and Market Data ---
    uint256 public lastEthUsdPrice;
    uint256 public priceUpdateThreshold = 5; // 5% price change threshold
    uint256 public lastSignificantPrice;

    // --- Original Registry State and Logic ---
    struct Order {
        address seller;
        address owner;
        uint256 orderId;
        uint256 sellPrice;
        bool isBuy;
        bool isSale;
        bool isOption;
        uint256 optionFee;
        uint256 optionDuration;
        bool fulfilled;
        uint256 noOfSLRTokens;
        uint256 createdAt;
        bool isAuditSelected; // New field for random audits
    }

    string[] verifiedSensors = [
        "b8715fb98feb70c3f3f1b01174577bbdbf7fe32892846aaad96776fb58270216",
        "2105742f5adb229dd4be3898314fdd0f0dd35efbf0a5724cc7d5a17eee9afd1f"
    ];

    Order[] public orderArray;
    uint256[] public activeOrderIds;

    uint256 public LatestTimestamp;
    uint256 public credsMarketPrice = 10;
    uint256 public constant PRICE_DECIMALS = 8; // Chainlink price feed decimals

    mapping(address => uint256) public balances;
    mapping(address => uint256) public recBalances;
    mapping(string => address) public genStationToAddress;
    mapping(address => string[]) public addressToEligiblePromotions;
    mapping(address => bool) public isBrand;
    mapping(address => string) public addressToPromotionSecret;
    mapping(address => bool) public authorizedSensors;
    mapping(address => uint256) public crossChainBalances; // For CCIP

    // Admin controls
    mapping(address => bool) public admins;
    
    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner(), "Not authorized admin");
        _;
    }

    modifier validOrder(uint256 _orderId) {
        require(_orderId < orderArray.length, "Invalid order ID");
        _;
    }

    modifier onlyAuthorizedSensor() {
        require(authorizedSensors[msg.sender], "Not authorized sensor");
        _;
    }

    // --- Events for original functionality ---
    event optionCreated(address indexed lessor, uint256 optionId, uint256 noOfSLRTokens, uint256 collateral);
    event optionTaken(address indexed lessee, uint256 optionId);
    event optionEnded(address indexed lessee, uint256 optionId, uint256 refundAmount, uint256 extraAmount);

    // --- Enhanced Constructor ---
    constructor(
        address _priceFeed,
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint64 _vrfSubscriptionId
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        priceFeed = AggregatorV3Interface(_priceFeed);
        coordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        keyHash = _keyHash;
        s_subscriptionId = _vrfSubscriptionId;
        lastUpkeepTime = block.timestamp;
        lastOptionCheckTime = block.timestamp;
        
        // Set initial admin
        admins[msg.sender] = true;
        
        // Initialize price
        updateEthUsdPrice();
        lastSignificantPrice = lastEthUsdPrice;
    }

    // --- Admin Functions ---
    function addAdmin(address _admin) external onlyOwner {
        admins[_admin] = true;
    }

    function removeAdmin(address _admin) external onlyOwner {
        admins[_admin] = false;
    }

    function addAuthorizedSensor(address _sensor) external onlyAdmin {
        authorizedSensors[_sensor] = true;
    }

    // --- Enhanced Chainlink Price Feed ---
    function updateEthUsdPrice() public {
        (
            uint80 roundId,
            int256 price,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        require(updatedAt > 0, "Stale price data");
        require(block.timestamp - updatedAt < 3600, "Price data too old"); // 1 hour max
        
        lastEthUsdPrice = uint256(price);
        
        // Check if price changed significantly
        if (lastSignificantPrice > 0) {
            uint256 priceChange = lastEthUsdPrice > lastSignificantPrice 
                ? ((lastEthUsdPrice - lastSignificantPrice) * 100) / lastSignificantPrice
                : ((lastSignificantPrice - lastEthUsdPrice) * 100) / lastSignificantPrice;
            
            if (priceChange >= priceUpdateThreshold) {
                lastSignificantPrice = lastEthUsdPrice;
                // Trigger additional actions on significant price changes
                _handleSignificantPriceChange();
            }
        }
    }

    function _handleSignificantPriceChange() internal {
        // Could trigger random audit selection or other actions
        if (orderArray.length > 0) {
            requestRandomWordsForPurpose("price_change_audit");
        }
    }

    // --- Enhanced Chainlink VRF ---
    function requestRandomWordsForPurpose(string memory _purpose) public returns (uint256 requestId) {
        requestId = coordinator.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        lastRequestId = requestId;
        pendingRandomRequests[requestId] = true;
        
        emit RandomnessRequested(requestId, _purpose);
        return requestId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        require(pendingRandomRequests[requestId], "Request not pending");
        pendingRandomRequests[requestId] = false;
        
        randomResult = randomWords[0];
        
        // Use randomness for different purposes
        _processRandomResult(requestId, randomResult);
        
        emit RandomnessFulfilled(requestId, randomResult, "general");
    }

    function _processRandomResult(uint256 requestId, uint256 randomValue) internal {
        if (orderArray.length > 0) {
            // Select random order for audit
            uint256 randomOrderIndex = randomValue % orderArray.length;
            orderArray[randomOrderIndex].isAuditSelected = true;
            emit RandomOrderSelected(randomOrderIndex, orderArray[randomOrderIndex].seller);
        }
    }

    // --- Enhanced Chainlink Automation ---
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        bool priceUpdateNeeded = (block.timestamp - lastUpkeepTime) > upkeepInterval;
        bool optionCheckNeeded = (block.timestamp - lastOptionCheckTime) > (upkeepInterval / 24); // Check every hour
        bool hasExpiredOptions = _hasExpiredOptions();
        
        upkeepNeeded = priceUpdateNeeded || optionCheckNeeded || hasExpiredOptions;
        
        // Encode what actions are needed
        string[] memory actions = new string[](3);
        uint256 actionCount = 0;
        
        if (priceUpdateNeeded) {
            actions[actionCount] = "price_update";
            actionCount++;
        }
        if (optionCheckNeeded || hasExpiredOptions) {
            actions[actionCount] = "option_check";
            actionCount++;
        }
        
        performData = abi.encode(actions, actionCount);
    }

    function performUpkeep(bytes calldata performData) external override {
        (string[] memory actions, uint256 actionCount) = abi.decode(performData, (string[], uint256));
        
        string[] memory performedActions = new string[](actionCount);
        uint256 performedCount = 0;
        
        for (uint256 i = 0; i < actionCount; i++) {
            if (keccak256(bytes(actions[i])) == keccak256(bytes("price_update"))) {
                if ((block.timestamp - lastUpkeepTime) > upkeepInterval) {
                    updateEthUsdPrice();
                    lastUpkeepTime = block.timestamp;
                    performedActions[performedCount] = "price_update";
                    performedCount++;
                }
            } else if (keccak256(bytes(actions[i])) == keccak256(bytes("option_check"))) {
                if ((block.timestamp - lastOptionCheckTime) > (upkeepInterval / 24)) {
                    checkExpiredOptions();
                    lastOptionCheckTime = block.timestamp;
                    performedActions[performedCount] = "option_check";
                    performedCount++;
                }
            }
        }
        
        emit UpkeepPerformed(block.timestamp, performedActions);
    }

    function _hasExpiredOptions() internal view returns (bool) {
        for (uint256 i = 0; i < orderArray.length; i++) {
            if (orderArray[i].optionDuration > 0 && 
                orderArray[i].createdAt + orderArray[i].optionDuration < block.timestamp) {
                return true;
            }
        }
        return false;
    }

    // --- Enhanced Original Registry Functions ---
    function addPromotionSecret(string memory _promotionSecret) public {
        require(bytes(_promotionSecret).length > 0, "Empty promotion secret");
        addressToPromotionSecret[msg.sender] = _promotionSecret;
    }

    function registerAsBrand() public {
        isBrand[msg.sender] = true;
    }

    function addEligiblePromotions(address _seller, string memory _promotionSecret) public {
        require(isBrand[msg.sender], "Only brands can add promotions");
        addressToEligiblePromotions[_seller].push(_promotionSecret);
    }

    function getAllEligiblePromotions(address _seller) public view returns (string[] memory) {
        return addressToEligiblePromotions[_seller];
    }

    function addGenStation(string memory _code) public {
        require(bytes(_code).length > 0, "Empty station code");
        genStationToAddress[_code] = msg.sender;
    }

    function returnOrdersArrayLength() public view returns (uint256) {
        return orderArray.length;
    }

    function updateSLRTokenBalance(string memory _code, uint256 _newValue) public onlyAuthorizedSensor {
        require(checkVerifiedSensors(_code), "Sensor not verified");
        require(_newValue > 0, "Invalid balance value");

        updateTime();
        checkExpiredOptions();

        address stationOwner = genStationToAddress[_code];
        require(stationOwner != address(0), "Station not registered");
        
        balances[stationOwner] = _newValue;
    }

    function returnSLRBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function createBuyOrder(uint256 _orderId) public payable validOrder(_orderId) nonReentrant {
        updateTime();
        checkExpiredOptions();
        
        Order storage order = orderArray[_orderId];
        require(msg.value >= order.sellPrice, "Insufficient value sent");
        require(!order.fulfilled, "Order already fulfilled");
        require(order.isSale, "Not a sale order");

        order.owner = msg.sender;
        order.fulfilled = true;
        order.optionDuration = 0;
        balances[msg.sender] += order.noOfSLRTokens;
        
        // Calculate market price
        credsMarketPrice = order.sellPrice / order.noOfSLRTokens;
        
        payable(order.seller).transfer(msg.value);
    }

    function consumeToken(uint256 _orderId) public payable validOrder(_orderId) nonReentrant {
        updateTime();
        checkExpiredOptions();
        
        Order storage order = orderArray[_orderId];
        require(msg.value >= order.sellPrice, "Insufficient value sent");
        require(!order.fulfilled, "Order already fulfilled");
        require(isBrand[msg.sender], "Only brands can consume tokens");

        order.owner = msg.sender;
        order.fulfilled = true;
        order.optionDuration = 0;
        recBalances[msg.sender] += order.noOfSLRTokens;
        
        string memory promotionSecret = addressToPromotionSecret[msg.sender];
        if (bytes(promotionSecret).length > 0) {
            addEligiblePromotions(order.seller, promotionSecret);
        }
        
        credsMarketPrice = order.sellPrice / order.noOfSLRTokens;
        payable(order.seller).transfer(msg.value);
    }

    function listOrder(
        uint256 _sellPrice,
        uint256 _noOfSLRTokens,
        uint256 _optionPrice,
        uint256 _duration
    ) public {
        updateTime();
        checkExpiredOptions();

        require(balances[msg.sender] >= _noOfSLRTokens, "Insufficient SLR tokens");
        require(_sellPrice > 0, "Invalid sell price");
        require(_noOfSLRTokens > 0, "Invalid token amount");

        orderArray.push(
            Order({
                seller: msg.sender,
                owner: msg.sender,
                orderId: orderArray.length,
                sellPrice: _sellPrice,
                isBuy: false,
                isSale: true,
                isOption: _duration > 0,
                optionFee: _optionPrice,
                optionDuration: _duration,
                fulfilled: false,
                noOfSLRTokens: _noOfSLRTokens,
                createdAt: block.timestamp,
                isAuditSelected: false
            })
        );
        
        balances[msg.sender] -= _noOfSLRTokens;
        activeOrderIds.push(orderArray.length - 1);
        
        emit optionCreated(msg.sender, orderArray.length - 1, _noOfSLRTokens, _optionPrice);
    }

    function takeOnOption(uint256 _orderId) public payable validOrder(_orderId) nonReentrant {
        updateTime();
        checkExpiredOptions();
        
        Order storage order = orderArray[_orderId];
        require(msg.value >= order.optionFee, "Insufficient option fee");
        require(!order.fulfilled, "Option already fulfilled");
        require(order.isOption, "Not an option order");

        order.owner = msg.sender;
        order.fulfilled = true;
        order.createdAt = block.timestamp;
        balances[msg.sender] += order.noOfSLRTokens;
        
        payable(order.seller).transfer(msg.value);
        emit optionTaken(msg.sender, _orderId);
    }

    function redeemTokens(uint256 _value, address _user) public onlyAdmin {
        require(balances[_user] >= _value, "Insufficient balance");
        checkExpiredOptions();
        balances[_user] -= _value;
    }

    function endOption(uint256 _orderId) public onlyAdmin validOrder(_orderId) {
        Order storage order = orderArray[_orderId];
        require(order.fulfilled, "Option not active");
        
        balances[order.owner] -= order.noOfSLRTokens;
        balances[order.seller] += order.noOfSLRTokens;
        order.fulfilled = false;
        order.owner = order.seller;
        
        emit optionEnded(order.owner, _orderId, 0, 0);
    }

    function updateTime() public {
        LatestTimestamp = block.timestamp;
    }

    function checkExpiredOptions() public {
        updateTime();
        for (uint256 index = 0; index < orderArray.length; index++) {
            if (orderArray[index].optionDuration > 0 && 
                orderArray[index].fulfilled &&
                orderArray[index].createdAt + orderArray[index].optionDuration < LatestTimestamp) {
                endOption(index);
            }
        }
    }

    bool public isVerified;

    function checkVerifiedSensors(string memory _code) public returns (bool) {
        for (uint256 index = 0; index < verifiedSensors.length; index++) {
            if (keccak256(abi.encodePacked(verifiedSensors[index])) == 
                keccak256(abi.encodePacked(_code))) {
                isVerified = true;
                return true;
            }
        }
        isVerified = false;
        return false;
    }

    // --- View Functions ---
    function getOrderDetails(uint256 _orderId) public view validOrder(_orderId) returns (Order memory) {
        return orderArray[_orderId];
    }

    function getActiveOrders() public view returns (uint256[] memory) {
        return activeOrderIds;
    }

    function getCurrentPrice() public view returns (uint256) {
        return lastEthUsdPrice;
    }

    // --- Emergency Functions ---
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function updateUpkeepInterval(uint256 _newInterval) external onlyAdmin {
        require(_newInterval >= 1 hours, "Interval too short");
        upkeepInterval = _newInterval;
    }

    event RandomnessRequested(uint256 requestId, string purpose);
    event RandomnessFulfilled(uint256 requestId, uint256 randomResult, string purpose);
    event RandomOrderSelected(uint256 orderId, address seller);
    event UpkeepPerformed(uint256 timestamp, string[] actions);
}

/**
 * --- Deployment Addresses for Sepolia Testnet ---
 * ETH/USD Price Feed: 0x694AA1769357215DE4FAC081bf1f309aDC325306
 * VRF Coordinator:    0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625
 * Key Hash (30 gwei): 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c
 * Functions Router:   0xb83E47C2bC239B3bf370bc41e1459A34b41238D0
 * CCIP Router:        0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59
 * 
 * Note: You need to:
 * 1. Create VRF subscription and fund it with LINK
 * 2. Create Functions subscription and fund it with LINK  
 * 3. Add this contract as a consumer to both subscriptions
 * 4. Deploy with proper subscription IDs
 */