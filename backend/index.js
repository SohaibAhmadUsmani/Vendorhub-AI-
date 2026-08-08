require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const vendorRoutes = require('./routes/vendorRoutes');
const productRoutes = require('./routes/productRoutes');
const matchRoutes = require('./routes/matchRoutes');
const rfqRoutes = require('./routes/rfqRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const vendorDashboardRoutes = require('./routes/vendorDashboardRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

connectDB();

// Expose Content-Disposition so the dashboard's CSV downloads can read the
// backend-generated filename from the response headers.
app.use(cors({ exposedHeaders: ['Content-Disposition'] }));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/rfq', rfqRoutes);
app.use('/api/vendor/dashboard', dashboardRoutes);
app.use('/api/vendor', vendorDashboardRoutes);
app.use('/api/dashboard', dashboardRoutes.overviewRouter);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VendorHub AI server is running' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));