import { GeminiService } from '../src/services/geminiService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GeminiService', () => {
    let geminiService: GeminiService;

    beforeEach(() => {
        geminiService = new GeminiService('fake-api-key');
    });

    it('should return a measure value from the Gemini API', async () => {
        mockedAxios.post.mockResolvedValue({
            data: { measure_value: 150 }
        });

        const measureValue = await geminiService.extractMeasureValue('base64-image-string');
        expect(measureValue).toBe(150);
    });

    it('should throw an error when the Gemini API fails', async () => {
        mockedAxios.post.mockRejectedValue(new Error('API failure'));

        await expect(geminiService.extractMeasureValue('base64-image-string'))
            .rejects
            .toThrow('API failure');
    });
});
