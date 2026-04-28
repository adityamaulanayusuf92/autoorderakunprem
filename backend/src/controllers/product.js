import { Product, Account } from '../models/index.js';

export const productController = {
  async getAll(req, res) {
    try {
      const products = await Product.getWithStock();
      
      const productsWithStatus = products.map(p => ({
        ...p,
        status: p.available_stock > 0 ? 'available' : 'out_of_stock'
      }));

      res.json({
        success: true,
        products: productsWithStatus
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.getById(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const accountCount = await Account.getCountByProductId(id);

      res.json({
        success: true,
        product: {
          ...product,
          total_accounts: accountCount.total,
          available_stock: accountCount.available,
          status: accountCount.available > 0 ? 'available' : 'out_of_stock'
        }
      });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  },

  async search(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length === 0) {
        return res.status(400).json({ error: 'Search query required' });
      }

      const products = await Product.search(q);

      res.json({
        success: true,
        products
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  },

  async getByCategory(req, res) {
    try {
      const { category } = req.params;
      const products = await Product.getByCategory(category);

      res.json({
        success: true,
        category,
        products
      });
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  // Admin only
  async create(req, res) {
    try {
      const { name, slug, description, price, imageUrl, category } = req.body;

      if (!name || !slug || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const id = await Product.create(name, slug, description, price, imageUrl, category);

      res.status(201).json({
        success: true,
        message: 'Product created',
        productId: id
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const product = await Product.getById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await Product.update(id, updates);

      res.json({
        success: true,
        message: 'Product updated'
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.getById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await Product.delete(id);

      res.json({
        success: true,
        message: 'Product deleted'
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
};
