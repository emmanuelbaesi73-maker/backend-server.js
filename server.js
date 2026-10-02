require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const { WebSocketServer } = require('ws');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set and at least 32 characters long.');
}

const origins = (process.env.CORS_ORIGINS || '*')
  .split(',')
  .map(x => x.trim())
  .filter(Boolean);

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  })
);

app.use(
  cors({
    origin: origins.includes('*') ? true : origins,
    credentials: true
  })
);

app.use(express.json({ limit: '200kb' }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

/* =========================================================
   REAL-TIME
========================================================= */

const io = new Server(server, {
  cors: {
    origin: origins.includes('*') ? '*' : origins
  }
});

const wss = new WebSocketServer({
  server,
  path: '/
