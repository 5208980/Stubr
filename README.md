## Requirements
- MetaMask Extension

### Run locally (localhost)

1. Clone repo
```
git clone git@github.com:z5208980/stubr.git
cd stubr
```

2. Setup express node (on one terminal) (this is to connect to Web3.storage)
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

Accessible URLs 
- localhost/:PORT/upload
- localhost/:PORT/list/contract/ticketID
