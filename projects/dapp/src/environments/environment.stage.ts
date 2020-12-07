export const environment = {
  production: true,
  confirmations: 1,
  grantsProgramLink: 'https://github.com/Waves-Association/grants-program/issues/new?assignees=KardanovIR&labels=Interhack+Grant&template=track-3--interhack-grant.md&title=%5BTrack+3.+Interhack+Grant%5D+',

  apis: {
    nodes: 'https://nodes-testnet.wavesnodes.com',
    signer: 'https://testnet.waves.exchange/signer/',
    rest: 'https://nodes-testnet.wavesnodes.com',
    explorer: 'https://testnet.wavesexplorer.com/address/',
    contractAddress: '3Mxk4Jmjd8SdE2MojSXsUQ8LVYM8vRzmFSA',
    contracts: {
      disruptive: '3N71MDc3kPD6cnbdWp6iEuDY8ghgZ9DiVan',
      web3: '3N6QtvE15KN8rsW1jkBe1kz8xJHdmhNsYnG',
      interhack: '3N2sQRGTRmL9NGZVVtzhfBEjEyVR7S9Mkum'
    }
  },

  // Routing constants on page
  routing: {
    home: '',
    listing: 'grants/:contractType',
    about: 'grants/:contractType/about',
    entity: 'grants/:contractType/:entityId',
    createGrant: 'grants/:contractType/create-grant',
    masterSetting: 'grants/:contractType/settings',
    members: 'members',
    stylesheet: 'stylesheet',
    addReward: 'grants/:contractType/add-reward/:entityId'
  },

  showDevTools: false
}
