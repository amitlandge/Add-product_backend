const bcrypt = require("bcrypt");

const Jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const Product = require("../model/productSchema");
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!(name && email && password)) {
      throw {
        message: "Please Enter Valid Information",
      };
    }
    const user = await User.findOne({ email });
    if (user) {
      throw {
        message: "Your Email is already used",
      };
    }
    const bcryptPass = await bcrypt.hash(password, 10);
    const user_data = await User.create({
      name,
      email,
      password: bcryptPass,
    });
    const generateToken = Jwt.sign({ user_data }, process.env.SECRETE_KEY, {
      expiresIn: "2hr",
    });
    user_data.password = undefined;
    user_data.token = generateToken;
    res.status(200).json({
      success: true,
      user_data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      throw {
        message: "Please fill Valid Information",
      };
    }
    let user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const generateToken = Jwt.sign({ user }, process.env.SECRETE_KEY, {
        expiresIn: "2hr",
      });
      user.token = generateToken;
      user.password = undefined;
      res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const addProducts = async (req, res) => {
  try {
    const { name, description, category, price, userId } = req.body;
    if (!(name && description && category && price && userId)) {
      throw {
        message: "Please Fill Valid Information",
      };
    }
    const product = await Product.create({
      name,
      description,
      category,
      price,
      userId,
    });
    await product.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const getProductByUserId = async (req, res) => {
  try {
    const id = req.params.userId;
    const products = await Product.find({ userId: id });
    if (!products) {
      throw {
        success: false,
        message: "no products found",
      };
    }
    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    const deleteProduct = await Product.findByIdAndDelete(id);
    if (!deleteProduct) {
      throw new Error("not deleted");
    }
    res.status(200).json({
      deleteProduct,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getProductByProductId = async (req, res) => {
  try {
    const id = req.params.productId;
    const update_product = await Product.findById(id);
    if (!update_product) {
      throw {
        message: "Failed",
      };
    }
    res.status(200).json({
      update_product,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateProductByProductId = async (req, res) => {
  try {
    const { name, description, category, price } = req.body;
    if (!(name && description && category && price)) {
      throw {
        message: "Please Fill All Information",
      };
    }
    const id = req.params.productId;
    const update = await Product.updateOne(
      { _id: id },
      {
        $set: req.body,
      }
    );

    res.status(200).json({
      success: true,
      update,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const serachProductById = async (req, res) => {
  try {
    const response = await Product.find({
      userId: req.params.userId,
      $or: [
        { name: { $regex: req.params.key, $options: "i" } },
        { description: { $regex: req.params.key, $options: "i" } },
        { category: { $regex: req.params.key, $options: "i" } },
      ],
    });
    if (!response) {
      throw { message: "failed response" };
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.signup = signup;
exports.signin = signin;
exports.addProducts = addProducts;
exports.getProductByProductId = getProductByProductId;
exports.getProductByUserId = getProductByUserId;
exports.deleteProduct = deleteProduct;
exports.updateProductByProductId = updateProductByProductId;
exports.serachProductById = serachProductById;
