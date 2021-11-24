// This is Helper function to exec smart contracts

class Helper {
    static gas_mulptiplier = 1.2;
    static gasPay(gas) {
        return Math.ceil(gas * Helper.gas_mulptiplier);
    }
}

/*
    typeCall: Send, Call
*/
export async function methodSend(web3, account, contractInstance, typeCall, methodName, args) {
    let gasPrice;

    await web3.eth.getGasPrice().then((averageGasPrice) => {
        // console.log("Average gas price: " + averageGasPrice);
        gasPrice = averageGasPrice;
    }).catch(console.error);

    // let gas;

    await web3.eth.getBalance(account.address).then((account_balance) => {
        // console.log("Gas in wallet: " + account_balance);
    }).catch((err) => {

    });

    // console.log("sending...");
    return contractInstance.methods[methodName](...args)[typeCall]({
        from: account.address,
        gasPrice: gasPrice,
        gas: Helper.gasPay(await contractInstance.methods[methodName](...args).estimateGas({ from: account.address })),
    }).then(function (receipt) {
        return receipt;
    }).catch((ee) => {
        console.error(ee);
    });
}
