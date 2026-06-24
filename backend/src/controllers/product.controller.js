const Product = require("../model/products");

/**
 * @desc    Get all products with filtering, searching & pagination
 * @route   GET /api/products
 * @access  Public
 *
 * Supported query params:
 *   search      - full-text search on name / description / brand
 *   category    - filter by category (comma-separated for multiple: "electronics,fashion")
 *   brand       - filter by brand   (comma-separated for multiple: "nike,adidas")
 *   minPrice    - minimum price
 *   maxPrice    - maximum price
 *   inStock     - "true" → only products with stock > 0
 *   rating      - minimum rating (e.g. 4 → 4 stars and above)
 *   isActive    - "true" | "false"  (defaults to true)
 *   sortBy      - field to sort by  (price, rating, createdAt, name)
 *   order       - "asc" | "desc"   (default: desc)
 *   page        - page number       (default: 1)
 *   limit       - results per page  (default: 10, max: 100)
 */
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      rating,
      isActive,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    // ── Build filter object ─────────────────────────────────────────────────
    const filter = {};

    // Active status (default: show only active products)
    filter.isActive = isActive === "false" ? false : true;

    // Full-text search (requires the text index on the schema)
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    // Category — supports comma-separated values
    if (category) {
      const categories = category
        .split(",")
        .map((c) => c.trim().toLowerCase())
        .filter(Boolean);
      filter.category =
        categories.length === 1 ? categories[0] : { $in: categories };
    }

    // Brand — supports comma-separated values (case-insensitive via regex)
    if (brand) {
      const brands = brand
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean);
      filter.brand =
        brands.length === 1
          ? { $regex: new RegExp(`^${brands[0]}$`, "i") }
          : { $in: brands.map((b) => new RegExp(`^${b}$`, "i")) };
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // In-stock only
    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    // Minimum rating
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    // ── Sorting ─────────────────────────────────────────────────────────────
    const allowedSortFields = ["price", "rating", "createdAt", "name", "stock"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    // When doing a text search add relevance score sort
    if (search) {
      sort.score = { $meta: "textScore" };
    }

    // ── Pagination ───────────────────────────────────────────────────────────
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // ── Query ────────────────────────────────────────────────────────────────
    const [products, totalCount] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limitNum).select("-__v"),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    return res.status(200).json({
      success: true,
      meta: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      filters: {
        search: search || null,
        category: category || null,
        brand: brand || null,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        inStock: inStock === "true",
        rating: rating ? Number(rating) : null,
      },
      data: products,
    });
  } catch (error) {
    console.error("getProducts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select("-__v");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }
    console.error("getProductById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

/**
 * @desc    Get distinct categories & brands (useful for frontend filter UI)
 * @route   GET /api/products/meta/filters
 * @access  Public
 */
const getFilterMeta = async (req, res) => {
  try {
    const [categories, brands] = await Promise.all([
      Product.distinct("category", { isActive: true }),
      Product.distinct("brand", { isActive: true }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        categories: categories.sort(),
        brands: brands.sort(),
      },
    });
  } catch (error) {
    console.error("getFilterMeta error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch filter metadata",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private / Admin
 */
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    console.error("createProduct error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private / Admin
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    ).select("-__v");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID format" });
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: "Validation failed", errors });
    }
    console.error("updateProduct error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a product (soft delete — sets isActive: false)
 * @route   DELETE /api/products/:id
 * @access  Private / Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true },
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID format" });
    }
    console.error("deleteProduct error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getFilterMeta,
  createProduct,
  updateProduct,
  deleteProduct,
};
