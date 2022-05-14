import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { createContext, useCallback, useEffect, useState } from 'react';

import GreeterInfo from './abi/Greeter.json';

import type { Greeter } from '../../typechain-types';
import type {
  ExternalProvider,
  JsonRpcSigner,
  Provider,
} from '@ethersproject/providers';
import type { ReactNode } from 'react';

declare global {
  interface Window {
    ethereum: Provider & ExternalProvider;
  }
}

type Wallet =
  | {
      provider: Web3Provider;
      signer: JsonRpcSigner;
      address: string;
      contract: {
        greeter: Greeter;
      };
    }
  | undefined;

export const WalletContext = createContext({
  wallet: undefined as Wallet,
  connectWallet: () => {},
});

const contractAddress = '0xE1bcA7D3fb003e0c423EF48d2AadAd05004B27a8';

export default function WalletProvider(props: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>();

  const connectWallet = useCallback(() => {
    if (window.ethereum?.isMetaMask) {
      window.ethereum
        .request?.({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => {
          onAccountsChanged(accounts);
        })
        .catch(error => {
          console.log('An error occurred while connecting MetaMask:', error);
        });
    } else {
      console.log('MetaMask is not installed.');
    }
  }, []);

  const onAccountsChanged = (addresses: string[]) => {
    console.log('Wallet:', addresses);
    if (!addresses.length) {
      setWallet(undefined);
    } else {
      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const greeter = new Contract(
        contractAddress,
        GreeterInfo.abi,
        signer
      ) as Greeter;
      setWallet({
        provider,
        signer,
        address: addresses[0] as string,
        contract: { greeter },
      });
    }
  };

  useEffect(() => {
    // Connect on page load
    connectWallet();
  }, [connectWallet]);

  useEffect(() => {
    if (!wallet) return;
    window.ethereum.on('accountsChanged', onAccountsChanged);
    window.ethereum.on('chainChanged', () => window.location.reload());
  }, [wallet]);

  return (
    <WalletContext.Provider value={{ wallet, connectWallet }}>
      {props.children}
    </WalletContext.Provider>
  );
}
