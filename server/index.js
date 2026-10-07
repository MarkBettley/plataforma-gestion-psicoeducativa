const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Configuración CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const upload = multer({ dest: 'uploads/' });

app.post('/convertir-pdf', upload.single('archivo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió ningún archivo' });
  }

  if (!req.file.originalname.endsWith('.docx')) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'El archivo debe ser un DOCX' });
  }

  const inputPath = req.file.path;
  const outputPath = inputPath.replace(/\.docx$/, '.pdf');

  console.log('Convirtiendo archivo:', req.file.originalname);

  try {
    const baseName = path.basename(inputPath);
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempInput = path.join(tempDir, baseName + '.docx');
    const tempOutput = path.join(tempDir, baseName + '.pdf');
    fs.copyFileSync(inputPath, tempInput);

    await new Promise((resolve, reject) => {
      console.log('Archivo existe:', fs.existsSync(tempInput));
      const cmd = `/usr/bin/soffice -env:UserInstallation=file:///tmp/lo-sep-server --headless --convert-to pdf --outdir "${tempDir}" "${tempInput}"`;
      exec(cmd, { shell: '/bin/bash', timeout: 30000 }, (error, stdout, stderr) => {
        console.log('STDOUT:', stdout);
        console.log('STDERR:', stderr);
        if (error) {
          console.error('Error ejecutando libreoffice:', error.message);
          reject(new Error('libreoffice falló: ' + error.message));
          return;
        }

        if (fs.existsSync(tempOutput)) {
          const pdfData = fs.readFileSync(tempOutput);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${baseName}.pdf"`);
          res.send(pdfData);

          fs.unlinkSync(tempInput);
          fs.unlinkSync(tempOutput);
          fs.unlinkSync(inputPath);
          resolve();
        } else {
          reject(new Error('No se generó el PDF'));
        }
      });
    });
  } catch (error) {
    console.error('Error de conversión:', error.message || error);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    res.status(500).json({ error: 'Error al convertir el archivo: ' + (error.message || error) });
  }
});

// Servir la plantilla Word
app.get('/plantilla-comision', (req, res) => {
  const templatePath = path.join(__dirname, '..', 'src', 'templates', 'Oficios-comision-IHE.docx');
  res.download(templatePath, 'Oficios-comision-IHE.docx', (err) => {
    if (err) {
      console.error('Error sirviendo plantilla:', err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor DOCX a PDF corriendo en http://localhost:${PORT}`);
});
