import sequelize from './config/database';
import Measure from './models/Measure';
import Customer from './models/Customer';
import MeasureType from './models/MeasureType';

const seedDatabase = async () => {
  try {
    // Sincroniza os modelos com o banco de dados
    await sequelize.sync({ force: true });

    // Insere tipos de medição
    await MeasureType.bulkCreate([
      { measure_type: 'WATER', description: 'Leitura de água' },
      { measure_type: 'GAS', description: 'Leitura de gás' },
      { measure_type: 'ELECTRICITY', description: 'Leitura de eletricidade' },
    ]);

    // Insere clientes
    await Customer.bulkCreate([
      { customer_code: 'CUST001', name: 'Cliente A', email: 'clientea@example.com' },
      { customer_code: 'CUST002', name: 'Cliente B', email: 'clienteb@example.com' },
    ]);

    // Insere medições
    await Measure.bulkCreate([
      {
        customer_code: 'CUST001',
        measure_datetime: new Date(),
        measure_type: 'WATER',
        image_url: 'https://example.com/image1.jpg',
        measure_value: 150,
        has_confirmed: false,
      },
      {
        customer_code: 'CUST002',
        measure_datetime: new Date(),
        measure_type: 'GAS',
        image_url: 'https://example.com/image2.jpg',
        measure_value: 250,
        has_confirmed: true,
      },
    ]);

    console.log('Banco de dados populado com sucesso!');
  } catch (error) {
    console.error('Erro ao popular o banco de dados:', error);
  } finally {
    // Fecha a conexão com o banco de dados
    await sequelize.close();
  }
};

seedDatabase();
