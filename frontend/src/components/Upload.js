import React from 'react';
import { Navigate} from "react-router-dom";
import Web3 from 'web3';

import MetaMask from './MetaMask';
import { methodSend } from '../utils/send';
import { eventShopAddr } from '../contracts/address';
import { eventShopABI } from '../contracts/abi';

let web3;
let ticketContract;
let accounts;
let accountInfo
let ethAddr;
async function onload() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        ticketContract = new web3.eth.Contract(eventShopABI, eventShopAddr, {});
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        accountInfo = { address: accounts[0] };
        ethAddr = accounts[0];
    }
}

onload();   // Load Web3 and contract

class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            ticketImage: "assets/b/ticket.png",
            // For POC, predefined values
            ticketNumber: "2", 
            ticketSupply: "25000", 
            ticketType: "Adult",
            eventDate: "01/01/2021",
            artist: "Artist",

            nftId: 1,
            ticketCid: {},
            msg: "",
        
            isLoggedIn: false,
            ethAddr: "",


            web3: null,
            factoryContract: { addr: "", contract: null },
        };

    }
    
    connectToWeb3 = () => {
        console.log(`Connecting to MetaMask ...`);

        if (web3 === null) {
            <Navigate path="/" element={<MetaMask />} />
        }
    }

    importUserAccount = async () => {
        console.log(`Loading MetaMask Acc ...`);
        if (accountInfo !== null) {
            this.setState({ isLoggedIn: true });
            // this.setState({ ethAddr: ethAddr });
        }
    }

    componentDidMount() {
        this.connectToWeb3();
        console.log(this.state.eventDate);

    }

    uploadTicket = async () => {    
        let tmp = this.state.eventDate.split('/');
        let epoch = Number(new Date(tmp[2], tmp[1], tmp[0]))/1000;

        this.setState({ msg: "Uploading to Web3.storage ..." }); 
        const r = await fetch('../../upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ticket: this.state.ticketImage,    // stub image URL
                metadata: {     // Clean format for upload to IPFS
                    ticketNumber: this.state.ticketNumber,
                    ticketType: this.state.ticketType,
                    eventDate: epoch,
                    ticketSupply: this.state.ticketSupply,
                    artist: this.state.artist,
                },
            })
        })
        const j = await r.json();

        // Mint the ticket to Smart Contract
        this.setState({ msg: "Minting to Blockchain ..." }); 

        console.log([this.state.ticketSupply, 50, epoch, j.cidMetaData]);
        let nftId = await methodSend(web3, accountInfo, ticketContract, 'send', 'mintTicket', [this.state.ticketSupply, 50, epoch, j.cidMetaData]);
        nftId = await methodSend(web3, accountInfo, ticketContract, 'call', 'mintTicket', [this.state.ticketSupply, 50, epoch, j.cidMetaData]);
        // console.log(nftId-1);
        this.setState({ nftId: nftId-1 });
        // this.setState({ nftId: 1 });
        // this.setState({ nftId: await methodSend(web3, this.state.accountInfo, ticketContract, "send", "mintTicket", [this.state.ticketSupply, 50, epoch, this.state.cidMetadata]) });
       
        this.setState({ msg: `Ticket stored on IPFS/Filecoin!`}); 
        this.setState({ cidImage: j.cidImage }); 
        this.setState({ cidMetadata: j.cidMetaData }); 
    }

    handleTicketChange = (key, e) => {
        if (e.target.type === 'text') {
            this.setState({ [key]: e.target.value });
        } else {
            // Should be for file upload, but not sure how to do.
            // const files = e.target.files;
            // console.log(document.getElementById("file-id").files[0].name)
            // this.setState({ uploadTicket: { [key]: formData } });
            this.setState({ [key]: e.target.value });
        }
        console.log(this.state);

    };

    whiteList = async () => {
        this.setState({ msg: `Whitelisting ${ethAddr}` })
        await methodSend(web3, accountInfo, ticketContract, "send", "whitelistOrganiser", [ethAddr]);
    }

    render() {
        return (
            <div>
                Wallet: {ethAddr}

                <div>
                    <h3>You need to Whitelist to mint tickets</h3>
                    <small>For sake of demo, anyone can be whitelisted</small>
                    <button onClick={this.whiteList} className="btn btn-primary m-2" type="button">Whitelist</button>
                </div>
                <form>
                    <small>For sake of demo, choose from defined assets</small> <br/>

                    <div>
                        <label className="mx-2">Ticket Image</label>
                        <select name="ticketImage" value={this.state.eventDate} onChange={(e) => this.handleTicketChange("ticketImage", e)}>
                            <option value="assets/1/ticket.png">The Beatles</option>
                            <option value="assets/a/ticket.png">The Wiggles</option>
                            <option value="assets/b/ticket.png">Led Zeppelin</option>
                            <option value="assets/c/ticket.png">AC/DC</option>
                        </select>
                    </div>
                    {/* <input type="text" className="form-control my-2" name="ticketImage" value={this.state.ticketImage} onChange={(e) => this.handleTicketChange("ticketImage", e)} placeholder="ticketImage"></input> */}
                    <label>Event Date</label>
                    <input type="text" className="form-control my-2" name="ticketEventDate" value={this.state.eventDate} onChange={(e) => this.handleTicketChange("eventDate", e)} placeholder="eventDate"></input>
                    
                    <label>Total Supply</label>
                    <input type="number" className="form-control my-2" name="ticketSupply" value={this.state.ticketSupply} onChange={(e) => this.handleTicketChange("ticketSupply", e)} placeholder="Ticket Supply"></input>
                    
                    <label>Band / Artist</label>
                    <input type="text" className="form-control my-2" name="ticketArtist" value={this.state.artist} onChange={(e) => this.handleTicketChange("artist", e)} placeholder="artist"></input>

                    {/* <input type="file" accept="image/png, image/jpeg" name="ticketImage" value={this.state.ticketImage} onChange={(e) => this.handleChange("ticketImage", e)} placeholder="ticketImage"></input>
                    <input type="file" accept="application/JSON" name="ticketType" value={this.state.ticketType} onChange={(e) => this.handleChange("ticketType", e)} placeholder="ticketType"></input> */}
                    <button onClick={this.uploadTicket} className="btn btn-primary" type="button">Upload Image to IPFS</button>
                </form>

                {this.state.msg}
                {this.state.msg === "Ticket stored on IPFS/Filecoin!" &&
                <div>
                    <div>Id: {this.state.nftId}</div>
                    <a href={"list/" + eventShopAddr + "/" + this.state.nftId} class="btn btn-primary m-2" target="_self">View NFT Ticket</a>
                    <a href={"https://" + this.state.cidImage + ".ipfs.dweb.link/ticket.png"} class="btn btn-primary m-2" target="_blank" rel="noreferrer">View Ticket on IPFS</a>
                    <a href={"https://" + this.state.cidMetadata + ".ipfs.dweb.link/metadata.json"} class="btn btn-primary m-2" target="_blank" rel="noreferrer">View Metadata on IPFS</a>
                </div>}
            </div>

        );
    }
}

export default Upload;
