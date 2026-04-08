// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SubscriptionManager
 * @notice Manages Premium and Elite subscriptions on Sepolia testnet.
 *         Users pay ETH, contract tracks their plan and expiry on-chain.
 */
contract SubscriptionManager {

    address public owner;

    // Plan IDs
    uint8 public constant PLAN_PREMIUM = 1;
    uint8 public constant PLAN_ELITE   = 2;

    // Prices in ETH (set at deploy, updatable by owner)
    uint256 public premiumPriceWei;
    uint256 public elitePriceWei;

    // Subscription duration: 30 days
    uint256 public constant DURATION = 30 days;

    struct Subscription {
        uint8   plan;       // 1 = Premium, 2 = Elite
        uint256 expiry;     // Unix timestamp
    }

    mapping(address => Subscription) public subscriptions;

    // ── Events ────────────────────────────────────────────────────────────────
    event Subscribed(address indexed user, uint8 plan, uint256 expiry);
    event PriceUpdated(uint8 plan, uint256 newPriceWei);
    event Withdrawn(address indexed to, uint256 amount);

    // ── Modifiers ─────────────────────────────────────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // ── Constructor ───────────────────────────────────────────────────────────
    constructor(uint256 _premiumPriceWei, uint256 _elitePriceWei) {
        owner            = msg.sender;
        premiumPriceWei  = _premiumPriceWei;
        elitePriceWei    = _elitePriceWei;
    }

    // ── Subscribe ─────────────────────────────────────────────────────────────
    function subscribe(uint8 plan) external payable {
        require(plan == PLAN_PREMIUM || plan == PLAN_ELITE, "Invalid plan");

        uint256 required = plan == PLAN_PREMIUM ? premiumPriceWei : elitePriceWei;
        require(msg.value >= required, "Insufficient ETH");

        // If already subscribed and not expired, extend from current expiry
        uint256 start = block.timestamp;
        if (subscriptions[msg.sender].expiry > block.timestamp) {
            start = subscriptions[msg.sender].expiry;
        }

        subscriptions[msg.sender] = Subscription({
            plan:   plan,
            expiry: start + DURATION
        });

        // Refund excess ETH
        if (msg.value > required) {
            payable(msg.sender).transfer(msg.value - required);
        }

        emit Subscribed(msg.sender, plan, subscriptions[msg.sender].expiry);
    }

    // ── Read subscription ─────────────────────────────────────────────────────
    function getSubscription(address user)
        external view
        returns (uint8 plan, uint256 expiry, bool active)
    {
        Subscription memory s = subscriptions[user];
        return (s.plan, s.expiry, s.expiry > block.timestamp);
    }

    function isActive(address user) external view returns (bool) {
        return subscriptions[user].expiry > block.timestamp;
    }

    // ── Owner functions ───────────────────────────────────────────────────────
    function updatePrice(uint8 plan, uint256 newPriceWei) external onlyOwner {
        require(plan == PLAN_PREMIUM || plan == PLAN_ELITE, "Invalid plan");
        if (plan == PLAN_PREMIUM) premiumPriceWei = newPriceWei;
        else elitePriceWei = newPriceWei;
        emit PriceUpdated(plan, newPriceWei);
    }

    function withdraw() external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "Nothing to withdraw");
        payable(owner).transfer(bal);
        emit Withdrawn(owner, bal);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }

    receive() external payable {}
}
