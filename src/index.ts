// BACKEND API - POS Platform
// File: src/index.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

// Load env
dotenv.config();

// Init Prisma
const prisma = new PrismaClient();

// Init Express
const app = express();
const PORT = 8080; // Hardcoded port, bypass .env

// Middleware
app.use(cors());
app.use(express.json());

// Logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ============ ROUTES ============

// Health check
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'POS Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// CREATE customer
app.post('/api/customers', async (req, res) => {
  try {
    const { name, business, phone, email } = req.body;

    if (!name || !business) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and business are required'
      });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        business,
        phone: phone ?? undefined,
        email: email ?? undefined
      }
    });

    return res.status(201).json({
      status: 'success',
      data: customer
    });
  } catch (error: any) {
    console.error('Error creating customer:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create customer'
    });
  }
});

// GET all customers
app.get('/api/customers', async (_req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: { licenses: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      status: 'success',
      data: customers
    });
  } catch (error: any) {
    console.error('Error getting customers:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get customers'
    });
  }
});

// GET customer by ID
app.get('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { licenses: true }
    });

    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found'
      });
    }

    return res.json({
      status: 'success',
      data: customer
    });
  } catch (error: any) {
    console.error('Error getting customer:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get customer'
    });
  }
});

// GENERATE license
app.post('/api/licenses/generate', async (req, res) => {
  try {
    const { customerId, appType, durationDays } = req.body;

    if (!customerId || !appType) {
      return res.status(400).json({
        status: 'error',
        message: 'customerId and appType are required'
      });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found'
      });
    }

    const licenseKey = nanoid(12);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (durationDays || 30));

    const license = await prisma.license.create({
      data: {
        key: licenseKey,
        customerId,
        appType,
        status: 'pending',
        expiresAt
      },
      include: { customer: true }
    });

    return res.status(201).json({
      status: 'success',
      data: {
        licenseKey,
        license,
        message: `License key generated: ${licenseKey}`
      }
    });
  } catch (error: any) {
    console.error('Error generating license:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate license'
    });
  }
});

// ACTIVATE license
app.post('/api/licenses/activate', async (req, res) => {
  try {
    const { licenseKey } = req.body;

    if (!licenseKey) {
      return res.status(400).json({
        status: 'error',
        message: 'License key is required'
      });
    }

    const license = await prisma.license.findUnique({
      where: { key: licenseKey },
      include: { customer: true }
    });

    if (!license) {
      return res.status(404).json({
        status: 'error',
        message: 'Invalid license key'
      });
    }

    if (license.status === 'active') {
      return res.status(400).json({
        status: 'error',
        message: 'License already activated'
      });
    }

    if (license.expiresAt && new Date() > license.expiresAt) {
      return res.status(400).json({
        status: 'error',
        message: 'License has expired'
      });
    }

    const updatedLicense = await prisma.license.update({
      where: { id: license.id },
      data: {
        status: 'active',
        activatedAt: new Date()
      },
      include: { customer: true }
    });

    return res.json({
      status: 'success',
      data: {
        license: updatedLicense,
        message: 'License activated successfully'
      }
    });
  } catch (error: any) {
    console.error('Error activating license:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to activate license'
    });
  }
});

// VALIDATE license
app.post('/api/licenses/validate', async (req, res) => {
  try {
    const { licenseKey } = req.body;

    if (!licenseKey) {
      return res.status(400).json({
        status: 'error',
        message: 'License key is required'
      });
    }

    const license = await prisma.license.findUnique({
      where: { key: licenseKey },
      include: { customer: true }
    });

    if (!license) {
      return res.status(404).json({
        status: 'error',
        message: 'Invalid license key'
      });
    }

    if (license.status === 'revoked') {
      return res.status(403).json({
        status: 'error',
        message: 'License has been revoked'
      });
    }

    if (license.expiresAt && new Date() > license.expiresAt) {
      return res.status(403).json({
        status: 'error',
        message: 'License has expired',
        expiredAt: license.expiresAt
      });
    }

    if (license.status !== 'active') {
      return res.status(403).json({
        status: 'error',
        message: 'License not yet activated'
      });
    }

    let daysRemaining = null;
    if (license.expiresAt) {
      const diffTime = license.expiresAt.getTime() - new Date().getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return res.json({
      status: 'success',
      data: {
        isValid: true,
        license: {
          id: license.id,
          key: license.key,
          appType: license.appType,
          status: license.status,
          activatedAt: license.activatedAt,
          expiresAt: license.expiresAt,
          daysRemaining
        },
        customer: {
          id: license.customer.id,
          name: license.customer.name,
          business: license.customer.business
        }
      }
    });
  } catch (error: any) {
    console.error('Error validating license:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to validate license'
    });
  }
});

// GET licenses by customer
app.get('/api/licenses/customer/:customerId', async (_req, res) => {
  try {
    const { customerId } = _req.params;

    const licenses = await prisma.license.findMany({
      where: { customerId },
      include: { customer: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      status: 'success',
      data: licenses
    });
  } catch (error: any) {
    console.error('Error getting licenses:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get licenses'
    });
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 POS Platform API                                     ║
║                                                           ║
║   Server running on port ${PORT}                            ║
║   Environment: ${process.env.NODE_ENV || 'development'}                          ║
║                                                           ║
║   Endpoints:                                              ║
║   GET  /                          - Health check          ║
║   POST /api/customers             - Create customer       ║
║   GET  /api/customers             - List customers        ║
║   GET  /api/customers/:id         - Get customer          ║
║   POST /api/licenses/generate     - Generate license      ║
║   POST /api/licenses/activate     - Activate license      ║
║   POST /api/licenses/validate     - Validate license      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
