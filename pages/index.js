import { useState } from 'react'
import CeramicClient  from '@ceramicnetwork/http-client';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'

import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import { DID } from 'dids'
import { IDX } from '@ceramicstudio/idx'
import { Caip10Link } from '@ceramicnetwork/stream-caip10-link'

const endpoint = "https://ceramic-clay.3boxlabs.com"

export default function IndexPage() {
  const [name, setName] = useState('');
  const [solAddress, setSolAddress] = useState('');
  const [ethAddr, setEthAddr] = useState('');

  const [nameInput, setNameInput] = useState('');
  const [addressInput, setAddressInput] = useState('');

  const [didAddress,  setDidAddress] = useState('');

  const [loaded, setLoaded] = useState(false);

  async function connect() {
    const addresses = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })
    return addresses;
  }

  async function readProfile() {
    const [address] = await connect();
    setEthAddr(address);
    const ceramic = new CeramicClient(endpoint);
    const idx = new IDX({ ceramic });
    try {
      const data = await idx.get(
        'basicProfile',
        `${address}@eip155:1`
      )
      const link = await Caip10Link.fromAccount(
        ceramic,
        `${address}@eip155:1`
      );
      setDidAddress(link.did);
      if(data.name)
        setName(data.name);
      if(data.solAddress)
        setSolAddress(data.solAddress)
    } catch(error) {
      console.log('error: ', error);
      setLoaded(true);
    }
  }

  async function updateProfile() {
    const [address] = await connect();
    setEthAddr(address);
    const ceramic = new CeramicClient(endpoint);
    const threeIdConnect = new ThreeIdConnect();
    const provider = new EthereumAuthProvider(window.ethereum, address);
    await threeIdConnect.connect(provider);

    const did = new DID({
      provider: threeIdConnect.getDidProvider(),
      resolver: {
        ...ThreeIdResolver.getResolver(ceramic)
      }
    })
    await did.authenticate();
    ceramic.setDID(did);
    const idx = new IDX({ ceramic });
    await idx.set('basicProfile', {
      name: nameInput,
      solAddress: addressInput
    })

    console.log("Profile updated!");
  }

  const profileNotFound = (!name && !solAddress && loaded);
  return (
    <div className="App">
      <input placeholder="Name" onChange={ e=> setNameInput(e.target.value)}/>
      <input placeholder="Sol Address" onChange={e => setAddressInput(e.target.value)}/>
      <button onClick={updateProfile}>Update Profile</button>
      <div style={{height: 10}}/>
      <button onClick={readProfile}>Read Profile</button>
      {ethAddr && didAddress && <div>{`Loaded DID document for eth address:${ethAddr}`}</div>}
      {didAddress && <h3>DID Address:{didAddress}</h3>}
      {name && <h3>Name: {name}</h3> }
      {solAddress && <h3>Sol address: {solAddress}</h3>}
      {profileNotFound?(<h4>No profile exists</h4>):null}
    </div>
  )
}
