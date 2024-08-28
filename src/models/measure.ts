import { Schema, model } from 'mongoose';

// Define o schema para a medida
const measureSchema = new Schema({
  customer_code: { type: String, ref: 'Customer', required: true },
  measure_datetime: { type: Date, required: true },
  measure_type: { type: String, enum: ['WATER', 'GAS'], required: true },
  measure_value: { type: Number, required: true },
  image_url: { type: String, required: true },
  has_confirmed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Cria o modelo para a coleção de medidas
const Measure = model('Measure', measureSchema);

export default Measure;
