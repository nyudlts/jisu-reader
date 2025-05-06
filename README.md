# jisu-reader
A web-based EPUB reader based on the Readium [ts-toolkit](https://github.com/readium/ts-toolkit).

## Dev Setup
For development purposes it is possible to run this project locally.  Note that this project requires the following projects to also be running locally in order to work.

[jisu-build](https://github.com/nyudlts/jisu-build)             For a Solr database populated with book data.   
[jisu-pub-server](https://github.com/nyudlts/jisu-pub-server)   A Publication Manifest Server with books in the 'test' directory.   
[jisu-api](https://github.com/nyudlts/jisu-api)                 An API for the reader to make Solr calls.    

With these three service running you run the reader in development mode by follow these steps:

Dependencies:  
Node v.21  
pnpm

1. Clone this project recursively for the ts-toolkit submodule.  
(Note that ts-toolkit should be pinned to commit @36e7be6)
```
git clone https://github.com/nyudlts/jisu-reader.git --recursive
```

2. Install project dependencies and run the reader in dev mode
```
cd jisu-reader
pnpm install
pnpm run dev
```

3. Test the reader
```
http://localhost:3000

Click on a link to a book from the landing page.
If the book content loads then the jisu-pub-server is working.  

Check that the reader footer contains the chapter name on the left side.
If so, then the 'chapter' api call is working.

Perform a search via the magnifying glass icon in the reader header.
If search results are shown thn the 'search' api call is working.
```

## Production Setup
For production, use the [jisu-build](https://github.com/nyudlts/jisu-build) project which includes this project as a submodule. 

