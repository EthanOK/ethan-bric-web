import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DataDisplayPage from "./pages/DataDisplayPage";
import MintNFTPage from "./pages/MintNFTPage";
import SignEIP712Page from "./pages/SignEIP712Page";
import HomePage from "./pages/HomePage";
import GetOpenSeaDataPage from "./pages/GetOpenSeaDataPage";
import GetIPFSPage from "./pages/GetIPFSPage";
import "./App.css";
import { _TypedDataEncoder } from "@ethersproject/hash";
import { login } from "./utils/ConnectWallet";
import { getChainIdAndBalanceETHAndTransactionCount } from "./utils/GetProvider";
import { DefaultChainId } from "./utils/SystemConfiguration";
import BuyNFTPage from "./pages/BuyNFTPage";
import LuckyBabyPage from "./pages/LuckyBabyPage";
import ENSPage from "./pages/ENSPage";
import FaucetTokenPage from "./pages/FaucetTokenPage";
import { getExtractAddress } from "./utils/Utils";
import TransferNativePage from "./pages/TransferNativePage";
import UtilsPage from "./pages/UtilsPage";
import BurnTokenPage from "./pages/BurnTokenPage";
import CrossChainBridgePage from "./pages/CrossChainBridgePage";
import SolanaLoginPage from "./pages/SolanaLoginPage";
import BuyBlurNFTPage from "./pages/BuyBlurNFTPage";
// hardhat: 31337 tbsc: 97 0x61 goerli： 0x5

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentAccountBalance, setCurrentAccountBalance] = useState(null);
  const [currentAccountNonce, setCurrentAccountNonce] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const [chainId, setChainId] = useState(
    localStorage.getItem("chainId") || DefaultChainId
  );

  const [isMounted, setIsMounted] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const intervalId = setInterval(updateChianId, 2000);

    return () => {
      clearInterval(intervalId);
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      let account = localStorage.getItem("userAddress");

      let chainId = localStorage.getItem("chainId");
      if (chainId == null) {
        localStorage.setItem("chainId", DefaultChainId);
      }
      let loginType = localStorage.getItem("LoginType");
      if (loginType == null) {
        localStorage.setItem("LoginType", "metamask");
      }

      if (account != null) {
        configAccountData(account);
      }
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", async (accounts) => {
          let account = accounts[0];

          localStorage.setItem("userAddress", account);
        });
      }
    }
  }, [isMounted]);

  const updateChianId = () => {
    let chainId = localStorage.getItem("chainId");
    setChainId(chainId);
    let account = localStorage.getItem("userAddress");
    setCurrentAccount(account);
  };
  const handleSelectChange = (event) => {
    let account = localStorage.getItem("userAddress");
    if (account === null) {
      let networkId = event.target.value;

      setChainId(event.target.value);

      localStorage.setItem("chainId", networkId);
    }
  };

  // config AccountData
  const configAccountData = async (account) => {
    try {
      setCurrentAccount(account);

      let [chainId, balance_ether, nonce] =
        await getChainIdAndBalanceETHAndTransactionCount(account);

      setChainId(localStorage.getItem("chainId"));

      setCurrentAccountBalance(balance_ether);

      setCurrentAccountNonce(nonce);
    } catch (error) {
      console.log(error);
    }
  };

  const disconnect = async () => {
    let chainId = localStorage.getItem("chainId");
    localStorage.clear();
    localStorage.setItem("chainId", chainId);
    window.location.reload();

    console.log("断开连接");
  };
  const disConnect = () => {
    return (
      <button
        onClick={disconnect}
        style={{
          color: "red",
          fontSize: "10px",
          padding: "10px 20px",
        }}
      >
        DisConnect
      </button>
    );
  };

  const handleAccordionClick = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <Router>
      <div>
        <div className="floating-accordion">
          <div
            className={`accordion-header ${isExpanded ? "open" : ""}`}
            onClick={handleAccordionClick}
          >
            <h3 className="accordion-title">Function</h3>
            <span className="accordion-icon">▼</span>
          </div>
          {isExpanded && (
            <div>
              <AccordionItem title="Login DApp" linkTo="/" />
              <AccordionItem title="Login Solana" linkTo="/loginSolana" />
              <AccordionItem title="Transfer Native" linkTo="/transfer" />
              <AccordionItem title="Faucet Token" linkTo="/faucet" />
              <AccordionItem title="Burn Token" linkTo="/burn" />
              <AccordionItem title="Token Price" linkTo="/display" />
              <AccordionItem title="ENS Service" linkTo="/ens" />
              <AccordionItem title="Mint NFT" linkTo="/mintnft" />
              <AccordionItem title="Sign EIP712" linkTo="/signEIP712" />
              <AccordionItem title="Get OpenSeaData" linkTo="/getOpenSeaData" />
              <AccordionItem title="Buy NFT (Y,O)" linkTo="/buyNFT" />
              <AccordionItem title="Buy Blur NFT" linkTo="/buyBlurNFT" />
              {/* <AccordionItem title="Get IPFS" linkTo="/getIPFS" /> */}
              <AccordionItem title="Lucky Baby" linkTo="/luckyBaby" />
              <AccordionItem title="Utils" linkTo="/utils" />
              <AccordionItem
                title="Cross-Chain Bridge"
                linkTo="/crossChainBridge"
              />

              {/* ...添加更多的折叠项 */}
            </div>
          )}
        </div>
        <div
          style={{
            textAlign: "right",
          }}
        >
          <p></p>
          ChainId: {chainId}&nbsp;{disConnect()}
          <p></p>
          Account:{" "}
          {
            // currentAccount 保留前4后4
            getExtractAddress(currentAccount)
          }
        </div>

        {/* 使用 <Routes> 包含所有的路由 */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/loginSolana" element={<SolanaLoginPage />} />
          <Route path="/display" element={<DataDisplayPage />} />
          <Route path="/ens" element={<ENSPage />} />
          <Route path="/mintnft" element={<MintNFTPage />} />
          <Route path="/signEIP712" element={<SignEIP712Page />} />
          <Route path="/getOpenSeaData" element={<GetOpenSeaDataPage />} />
          <Route path="/buyNFT" element={<BuyNFTPage />} />
          <Route path="/buyBlurNFT" element={<BuyBlurNFTPage />} />
          <Route path="/getIPFS" element={<GetIPFSPage />} />
          <Route path="/luckyBaby" element={<LuckyBabyPage />} />
          <Route path="/faucet" element={<FaucetTokenPage />} />
          <Route path="/burn" element={<BurnTokenPage />} />
          <Route path="/transfer" element={<TransferNativePage />} />
          <Route path="/utils" element={<UtilsPage />} />
          <Route path="/crossChainBridge" element={<CrossChainBridgePage />} />
        </Routes>
      </div>
    </Router>
  );
}

const AccordionItem = ({ title, linkTo }) => {
  return (
    <div className="accordion-item">
      <div className="accordion-header">
        <Link to={linkTo}>{title}</Link>
      </div>
    </div>
  );
};
export default App;
