const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  signin,
  signup,
  addProducts,
  getProductByUserId,
  deleteProduct,
  getProductByProductId,
  updateProductByProductId,
  serachProductById,
} = require("../Controller/productController");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/add-product", addProducts);
router.delete("/delete/:productId", deleteProduct);
router.get("/getProduct/:productId", getProductByProductId);
router.put("/update-product/:productId", updateProductByProductId);
router.get("/search/:key/:userId", serachProductById);
router.use(auth);
router.get("/products/:userId", getProductByUserId);

module.exports = router;
