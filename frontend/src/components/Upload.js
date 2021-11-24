import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Web3 from 'web3';

import MetaMask from './MetaMask';
import { methodSend } from '../utils/send';
import eventShopAddr from '../contracts/address';
import eventShopABI from '../contracts/abi';

class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            uploadTicket: {
                ticketImage: "assets/b/ticket.png",

                // For POC, predefined values
                ticketNumber: "2", 
                ticketSupply: "25000", 
                ticketType: "Adult",
                eventDate: "01/01/2021",
                artist: "Led Zeppelin",
            },
            nftId: 1,
            ticketCid: {},
            msg: "",
        
            isLoggedIn: false,
            accountInfo: null,

            web3: null,
            factoryContract: { addr: "", contract: null },

            inputAddr: "",

        };

    }
    
    connectToWeb3 = () => {
        console.log(`Connecting to MetaMask ...`);

        if (window.ethereum) {
            try {
                window.web3 = new Web3(window.ethereum);
                window.ethereum.enable();
                this.setState({ web3: window.web3 });
            } catch (e) {
                console.error(e);
            }

            (this.state.web3 && <Navigate path="/" element={<MetaMask />} />); 
            this.importUserAccount();    // Load in User
        }
    }

    importUserAccount = async () => {
        console.log(`Loading MetaMask Acc ...`);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.setState({ isLoggedIn: true });
            this.setState({ accountInfo: { address: accounts[0] } });
            this.setState({ inputAddr: accounts[0] });
        } catch {
            this.setState({ isLoggedIn: false });
        }
    }

    componentDidMount() {
        this.connectToWeb3();
        (!this.state.isLoggedIn && <Navigate path="/" element={<MetaMask />} />); 
        // this.setState({ ticketContract: new this.state.web3.web3.eth.Contract(eventShopABI, eventShopAddr, {}) });
    }

    uploadTicket = async () => {    
        // Simple validation check
        for (var prop in this.state.uploadTicket) {
            if(this.state.uploadTicket[prop] === "") { 
                this.setState({ msg: "fill in inputs" }); 
                return; 
            }
        }

        this.setState({ msg: "Uploading to Web3.storage ..." }); 
        const r = await fetch('../../upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ticket: this.state.uploadTicket.ticketImage,    // stub image URL
                metadata: {     // Clean format for upload to IPFS
                    ticketNumber: this.state.uploadTicket.ticketNumber,
                    ticketType: this.state.uploadTicket.ticketType,
                    eventDate: this.state.uploadTicket.eventDate,
                    ticketSupply: this.state.uploadTicket.ticketSupply,
                    artist: this.state.uploadTicket.artist,
                },
            })
        })
        const j = await r.json();
        this.setState({ msg: "Ticket stored on IPFS/Filecoin!" }); 
        this.setState({ cidImage: j.cidImage }); 
        this.setState({ cidMetadata: j.cidMetaData }); 

        // Mint the ticket to Smart Contract
        this.setState({ nftId: 1 });
        // this.setState({ nftId: methodSend(this.state.web3, this.state.account, this.state.ticketContract, "send", mintTicket, [this.state.uploadTicket.ticketSupply, this.state.cidMetadata] });
    }

    handleTicketChange = (key, e) => {
        if (e.target.type === 'text') {
            this.setState({ uploadTicket: { [key]: e.target.value } });
        } else {
            // Should be for file upload, but not sure how to do.
            // const files = e.target.files;
            // console.log(document.getElementById("file-id").files[0].name)
            // this.setState({ uploadTicket: { [key]: formData } });
            this.setState({ uploadTicket: { [key]: e.target.value } });
        }
    };

    render() {
        return (
            <div>
                Wallet: {this.state.inputAddr}
                <form>
                    {/* <label for="">Total Supply</label> */}
                    {/* <input type="text" className="form-control my-2" name="ticketNumber" value={this.state.uploadTicket.ticketNumber} onChange={(e) => this.handleTicketChange("ticketNumber", e)} placeholder="ticketNumber"></input> */}
                    <label for="">Ticket Image</label>
                    <input type="text" className="form-control my-2" name="ticketImage" value={this.state.uploadTicket.ticketImage} onChange={(e) => this.handleTicketChange("ticketImage", e)} placeholder="ticketImage"></input>

                    {/* <input type="file" accept="image/png, image/jpeg" name="ticketImage" value={this.state.uploadTicket.ticketImage} onChange={(e) => this.handleChange("ticketImage", e)} placeholder="ticketImage"></input>
                    <input type="file" accept="application/JSON" name="ticketType" value={this.state.uploadTicket.ticketType} onChange={(e) => this.handleChange("ticketType", e)} placeholder="ticketType"></input> */}
                    <label for="">Event Date</label>
                    <input type="text" className="form-control my-2" name="ticketEventDate" value={this.state.uploadTicket.eventDate} onChange={(e) => this.handleTicketChange("eventDate", e)} placeholder="eventDate"></input>
                    
                    <label for="">Total Supply</label>
                    <input type="text" className="form-control my-2" name="ticketSupply" value={this.state.uploadTicket.ticketSupply} onChange={(e) => this.handleTicketChange("ticketSupply", e)} placeholder="Ticket Supply"></input>
                    
                    <label for="">Band / Artist</label>
                    <input type="text" className="form-control my-2" name="ticketArtist" value={this.state.uploadTicket.artist} onChange={(e) => this.handleTicketChange("artist", e)} placeholder="artist"></input>

                    <button onClick={this.uploadTicket} className="btn btn-primary" type="button">Upload Image to IPFS</button>
                </form>

                {this.state.msg}
                {this.state.msg === "Ticket stored on IPFS/Filecoin!" &&
                <div>
                    <a href={"list/adsad/" + this.state.nftId} class="btn btn-primary m-2" target="_self">View NFT Ticket</a>
                    <a href={"https://" + this.state.cidImage + ".ipfs.dweb.link/ticket.png"} class="btn btn-primary m-2" target="_blank">View Ticket on IPFS</a>
                    <a href={"https://" + this.state.cidMetadata + ".ipfs.dweb.link/metadata.json"} class="btn btn-primary m-2" target="_blank">View Metadata on IPFS</a>
                </div>}
            </div>

        );
    }
}

export default Upload;
