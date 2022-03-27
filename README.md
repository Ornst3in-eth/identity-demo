# DID Identity demo

This is a demo implementation of creating and fetching verified credentials of a user using did specs outlined by https://identity.foundation/ using ceramic network

A user can login with their web3 provider account(like metamask) and update their profile with details like name, sol address, etc. This profile data would be stored in a DID compatible datastore by ceramic network, untamperable without the user's private key.

## Installation
npm install

## run
npm run dev

## rationale behind using ceramic network
DID compatible VC storage on general purpose public blockchains is not scalable without applying an additional layer on top. With universal did resolvers, the only requirement for such layers is sufficient censorship resistance in comparision to hosted storage. ION network, ceramic and kepler(by spruceid) are such examples, ceramic was chosen because the documentation felt more well written and the kepler network isn't live yet.

All data is public by default in this implementation.