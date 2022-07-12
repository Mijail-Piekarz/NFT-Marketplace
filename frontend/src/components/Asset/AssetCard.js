import { Alert, Dialog, DialogContent, Snackbar } from "@mui/material";
import axios from "axios";
import { utils } from "ethers";
import { useEffect, useState } from "react";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { FaEthereum } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import useBuyCoordinator from "../../hooks/useBuyCoordinator";
import ModifiedDialogTitle from "../ModifiedMuiComponents/ModifiedDialogTitle";
import SecondaryButton from "../SecondaryButton";
import Sell from "./Sell";

function AssetCard() {
  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100));
  const [ethUsd, setEthUsd] = useState();
  const [onSale, setOnSale] = useState();
  const [transactionFailureAlert, setTransactionFailureAlert] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const location = useLocation();

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
  };

  const { buyCoordinator, buyStatus } = useBuyCoordinator(
    location.state.contractAddress,
    location.state.tokenId
  );

  useEffect(() => {
    fetchNft();
  }, []);

  useEffect(() => {
    if (!location.state.ethUsd) {
      fetchEthPrice();
    }
  }, []);

  const fetchNft = async () => {
    let onSale;
    try {
      onSale = await axios({
        method: "get",
        url: "http://localhost:8000/api/nfts/nftsforsale/getnft",
        params: {
          contractAddress: location.state.contractAddress,
          tokenId: location.state.tokenId,
        },
      }).then((res) => res.data.nftForSale);
    } catch (err) {
      console.log(err);
    }
    console.log("🚀 ~ onSale", onSale);
    setOnSale(onSale.length ? true : false);
  };

  const fetchEthPrice = async () => {
    const ethUsd = await fetch(
      "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=2TK8NI1JT3WXC7WCCFQP8V3Q22J347ZC5F"
    ).then((res) => res.json().result.ethusd);
    setEthUsd(ethUsd);
  };

  const handleTransactionFailureAlertClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setTransactionFailureAlert(false);
  };

  function likeIcon() {
    if (isLike) {
      return (
        <BsSuitHeartFill
          size="32px"
          onClick={() => {
            setIsLike(false);
            setLikeCount(likeCount - 1);
          }}
        />
      );
    } else {
      return (
        <BsSuitHeart
          size="32px"
          onClick={() => {
            setIsLike(true);
            setLikeCount(likeCount + 1);
          }}
        />
      );
    }
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl flex flex-col md:grid md:grid-cols-2">
        <div className="w-full">
          <img
            src={location.state.imagePath}
            alt="NFT image"
            className="w-full h-full object-cover aspect-square"
          />
        </div>
        <div className="bg-onPrimary p-6 flex flex-col gap-6">
          <h4>{location.state.collectionName}</h4>
          <h3 className="text-2xl font-bold text-left">
            {location.state.name
              ? location.state.name
              : `#${location.state.tokenId}`}
          </h3>

          {console.log(`onSale = ${onSale}`)}
          {onSale === false && (
            <p className="text-sm text-gray-500">Not for sale</p>
          )}

          {location.state.price && (
            <div className="flex gap-3 items-center">
              <div className="flex items-center">
                <FaEthereum />
                <p className="text-left text-xl font-semibold">
                  {utils.formatEther(location.state.price)}
                </p>
              </div>
              <p>
                {location.state.ethUsd
                  ? `$${location.state.ethUsd}`
                  : ethUsd
                  ? `$${ethUsd}`
                  : ""}
              </p>
            </div>
          )}
          <p className="text-left line-clamp-[10] md:line-clamp-5 lg:line-clamp-[10]">
            {location.state.description
              ? location.state.description
              : "This item has no description."}
          </p>
          {location.state.status === "Sell" ? (
            onSale === false ? (
              <Sell
                collectionName={location.state.collectionName}
                description={location.state.description}
                name={location.state.name}
                imageUrl={location.state.imagePath}
                tokenId={location.state.tokenId}
                attributes={location.state.attributes}
                tokenContractAddress={location.state.contractAddress}
                setTransactionFailureAlert={setTransactionFailureAlert}
                setShowSuccessDialog={setShowSuccessDialog}
                setOnSale={setOnSale}
              />
            ) : null
          ) : (
            location.state.status === "Buy" && (
              <div className="w-full md:w-56 mt-4 mb-6 md:mb-0 flex flex-col gap-3">
                <SecondaryButton
                  text="Buy"
                  onClick={() => {
                    buyCoordinator();
                  }}
                />
              </div>
            )
          )}
          <div className="flex justify-between mt-auto">
            <div className="flex items-center gap-2 ">
              {location.state.creatorImagePath && (
                <img
                  src={location.state.creatorImagePath}
                  alt=""
                  className="w-8 h-8 bg-gray-500 object-cover rounded-full"
                />
              )}
              {location.state.creatorName && (
                <h4 className="text-base">{location.state.creatorName}</h4>
              )}
            </div>
            <div className="flex gap-2 items-center cursor-pointer">
              {likeIcon()}
              <p className="text-base">{likeCount}</p>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={transactionFailureAlert}
        autoHideDuration={6000}
        onClose={handleTransactionFailureAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={handleTransactionFailureAlertClose}
        >
          The transaction has been canceled!
        </Alert>
      </Snackbar>
      <Dialog
        onClose={handleSuccessDialogClose}
        open={showSuccessDialog}
        PaperProps={{
          style: { padding: "1.5rem" },
        }}
      >
        <ModifiedDialogTitle
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
          onClose={handleSuccessDialogClose}
        >
          Congratulations!
          <br />
          Your NFT was listed for sale.
        </ModifiedDialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignItems: "center",
            padding: "0px",
          }}
        >
          Your NFT will be shown on the marketplace accordingly to user
          interest.
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AssetCard;
