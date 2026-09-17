// Importamos la libreria de Express y cors
const express = require("express"); //importamos el paquete de express
const cors = require("cors");

//Creamos la aplicacion
const app = express();

require("./config/db");

//Permitir que Express y cors pueda leer JSON
app.use(express.json());
app.use(cors());

//Conexion con routes/citas
const citasRoutes = require("./routes/citas")

//Definimos el puerto del servidor
const PORT = 3000;

/* SE CREAN LAS RUTAS*/
app.get("/", (req, res) => { //con el metodo GET se obtiene informacion
    res.send(`Api de citas medicas funcionando`); //ruta por defecto
});

//Se le indica a Express que use las rutas
app.use("/citas", citasRoutes);

//Se inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
    console.log('Hola :)');
});
