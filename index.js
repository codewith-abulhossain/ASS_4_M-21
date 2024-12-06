//  index.js
const express = require("express");
const mongoose = require("mongoose");
const router = require("./src/routes/api.js");

const app = express();
app.use(express.json());

const mongoURI = "mongodb://localhost:27017/products_db";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/", router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// index.js end

// **** api.js
const express = require("express");
const {
  createProduct,
  getSingleProduct,
  deleteSingleProduct,
  updateProductById,
} = require("../controllers/productControllers");
const router = express.Router();

router.post("/create-product", createProduct);
router.get("/products/:productId", getSingleProduct);
router.delete("/delete-product/:productId", deleteSingleProduct);
router.put("/update-product/:productId", updateProductById);

module.exports = router;
//  api.js

//  productControllers.js
const productModel = require("../model/ProductModel");

const createProduct = async (req, res) => {
  try {
    const newProduct = await productModel.create(req.body);

    res.status(201).json({
      type: "success",
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      type: "fail",
      message: "Error creating product",
      error: error.message,
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        type: "fail",
        message: "Product not found",
      });
    }

    res.status(200).json({
      type: "success",
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      type: "fail",
      message: "Error fetching product",
      error: error.message,
    });
  }
};

const deleteSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await productModel.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({
        type: "fail",
        message: "Product not found",
      });
    }
    res.status(200).json({
      type: "success",
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      type: "fail",
      message: "Error deleting product",
      error: error.message,
    });
  }
};

const updateProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        type: "fail",
        message: "Product not found",
      });
    }
    res.status(200).json({
      type: "success",
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      type: "fail",
      message: "Error updating product",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getSingleProduct,
  deleteSingleProduct,
  updateProductById,
};
