import { Product, Account, User, Order, ActivityLog } from '../models/index.js';

export const adminController = {
  async getDashboard(req, res) {
    try {
      const totalOrdersResult = await Order.getTotalOrders();
      const revenueResult = await Order.getTotalRevenue();

      const [userCountResult] = await require('../config/database.js').default.query(
        'SELECT COUNT(*) as total FROM users'
      );

      const [productCountResult] = await require('../config/database.js').default.query(
        'SELECT COUNT(*) as total FROM products'
      );

      res.json({
        success: true,
        dashboard: {
          totalOrders: totalOrdersResult.total,
          totalRevenue: revenueResult.total || 0,
          totalUsers: userCountResult[0].total,
          totalProducts: productCountResult[0].total
        }
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard' });
    }
  },

  async addProduct(req, res) {
    try {
      const { name, slug, description, price, imageUrl, category } = req.body;

      if (!name || !slug || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const id = await Product.create(name, slug, description, price, imageUrl, category);

      res.status(201).json({
        success: true,
        message: 'Product added',
        productId: id
      });
    } catch (error) {
      console.error('Add product error:', error);
      res.status(500).json({ error: 'Failed to add product' });
    }
  },

  async updateProduct(req, res) {
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

  async deleteProduct(req, res) {
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
  },

  async bulkRestockAccounts(req, res) {
    try {
      const { productId, accounts } = req.body;

      if (!productId || !accounts || accounts.length === 0) {
        return res.status(400).json({ error: 'Invalid product or accounts' });
      }

      const product = await Product.getById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Parse accounts format: email|password|link
      const parsedAccounts = accounts.map(acc => {
        if (typeof acc === 'string') {
          const parts = acc.split('|');
          return {
            email: parts[0]?.trim(),
            password: parts[1]?.trim(),
            tempMailLink: parts[2]?.trim() || null
          };
        }
        return acc;
      });

      await Account.bulkCreate(productId, parsedAccounts);

      res.json({
        success: true,
        message: `${parsedAccounts.length} accounts added to ${product.name}`
      });
    } catch (error) {
      console.error('Bulk restock error:', error);
      res.status(500).json({ error: 'Failed to restock accounts' });
    }
  },

  async getUsers(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;

      const users = await User.getAll(parseInt(limit), parseInt(offset));

      res.json({
        success: true,
        users
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },

  async banUser(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await User.banUser(userId);

      res.json({
        success: true,
        message: 'User banned'
      });
    } catch (error) {
      console.error('Ban user error:', error);
      res.status(500).json({ error: 'Failed to ban user' });
    }
  },

  async unbanUser(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await User.unbanUser(userId);

      res.json({
        success: true,
        message: 'User unbanned'
      });
    } catch (error) {
      console.error('Unban user error:', error);
      res.status(500).json({ error: 'Failed to unban user' });
    }
  },

  async getActivityLogs(req, res) {
    try {
      const { limit = 100, offset = 0 } = req.query;

      const logs = await ActivityLog.getAll(parseInt(limit), parseInt(offset));

      res.json({
        success: true,
        logs
      });
    } catch (error) {
      console.error('Get logs error:', error);
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  }
};
