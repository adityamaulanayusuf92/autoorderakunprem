import { Order, Product, Account, User } from '../models/index.js';
import nodemailer from 'nodemailer';
import { emailConfig } from '../config/mail.js';

const transporter = nodemailer.createTransport(emailConfig);

export const orderController = {
  async create(req, res) {
    try {
      const userId = req.user.userId;
      const { items } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'No items in order' });
      }

      let totalPrice = 0;
      const orderItems = [];

      // Validate and calculate total
      for (const item of items) {
        const product = await Product.getById(item.productId);
        if (!product) {
          return res.status(404).json({ error: `Product ${item.productId} not found` });
        }

        const accountCount = await Account.getCountByProductId(item.productId);
        if (accountCount.available <= 0) {
          return res.status(400).json({ error: `Product ${product.name} is out of stock` });
        }

        totalPrice += product.price * (item.quantity || 1);
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity || 1,
          price: product.price
        });
      }

      const order = await Order.create(userId, orderItems, totalPrice);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          totalPrice,
          status: 'pending'
        }
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  },

  async getMyOrders(req, res) {
    try {
      const userId = req.user.userId;
      const { status } = req.query;

      const orders = await Order.getByUserId(userId, status);

      // Get items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await Order.getItemsByOrderId(order.id);
          return { ...order, items };
        })
      );

      res.json({
        success: true,
        orders: ordersWithItems
      });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const order = await Order.getById(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Check if this order belongs to the user
      if (order.user_id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      const items = await Order.getItemsByOrderId(id);

      res.json({
        success: true,
        order: { ...order, items }
      });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  },

  async confirmPayment(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.getById(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.user_id !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Get order items
      const items = await Order.getItemsByOrderId(id);

      // Auto delivery: assign accounts and send email
      for (const item of items) {
        // Get available account
        const account = await Account.getAvailableByProductId(item.product_id);

        if (!account) {
          return res.status(400).json({ error: 'No available account for delivery' });
        }

        // Mark account as sold
        await Account.markAsSold(account.id, id);

        // Update order item with account details
        await Order.updateItemWithAccount(
          item.id,
          account.id,
          account.email,
          account.password,
          account.temp_mail_link
        );

        // Send email to user
        const user = await User.findById(order.user_id);
        if (user && user.email) {
          try {
            const product = await Product.getById(item.product_id);
            await transporter.sendMail({
              from: process.env.MAIL_USER || 'noreply@dokzstore.com',
              to: user.email,
              subject: `Your Account Details for ${product.name}`,
              html: `
                <h2>Account Delivered</h2>
                <p>Thank you for your purchase!</p>
                <p><strong>Order Number:</strong> ${order.order_number}</p>
                <p><strong>Product:</strong> ${product.name}</p>
                <h3>Account Details:</h3>
                <p><strong>Email:</strong> ${account.email}</p>
                <p><strong>Password:</strong> ${account.password}</p>
                ${account.temp_mail_link ? `<p><strong>Temp Mail Link:</strong> <a href="${account.temp_mail_link}">Click here</a></p>` : ''}
                <p>Please keep your credentials safe!</p>
              `
            });
          } catch (emailError) {
            console.error('Email send error:', emailError);
          }
        }
      }

      // Update order status to delivered
      await Order.updateStatus(id, 'delivered');

      res.json({
        success: true,
        message: 'Payment confirmed and account delivered'
      });
    } catch (error) {
      console.error('Confirm payment error:', error);
      res.status(500).json({ error: 'Failed to process payment' });
    }
  },

  // Admin only
  async getAll(req, res) {
    try {
      const { status, limit = 50, offset = 0 } = req.query;

      const orders = await Order.getAll(status, parseInt(limit), parseInt(offset));

      // Get items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await Order.getItemsByOrderId(order.id);
          return { ...order, items };
        })
      );

      res.json({
        success: true,
        orders: ordersWithItems
      });
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  },

  async approvePendingOrder(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.getById(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.status !== 'pending') {
        return res.status(400).json({ error: 'Order is not pending' });
      }

      // Mark as paid
      await Order.updateStatus(id, 'paid');

      // Auto delivery
      const items = await Order.getItemsByOrderId(id);

      for (const item of items) {
        const account = await Account.getAvailableByProductId(item.product_id);

        if (!account) {
          await Order.updateStatus(id, 'pending');
          return res.status(400).json({ error: 'No available account for delivery' });
        }

        await Account.markAsSold(account.id, id);
        await Order.updateItemWithAccount(
          item.id,
          account.id,
          account.email,
          account.password,
          account.temp_mail_link
        );
      }

      await Order.updateStatus(id, 'delivered');

      res.json({
        success: true,
        message: 'Order approved and delivered'
      });
    } catch (error) {
      console.error('Approve order error:', error);
      res.status(500).json({ error: 'Failed to approve order' });
    }
  }
};
