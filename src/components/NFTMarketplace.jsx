import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const NFTMarketplace = ({ contract, account }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPrice, setEditingPrice] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        if (contract) {
          const totalSupply = await contract.methods.nextTokenId().call();
          const nftList = [];
          
          for (let i = 0; i < totalSupply; i++) {
            const tokenURI = await contract.methods.tokenURI(i).call();
            const price = await contract.methods.tokenPrices(i).call();
            const name = await contract.methods.tokenNames(i).call();
            const type = await contract.methods.tokenTypes(i).call();
            const owner = await contract.methods.ownerOf(i).call(); // ตรวจสอบเจ้าของ NFT
            nftList.push({ id: i, tokenURI, price, name, type, owner });
          }

          setNfts(nftList);
          setLoading(false);
        }
      } catch (err) {
        setError(`Error fetching NFTs: ${err.message}`);
        setLoading(false);
      }
    };
    
    loadNFTs();
  }, [contract]);

  const handleBuyNFT = async (tokenId, price) => {
    try {
      const priceInWei = Web3.utils.toWei(price, "ether");
      await contract.methods.buyNFT(tokenId).send({
        from: account,
        value: priceInWei,
      });
      alert('NFT bought successfully!');
    } catch (err) {
      alert(`Error buying NFT: ${err.message}`);
    }
  };

  const handleEditPrice = async (tokenId) => {
    try {
      const priceInWei = Web3.utils.toWei(newPrice, "ether");
      await contract.methods.updatePrice(tokenId, priceInWei).send({ from: account });
      alert('Price updated successfully!');
      setEditingPrice(null);
      setNewPrice("");
    } catch (err) {
      alert(`Error updating price: ${err.message}`);
    }
  };

  if (loading) return <div>Loading NFTs...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">NFT Marketplace</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft) => {
          // เพิ่มการตรวจสอบการเชื่อมต่อ address
          console.log("account: ", account); // ตรวจสอบค่า account
          console.log("nft owner: ", nft.owner); // ตรวจสอบค่า owner ของ NFT

          // ตรวจสอบว่า account และ nft.owner ตรงกันหรือไม่
          const isOwner = account && account.toLowerCase() === nft.owner.toLowerCase();
          
          return (
            <div key={nft.id} className="card w-80 bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">{nft.name} - {nft.type}</h3>
                <img src={nft.tokenURI} alt={`NFT #${nft.id}`} className="w-full h-48 object-cover" />
                <p>Price: {Web3.utils.fromWei(nft.price, "ether")} ETH</p>
                
                {/* ตรวจสอบว่า account ตรงกับ owner ของ NFT หรือไม่ */}
                {isOwner && (
                  <>
                    {editingPrice === nft.id ? (
                      <div>
                        <input 
                          type="text" 
                          placeholder="New price" 
                          value={newPrice} 
                          onChange={(e) => setNewPrice(e.target.value)} 
                          className="input input-bordered mt-2"
                        />
                        <button onClick={() => handleEditPrice(nft.id)} className="btn btn-success mt-2">Save</button>
                        <button onClick={() => setEditingPrice(null)} className="btn btn-secondary mt-2">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingPrice(nft.id)} className="btn btn-primary mt-2">Edit Price</button>
                    )}
                  </>
                )}
                
                <button onClick={() => handleBuyNFT(nft.id, Web3.utils.fromWei(nft.price, "ether"))} className="btn btn-primary mt-2">
                  Buy NFT
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NFTMarketplace;
