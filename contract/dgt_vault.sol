// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function balanceOf(address owner) external view returns (uint256);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
    function adminTransferFrom(address from, address to, uint tokens) external returns(bool success);
}

contract DGTVault is Ownable{
    struct Vault {
        address manager;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] investors;
        uint256[] amount;
    }

    struct Investment{
        uint256 id;
        address investor;
        uint256 amount;
        uint256 block_number;
        uint256 timestamp;
    }

    mapping(uint256 => Vault) public vaults;
    mapping(address => uint256) public profit;
    mapping(address => Investment[]) public listInvests;

    uint256 public numberOfVaults = 0;
    IERC20 public dgtToken = IERC20(0xDdf9B62DbfbDd5D473bB89295843915D7F21cFed);

    constructor(address _dgtToken){
        dgtToken = IERC20(_dgtToken);
    }

    function setDGTToken(address _dgtToken) external onlyOwner{
        dgtToken = IERC20(_dgtToken);
    }

    function createVault(address _manager, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Vault storage vault = vaults[numberOfVaults];

        require(vault.deadline < block.timestamp, "The deadline should be a date in the future.");

        vault.manager = _manager;
        vault.title = _title;
        vault.description = _description;
        vault.target = _target;
        vault.deadline = _deadline;
        vault.amountCollected = 0;
        vault.image = _image;

        numberOfVaults++;

        return numberOfVaults - 1;
    }

    function invest(uint256 _id, uint256 amount) public payable {
        Vault storage vault = vaults[_id];

        vault.investors.push(msg.sender);
        vault.amount.push(amount);

        dgtToken.adminTransferFrom(msg.sender, address(this), amount);

        vault.amountCollected = vault.amountCollected + amount;

        //tracking investment 
        Investment memory investment = Investment(_id, msg.sender, amount, block.number, block.timestamp);
        listInvests[msg.sender].push(investment);
    }

    function getListInvestments(address _manager) public view returns(Investment[] memory){
        return listInvests[_manager];
    }

    function withdraw(uint256 _amount, address _investor) public payable{
        profit[_investor] = _amount;

        dgtToken.adminTransferFrom(address(this), _investor, _amount);
    }

    function getProfit(address _investor) public view returns(uint256){
        return profit[_investor];
    }

    function getInvestors(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (vaults[_id].investors, vaults[_id].amount);
    }

    function getVaults() public view returns (Vault[] memory) {
        Vault[] memory allVaults = new Vault[](numberOfVaults);

        for(uint i = 0; i < numberOfVaults; i++) {
            Vault storage item = vaults[i];

            allVaults[i] = item;
        }

        return allVaults;
    }
}