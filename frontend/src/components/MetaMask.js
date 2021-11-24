import React from 'react';
import Web3 from 'web3';

import Upload from './Upload';
  
class MetaMask extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            isLoggedIn: false,
            accountInfo: null,

            web3: null,
            factoryContract: { addr: "", contract: null },

            inputAddr: "asdasdasd",
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

    render() {
        return (
            <div>
                {this.state.isLoggedIn 
                ? <div>
                    <Upload data={this.state}/>
                </div>
                : <div>
                    <button onClick={this.connectToWeb3} className="btn btn-primary">Login into MetaMask</button>
                </div>
                }
            </div>
        );
    }
}

export default MetaMask;
