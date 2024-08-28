import request from 'supertest';
import app from '../src/app';
import { GeminiService } from '../src/services/geminiService';
import Measure from '../src/models/measure'; // Importar o modelo para limpar o banco de dados

jest.mock('../src/services/geminiService');

describe('MeasureController', () => {
    let geminiServiceMock: jest.Mocked<GeminiService>;

    beforeEach(() => {
        geminiServiceMock = new GeminiService('fake-api-key') as jest.Mocked<GeminiService>;

        // Mock do método 'extractMeasureValue'
        geminiServiceMock.extractMeasureValue = jest.fn().mockResolvedValue(100);
    });

    afterEach(async () => {
        // Limpar o banco de dados após cada teste, se necessário
        await Measure.deleteMany({});
    });

    it('should upload a new measure', async () => {
        const response = await request(app)
            .post('/measure/upload')
            .send({
                image: 'base64-string',
                customer_code: 'customer1',
                measure_datetime: new Date().toISOString(),
                measure_type: 'WATER'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('measure_uuid');
        expect(response.body).toHaveProperty('measure_value', 100);
        expect(response.body).toHaveProperty('image_url', 'link-temporario');
    });

    it('should return 400 when invalid data is sent', async () => {
        const response = await request(app)
            .post('/measure/upload')
            .send({
                image: '',
                customer_code: '',
                measure_datetime: '',
                measure_type: ''
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });

    it('should confirm a measure successfully', async () => {
        const response = await request(app)
            .patch('/measure/confirm')
            .send({
                measure_uuid: '1',
                confirmed_value: 120
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
    });

    it('should return 404 when confirming a non-existent measure', async () => {
        const response = await request(app)
            .patch('/measure/confirm')
            .send({
                measure_uuid: 'non-existent',
                confirmed_value: 120
            });

        expect(response.status).toBe(404);
        expect(response.body.error_code).toBe('MEASURE_NOT_FOUND');
    });

    it('should list all measures for a customer', async () => {
        const response = await request(app)
            .get('/measure/customer1/list')
            .expect(200);

        expect(response.body).toHaveProperty('customer_code', 'customer1');
        expect(response.body.measures).toBeInstanceOf(Array);
    });

    it('should return 400 for an invalid measure type query', async () => {
        const response = await request(app)
            .get('/measure/customer1/list?measure_type=INVALID')
            .expect(400);

        expect(response.body.error_code).toBe('INVALID_TYPE');
    });

    it('should return 404 when no measures are found', async () => {
        const response = await request(app)
            .get('/measure/nonexistent_customer/list')
            .expect(404);

        expect(response.body.error_code).toBe('MEASURES_NOT_FOUND');
    });
});
