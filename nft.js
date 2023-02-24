import axios from "axios";

const GetNFTsInCollection = async () => {
  const input = {
    collectionAddress: "0x6f9ba95aab7a23fad83af548f9ee86289a3a3aac",
    continuation: "bnVsbF8weDZmOWJhOTVhYWI3YTIzZmFkODNhZjU0OGY5ZWU4NjI4OWEzYTNhYWNfNg=="
  };

  const response = await axios.post("https://metadapp.com/graphql", {
    query: `
        query GetNFTsInCollection($input: NFTDataFilterQuery!) {
          getNFTsInCollection(input: $input) {
            result
          }
        }
      `,
    variables: {
      input,
    },
  });

  const nftdata = response.data.data.getNFTsInCollection.result;
  const nfttokens = JSON.parse(nftdata);
  const continuationkey = nfttokens.continuation

  for (const nfttoken of nfttokens.tokens) {
    if (nfttoken.market.floorAsk.price !== null) {
      const tokenid = nfttoken.token.tokenId;
      const price = nfttoken.market.floorAsk.price.amount.native;
      const symbol = nfttoken.market.floorAsk.price.currency.symbol;
      console.log("id:", tokenid);
      console.log("price:", price);
      console.log("symbol:", symbol);
      if (nfttoken.token.image) {
        const image = nfttoken.token.image;
        console.log("image:", image);
      } else {
        const image = nfttoken.token.collection.image;
        console.log(image);
      }

    }
  }
}

GetNFTsInCollection();

