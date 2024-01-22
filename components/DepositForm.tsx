"use client";
import React, { useState } from "react";
import { AbiSendTx } from "../app/abi/SendTx";
import Web3 from "web3";

declare global {
  interface Window {
    ethereum: any;
  }
}
const DepositForm = () => {
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState(null);
  let accounts;
  let userAddress;

  const handleSubmitKlaytn = async (event: any) => {
    accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    userAddress = accounts[0];
    console.log("PQD userAdr: ", userAddress);
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(
      AbiSendTx,
      "0x7e3Eb852b7cC65477e50cdc8DD51cf1B36fB81E2"
    );
    const data = await (contract.methods.invest as any)(
      0,
      amount
    )
      .send({ from: userAddress, gasPrice: "25000000000", gas: "8500000" })
      .then((resp: any) =>{console.log("PQD tx resp: ", resp)})
      .catch(console.error);
    
      console.log("Tx resp: ", data);
  };

  const setContract = async () => {
    accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    userAddress = accounts[0];
    const web3 = new Web3(window.ethereum);

    const contract = new web3.eth.Contract(
      AbiSendTx,
      "0x7e3Eb852b7cC65477e50cdc8DD51cf1B36fB81E2"
    );

    const value = 1;
    const gas = await (contract.methods.setData as any)(value).estimateGas();

    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(userAddress);

    const tx = {
      from: userAddress,
      to: process.env.CONTRACT_ADDRESS,
      gasPrice: gasPrice,
      gas: gas,
      nonce: nonce,
      data: (contract.methods.setData as any)(value).encodeABI(),
    };

    const privateKey = "pqd";
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    if (receipt.status === "0x1") {
      // the transaction was successful
      alert("Success Deposit");
    } else {
      // the transaction failed
    }
  };

  // useEffect(() => {
  //   console.log(getFullnodeUrl("devnet"));
  // }, []);

  return (
    <>
      {/* <form onSubmit={handleSubmitKlaytn}> */}
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Amount
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="number"
        id="amount"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />
      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={handleSubmitKlaytn}
        >
          Deposit
        </button>
      </div>
      {/* </form> */}
    </>
  );
};

export default DepositForm;
