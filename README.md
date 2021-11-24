## Description
React frontend, that is connected to Express Node server. This allows for connection of Web3.storage. To use the implementation 
of smart contracts, you will need,
- MetaMask Extension
- Connection to Rinkeby Testnet

## Technologies Used
- React Framework for frontend
- Web3.storage as IPFS/Filecoin storage of tickets

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

## Endpoints 
http://localhost:3000/ (connect to metamask)

http://localhost:3000/upload (upload ticket image + metadata to web3.storage and mint on smart contract)
For the `Ticket Image` input in `/upload`, you can statily select one of the filepaths
- assets/1/ticket.png
- assets/a/ticket.png
- assets/b/ticket.png
- assets/c/ticket.png

http://localhost:3000/list/contract/ticketID (shows ticket information of the ticketId, listing and buy request)