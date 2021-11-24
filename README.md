## Description
React frontend, that is connected to Express Node server. This allows for connection of Web3.storage. To use the implementation 
of smart contracts, you will need,
- MetaMask Extension
- Connection to Rinkeby Testnet
You an access the NFT here: https://testnets.opensea.io/collection/unidentified-contract-xm6fkrhcik
ERC1155 smart contract: https://rinkeby.etherscan.io/address/0x04BA9bAd8Ca4B3fF2eeF9dbc30C5A12328dF3Dc2
Proof of web3.storage tickets on IPFS: https://bafybeieaf5ckfa35ydx56lr6ixbnmfbzbll6azg4dp6jh4yjzgxwcqiiva.ipfs.dweb.link/metadata.json 

## Technologies Used
- React Framework for frontend
- Web3.storage as IPFS/Filecoin storage of tickets

## Endpoints 
http://localhost:3000/ (connect to metamask)

http://localhost:3000/upload (upload ticket image + metadata to web3.storage and mint on smart contract)
For the `Ticket Image` input in `/upload`, you can statily select one of the filepaths
- assets/1/ticket.png
- assets/a/ticket.png
- assets/b/ticket.png
- assets/c/ticket.png

![](https://github.com/z5208980/stubr/blob/main/assets/readme/_uploadTicket.png)
Image 1.1 Form filled to store using Web3.storage Ticket + Metadata

![](https://github.com/z5208980/stubr/blob/main/assets/readme/_uploadTicketSuccess.png)
Image 1.2 Successful form submission, where you can view NFT on application (Image 1.3), Ticket on IPFS, Metadata on IPFS

http://localhost:3000/list/contract/ticketID (shows ticket information of the ticketId, listing and buy request)

![](https://github.com/z5208980/stubr/blob/main/assets/readme/_listTicket.png)
Image 1.3 View Nft on Application, where owner can list ticket for sale

## Run locally (localhost)

1. Clone repo
```sh
git clone git@github.com:z5208980/stubr.git
cd stubr
```

2. On one terminal, setup express node (this is to connect to Web3.storage)
```sh
npm install     # If first time use
node run dev    # runs express server
```

3. In another terminal, To run frontend react app, (this is to connet to Web3)
```sh
cd frontend
npm install     # If first time use
npm start       # should start on port 3000
```

