import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const nftsForSaleSchema = mongoose.Schema({
  collectionName: { type: String, required: true },
  description: { type: String },
  name: { type: String },
  imageUrl: { type: String, required: true },
  tokenId: { type: String, required: true },
  tokenContractAddress: { type: String, required: true },
  price: { type: String, required: true },
  seller: { type: String, required: true },
  nonce: { type: Number, required: true, unique: true },
  marketplaceAddress: { type: String, required: true },
  sellerSignature: { type: String, required: true },
  attributes: [{}],
});

nftsForSaleSchema.plugin(mongoosePaginate);

export default mongoose.models.NftsForSale ||
  mongoose.model("NftsForSale", nftsForSaleSchema);
