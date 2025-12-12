const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
// ⬇️ CAMBIA ESTA LÍNEA - USA PUERTO 5001 ⬇️
const PORT = process.env.PORT || 5001;  // Cambiado de 5000 a 5001
// ⬆️ CAMBIA ESTA LÍNEA ⬆️

app.use(cors());
app.use(express.json());

// ... (el resto de tu código se mantiene igual)

app.listen(PORT, () => {
  console.log(\`🚀 Servidor backend corriendo en: http://localhost:\${PORT}\`);
});
