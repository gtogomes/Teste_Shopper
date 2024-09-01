import express from 'express';
import measureRoutes from './routes/measureRoutes';
import connectDB from './config/database';

const app = express();

// Middleware para parsing de JSON
app.use(express.json());

// Conectar ao MongoDB
connectDB();

// Configurar rotas
app.use('/measure', measureRoutes);

// Exportar a aplicação para outros usos, como testes unitários
export default app;
