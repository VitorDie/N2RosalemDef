const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Criando um router do Express
const router = express.Router();

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Definindo a pasta onde as imagens serão armazenadas
  },
  filename: (req, file, cb) => {
    // Gerando nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Nome final do arquivo
  },
});

const upload = multer({ storage: storage });

// Rota para upload de imagem
router.post('/upload', upload.single('image'), (req, res) => {
  // Verifica se o arquivo foi enviado
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  // Lê a imagem e a converte para Base64
  const imagePath = path.join(__dirname, '../uploads', req.file.filename);  // Caminho do arquivo
  fs.readFile(imagePath, 'base64', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    // Responde com a imagem em Base64
    res.json({
      message: 'File uploaded successfully!',
      imageBase64: `data:${req.file.mimetype};base64,${data}`,  // Retorna a imagem como base64
    });
  });
});

// Rota para buscar uma imagem usando o nome do arquivo (acessível pela URL)
router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, '../uploads', filename);

  // Lê o arquivo e retorna a imagem em Base64
  fs.readFile(imagePath, 'base64', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    // Envia a imagem em Base64 como resposta
    res.json({
      imageBase64: `data:image/png;base64,${data}`,
    });
  });
});

module.exports = router;
