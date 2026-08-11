require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const vendorRoutes = require('./routes/vendorRoutes');
const productRoutes = require('./routes/productRoutes');
const matchRoutes = require('./routes/matchRoutes');
const rfqRoutes = require('./routes/rfqRoutes');

const dashboardRoutes = require('./routes/dashboardRoutes');
const vendorDashboardRoutes = require('./routes/vendorDashboardRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const negotiationRoutes = require('./routes/negotiationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const orderRoutes = require('./routes/orderRoutes');
const riskRoutes = require('./routes/riskRoutes');
const documentRoutes = require("./routes/documentRoutes");
const Notification = require('./models/Notification');
const analyticsRoutes = require('./routes/analyticsRoutes');
const authRoutes = require('./routes/authRoutes');
const passport = require('./config/passport');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
const notificationNamespace = io.of('/notifications');

app.set('io', io);
app.set('notificationIo', notificationNamespace);
connectDB();

// Expose Content-Disposition so the dashboard's CSV downloads can read the
// backend-generated filename from the response headers.
app.use(cors({ exposedHeaders: ['Content-Disposition'] }));
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());

// Static Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/rfq', rfqRoutes);

app.use('/api/vendor/dashboard', dashboardRoutes);
app.use('/api/vendor', vendorDashboardRoutes);
app.use('/api/dashboard', dashboardRoutes.overviewRouter);
app.use('/api/quotes', quoteRoutes);
app.use('/api/negotiation', negotiationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Module 11 — Real-time Messaging (Socket.io)
notificationNamespace.on('connection', (socket) => {
  console.log('Notification client connected:', socket.id);

  socket.on('vendorhub:join_notifications', () => {
    socket.join('vendorhub:notifications');
  });

  socket.on('vendorhub:leave_notifications', () => {
    socket.leave('vendorhub:notifications');
  });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join a room scoped to a specific conversation
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('leave_conversation', (conversationId) => {
    socket.leave(conversationId);
  });

  // Persist + broadcast a new chat message
  socket.on('send_message', async (payload) => {
    try {
      const { conversationId, senderId, senderRole, text, attachmentUrl, attachmentType } = payload;

      const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        senderRole,
        text,
        attachmentUrl,
        attachmentType,
        readBy: [senderId],
      });

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: text || 'Sent an attachment',
        lastMessageAt: new Date(),
      });

      const notification = await Notification.create({
        title: 'New message received',
        message: text || 'You received a new message',
        type: 'message',
        link: '/buyer/messages',
        read: false,
      });

      notificationNamespace.to('vendorhub:notifications').emit('vendorhub:notification:new', {
        id: String(notification._id),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        time: notification.createdAt,
        unread: true,
        link: notification.link,
      });

      io.to(conversationId).emit('receive_message', message);
    } catch (err) {
      socket.emit('message_error', { message: err.message });
    }
  });

  // Typing indicator
  socket.on('typing', ({ conversationId, userId }) => {
    socket.to(conversationId).emit('user_typing', { userId });
  });

  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VendorHub AI server is running' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));