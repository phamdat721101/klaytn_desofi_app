"use client";
import React, { useEffect, useState } from "react";
import Link from 'next/link'
import Web3 from "web3";
import { AbiSendTx } from "../../app/abi/SendTx";

interface Transaction {
  id: string;
  investor: string;
  tx_hash: string;
  type: string;
  url: string;
  amount: string;
  timestamp: string;
}

async function getTransactions(wallet: string) {
  let accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  });
  let userAddress: string = accounts[0];
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(
    AbiSendTx,
    "0x7e3Eb852b7cC65477e50cdc8DD51cf1B36fB81E2"
  );

  const data = await (contract.methods.getListInvestments(userAddress).call() as any);
  console.log("PQD vaults: ", data[0]);
  
  const resp = [
    {
      "id": parseInt(data[0].id),
      "investor": data[0].investor,
      "tx_hash": "0x312n8b1",
      "type": "deposit",
      "url": `https://baobab.klaytnscope.com/account/${userAddress}?tabId=txList`,
      "amount": parseInt(data[0].amount),
      "timestamp": parseInt(data[0].timestamp)
    }
  ]
  return resp
}


const Wallet = (wallet:any) => {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
 // const { currentAccount } = useWalletKit();

  useEffect(() => {
    const fetchTransactions = async () => {

      const transactions = await getTransactions(wallet.wallet);
      // if(transactions){
      //   transactions.array.forEach(item => {
      //     item.timestamp = new Date (item.timestamp);
      //     console.log("Time stamp: ", item.timestamp)
      //   });
      // }
      
      setTransactions(transactions);
    };

    fetchTransactions().catch(console.log);
  }, []);

  return (
    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
      {transactions ? (
        <div>
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-blueGray-700">
                  Investment History
                </h3>
              </div>
              {/* <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <button
                    class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    See all
                  </button>
                </div> */}
            </div>
          </div>
          
            <div
              className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded "
            >
              <div className="block w-full overflow-x-auto">
                <table className="items-center bg-transparent w-full border-collapse ">
                  <thead>
                    <tr>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                        Id
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                        Investor
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                        Amount
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                        Tx Hash
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                        Created At
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.tx_hash}>
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                        {transaction.id}
                      </th>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {transaction.investor}
                      </td>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {transaction.amount}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                      <Link href={transaction.url}>{transaction.tx_hash}</Link>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <i className="fas fa-arrow-up text-emerald-500 mr-4"></i>
                        {transaction.timestamp}
                      </td>
                    </tr>
                    
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          
        </div>
      ) : (

        <p>Loading...</p>
      )}
    </div>
  );
};

export default Wallet;
