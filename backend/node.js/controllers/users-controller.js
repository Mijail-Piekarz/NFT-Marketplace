import axios from "axios";
import FormData from "form-data";
import User from "../models/User";

export const changeBannerImage = async (req, res) => {
  console.log("Changing banner image...");

  const newBannerImage = req.files.bannerImage;
  const { account } = req.body;

  const base64EncodedImage = Buffer.from(newBannerImage.data).toString(
    "base64"
  );

  const formData = new FormData();
  formData.append("image", base64EncodedImage);

  let newBannerImageData = null;
  try {
    console.log("Uploading image data to hosting service...");
    newBannerImageData = await axios
      .post("https://api.imgbb.com/1/upload", formData, {
        params: {
          //'expiration': '600',
          key: process.env.IMGBB_API_KEY,
        },
        headers: {
          ...formData.getHeaders(),
        },
      })
      .then((res) => res.data);
    console.log("Image uploaded!");
  } catch (err) {
    console.log("Error uploading image!");
    console.log(err);
  }

  const userToUpdate = await User.findOne({ account: account });

  if (newBannerImageData) {
    try {
      if (userToUpdate) {
        console.log("User with this account exists. Updating...");
        userToUpdate.bannerImage = newBannerImageData.data.url;
        await userToUpdate.save();
      } else {
        console.log("User with this account not found. Creating new user...");
        const newUser = await new User({
          account: account,
          bannerImage: newBannerImageData.data.url,
        });
        await newUser.save();
      }
      console.log("Success!");
      console.log(`newBannerImage = ${newBannerImageData.data.url}`);
      return res.status(200).json({
        success: true,
        newBannerImageURL: newBannerImageData.data.url,
      });
    } catch (err) {
      console.log("ERROR!");
      console.log(err);
    }
  }

  return res.status(400).json({ success: false });
};

export const changeRoundedIconImage = async (req, res) => {
  console.log("Changing rounded icon image...");
  const newRoundedIconImage = req.files.roundedIconImage;
  const { account } = req.body;

  const base64EncodedImage = Buffer.from(newRoundedIconImage.data).toString(
    "base64"
  );

  const formData = new FormData();
  formData.append("image", base64EncodedImage);
  let newRoundedIconImageData = null;

  try {
    console.log("Uploading image data to hosting service...");
    newRoundedIconImageData = await axios
      .post("https://api.imgbb.com/1/upload", formData, {
        params: {
          //'expiration': '600',
          key: process.env.IMGBB_API_KEY,
        },
        headers: {
          ...formData.getHeaders(),
        },
      })
      .then((res) => res.data);
    console.log("Image uploaded!");
  } catch (err) {
    console.log("Error uploading image!");
    console.log(err);
  }

  const userToUpdate = await User.findOne({ account: account });

  if (newRoundedIconImageData) {
    try {
      if (userToUpdate) {
        console.log("User with this account exists. Updating...");
        userToUpdate.roundedIconImage = newRoundedIconImageData.data.url;
        await userToUpdate.save();
      } else {
        console.log("User with this account not found. Creating new user...");
        const newUser = await new User({
          account: account,
          roundedIconImage: newRoundedIconImageData.data.url,
        });
        await newUser.save();
      }
      console.log("Success!");
      console.log(`newRoundedIconImage = ${newRoundedIconImageData.data.url}`);
      return res.status(200).json({
        success: true,
        newRoundedIconImage: newRoundedIconImageData.data.url,
      });
    } catch (err) {
      console.log("ERROR!");
      console.log(err);
    }
  }
  return res.status(400).json({ success: false });
};

export const getUser = async (req, res) => {
  console.log("Initializing getUser...");
  const account = req.params.account;

  let user;
  try {
    console.log("Looking for user...");
    user = await User.findOne({ account: account }).populate(
      "collectionsCreated"
    );
    console.log("User found.");
    console.log(`User = ${user}`);
  } catch (err) {
    console.log("ERROR!");
    console.log(err);
  }

  if (user) {
    return res.status(200).json({ success: true, user });
  } else {
    return res.status(404).json({ success: false, message: "User not found" });
  }
};

export const addCollection = async (req, res) => {
  console.log("Initializing addCollection");
  const { account, collectionId } = req.body;

  const userExists = await User.findOne({ account: account });

  if (!userExists) {
  }

  const collectionExists = await User.findOne({
    account: account,
    collectionsCreated: collectionId,
  });

  if (collectionExists) {
    console.log("ERROR! Collection already exists!");
    return res.status(409).json({
      success: false,
      message: "Collection already exists",
    });
  } else {
    console.log("Updating user");
    try {
      const res = await User.updateOne(
        {
          account: account,
        },
        {
          $push: {
            collectionsCreated: collectionId,
          },
        }
      );
      console.log("User updated!");
    } catch (err) {
      console.log("ERROR!");
      console.log(err);
      return res.status(400).json({ success: false, message: err });
    }
  }
  return res.status(200).json({ success: true });
};

export const createUser = async (req, res) => {
  console.log("Initializing createUser...");
  const { account } = req.body;

  const exists = await User.findOne({ account: account });
  if (exists) {
    console.log("ERROR! User already exists");
    return res
      .status(409)
      .json({ success: false, message: "User already exists" });
  }

  try {
    console.log("Creating user...");
    const newUser = await new User({ account: account });
    await newUser.save();
    console.log("Success!");
    console.log(`newUser = ${newUser}`);
    return res.status(200).json({ success: true, newUser });
  } catch (err) {
    console.log("ERROR!");
    console.log(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};
