import { useContext, useEffect, useState } from 'react';

import WalletProvider, { WalletContext } from '../ethereum/WalletProvider';

function IndexCore(): JSX.Element {
  const { wallet, connectWallet } = useContext(WalletContext);
  const [text, setText] = useState('');
  const [greet, setGreet] = useState('');

  const setGreeting = async () => {
    wallet?.contract.greeter
      .setGreeting(text)
      .then(setGreetingTx => setGreetingTx.wait())
      .then(() => wallet?.contract.greeter.greet())
      .then(_greet => setGreet(_greet));
  };

  useEffect(() => {
    wallet?.contract.greeter.greet().then(_greet => setGreet(_greet));
  }, [wallet]);

  return (
    <>
      {wallet ? (
        <div>
          <p>Address: {wallet.address}</p>
          <p>Greeting: {greet}</p>
          <div>
            <input
              type='text'
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button onClick={setGreeting}>setGreeting</button>
          </div>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </>
  );
}

export default function Index(): JSX.Element {
  return (
    <WalletProvider>
      <IndexCore />
    </WalletProvider>
  );
}
