import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ConnectWallet from './components/ConnectWallet';
import NFTMarketplace from './components/NFTMarketplace';
import MintNFT from './components/MintNFT';
import ArtNFT from './ArtNFT.json';

const App = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (account) {
      const web3 = new Web3(window.ethereum);
      const contractInstance = new web3.eth.Contract(ArtNFT.abi, "0x07e2F1ec5fDF249BAf8bC7837f2025123e982664");
      setContract(contractInstance);
    }
  }, [account]);

  return (
    <div className="container mx-auto">
      {!account ? (
        <ConnectWallet onConnect={setAccount} />
      ) : (
        <>
          <MintNFT contract={contract} account={account} />
          <NFTMarketplace contract={contract} account={account} />
        </>
      )}
    </div>
  );
};

export default App;
