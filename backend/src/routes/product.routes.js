const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  getFilterMeta,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// ── Public routes ────────────────────────────────────────────────────────────

// GET /api/products/meta/filters  →  distinct categories & brands for filter UI
// NOTE: must be declared BEFORE /:id so Express doesn't treat "meta" as an id
router.get("/meta/filters", getFilterMeta);

// GET /api/products               →  list with search, filters & pagination
router.get("/", getProducts);

// GET /api/products/:id           →  single product
router.get("/:id", getProductById);

// ── Admin / Protected routes  (attach your auth middleware here) ─────────────
// e.g. router.use(authMiddleware, adminMiddleware);

// POST   /api/products            →  create product
router.post("/", createProduct);

// PUT    /api/products/:id        →  update product
router.put("/:id", updateProduct);

// DELETE /api/products/:id        →  soft-delete product
router.delete("/:id", deleteProduct);

module.exports = router;