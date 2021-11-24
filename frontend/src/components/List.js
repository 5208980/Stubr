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

onload();   // Load Web3 and contract
function List() {
    let { contract, id } = useParams();
    // const [web3, setWeb3] = useState({ web3: null });
    const [isLoggedIn, setisLoggedIn] = useState(false);
    // const [accountInfo, setAccountInfo] = useState({});
    const [ticketOwner, setTicketOwner] = useState(0);
    const [ticketState, setTicketState] = useState("");

    // const [ticketContract, setTicketContract] = useState({});
    const [nftImage, setNFTImage] = useState('');
    const [nftMetadata, setNFTMetadata] = useState({});
    const [show, setShow] = useState(false);

    useEffect(async () => {
        if (window.ethereum) {
            try {
                // window.web3 = new Web3(window.ethereum);
                // window.ethereum.enable();
                // setWeb3({ web3: new Web3(window.ethereum) });
            } catch (e) {
                console.error(e);
            }

            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                // setisLoggedIn(true);
                // setAccountInfo({ address: accounts[0] });
                // this.setState({ accountAddr: accounts[0] });
            } catch {
                setisLoggedIn(false);
            }
        }
        (!isLoggedIn && <Navigate path="/" element={<MetaMask />} />); 

        console.log(accountInfo);
        // setTicketContract({ ticketContract: new web3.eth.Contract(eventShopABI, eventShopAddr, {}) });

        // This will determine if user can list ticket
        setTicketOwner(await methodSend(web3, accountInfo, ticketContract, 'call', 'balanceOf', [ethAddr, id]));  // Should return true/false from contract
        let cid = await methodSend(web3, accountInfo, ticketContract, 'call', 'getMetadata', [id]);
        console.log(cid);

        const uri = `https://${cid}.ipfs.dweb.link/metadata.json`;
        const r = await fetch(uri, { method: 'GET' });
        const j = await r.json();
        setNFTImage(j.cid);
        setNFTMetadata(j.metadata);
        console.log(nftImage);
    }, []);

    function listTicket() {
        // await methodSend(web3.web3, accountInfo.address, ticketContract, 'call', 'listTicket', [listingPrice, id]);
    }

    function buyTicket() {
        // await methodSend(web3.web3, accountInfo.address, ticketContract, 'call', 'transferTicket', [id]);
    }

    function showInformation() {
        setShow(!show);
    }

    function loadAppropiateHTML() {
        if(ticketOwner > 0) {
            return (
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Place price for ticket (IN FIL)"/>
                    <input type="text" className="form-control" placeholder="Wallet Address"/>
                    <small className="form-text text-muted">(Empty means to anyone can buy it)</small>
                    <button onClick={listTicket} className="btn btn-primary m-2">List Ticket</button>
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
            <img className="ticket-image rounded-3 m-5" src={`https://${nftImage}.ipfs.dweb.link/ticket.png`}/>
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
        </div>
    );
}

export default List;
