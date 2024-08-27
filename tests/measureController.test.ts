import request from 'supertest';
import app from '../src/app';

describe('MeasureController', () => {
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
    });

    it('should not allow double reporting in the same month', async () => {
        const payload = {
            image: 'base64-string',
            customer_code: 'customer1',
            measure_datetime: new Date().toISOString(),
            measure_type: 'WATER'
        };

        await request(app).post('/measure/upload').send(payload);
        const response = await request(app).post('/measure/upload').send(payload);

        expect(response.status).toBe(409);
    });
});
