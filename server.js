const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Data storage (in production, use a real database)
const DATA_DIR = './data';
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Initialize data directory and files
async function initializeData() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        // Initialize users file
        try {
            await fs.access(USERS_FILE);
        } catch {
            await fs.writeFile(USERS_FILE, JSON.stringify([]));
        }
        
        // Initialize products file
        try {
            await fs.access(PRODUCTS_FILE);
        } catch {
            const sampleProducts = [
                {
                    id: 1,
                    name: "Wireless Headphones",
                    description: "High-quality wireless headphones with noise cancellation",
                    price: 199.99,
                    category: "electronics",
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
                    stock: 50
                },
                {
                    id: 2,
                    name: "Smart Watch",
                    description: "Fitness tracking smartwatch with heart rate monitor",
                    price: 299.99,
                    category: "electronics",
                    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
                    stock: 30
                },
                {
                    id: 3,
                    name: "Cotton T-Shirt",
                    description: "Comfortable 100% cotton t-shirt in various colors",
                    price: 29.99,
                    category: "clothing",
                    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
                    stock: 100
                },
                {
                    id: 4,
                    name: "Denim Jeans",
                    description: "Classic blue denim jeans with perfect fit",
                    price: 79.99,
                    category: "clothing",
                    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
                    stock: 75
                },
                {
                    id: 5,
                    name: "Coffee Maker",
                    description: "Automatic drip coffee maker with programmable timer",
                    price: 89.99,
                    category: "home",
                    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
                    stock: 25
                },
                {
                    id: 6,
                    name: "Garden Tools Set",
                    description: "Complete set of gardening tools for home use",
                    price: 49.99,
                    category: "home",
                    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
                    stock: 40
                },
                {
                    id: 7,
                    name: "Yoga Mat",
                    description: "Non-slip yoga mat perfect for workouts and meditation",
                    price: 39.99,
                    category: "sports",
                    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
                    stock: 60
                },
                {
                    id: 8,
                    name: "Running Shoes",
                    description: "Lightweight running shoes with excellent cushioning",
                    price: 129.99,
                    category: "sports",
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
                    stock: 45
                }
            ];
            await fs.writeFile(PRODUCTS_FILE, JSON.stringify(sampleProducts, null, 2));
        }
        
        // Initialize orders file
        try {
            await fs.access(ORDERS_FILE);
        } catch {
            await fs.writeFile(ORDERS_FILE, JSON.stringify([]));
        }
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

// Helper functions
async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
}

async function writeJsonFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Routes

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await readJsonFile(PRODUCTS_FILE);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const products = await readJsonFile(PRODUCTS_FILE);
        const product = products.find(p => p.id === parseInt(req.params.id));
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
});

// Search products
app.get('/api/products/search/:query', async (req, res) => {
    try {
        const products = await readJsonFile(PRODUCTS_FILE);
        const query = req.params.query.toLowerCase();
        
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
        
        res.json(filteredProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error searching products' });
    }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
    try {
        const products = await readJsonFile(PRODUCTS_FILE);
        const category = req.params.category;
        
        const filteredProducts = products.filter(product =>
            product.category === category
        );
        
        res.json(filteredProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products by category' });
    }
});

// User registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const users = await readJsonFile(USERS_FILE);
        
        // Check if user already exists
        if (users.find(user => user.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        await writeJsonFile(USERS_FILE, users);
        
        // Generate JWT token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// User login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        const users = await readJsonFile(USERS_FILE);
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const users = await readJsonFile(USERS_FILE);
        const user = users.find(u => u.id === req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

// Get user orders
app.get('/api/user/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await readJsonFile(ORDERS_FILE);
        const userOrders = orders.filter(order => order.userId === req.user.id);
        
        res.json(userOrders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Process payment
app.post('/api/payments/process', authenticateToken, async (req, res) => {
    try {
        const { amount, currency, cardNumber, expiryDate, cvv, shippingInfo, items } = req.body;
        
        if (!amount || !items || items.length === 0) {
            return res.status(400).json({ message: 'Invalid payment data' });
        }
        
        // In a real application, you would:
        // 1. Validate the card details
        // 2. Process payment with Stripe or another payment processor
        // 3. Handle payment failures and retries
        
        // For demo purposes, we'll simulate a successful payment
        const paymentIntent = {
            id: `pi_demo_${Date.now()}`,
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency || 'usd',
            status: 'succeeded',
            created: Math.floor(Date.now() / 1000)
        };
        
        // Create order
        const order = {
            id: Date.now(),
            userId: req.user.id,
            items: items,
            total: amount,
            currency: currency || 'usd',
            paymentIntentId: paymentIntent.id,
            shippingInfo: shippingInfo,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        // Save order
        const orders = await readJsonFile(ORDERS_FILE);
        orders.push(order);
        await writeJsonFile(ORDERS_FILE, orders);
        
        // Update product stock (in a real app, you'd want to handle this atomically)
        const products = await readJsonFile(PRODUCTS_FILE);
        for (const item of items) {
            const product = products.find(p => p.id === item.id);
            if (product) {
                product.stock = Math.max(0, product.stock - item.quantity);
            }
        }
        await writeJsonFile(PRODUCTS_FILE, products);
        
        res.json({
            message: 'Payment processed successfully',
            orderId: order.id,
            paymentIntent: paymentIntent
        });
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ message: 'Error processing payment' });
    }
});

// Admin routes (for managing products)
app.post('/api/admin/products', authenticateToken, async (req, res) => {
    try {
        // In a real app, you'd check if user is admin
        const { name, description, price, category, image, stock } = req.body;
        
        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: 'Required fields missing' });
        }
        
        const products = await readJsonFile(PRODUCTS_FILE);
        const newProduct = {
            id: Date.now(),
            name,
            description,
            price: parseFloat(price),
            category,
            image: image || 'https://via.placeholder.com/400x300',
            stock: parseInt(stock) || 0,
            createdAt: new Date().toISOString()
        };
        
        products.push(newProduct);
        await writeJsonFile(PRODUCTS_FILE, products);
        
        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product' });
    }
});

// Update product
app.put('/api/admin/products/:id', authenticateToken, async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const updates = req.body;
        
        const products = await readJsonFile(PRODUCTS_FILE);
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        products[productIndex] = { ...products[productIndex], ...updates };
        await writeJsonFile(PRODUCTS_FILE, products);
        
        res.json({
            message: 'Product updated successfully',
            product: products[productIndex]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product' });
    }
});

// Delete product
app.delete('/api/admin/products/:id', authenticateToken, async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        
        const products = await readJsonFile(PRODUCTS_FILE);
        const filteredProducts = products.filter(p => p.id !== productId);
        
        if (products.length === filteredProducts.length) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        await writeJsonFile(PRODUCTS_FILE, filteredProducts);
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
async function startServer() {
    await initializeData();
    
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log('API endpoints available at /api/');
        console.log('Frontend available at http://localhost:${PORT}');
    });
}

startServer().catch(console.error);
