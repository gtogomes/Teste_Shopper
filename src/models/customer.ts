import { Schema, model } from 'mongoose';

// Define o schema para o cliente
const customerSchema = new Schema({
  customer_code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Cria o modelo para a coleção de clientes
const Customer = model('Customer', customerSchema);

export default Customer;
