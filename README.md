# ShopEasy - Online Shopping Website

A modern, responsive e-commerce website built with HTML, CSS, JavaScript, and Node.js. Features include user authentication, shopping cart, payment processing, and a complete admin panel.

## 🚀 Features

### Frontend
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Product Catalog**: Browse products with filtering and search
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: Login/Register with JWT tokens
- **Payment Integration**: Stripe payment processing
- **Order Management**: View order history and status

### Backend
- **RESTful API**: Express.js server with comprehensive endpoints
- **Authentication**: Secure user registration and login
- **Database**: JSON file storage (easily upgradeable to MongoDB/PostgreSQL)
- **Payment Processing**: Stripe integration for secure payments
- **Admin Panel**: Product and order management

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs (Password Hashing)
- Stripe (Payment Processing)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone or download the project**
   ```bash
   # If you have git
   git clone <repository-url>
   cd shopeasy-ecommerce
   
   # Or simply download and extract the files
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional)**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### For Customers
1. **Browse Products**: View the product catalog on the homepage
2. **Search & Filter**: Use the search bar or category filters
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Register/Login**: Create an account or login to proceed
5. **Checkout**: Review cart and enter shipping/payment details
6. **Complete Purchase**: Process payment securely

### For Administrators
1. **Access Admin Panel**: Login with admin credentials
2. **Manage Products**: Add, edit, or delete products
3. **View Orders**: Monitor customer orders and status
4. **Update Inventory**: Manage product stock levels

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search/:query` - Search products
- `GET /api/products/category/:category` - Get products by category

### Orders
- `GET /api/user/orders` - Get user orders (protected)
- `POST /api/payments/process` - Process payment (protected)

### Admin (Protected)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## 🎨 Customization

### Adding New Products
1. Edit the `sampleProducts` array in `script.js` (frontend)
2. Or use the admin API endpoints to add products dynamically

### Styling
- Modify `styles.css` for custom styling
- Update color scheme by changing CSS variables
- Add new animations or effects

### Backend Configuration
- Update `server.js` for additional API endpoints
- Modify database schema in the data files
- Add new middleware or authentication methods

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Secure authentication with expiration
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Error Handling**: Comprehensive error handling and logging

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
1. Set up environment variables
2. Install production dependencies
3. Start the server:
   ```bash
   npm start
   ```

### Cloud Deployment
- **Heroku**: Add a `Procfile` and deploy
- **Vercel**: Configure for Node.js
- **AWS**: Use Elastic Beanstalk or EC2
- **DigitalOcean**: Deploy on a droplet

## 🔧 Configuration

### Stripe Setup
1. Create a Stripe account
2. Get your API keys from the dashboard
3. Add the secret key to your environment variables
4. Update the frontend with your publishable key

### Database Migration
To migrate from JSON files to a real database:
1. Choose your database (MongoDB, PostgreSQL, MySQL)
2. Install the appropriate driver
3. Update the data access functions in `server.js`
4. Migrate existing data

## 🐛 Troubleshooting

### Common Issues
1. **Port already in use**: Change the PORT in `.env` or kill the process
2. **Module not found**: Run `npm install` to install dependencies
3. **Payment errors**: Check Stripe API keys and configuration
4. **Authentication issues**: Verify JWT secret and token expiration

### Debug Mode
Enable debug logging by setting:
```javascript
console.log('Debug mode enabled');
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

### Version 1.0.0
- Initial release
- Complete e-commerce functionality
- Responsive design
- Authentication system
- Payment integration
- Admin panel

---

**Happy Shopping! 🛒**
