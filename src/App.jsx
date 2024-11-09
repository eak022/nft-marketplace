import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ConnectWallet from './components/ConnectWallet';
import NFTMarketplace from './components/NFTMarketplace';
import MintNFT from './components/MintNFT';
import ArtNFT from './ArtNFT.json';

const App = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState(null); // เก็บ address ของเจ้าของ NFT

  useEffect(() => {
    if (account) {
      const web3 = new Web3(window.ethereum);
      const contractInstance = new web3.eth.Contract(ArtNFT.abi, "0xfAf407fB5bf4694937c895e0C3436BAF7c9C1E40");
      setContract(contractInstance);

      // ดึง address ของเจ้าของจาก contract (สมมุติว่าเจ้าของถูกเก็บไว้ในฟังก์ชัน `getOwner`)
      const fetchOwner = async () => {
        const owner = await contractInstance.methods.owner().call();
        setOwnerAddress(owner);
      };
      fetchOwner();
    }
  }, [account]);

  return (
    <div className="container mx-auto">
      {!account ? (
        <ConnectWallet onConnect={setAccount} />
      ) : (
        <>
          {/* แสดง MintNFT ฟอร์มเฉพาะเจ้าของ */}
          {account.toLowerCase() === ownerAddress?.toLowerCase() && (
            <MintNFT contract={contract} account={account} />
          )}

          {/* แสดง NFTMarketplace ให้ทุกคน */}
          <NFTMarketplace contract={contract} account={account} />
        </>
      )}
    </div>
  );
};

export default App;
