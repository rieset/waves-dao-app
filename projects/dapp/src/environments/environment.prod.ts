export const environment = {
  production: true,
  confirmations: 0,
  grantsProgramLink: 'https://github.com/Waves-Association/grants-program/issues' +
      '/new?assignees=KardanovIR&labels=Interhack+Grant&template=track-3--' +
      'interhack-grant.md&title=%5BTrack+3.+Interhack+Grant%5D+',

  apis: {
    nodes: 'https://nodes.wavesnodes.com',
    signer: 'https://waves.exchange/signer/',
    rest: 'https://nodes.wavesnodes.com',
    explorer: 'https://wavesexplorer.com/address/',
    management: {
      membership: '3P5XXSbp8Mgnaccv7AmB1FaxDMkppu2LZgS'
    },
    contracts: {
      disruptive: '3PLAhMnipQdjzasGeh5B2EKxKP74dasHHqD',
      web3: '3PB8KDpFJqiDbqhmu8crSmU8h7krxFt68Pd',
      interhack: '3PBZs1dzpMoQwCZM1KNwxxQZVnmRU6wqC2e'
    },
    issues: {
      disruptive: 'https://github.com/vlzhr/grants-program/issues/new?assignees=' +
          'KardanovIR&labels=Disruptive+Tech+Grant&template=track-1--disruptive-' +
          'tech-grant.md&title=%5BTrack+1.+Disruptive+Tech+Grant%5D+',
      web3: 'https://github.com/vlzhr/grants-program/issues/new?assignees=' +
          'KardanovIR&labels=Web3.0+Development+Grant&template=track-2--web3-' +
          '0-development-grant.md&title=%5BTrack+2.+Web3.0+Development+Grant%5D+',
      interhack: 'https://github.com/vlzhr/grants-program/issues/new?assignees=' +
          'KardanovIR&labels=Interhack+Grant&template=track-3--interhack-grant.' +
          'md&title=%5BTrack+3.+Interhack+Grant%5D+'
    },
    links: {
      facebook: "https://www.facebook.com/wavesassociation",
      medium: "https://medium.com/waves-association",
      twitter: "https://twitter.com/Waves_Ass",
    },
    emails: {
      grants: "grants@wavesassociation.org"
    }
  },

  /* eslint-disable */
  workingGroup: JSON.parse('${WORKING_GROUP}' || '{}'),
  /* eslint-enable */

  // Routing constants on page
  routing: {
    // home: '',
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
