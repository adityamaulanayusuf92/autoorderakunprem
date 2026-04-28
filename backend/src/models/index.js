import pool from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/helpers.js';

export const User = {
  async create(email, password, fullName) {
    const hashedPassword = await hashPassword(password);
    const [result] = await pool.query(
      'INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)',
      [email, hashedPassword, fullName]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, email, full_name, role, is_banned, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async findByGoogleId(googleId) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE google_id = ?',
      [googleId]
    );
    return rows[0];
  },

  async createGoogleUser(googleId, email, fullName) {
    const [result] = await pool.query(
      'INSERT INTO users (google_id, email, full_name) VALUES (?, ?, ?)',
      [googleId, email, fullName]
    );
    return result.insertId;
  },

  async verifyPassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    
    const isValid = await comparePassword(password, user.password);
    return isValid ? user : null;
  },

  async getAll(limit = 50, offset = 0) {
    const [rows] = await pool.query(
      'SELECT id, email, full_name, role, is_banned, created_at FROM users LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  },

  async banUser(id) {
    await pool.query(
      'UPDATE users SET is_banned = TRUE WHERE id = ?',
      [id]
    );
  },

  async unbanUser(id) {
    await pool.query(
      'UPDATE users SET is_banned = FALSE WHERE id = ?',
      [id]
    );
  }
};

export const Product = {
  async create(name, slug, description, price, imageUrl, category) {
    const [result] = await pool.query(
      'INSERT INTO products (name, slug, description, price, image_url, category) VALUES (?, ?, ?, ?, ?, ?)',
      [name, slug, description, price, imageUrl, category]
    );
    return result.insertId;
  },

  async getAll(active = true) {
    const query = active 
      ? 'SELECT * FROM products WHERE is_active = TRUE ORDER BY created_at DESC'
      : 'SELECT * FROM products ORDER BY created_at DESC';
    
    const [rows] = await pool.query(query);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async getBySlug(slug) {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE slug = ?',
      [slug]
    );
    return rows[0];
  },

  async update(id, updates) {
    const allowedFields = ['name', 'description', 'price', 'image_url', 'category', 'is_active'];
    const updateFields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updateFields.length === 0) return;

    values.push(id);
    await pool.query(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
  },

  async getWithStock() {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        COUNT(a.id) as total_accounts,
        SUM(CASE WHEN a.is_sold = FALSE THEN 1 ELSE 0 END) as available_stock
      FROM products p
      LEFT JOIN accounts a ON p.id = a.product_id
      WHERE p.is_active = TRUE
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    return rows;
  },

  async getByCategory(category) {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE category = ? AND is_active = TRUE ORDER BY created_at DESC',
      [category]
    );
    return rows;
  },

  async search(keyword) {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE (name LIKE ? OR description LIKE ?) AND is_active = TRUE',
      [`%${keyword}%`, `%${keyword}%`]
    );
    return rows;
  }
};

export const Account = {
  async create(productId, email, password, tempMailLink) {
    const [result] = await pool.query(
      'INSERT INTO accounts (product_id, email, password, temp_mail_link) VALUES (?, ?, ?, ?)',
      [productId, email, password, tempMailLink]
    );
    return result.insertId;
  },

  async getAvailableByProductId(productId) {
    const [rows] = await pool.query(
      'SELECT * FROM accounts WHERE product_id = ? AND is_sold = FALSE LIMIT 1',
      [productId]
    );
    return rows[0];
  },

  async markAsSold(accountId, orderId) {
    await pool.query(
      'UPDATE accounts SET is_sold = TRUE, sold_at = NOW() WHERE id = ?',
      [accountId]
    );
  },

  async getCountByProductId(productId) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN is_sold = FALSE THEN 1 ELSE 0 END) as available FROM accounts WHERE product_id = ?',
      [productId]
    );
    return rows[0];
  },

  async bulkCreate(productId, accounts) {
    // accounts = [{email, password, tempMailLink}, ...]
    const values = accounts.map(a => [productId, a.email, a.password, a.tempMailLink || null]);
    
    await pool.query(
      'INSERT INTO accounts (product_id, email, password, temp_mail_link) VALUES ?',
      [values]
    );
  }
};

export const Order = {
  async create(userId, items, totalPrice, paymentMethod = 'manual') {
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const [result] = await pool.query(
      'INSERT INTO orders (user_id, order_number, total_price, payment_method) VALUES (?, ?, ?, ?)',
      [userId, orderNumber, totalPrice, paymentMethod]
    );

    const orderId = result.insertId;

    // Insert order items
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    return { id: orderId, orderNumber };
  },

  async getById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async getByUserId(userId, status = null) {
    let query = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async getAll(status = null, limit = 50, offset = 0) {
    let query = 'SELECT * FROM orders';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async updateStatus(orderId, status) {
    await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );
  },

  async getItemsByOrderId(orderId) {
    const [rows] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );
    return rows;
  },

  async updateItemWithAccount(orderItemId, accountId, email, password, tempMailLink) {
    await pool.query(
      'UPDATE order_items SET account_id = ?, account_email = ?, account_password = ?, temp_mail_link = ? WHERE id = ?',
      [accountId, email, password, tempMailLink, orderItemId]
    );
  },

  async getTotalRevenue() {
    const [rows] = await pool.query(
      'SELECT SUM(total_price) as total FROM orders WHERE status = "delivered"'
    );
    return rows[0];
  },

  async getTotalOrders() {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as total FROM orders'
    );
    return rows[0];
  }
};

export const ActivityLog = {
  async create(userId, action, description, ipAddress) {
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)',
      [userId, action, description, ipAddress]
    );
  },

  async getAll(limit = 100, offset = 0) {
    const [rows] = await pool.query(
      'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }
};
