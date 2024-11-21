const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Conecta ao Banco de Dados
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/files', require('./routes/file'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
