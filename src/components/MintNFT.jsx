import React, { useState } from 'react';
import Web3 from 'web3';

const MintNFT = ({ contract, account }) => {
  const [tokenURI, setTokenURI] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const mintNFT = async () => {
    if (!tokenURI || !price || !name || !type || !description) {
      return alert("Please fill in all fields.");
    }

    const web3 = new Web3(window.ethereum);
    const priceInWei = web3.utils.toWei(price, "ether");

    const tx = await contract.methods.mintNFT(
      account, tokenURI, priceInWei, name, type, description
    ).send({ from: account });

    alert('NFT minted successfully!');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Mint New NFT</h2>
      <div className="form-control mb-5">
        <label className="label">Token URI (Image URL)</label>
        <input type="text" placeholder="Enter token URI" className="input input-bordered" value={tokenURI} onChange={(e) => setTokenURI(e.target.value)} />
      </div>
      <div className="form-control mb-5">
        <label className="label">Price (ETH)</label>
        <input type="text" placeholder="Enter price" className="input input-bordered" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className="form-control mb-5">
        <label className="label">NFT Name</label>
        <input type="text" placeholder="Enter NFT name" className="input input-bordered" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-control mb-5">
        <label className="label">NFT Type</label>
        <input type="text" placeholder="Enter NFT type" className="input input-bordered" value={type} onChange={(e) => setType(e.target.value)} />
      </div>
      <div className="form-control mb-5">
        <label className="label">Description</label>
        <textarea placeholder="Enter description" className="textarea textarea-bordered" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button onClick={mintNFT} className="btn btn-primary">Mint NFT</button>
    </div>
  );
};

export default MintNFT;
