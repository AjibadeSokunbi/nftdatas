const axios = require("axios");

async function you() {
  const input = {
    collectionAddress: "0x6f9ba95aab7a23fad83af548f9ee86289a3a3aac",
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
  const nftc = JSON.parse(nftdata).continuation
  const nfttokens = JSON.parse(nftdata).tokens;

  for (const nfttoken of nfttokens) {
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

      console.log(" ");
      console.log(" ");
    }
  }

  for (const cont of nftc) {
    const continuationResponse = await axios.post("https://metadapp.com/graphql", {
      query: `
        query GetNFTsInCollection($input: NFTDataFilterQuery!) {
          getNFTsInCollection(input: $input) {
            result
          }
        }
      `,
      variables: {
        input: {
          collectionAddress: "0x6f9ba95aab7a23fad83af548f9ee86289a3a3aac",
          continuation: cont,
        },
      },
    });

    const continuationData = continuationResponse.data.data.getNFTsInCollection.result;

    const cdata = JSON.parse(continuationData).tokens;
    console.log(continuationData)

    for (const nfttoken of cdata) {
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

        console.log(" ");
        console.log(" ");
      }
    }
  }
}

you();
