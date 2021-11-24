import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from "react-router-dom";
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

// onload();   // Load Web3 and contract

function List() {
    let { contract, id } = useParams();
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [ticketOwner, setTicketOwner] = useState(0);
    const [listingPrice, setListingPrice] = useState(0);
    const [transferAmount, setTransferAmount] = useState(0);
    const [tansferWallet, setTransferWallet] = useState('0x');
    const [nftImage, setNFTImage] = useState('');
    const [nftMetadata, setNFTMetadata] = useState({});
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(async () => {
        await onload();
        (!isLoggedIn && <Navigate path="/" element={<MetaMask />} />); 

        // This will determine if user can list ticket
        console.log(accountInfo);
        setTicketOwner(await methodSend(web3, accountInfo, ticketContract, 'call', 'balanceOf', [ethAddr, id]));  // Should return true/false from contract
        let cid = await methodSend(web3, accountInfo, ticketContract, 'call', 'getMetadata', [id]);
        console.log(cid);

        const uri = `https://${cid}.ipfs.dweb.link/metadata.json`;
        const r = await fetch(uri, { method: 'GET' });
        const j = await r.json();
        setNFTImage(j.image);
        setNFTMetadata(j.metadata);

        setListingPrice(1);

        console.log(nftImage);
    }, [contract, id, isLoggedIn, nftImage]);

    async function listTicket() {
        setMsg('Listing Tickets ...');
        await methodSend(web3, accountInfo, ticketContract, 'send', 'listTicket', [listingPrice, id]);
        setMsg('Listing Complete ...');
    }

    async function buyTicket() {
        setMsg('Buy feature not implemented yet!');
        // await methodSend(web3.web3, accountInfo.address, ticketContract, 'call', 'buyTicket', [id]);
    }

    async function transferTicket() {
        setMsg('Transfering Tickets ...');
        await methodSend(web3, accountInfo, ticketContract, 'send', 'transferTicket', [tansferWallet, id, transferAmount]);
        setMsg('Transfer Complete!');
    }

    function showInformation() {
        setShow(!show);
    }

    function handleTicketListing(e) { setListingPrice(e.target.value); }
    function handleTicketTransfer(e) { setTransferAmount(e.target.value); }
    function handleTicketTransferWallet(e) { setTransferWallet(e.target.value); }

    function loadAppropiateHTML() {
        if(ticketOwner > 0) {
            return (
                <div className="form-group">
                    <div>
                        <h3>List Tickets</h3>
                        <label>Listing Price</label>
                        <input type="text" className="form-control" name="listingPrice" value={listingPrice} onChange={(e) => handleTicketListing(e)} placeholder="Place price for ticket (IN FIL)"/>
                        <button onClick={listTicket} className="btn btn-primary m-2">List Ticket</button>
                    </div>
                    
                    <div>
                        <h3>Transfer Tickets</h3>
                        <label>Amount to transfer</label>
                        <input type="number" className="form-control" name="transferAmount" min="1" max={ticketOwner} value={transferAmount} onChange={(e) => handleTicketTransfer(e)} placeholder="Transfer Amount"/>
                        <label>Wallet Address</label>
                        <input type="text" className="form-control" name="transferWallet" value={tansferWallet} onChange={(e) => handleTicketTransferWallet(e)} placeholder="Wallet Address"/>
                        <button onClick={transferTicket} className="btn btn-primary m-2">Transfer Tickets</button>
                    </div>
               </div>
            );
        } else {
            return (
                <div>
                    <button onClick={buyTicket} className="btn btn-primary m-4">Buy Ticket</button>
                </div>
            );
        }
    }

    return (
        <div>
            <h3>ID: {id}</h3>
            <div>{ethAddr} owns: {ticketOwner}</div>
            <img className="ticket-image rounded-3 m-5" src={nftImage} alt={nftImage}/>
            {show && 
            <div>
                <div>TicketOwners: {ticketOwner}</div>
               <div>Artist: {nftMetadata.artist}</div>
               <div>Supply: {nftMetadata.supply}</div>
               <div>EventDate: {nftMetadata.eventDate}</div>
            </div>}

            <div>
                <button onClick={showInformation} className="btn btn-primary m-2">Ticket Information</button>
            </div>

            {loadAppropiateHTML()}

            {msg}
        </div>
    );
}

export default List;
