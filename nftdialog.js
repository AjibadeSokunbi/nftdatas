import {
    Box,
    Button,
    Dialog,
    Stack,
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
  } from "@mui/material";
  import { useTheme } from "@mui/material/styles";
  import { makeWalletAddress, convertDate } from "../../utils";
  import GradingIcon from "@mui/icons-material/Grading";
  import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
  import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
  import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
  import { useQuery } from "@apollo/client";
  import { NFT_RARITY, TOP_BUYERS_QUERY } from "../../queries/graphqlQueries";
  import { useEffect, useState } from "react";
  import { getClient } from "@reservoir0x/reservoir-sdk";
  import { ethers } from "ethers";
  
  export default function NftDialog({
    open,
    nftDetail,
    nftTransfer,
    handleClose,
  }) {
    //   console.log(nftDetail);
    const theme = useTheme();
    const [buying, setBuying] = useState(false);
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
  
    const signer = provider.getSigner(window.ethereum._state.accounts[0]);
  
    const handleBuyToken = async () => {
      setBuying(true);
      try {
        if (signer) {
          await getClient()?.actions.buyToken({
            tokens: [
              {
                tokenId: nftDetail.token_id,
                contract: nftDetail.asset_contract.address,
              },
            ],
            signer: signer,
            onProgress: (steps) => {
              console.log(steps);
            },
          });
          setBuying(false);
        }
      } catch (error) {
        console.error(`this is the error: ${error.response.data.message}`);
        setBuying(false);
      }
    };
  
    const Boxy = () => {
      const [rarity, setRarity] = useState(null);
      const { data, loading, error, refetch } = useQuery(NFT_RARITY, {
        variables: {
          input: {
            collectionSlug: nftDetail?.collection?.name
              .toLowerCase()
              .replaceAll(" ", "-"),
            nftId: Number(nftDetail?.token_id),
          },
        },
      });
  
      useEffect(() => {
        if (data?.getNftRarity?.result) {
          setRarity(JSON.parse(data?.getNftRarity?.result));
        }
      }, [data]);
  
      return (
        <Box
          sx={{
            borderRadius: 3,
            bgcolor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(4px)",
            p: 5,
            px: 4,
            width: "100%",
          }}
        >
          <Box
            sx={{
              borderRadius: 3,
              bgcolor: "transparent",
              backdropFilter: "blur(4px)",
              p: 5,
              px: 4,
            }}
          >
            <Stack gap={4}>
              <Stack flexDirection="row" gap={4}>
                <Box flex={5}>
                  <Box
                    sx={{
                      borderRadius: 3,
                      bgcolor: "#343A40",
                    }}
                  >
                    <Box
                      sx={{
                        height: 250,
                        backgroundImage: `url(${nftDetail.image_url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "100% 100%",
                        borderRadius: 3,
                        width: "100%",
                      }}
                    ></Box>
                    <Box p={2}>
                      <Box>
                        <Stack flexDirection="row" justifyContent="space-between">
                          <Typography>{nftDetail.name}</Typography>
                          <Typography></Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={700}>
                          #{nftDetail.token_id}
                        </Typography>
                      </Box>
                      <Stack flexDirection="row" alignItems="center" gap={0.5}>
                        <PersonOutlineOutlinedIcon />
                        {/* <Typography variant="caption">
                          {makeWalletAddress(
                            Object.keys(nftDetail).length !== 0
                              ? nftDetail.owner.address
                              : "",
                            8,
                            0
                          )}
                        </Typography> */}
                      </Stack>
                      <Stack
                        flexDirection="row"
                        justifyContent="space-between"
                        sx={{
                          pt: 2,
                        }}
                      >
                        <Stack flexDirection="row" alignItems="center" gap={1}>
                          <FavoriteBorderIcon />
                          <Typography>0</Typography>
                        </Stack>
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
                </Box>
                <Stack
                  flex={7}
                  gap={2}
                  sx={{
                    borderRadius: 3,
                    bgcolor: theme.palette.background.default,
                    p: 2,
                  }}
                >
                  <Typography variant="h5" sx={{ textTransform: "uppercase" }}>
                    Traits
                  </Typography>
                  <Stack
                    alignItems="center"
                    justifyContent="space-between"
                    flexDirection="row"
                    gap={2}
                    sx={{
                      px: 2,
                      borderRadius: 3,
                      bgcolor: theme.palette.background.paper,
                      py: 0.5,
                    }}
                  >
                    <Stack gap={2} alignItems="center" flexDirection="row">
                      <Typography variant="subtitle1">Rarity Score</Typography>
                      <Button
                        variant="contained"
                        size="small"
                        color="warning"
                        sx={{
                          px: 2,
                        }}
                      >
                        {!!rarity?.rarityScore ? rarity.rarityScore : 0}
                      </Button>
                    </Stack>
  
                    <Stack gap={2} alignItems="center" flexDirection="row">
                      <Typography variant="subtitle1">Rank</Typography>
                      <Button
                        variant="contained"
                        size="small"
                        color="warning"
                        sx={{
                          px: 2,
                        }}
                      >
                        {!!rarity?.rank ? rarity.rank : 0}
                      </Button>
                    </Stack>
                  </Stack>
                  <Box>
                    <TableContainer>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow sx={{ "& th": { px: 0, py: 1, border: 0 } }}>
                            <TableCell align="left">Traits Type</TableCell>
                            <TableCell align="left">Value</TableCell>
                            <TableCell align="left">%</TableCell>
                            {/* <TableCell align="right">Floor Price(ETH)</TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {nftDetail.traits && nftDetail.traits.length ? (
                            nftDetail.traits.map((row, key) => (
                              <TableRow
                                key={key}
                                sx={{ "& td, & th": { border: 0, py: 1, px: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.trait_type}
                                </TableCell>
                                <TableCell align="left">{row.value}</TableCell>
                                <TableCell
                                  align="left"
                                  sx={{ color: theme.palette.primary.main }}
                                >
                                  {row.trait_count}
                                </TableCell>
                                {/* <TableCell align="right" sx={{ color: theme.palette.warning.main }}>{`1`}</TableCell> */}
                              </TableRow>
                            ))
                          ) : (
                            <></>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Stack>
              </Stack>
              <Stack
                flexDirection="row"
                justifyContent="space-between"
                sx={{
                  bgcolor: theme.palette.background.default,
                  p: 4,
                  borderRadius: 4,
                }}
              >
                <Box>
                  <Typography variant="body1" sx={{ textAlign: "center" }}>
                    Floor Price
                  </Typography>
                  <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
                    -
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ textAlign: "center" }}>
                    7D Sales
                  </Typography>
                  <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
                    -
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ textAlign: "center" }}>
                    Total Sales
                  </Typography>
                  <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
                    {nftDetail.num_sales}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ textAlign: "center" }}>
                    Past Owners
                  </Typography>
                  <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
                    {nftTransfer.result && nftTransfer.result.length
                      ? nftTransfer.result.length
                      : 0}
                  </Typography>
                </Box>
              </Stack>
              <Stack
                sx={{
                  bgcolor: theme.palette.background.default,
                  p: 4,
                  borderRadius: 4,
                }}
              >
                <Stack
                  flexDirection="row"
                  gap={1}
                  alignItems="center"
                  sx={{ pb: 1 }}
                >
                  <GradingIcon />
                  <Typography variant="h5">Activity</Typography>
                </Stack>
                <TableContainer>
                  <Table aria-label="simple table">
                    <TableBody>
                      <TableRow sx={{ "& td": { px: 0, py: 1, border: 0 } }}>
                        <TableCell align="left">Action</TableCell>
                        <TableCell align="left">Price</TableCell>
                        <TableCell align="left">Quantity</TableCell>
                        <TableCell align="right">From</TableCell>
                        <TableCell align="right">To</TableCell>
                        {/* <TableCell align="right">Gas</TableCell> */}
                        <TableCell align="right">Date</TableCell>
                      </TableRow>
                      {nftTransfer.result && nftTransfer.result.length ? (
                        nftTransfer.result.map((row, key) => (
                          <TableRow
                            key={key}
                            sx={{ "& td, & th": { border: 0, py: 1, px: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {/* {row.name} */}-
                            </TableCell>
                            <TableCell align="left">
                              {row.value / Math.pow(10, 18)}
                            </TableCell>
                            <TableCell align="left">{row.amount}</TableCell>
                            <TableCell align="right">
                              {makeWalletAddress(row.from_address, 8, 0)}
                            </TableCell>
                            <TableCell align="right">
                              {makeWalletAddress(row.to_address, 8, 0)}
                            </TableCell>
                            {/* <TableCell align="right">
                                                  <Stack flexDirection="row" justifyContent="flex-end" gap={1} alignItems="center">
                                                      <LocalGasStationIcon fontSize="small" sx={{ color: '#FF3434' }} />
                                                      <Box component="span">
                                                          0
                                                      </Box>
                                                  </Stack>
                                              </TableCell> */}
                            <TableCell align="right">
                              {convertDate(row.block_timestamp)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <></>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </Stack>
          </Box>
        </Box>
      );
    };
  
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 4,
            bgcolor: "transparent",
            minWidth: 991,
          },
        }}
      >
        {open ? <Boxy /> : null}
      </Dialog>
    );
  }
  
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24),
    createData("Ice cream sandwich", 237, 9.0, 37),
    createData("Eclair", 262, 16.0, 24),
    createData("Cupcake", 305, 3.7, 67),
    createData("Gingerbread", 356, 16.0, 49),
  ];
  