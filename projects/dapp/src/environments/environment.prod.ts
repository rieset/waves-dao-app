export const environment = {
  production: true,
  confirmations: 0,
  grantsProgramLink: '${GRANT_PROGRAM_LINK}',
  showMoreLink: {
    disruptive: '${DISRUPTIVE_SHOW_MORE}',
    votings: '${VOTINGS_SHOW_MORE}',
    web3: '${WEB3_SHOW_MORE}',
    interhack: '${INTERHACK_SHOW_MORE}'
  },

  apis: {
    // Mainnet
    // nodes: 'https://nodes.wavesnodes.com',
    // signer: 'https://waves.exchange/signer/',
    // rest: 'https://nodes.wavesnodes.com',
    // explorer: 'https://wavesexplorer.com/address/',

    nodes: '${API_NODES}',        //'https://nodes-testnet.wavesnodes.com',
    signer: '${API_SIGNER}',      //'https://testnet.waves.exchange/signer/',
    rest: '${API_NODES}',         //'https://nodes-testnet.wavesnodes.com',
    explorer: '${API_EXPLORER}',  // 'https://testnet.wavesexplorer.com/address/',

    // USE SYSTEM ENVIRONMENTS ON BUILD PROJECT
    management: {
      membership: '${MEMBERSHIP}'
    },
    contracts: {
      disruptive: '${DISRUPTIVE}',
      votings: '${VOTINGS}',
      web3: '${WEB3}',
      interhack: '${INTERHACK}'
    },

    issues: {
      disruptive: '${DISRUPTIVE_ISSUE_TEMPLATE}',
      votings: '${VOTINGS_ISSUE_TEMPLATE}',
      web3: '${WEB3_ISSUE_TEMPLATE}',
      interhack: '${INTERHACK_ISSUE_TEMPLATE}'
    },

    links: {
      telegram: 'https://t.me/WavesDAO',
      facebook: 'https://www.facebook.com/wavesassociation',
      medium: 'https://medium.com/waves-association',
      twitter: 'https://twitter.com/Waves_Assn',
      github: {
        api: 'https://api.github.com/repos',
        raw: 'https://raw.githubusercontent.com/',
        mdEnd: '/contents/README.md',
      }
    },
    emails: {
      grants: 'grants@wavesassociation.org'
    }
  },

  /* eslint-disable */
  workingGroup: JSON.parse('${WORKING_GROUP}' || '{}'),
  /* eslint-enable */

  // Routing constants on page
  routing: {
    landing: '',
    guide: 'guide',
    listing: 'grants/:contractType',
    about: 'grants/:contractType/about',
    entity: 'grants/:contractType/:entityId',
    createGrant: 'grants/:contractType/create-grant',
    allTeams: 'grants/:contractType/:entityId/all-teams',
    members: 'members',
    stylesheet: 'stylesheet',
    addReward: 'grants/:contractType/add-reward/:entityId'
  },

  showDevTools: false
}
