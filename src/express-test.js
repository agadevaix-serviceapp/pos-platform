// Express minimal test
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Express is working!' });
});

// Create customer route - LANGSUNG DI SINI (tidak import dari file lain)
app.post('/api/customers', async (req, res) => {
  console.log('Body received:', req.body);
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const { name, business } = req.body;
    
    if (!name || !business) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and business are required'
      });
    }
    
    const customer = await prisma.customer.create({
      data: { name, business }
    });
    
    console.log('Customer created:', customer.id);
    
    res.status(201).json({
      status: 'success',
      data: customer
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
  console.log(`Test: curl http://localhost:${PORT}/`);
});
