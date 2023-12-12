'use client';
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { userNFTAddress, tokenExchangeAddress } from '../../contracts'
import UserNFT from '../contracts/UserNFT.json'
import TokenExchange from '../contracts/TokenExchange.json'

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Home() {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(false);
  const [tokenBalance, setTokenBalance] = useState("");
  const [bankBalance, setBankBalance] = useState("");
  const [bankTotalDeposit, setBankTotalDeposit] = useState("");
  const [nftOwner, setNftOwner] = useState(false);
  const [inputData, setInputData] = useState({
    transferAddress: "",
    transferAmount: "",
    depositAmount: "",
    withdrawAmount: "",
  });
  const [items, setItems] = useState([]);
  const sepoliaId = "0x" + Number(11155111).toString(16);
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const checkMetaMaskInstalled = async() => {
    const { ethereum } = window;
    if(!ethereum) {
      alert('MetaMask をインストールしてください。');
    }
  }
  const checkChainId = async () => {
    const { ethereum } = window;
    console.log(typeof ethereum);

    if (ethereum) {
      const chain = await ethereum.request({
        method: "eth_chainId",
      });
      console.log(`sepoliaId: ${sepoliaId}`);
      console.log(`chain: ${chain}`);

      if (chain != sepoliaId) {
        alert("Sepoliaに接続してください");
        setChainId(false);
        return;
      } else {
        setChainId(true);
      }
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      console.log(`account: ${accounts[0]}`);
      setAccount(accounts[0]);
      ethereum.on('accountsChanged', checkAccountChanged);
      ethereum.on('chainChanged', checkChainId);
    } catch (err) {
      console.log(err);
    }
  }

  const checkAccountChanged = () => {
    setAccount("");
    setNftOwner(false);
    setItems([]);
    setTokenBalance("");
    setBankBalance("");
    setBankTotalDeposit("");
    setInputData({
      transferAddress: "",
      transferAmount: "",
      depositAmount: "",
      withdrawAmount: "",
    });

  }

  useEffect(() => {
    checkMetaMaskInstalled();
    checkChainId();
  });
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className={'flex mt-1'}>
        {account === '' ? (
          <button
                className={
                  "bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded hover:border-transparent hover:text-white hover:bg-blue-500 hover:cursor-pointer"
                }
                onClick={connectWallet}
              >
                MetaMaskを接続
          </button>
        ) : (<div></div>)}
      </div>
    </main>
  )
}
