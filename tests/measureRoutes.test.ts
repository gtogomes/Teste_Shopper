import request from 'supertest';
import app from '../src/app';

describe('Measure Routes', () => {
    it('should handle 404 for unknown routes', async () => {
        const response = await request(app)
            .get('/unknown-route')
            .expect(404);

        expect(response.body).toEqual({});
    });
});
