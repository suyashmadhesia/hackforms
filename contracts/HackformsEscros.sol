// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/utils/math/SafeMath.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";

contract HackformsEscrow {

    struct HackformsDeal {
        string formId;
        uint256 balance;
        address owner;
        bool doesExists;
    }

    struct WalletDetails {
        uint256 totalBalance;
        address owner;
        uint totalDeals;
        bool doesExists;
    }

    event HackformsDealCreated(address indexed _from, string indexed formId, uint256 timestamp);
    event Deposit(address indexed _from, string indexed formId, uint256 amount, uint256 timestamp);
    event PaymentDisbursed(address indexed to, string indexed formId, uint256 amount, uint256 timestamp);


    mapping(string => HackformsDeal) private _deals;
    mapping(address => WalletDetails) private _details;


    function fundDeal(string memory formId) payable external returns (bool) {
        return _deposit(formId);
    }

    function _deposit(string memory formId) internal returns (bool) {

        // Deposited amount must be updated in HackformsDeal and WalletDetails
        // WalletDetails will also be created with 0 balance 
        if (_details[msg.sender].doesExists != true) {
            _details[msg.sender] = WalletDetails(
                0,
                msg.sender,
                0,
                true                
            );
        }
        // HackformsDeal will be created with 0 balance if it doesn't exists
        if (_deals[formId].doesExists != true) {
            _deals[formId] = HackformsDeal(
                formId,
                0,
                msg.sender,
                true
            );
            // Update number of deals and deals array in wallet details
            _details[msg.sender].totalDeals += 1;
            emit HackformsDealCreated(msg.sender, formId, block.timestamp);
        }

        if (_deals[formId].owner == msg.sender) {
            _deals[formId].balance += msg.value;
            _details[msg.sender].totalBalance += msg.value;

            emit Deposit(msg.sender, formId, msg.value, block.timestamp);
            return true;
        }

        require(false, "Unauthorized attempt to manipulate the deal");
        return false;
    }



    function balance() external view returns(uint256) {
        return _details[msg.sender].totalBalance;
    }

    function balanceOfDeal(string memory formId) external view returns(uint256) {
        require(_deals[formId].doesExists, "Deal does not exists");
        return _deals[formId].balance;
    }

    function hasEnoughBalance(string memory formId, uint256 amount) external view returns (bool) {
        return _deals[formId].balance > amount;
    }


    function _pay(address to, uint256 amount) internal returns (bool) {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success, "Payment failed");
        return true;
    }


    function disburseFund(string memory formId, uint256 rate, address[] memory recps) payable external returns (bool) {
        require(_deals[formId].doesExists, "Deal does not exists");
        require(_deals[formId].owner == msg.sender, "Unauthorized attempt to disburse payment");
        
        uint256 recpsCount = recps.length;
        uint256 amount = recpsCount * rate;
        require(_deals[formId].balance > amount, "Insufficient balance in the deal");
        for(uint index = 0; index < recpsCount; index++) {
            _disburse(recps[index], formId, rate);
        }
        return true;
    }

    

    function _disburse(address to, string memory formId, uint256 amount) internal returns (bool) {
        require(_deals[formId].balance > amount, "Insufficient balance in the deal");
        require(_deals[formId].owner != to, "Withdrawl of amount is not allowd");
        _deals[formId].balance -= amount;
        _details[msg.sender].totalBalance -= amount;
        _pay(to, amount);
        emit PaymentDisbursed(to, formId, amount, block.timestamp);
        return true;

    }


}