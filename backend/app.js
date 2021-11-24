const process = require("process");
const minimist = require("minimist");
const w3s = require("web3.storage");
const fs = require("fs");
const util = require("util");

const express = require("express");
// NOTE: API KEY IS EXPOSE, WILL MOVE TO process.ENV
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU3ZGMxZjdGMDlDNjJGZTk4NkMzODkzRDMzMGIwOTVFMjA1ZTJlYTUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzY4OTAxOTU5NTMsIm5hbWUiOiJNZWRpQ2hhaW4ifQ.rJiWMj-t6wRHHd3nez5DB6VuNNbgYjGvbPM2tclv0lg";
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// writeFile = util.promisify(fs.writeFile);

const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
        .catch(next);
};
  
app.post("/upload", asyncMiddleware(async (req, res, next) => {
    console.log(req.body);
    const ticket = req.body.ticket;
    const metadata = req.body.metadata;
    const storage = new w3s.Web3Storage({ token });

    console.log('Uploading Ticket ...');
    const fileImage = await w3s.getFilesFromPath(ticket);
    const cidImage = await storage.put(fileImage);    // Upload Ticket Stub Image to IPFS
    
    // let md = { cid: cidImage, metadata: metadata };
    let dir = ticket.split('/');
    dir.pop()
    const metaDataDir =`${dir.join('/')}/metadata.json`;

    // await writeFile(metaDataDir, JSON.stringify(md, null, 4));
    console.log('Uploading Metadata ...');
    const fileMetaData = await w3s.getFilesFromPath(metaDataDir);
    const cidMetaData = await storage.put(fileMetaData);    // Store metadata on IPFS with link to ticket

    console.log(`${cidImage}. ${cidMetaData}`);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ cidImage: cidImage, cidMetaData: cidMetaData }));
}));

const PORT = process.env.PORT || 8080;
  
app.listen(PORT, console.log(`Server started on port ${PORT}`));