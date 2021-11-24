// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/math/SafeMath.sol";

contract TicketNFT is ERC1155 {
    
    enum TicketState { NOTLISTED, LISTED }

    uint256 public idCounter;
    address private contractOwner;
    uint256 public commission = 25;

    struct TicketStub {
        // Ticket ticket; // cid of metadata
        uint256 supply; // buyers supply
        uint256 price; // buyer's listed price
        bool used;
    }
    
    struct Ticket {
        // Other Attrs
        string metadata;     // cid of metadata
        uint256 price;
        uint256 supply;     // TotalSupply of tickets
        address payable owner;  // For commission to be paid too
        mapping(address => TicketStub) owners;
        uint256 eventDate;  // Determine if we can release price cap.
    }

    // tokenId => (owner => ticket)
    mapping(uint256 => Ticket) public tickets;     // Store information about General information about Tickets
    mapping(address => bool) private approvedOrganisers;  

    // URL base of https://:cid.ipfs.dweb.link/:metadata.png
    constructor() ERC1155("https://") { 
        contractOwner = msg.sender;
    }
    
    function mintTicket(
        uint256 ticketSupply,
        uint256 price,
        uint256 eventDate,
        string memory metadata
    ) onlyApproved public returns (uint256) {
        idCounter = idCounter + 1;

        bytes memory md = bytes(metadata);

        Ticket storage ticketInstances = tickets[idCounter];
        ticketInstances.metadata = metadata;
        ticketInstances.supply = ticketSupply;
        ticketInstances.price = price;
        ticketInstances.owner = payable(msg.sender);
        ticketInstances.eventDate = eventDate;

        TicketStub storage stubInstance = tickets[idCounter].owners[msg.sender];
        stubInstance.supply = ticketSupply;
        stubInstance.price = price;
        stubInstance.used = false;

        _mint(msg.sender, idCounter, ticketSupply, md);  
        return idCounter;      
    }
    
    function transferTicket(
        address to,  // buyer
        uint256 id,
        uint256 amount
    ) public payable  {
        require(amount > 0, "Cannot have amount 0");
        require(balanceOf(msg.sender, id) >= amount, "Insufficient balance");
        require(tickets[id].owners[msg.sender].supply >= amount, "Insufficient amount");
        require(to.balance >= tickets[id].owners[to].price * amount, "Insufficient balance");
        
        tickets[id].owners[msg.sender].supply = tickets[id].owners[msg.sender].supply - amount; // deduct amount
        if(tickets[idCounter].owners[to].supply != 0) {
            tickets[idCounter].owners[to].supply = tickets[idCounter].owners[to].supply + amount;   // increment Amount
        } else {
            TicketStub storage stubInstance = tickets[idCounter].owners[to];
            stubInstance.supply = amount;   // given amount
            stubInstance.price = 0;         // not for sale   
        }

        _safeTransferFrom(msg.sender, to, id, amount, "");
    }

    function listTicket(uint256 listingPrice, uint256 id) public returns (bool) {
        if(tickets[id].eventDate < block.timestamp) {   // Concert is over
            tickets[id].owners[msg.sender].price = listingPrice;
        } else {
            tickets[id].owners[msg.sender].price = tickets[id].price;
        }
        return true;
    }
    
    // Metadata for ticket
    function getMetadata(uint256 id) public view returns (string memory) {
        return tickets[id].metadata;
    }

    // function getTicket(uint256 id) public view returns (uint256 price, string _message) {
    //     return tickets[id].price;
    // }

    /* For managing who can mint */
    // function whitelistOrganiser(address org) public onlyOwner returns (bool) {
    function whitelistOrganiser(address org) public returns (bool) {
        approvedOrganisers[org] = true;
        return true;
    }

    function blacklistOrganiser() public onlyOwner returns (bool) {
        approvedOrganisers[msg.sender] = false;
        return false;
    }
    
    modifier onlyApproved() {
        require(approvedOrganisers[msg.sender] == true, "Only agent can call this method");
        _;
    }

    /* Confirm Contract owner of ERC1155 */
    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Only contractOwner can call this method");
        _;
    }
}