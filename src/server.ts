import mongoose from 'mongoose';
import app from './app';

// URL de conexão ao MongoDB
const dbUri = 'mongodb://localhost:27017/water_gas_meter';

mongoose.connect(dbUri)
  .then(() => {
    console.log('Connected to MongoDB');

    // Inicializar o servidor
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
