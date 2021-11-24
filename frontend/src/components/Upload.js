import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Web3 from 'web3';

import List from './List';
import MetaMask from './MetaMask';

// import { deploySmartContract } from '../scripts/deploy.js';
// import { methodSend } from '../scripts/send.js';
// import { ehr } from '../contracts/compiled/ehr.js';
// import { factory } from '../contracts/compiled/factory.js';

class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            uploadTicket: {
                ticketImage: "assets/ticket.png",

                // For POC, predefined values
                ticketNumber: "1", 
                ticketSupply: "50", 
                ticketType: "Adult",
                eventDate: "01/01/2021",
                artist: "Band 1",
            },
            listTicket: { id: 0, },
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

            // OnLoad
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

                listTicket: 0,
            })
        })
        const j = await r.json();
        this.setState({ msg: `Ticket Freezed on IPFS, Image cid: ${j.cidImage}, Metadata cid: ${j.cidMetaData}` }); 

        // Mint the ticket to Smart Contract
        // await methodSend(web3.web3, accountInfo.address, ticketContract, 'call', 'mintTicket', [ticketSupply, j.cidMetaData]);
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

    // handleListChange = (key, e) => {
    //     this.setState({ listTicket: { [key]: e.target.value } });
    // };

    render() {
        return (
            <div>
                Wallet: {this.state.inputAddr}
                <form>
                    <input type="text" name="ticketNumber" value={this.state.uploadTicket.ticketNumber} onChange={(e) => this.handleTicketChange("ticketNumber", e)} placeholder="ticketNumber"></input>
                    <input type="text" name="ticketImage" value={this.state.uploadTicket.ticketImage} onChange={(e) => this.handleTicketChange("ticketImage", e)} placeholder="ticketImage"></input>

                    {/* <input type="file" accept="image/png, image/jpeg" name="ticketImage" value={this.state.uploadTicket.ticketImage} onChange={(e) => this.handleChange("ticketImage", e)} placeholder="ticketImage"></input>
                    <input type="file" accept="application/JSON" name="ticketType" value={this.state.uploadTicket.ticketType} onChange={(e) => this.handleChange("ticketType", e)} placeholder="ticketType"></input> */}
                    <input type="text" name="ticketEventDate" value={this.state.uploadTicket.eventDate} onChange={(e) => this.handleTicketChange("eventDate", e)} placeholder="eventDate"></input>
                    <input type="text" name="ticketSupply" value={this.state.uploadTicket.ticketSupply} onChange={(e) => this.handleTicketChange("ticketSupply", e)} placeholder="Ticket Supply"></input>
                    <input type="text" name="ticketArtist" value={this.state.uploadTicket.artist} onChange={(e) => this.handleTicketChange("artist", e)} placeholder="artist"></input>

                    <button onClick={this.uploadTicket} type="button">Upload Image to IPFS</button>
                </form>

                {this.state.msg}
            </div>

        );
    }
}

export default Upload;
