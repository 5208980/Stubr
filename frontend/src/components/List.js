import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from "react-router-dom";
import Web3 from 'web3';

import MetaMask from './MetaMask';
import { methodSend } from '../utils/send';

function List() {
    let { contract, id } = useParams();
    const [web3, setWeb3] = useState({ web3: null });
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [accountInfo, setAccountInfo] = useState({});
    const [ticketOwner, setTicketOwner] = useState(true);
    const [ticketState, setTickerState] = useState(false);

    const [ticketContract, setTicketContract] = useState({});
    const [nftImg, setNFTImg] = useState('');
    const [nftMetadata, setNFTMetadata] = useState({});

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
        // might be from the /:contract
        // const abi = {} // If we have contract, can load from import
        // setTicketContract({ ticketContract: new web3.web3.eth.Contract(abi, contract, {}) });
        // // This will determine if user can list ticket
        // setTicketOwner(await methodSend(web3.web3, accountInfo.address, ticketContract, 'call', 'isTicketOwner', [id]));  // Should return true/false from contract
        // setTicketState(await methodSend(web3.web3, accountInfo.address, ticketContract, 'call', 'getTicketState', [id]));  // Should return true/false from contract

        //  const uri = setTicketState(await methodSend(web3.web3, accountInfo.address, getUri, 'call', 'getTicketState', [id]));  // Should return true/false from contract
        const uri = `https://bafybeifxpnmytym6iyzahsxrf2ydoozi5rxctgp3e424fttrn7for2afai.ipfs.dweb.link/metadata.json`;
        const r = await fetch(uri, { method: 'GET' });
        const j = await r.json();
        console.log(j);
        setNFTMetadata(j);
    }, []);

    function listTicket() {
        // await methodSend(web3.web3, accountInfo.address, ticketContract, 'call', 'listTicket', [listingPrice, id]);
    }

    function buyTicket() {
        // await methodSend(web3.web3, accountInfo.address, ticketContract, 'call', 'transferTicket', [id]);
    }

    function loadAppropiateHTML() {
        if(ticketOwner) {
            return (
                <div>
                    <input type="text" placeholder="Place price for ticket"/>
                    <button onClick={listTicket}>List Ticket</button>
                </div>
            );
        } else {
            return (
                <div>
                    Owner: {ticketOwner}
                    <button onClick={buyTicket}>Buy Ticket</button>
                </div>
            );
        }
    }

    return (
        <div>
            <h3>ID: {id}</h3>
            <img src={`https://${nftMetadata.cid}.ipfs.dweb.link/ticket.png`}/>
            {/* <div>TicketId: {nftMetadata.metadata.ticketNumber}</div>
            <div>Artist: {nftMetadata.metadata.artist}</div> */}

            {loadAppropiateHTML()}

            {/* Do Sell, but first we'll need ticketState and ticketPrice */}
        </div>
    );
}

export default List;
