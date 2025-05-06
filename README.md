# jisu-reader
A web-based EPUB reader based on the Readium [ts-toolkit](https://github.com/readium/ts-toolkit).

## Dev Setup
For development purposes it is possible to run this project locally.  Note that this project requires the following projects to be running locally in order to work.

A Solr database populated with book data. See [jisu-build](https://github.com/nyudlts/jisu-build)  
A Publication Manifest Server with books in the 'test' directory. See [jisu-pub-server](https://github.com/nyudlts/jisu-pub-server)  
An API for the reader to make Solr calls. See [jisu-api](https://github.com/nyudlts/jisu-api)  

With these three service running follow these steps to run the reader in local development mode.

Dependencies:  
Node
pnpm

1. Clone this project recursively for the ts-toolkit submodule.  (Note that ts-toolkit should be pinned to commit @36e7be6)
```
git clone https://github.com/nyudlts/jisu-reader.git --recursive
```

2. Install project dependencies and run the reader in dev mode
```
cd jisu-reader
pnpm install
pnpm run dev
```

3. Test the reader.

