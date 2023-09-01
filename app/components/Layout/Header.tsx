import { FC, useState } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatAddress } from "@/utils/format";
import MetaMaskSDK from "@metamask/sdk";

const Header: FC = () => {
  const [address, setAddress] = useState("");

  const connect = async () => {
    const options = {
      injectProvider: true,
      dappMetadata: { name: "", url: "" },
    };

    const MMSDK = new MetaMaskSDK(options);

    const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum

    const addr = await ethereum.request({
      method: "eth_requestAccounts",
      params: [],
    });

    if (addr && Array.isArray(addr) && addr.length > 0) {
      setAddress(addr[0]);
      toast.success(<div>Wallet successfully connected!</div>, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const disconnect = () => setAddress("");

  return (
    <header className="py-10">
      {/* <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      /> */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-4">
            <Image src={"/logo.svg"} alt={"logo"} width={60} height={60} />
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <button
              className=" xs:inline-flex group items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2
                focus-visible:outline-offset-2 bg-black text-white hover:bg-cerise-red-700 hover:text-slate-100 active:bg-cerise-red-800 active:text-slate-300 focus-visible:outline-cerise-red-900"
              onClick={!address ? connect : disconnect}
            >
              {address ? (
                <span>{formatAddress(address)}</span>
              ) : (
                <span>
                  Connect <span className="hidden lg:inline">Wallet</span>
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
