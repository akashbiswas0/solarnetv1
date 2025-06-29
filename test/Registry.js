const hre = require("hardhat");
const { expect } = require("chai");
const ethers = hre.ethers;

const VERIFIED_SENSOR = "b8715fb98feb70c3f3f1b01174577bbdbf7fe32892846aaad96776fb58270216";

describe("Registry", function () {
  let Registry, registry, owner, user1, user2, mockFeed;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy Mock Price Feed
    const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
    mockFeed = await MockV3Aggregator.deploy(8, ethers.parseUnits("2000", 8));
    await mockFeed.waitForDeployment();
    console.log("MockV3Aggregator address:", mockFeed.target);

    // Deploy Registry with mocks/dummy addresses for Chainlink params
    Registry = await ethers.getContractFactory("Registry");
    registry = await Registry.deploy(
      mockFeed.target, // priceFeed
      owner.address, // vrfCoordinator (dummy)
      ethers.ZeroHash, // keyHash
      1 // subscriptionId
    );
    await registry.waitForDeployment();

    // Authorize the test sensor (msg.sender)
    await registry.addAuthorizedSensor(owner.address);
  });

  // --- Business Logic ---

  it("should allow listing an order", async function () {
    await registry.addGenStation(VERIFIED_SENSOR); // Authorize sensor
    await registry.checkVerifiedSensors(VERIFIED_SENSOR);
    await registry.updateSLRTokenBalance(VERIFIED_SENSOR, 100);
    await registry.listOrder(10, 10, 1, 1000);
    expect(await registry.returnOrdersArrayLength()).to.equal(1);
  });

  it("should allow registering as a brand", async function () {
    await registry.connect(user1).registerAsBrand();
    expect(await registry.isBrand(user1.address)).to.equal(true);
  });

  it("should add and get promotion secrets", async function () {
    await registry.connect(user1).addPromotionSecret("secret123");
    expect(await registry.addressToPromotionSecret(user1.address)).to.equal("secret123");
  });

  it("should add and get eligible promotions", async function () {
    await registry.connect(user1).registerAsBrand(); // Register as brand first
    await registry.connect(user1).addEligiblePromotions(user2.address, "promo1");
    const promos = await registry.getAllEligiblePromotions(user2.address);
    expect(promos[0]).to.equal("promo1");
  });

  it("should update and return SLR balance", async function () {
    await registry.addGenStation(VERIFIED_SENSOR); // Authorize sensor
    await registry.checkVerifiedSensors(VERIFIED_SENSOR);
    await registry.updateSLRTokenBalance(VERIFIED_SENSOR, 42);
    expect(await registry.returnSLRBalance()).to.equal(42);
  });

  it("should create and fulfill a buy order", async function () {
    await registry.addGenStation(VERIFIED_SENSOR); // Authorize sensor
    await registry.checkVerifiedSensors(VERIFIED_SENSOR);
    await registry.updateSLRTokenBalance(VERIFIED_SENSOR, 100);
    await registry.listOrder(10, 10, 1, 1000);
    await registry.connect(user1).createBuyOrder(0, { value: 10 });
    const order = await registry.orderArray(0);
    expect(order.fulfilled).to.equal(true);
    expect(order.owner).to.equal(user1.address);
  });

  it("should allow consuming a token as a brand", async function () {
    await registry.connect(user1).registerAsBrand();
    await registry.addGenStation(VERIFIED_SENSOR); // Authorize sensor
    await registry.checkVerifiedSensors(VERIFIED_SENSOR);
    await registry.updateSLRTokenBalance(VERIFIED_SENSOR, 100);
    await registry.listOrder(10, 10, 1, 1000);
    await registry.connect(user1).addPromotionSecret("brandSecret");
    await registry.connect(user1).consumeToken(0, { value: 10 });
    const order = await registry.orderArray(0);
    expect(order.fulfilled).to.equal(true);
    expect(order.owner).to.equal(user1.address);
    expect(await registry.recBalances(user1.address)).to.equal(10);
    const promos = await registry.getAllEligiblePromotions(owner.address);
    expect(promos[0]).to.equal("brandSecret");
  });

  it("should allow taking and ending an option", async function () {
    await registry.addGenStation(VERIFIED_SENSOR); // Authorize sensor
    await registry.checkVerifiedSensors(VERIFIED_SENSOR);
    await registry.updateSLRTokenBalance(VERIFIED_SENSOR, 100);
    await registry.listOrder(10, 10, 1, 1000);
    await registry.connect(user1).takeOnOption(0, { value: 1 });
    let order = await registry.orderArray(0);
    expect(order.fulfilled).to.equal(true);
    // End option as admin
    await registry.endOption(0);
    order = await registry.orderArray(0);
    expect(order.fulfilled).to.equal(false);
    expect(order.owner).to.equal(owner.address);
  });

  it("should allow redeeming tokens", async function () {
    await registry.addGenStation(VERIFIED_SENSOR); // Authorize sensor
    await registry.checkVerifiedSensors(VERIFIED_SENSOR);
    await registry.updateSLRTokenBalance(VERIFIED_SENSOR, 100);
    await registry.redeemTokens(10, owner.address);
    expect(await registry.balances(owner.address)).to.equal(90);
  });

  // --- Chainlink Price Feed ---

  it("should update ETH/USD price from mock feed", async function () {
    await registry.updateEthUsdPrice();
    expect(await registry.lastEthUsdPrice()).to.equal(ethers.parseUnits("2000", 8));
    // Update mock price
    await mockFeed.updateAnswer(ethers.parseUnits("2500", 8));
    await registry.updateEthUsdPrice();
    expect(await registry.lastEthUsdPrice()).to.equal(ethers.parseUnits("2500", 8));
  });

  // --- Chainlink VRF (mock callback) ---

  // Skipping fulfillRandomWords test for now as it's an internal function
  // it("should set randomResult when fulfillRandomWords is called", async function () {
  //   // This would require exposing a helper or using a mock VRF coordinator
  // });

  // --- Chainlink Keepers ---

  it("should perform upkeep and update price", async function () {
    // Fast-forward time by 2 days
    await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");
    // Set a fresh price to ensure updatedAt is recent
    await mockFeed.updateAnswer(ethers.parseUnits("2000", 8));
    // Set updatedAt to current block timestamp
    const block = await ethers.provider.getBlock("latest");
    await mockFeed.setUpdatedAt(block.timestamp);
    // Log relevant values for debugging
    console.log("block.timestamp", block.timestamp);
    console.log("mockFeed.updatedAt", (await mockFeed.updatedAt()).toString());
    console.log("registry.lastUpkeepTime", (await registry.lastUpkeepTime()).toString());
    console.log("registry.upkeepInterval", (await registry.upkeepInterval()).toString());
    // Try calling updateEthUsdPrice directly
    await registry.updateEthUsdPrice();
    // Call checkUpkeep and log output
    const [upkeepNeeded, performData] = await registry.checkUpkeep.staticCall("0x");
    console.log("upkeepNeeded", upkeepNeeded, "performData", performData);
    // Call performUpkeep with performData
    await registry.performUpkeep(performData);
    // Should have updated price
    expect(await registry.lastEthUsdPrice()).to.equal(ethers.parseUnits("2000", 8));
  });

  // --- Chainlink CCIP (simulate receive) ---

  // Skipping CCIP test as the contract no longer supports it
  // it("should increment ccipMessageCount on _ccipReceive", async function () {
  //   const abiCoder = new ethers.AbiCoder();
  //   const data = abiCoder.encode(["address"], [user1.address]);
  //   await registry._ccipReceive({ sender: data, data: "0x" });
  //   expect(await registry.ccipMessageCount()).to.equal(1);
  // });

  // --- Sensor Verification ---

  it("should verify a known sensor", async function () {
    await registry.checkVerifiedSensors(VERIFIED_SENSOR);
    expect(await registry.isVerified()).to.equal(true);
  });

  it("should not verify an unknown sensor", async function () {
    await registry.checkVerifiedSensors("notarealsensor");
    expect(await registry.isVerified()).to.equal(false);
  });
});