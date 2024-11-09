import React, { useState, useEffect } from 'react';
import Web3 from 'web3'; // นำเข้า Web3

const NFTMarketplace = ({ contract, account }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ฟังก์ชันเพื่อดึงข้อมูล NFT ทั้งหมด
  useEffect(() => {
    const loadNFTs = async () => {
      try {
        // ตรวจสอบว่า contract ถูกตั้งค่าแล้วหรือยัง
        if (contract) {
          const totalSupply = await contract.methods.nextTokenId().call(); // ดึงจำนวน NFT ทั้งหมด
          const nftList = [];
          
          for (let i = 0; i < totalSupply; i++) {
            const tokenURI = await contract.methods.tokenURI(i).call(); // ดึง URI ของแต่ละ NFT
            const price = await contract.methods.tokenPrices(i).call(); // ดึงราคาของแต่ละ NFT
            nftList.push({ id: i, tokenURI, price });
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
      // ฟังก์ชันการซื้อ NFT
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

  if (loading) return <div>Loading NFTs...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">NFT Marketplace</h2>
      <p>Connected Account: {account}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <div key={nft.id} className="card w-80 bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">NFT #{nft.id}</h3>
              <img src={nft.tokenURI} alt={`NFT #${nft.id}`} className="w-full h-48 object-cover" />
              <p>Price: {Web3.utils.fromWei(nft.price, "ether")} ETH</p>
              <button
                onClick={() => handleBuyNFT(nft.id, Web3.utils.fromWei(nft.price, "ether"))}
                className="btn btn-primary mt-2"
              >
                Buy NFT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTMarketplace;
