import React from 'react';
import { Navigate } from 'react-router';
import Web3 from 'web3';

import MetaMask from './MetaMask';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
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

    loadTickets = () => {
        
    }

    componentDidMount() {
        this.connectToWeb3();
        (!this.state.isLoggedIn && <Navigate path="/" element={<MetaMask />} />); 
    }

    render() {
        return (
            <div>
                Home
            </div>

        );
    }
}

export default Home;
