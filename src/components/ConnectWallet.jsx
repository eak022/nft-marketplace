import React, { useState } from 'react';
import Web3 from 'web3';

const ConnectWallet = ({ onConnect }) => {
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' }); // ขอสิทธิ์การเชื่อมต่อจาก MetaMask
        const accounts = await web3.eth.getAccounts(); // ใช้ Web3 เพื่อดึงที่อยู่
        setAddress(accounts[0]);
        onConnect(accounts[0]);
      } else {
        setError("MetaMask not found!");
      }
    } catch (err) {
      setError(`Error connecting wallet: ${err.message}`);
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Connect MetaMask</h2>
        <button onClick={connectWallet} className="btn btn-primary">Connect Wallet</button>
        {address && <p>Connected as: {address}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ConnectWallet;
