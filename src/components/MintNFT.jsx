import React, { useState } from 'react';
import Web3 from 'web3';  // นำเข้า Web3

const MintNFT = ({ contract, account }) => {
  const [tokenURI, setTokenURI] = useState("");
  const [price, setPrice] = useState("");

  const mintNFT = async () => {
    if (!tokenURI || !price) return alert("Please fill in all fields.");
    
    // สร้างอินสแตนซ์ของ Web3
    const web3 = new Web3(window.ethereum);

    // แปลงราคา Ether เป็น Wei
    const priceInWei = web3.utils.toWei(price, "ether");

    // ส่งธุรกรรมเพื่อ mint NFT
    const tx = await contract.methods.mintNFT(account, tokenURI, priceInWei).send({ from: account });

    alert('NFT minted successfully!');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Mint New NFT</h2>
      <div className="form-control mb-5">
        <label className="label">
          <span className="label-text">Token URI (Image URL)</span>
        </label>
        <input 
          type="text" 
          placeholder="Enter token URI" 
          className="input input-bordered" 
          value={tokenURI} 
          onChange={(e) => setTokenURI(e.target.value)} 
        />
      </div>
      <div className="form-control mb-5">
        <label className="label">
          <span className="label-text">Price (ETH)</span>
        </label>
        <input 
          type="text" 
          placeholder="Enter price" 
          className="input input-bordered" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
        />
      </div>
      <button onClick={mintNFT} className="btn btn-primary"> Mint NFT </button>
    </div>
  );
};

export default MintNFT;
