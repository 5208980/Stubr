import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from "react-router-dom";
import Web3 from 'web3';

import MetaMask from './MetaMask';
import { methodSend } from '../utils/send';
import eventShopAddr from '../contracts/address';
import eventShopABI from '../contracts/abi';

function List() {
    let { contract, id } = useParams();
    const [web3, setWeb3] = useState({ web3: null });
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [accountInfo, setAccountInfo] = useState({});
    const [ticketOwner, setTicketOwner] = useState(true);
    const [ticketState, setTickerState] = useState(false);

    const [ticketContract, setTicketContract] = useState({});
    const [nftImage, setNFTImage] = useState('');
    const [nftMetadata, setNFTMetadata] = useState({});
    const [show, setShow] = useState(false);

    useEffect(async () => {
        if (window.ethereum) {
            try {
                window.web3 = new Web3(window.ethereum);
                window.ethereum.enable();
                console.log("HERE");
                setWeb3({ web3: window.web3 });
            } catch (e) {
                console.error(e);
            }

            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setisLoggedIn(true);
                setAccountInfo({ address: accounts[0] });
                // this.setState({ accountAddr: accounts[0] });
            } catch {
                setisLoggedIn(false);
            }
        }
        (!isLoggedIn && <Navigate path="/" element={<MetaMask />} />); 

        // console.log(web3.web3);
        // I think abi should just be ERC 1155 default
        // setTicketContract({ ticketContract: new web3.web3.eth.Contract(eventShopABI, eventShopAddr, {}) });
        // // This will determine if user can list ticket
        // setTicketOwner(await methodSend(web3.web3, accountInfo.address, ticketContract, 'call', 'isTicketOwner', [id]));  // Should return true/false from contract
        // setTicketState(await methodSend(web3.web3, accountInfo.address, ticketContract, 'call', 'getTicketState', [id]));  // Should return true/false from contract

        //  const uri = setTicketState(await methodSend(web3.web3, accountInfo.address, getUri, 'call', 'getTicketState', [id]));  // Should return true/false from contract
        const uri = `https://bafybeid3zygmgubn4glsja4nren43tpq3oypbsewmky2l6ct4iejjmey6m.ipfs.dweb.link/metadata.json`;
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
        if(ticketOwner) {
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
