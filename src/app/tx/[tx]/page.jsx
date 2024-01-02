"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { Alchemy, Network } from "alchemy-sdk";
import { formatEther, formatUnits,} from "ethers" 

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export default function Page({ params }) {
  const [selectedItem, setSelectedItem] = useState("transactions");
  const [receipt, setReceipt] = useState();
  const [tx, setTx] = useState()

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    async function getReceipt() {
      try {
        const rc = await alchemy.core.getTransactionReceipt(params.tx);
        const txx = await alchemy.core.getTransaction(params.tx);
        setTx(txx)
        setReceipt(rc);
       
      } catch (error) {
        console.error("Error fetching block details:", error);
      }
    }

    if (params.tx) {
      getReceipt();
    }
  }, [params.tx]);

  if (!receipt) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar selectedItem={selectedItem} handleItemClick={handleItemClick} />
      <div className="flex justify-center mt-12">
        <div className=" w-2/3 rounded p-4 border border-black-400 rounded-md shadow-md">
          <div>
            <div className="flex items-center ">
              <span className="text-4xl">Transactions Details</span>
            </div>

            <hr />
            <div>
              <p>Tx Hash : {receipt.transactionHash}</p>
              <p>Status : {receipt.status == 1 ? <span className="text-green-700 "> Success</span> : <span className="text-red-500 ">Failed</span>}</p>
              
              <p>From: {receipt.from}</p>
              <p>To: {receipt.to}</p>
              <p>Block : {receipt.blockNumber}</p>
              <p>Confirmation : {receipt.confirmations.toString() }</p>
              <p> Value : {parseFloat(formatEther(tx.value._hex)) } ETH</p>
              <p>Tx Fee : {parseFloat(formatEther(tx.gasPrice._hex) * receipt.gasUsed.toString()) } ETH</p>
              <p>Gas Price : {parseFloat(formatUnits(tx.gasPrice._hex, 'gwei')) } GWEI</p>
              <p>Gas Used : {receipt.gasUsed.toString()}</p>
              
              <p></p>
              {/* Aggiungi altri dettagli del blocco come desiderato */}
            </div>
          </div>
        </div>
      </div>

      {/* Altri dettagli del blocco come desiderato */}
    </>
  );
}