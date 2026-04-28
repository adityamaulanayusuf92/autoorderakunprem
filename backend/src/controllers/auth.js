import { User } from '../models/index.js';
import { generateToken } from '../config/auth.js';
import { ActivityLog } from '../models/index.js';

export const authController = {
  async register(req, res) {
    try {
      const { email, password, fullName } = req.body;

      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const userId = await User.create(email, password, fullName);
      const token = generateToken(userId);

      await ActivityLog.create(userId, 'register', 'User registered', req.ip);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: { id: userId, email, fullName }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const user = await User.verifyPassword(email, password);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (user.is_banned) {
        return res.status(403).json({ error: 'Account has been banned' });
      }

      const token = generateToken(user.id, user.role);

      await ActivityLog.create(user.id, 'login', 'User logged in', req.ip);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  },

  async googleAuth(req, res) {
    try {
      const { googleId, email, fullName } = req.body;

      if (!googleId || !email) {
        return res.status(400).json({ error: 'Missing google credentials' });
      }

      let user = await User.findByGoogleId(googleId);

      if (!user) {
        const existingEmailUser = await User.findByEmail(email);
        if (existingEmailUser) {
          return res.status(400).json({ error: 'Email already registered with password' });
        }

        const userId = await User.createGoogleUser(googleId, email, fullName);
        user = await User.findById(userId);

        await ActivityLog.create(userId, 'google_register', 'Registered via Google', req.ip);
      } else {
        await ActivityLog.create(user.id, 'google_login', 'Logged in via Google', req.ip);
      }

      const token = generateToken(user.id, user.role);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({ error: 'Google authentication failed' });
    }
  },

  async me(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!user || user.is_banned) {
        return res.status(401).json({ error: 'User not found or banned' });
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user info' });
    }
  }
};
