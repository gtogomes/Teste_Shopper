import { Router } from 'express';
import Customer from '../models/Customer';

const router = Router();

// Rota para criar um novo cliente
router.post('/customers', async (req, res) => {
  try {
    const { customer_code, name, email } = req.body;
    const customer = await Customer.create({ customer_code, name, email });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o cliente' });
  }
});

// Rota para listar todos os clientes
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os clientes' });
  }
});

// Rota para buscar um cliente pelo código
router.get('/customers/:customer_code', async (req, res) => {
  try {
    const { customer_code } = req.params;
    const customer = await Customer.findOne({ where: { customer_code } });
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o cliente' });
  }
});

// Rota para atualizar um cliente pelo código
router.put('/customers/:customer_code', async (req, res) => {
  try {
    const { customer_code } = req.params;
    const { name, email } = req.body;
    const customer = await Customer.findOne({ where: { customer_code } });
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    customer.name = name;
    customer.email = email;
    await customer.save();
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o cliente' });
  }
});

// Rota para deletar um cliente pelo código
router.delete('/customers/:customer_code', async (req, res) => {
  try {
    const { customer_code } = req.params;
    const customer = await Customer.findOne({ where: { customer_code } });
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    await customer.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar o cliente' });
  }
});

export default router;
