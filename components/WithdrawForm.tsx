"use client";
import React, { useState } from "react";
import { AbiSendTx } from "../app/abi/SendTx";
import Web3 from "web3";

declare global {
  interface Window {
    ethereum: any;
  }
}

const WithdrawForm = () => {
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState(null);
  let accounts;
  let userAddress;

  const withdrawKlay = async (event: any) => {
    console.log("Amount: ", amount);
    accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    userAddress = accounts[0];
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(
      AbiSendTx,
      "0x7e3Eb852b7cC65477e50cdc8DD51cf1B36fB81E2"
    );

    const decimal = 10 ** 17;
    const data = await (contract.methods.withdraw as any)(
      amount,
      "0xF7FCCFc3DE0789362B5B998782992a27b12040c8"
    )
      .send({ from: userAddress, gasPrice: "25000000000", gas: "8500000" })
      .then(console.log)
      .catch(console.error);
    console.log(data);
  };

  return (
    <>
      {/*<form onSubmit={handleSubmit}>*/}
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
          onClick={withdrawKlay}
        >
          Withdraw
        </button>
      </div>
      {/*</form>*/}
    </>
  );
};

export default WithdrawForm;
