import * as React from "react";
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getTokenDetailInfo } from "../../utils/opensea";
import { getOwnersOfToken } from "../../utils/moralis";
import { getPinataUrl } from "../../utils";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import NftDialog from "./NftDialog";
import { getClient, Execute } from "@reservoir0x/reservoir-sdk";
import { ethers } from "ethers";
import axios from "axios"

const NftCard = ({ nft, loading }) => {

  const [buying, setBuying] = React.useState(false);

  

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(window.ethereum._state.accounts[0]);

  const handleBuyToken = async () => {
    setBuying(true);
    try {
      await getClient()?.actions.buyToken({
        tokens: [
          { tokenId: nft.token_id, contract: nft.asset_contract.address },
        ],
        signer,
        onProgress: (steps) => {
          console.log(steps);
        },
      });
      setBuying(false);
    } catch (error) {
      console.error(error);
      console.log(error.response.data.message);
      setBuying(false);
    }
  };

  const metadata =
    nft.metadata !== undefined ? JSON.parse(nft.metadata) : undefined;

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selNft, setSelNft] = React.useState([]);
  const [nftDetail, setNftDetail] = React.useState({});
  const [nftTransfer, setNftTransfer] = React.useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNftDialog = async () => {
    const data = await getTokenDetailInfo(
      nft.asset_contract.address,
      nft.token_id
    );
    const transfer = await getOwnersOfToken(
      nft.asset_contract.address,
      nft.token_id
    );

    setNftTransfer(transfer);
    setNftDetail(data);
    handleClickOpen();
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{
            borderRadius: 3,
            bgcolor: "#343A40",
            p: 2,
          }}
        >
          <Stack gap={1}>
            <Skeleton
              sx={{
                transform: "scale(1, 1)",
                height: 250,
                borderRadius: 1,
                width: "100%",
              }}
            />
            <Skeleton
              width="50%"
              height={20}
              sx={{
                borderRadius: 1,
                transform: "scale(1, 1)",
              }}
              // height={20}
            />
            <Skeleton
              variant="rectangular"
              height={40}
              sx={{
                borderRadius: 1,
                transform: "scale(1, 1)",
              }}
            />
          </Stack>
        </Box>
      ) : (
        <Box
          onClick={handleNftDialog}
          sx={{
            borderRadius: 3,
            bgcolor: "#343A40",
          }}
        >
          <Box
            sx={{
              height: 250,
              backgroundImage: `url(${
                nft.image_url ? nft.image_url : "/img/unnamed.png"
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
              borderRadius: 3,
              width: "100%",
            }}
          >
            {/* <Box 
                        sx={{ 
                            display: 'inline-block',
                            py: .5, 
                            px: 1,
                            borderBottomRightRadius: 12,
                            borderTopLeftRadius: 12,
                            bgcolor: theme.palette.text.primary
                        }}>
                        <Typography  
                            variant="body2"
                            sx={{ 
                                fontWeight: 700,
                                color: theme.palette.background.default 
                            }}
                        >Rank: 2</Typography>
                    </Box> */}
          </Box>
          <Box p={2}>
            <Box>
              <Stack flexDirection="row" justifyContent="space-between">
                <Typography>
                  {nft.collection ? nft.collection.name : ""}
                </Typography>
                {/* <Typography>{nft.listings.length === 0 && nft.seaport_listings.length === 0 ? 'Last' : 'Price'}&nbsp;{((nft.current_price ? nft.current_price : nft.current_cost) / Math.pow(10, 18)).toFixed(2)}</Typography> */}
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                #{nft.token_id}
              </Typography>
            </Box>
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              sx={{
                pt: 2,
              }}
            >
              <Button
                onClick={handleBuyToken}
                disabled={buying}
                size="small"
                variant="contained"
                sx={{
                  bgcolor: "#0D6EFD",
                  color: "#FFFFFF",
                }}
              >
                {buying ? "Buying..." : "Buy now"}
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
      <NftDialog
        nftDetail={nftDetail}
        nftTransfer={nftTransfer}
        handleClose={handleClose}
        open={open}
      />
    </>
  );
};

export default NftCard;
