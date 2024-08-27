import axios from 'axios';

export class GeminiService {
    private readonly apiKey: string;
    private readonly apiUrl: string = 'https://api.gemini.com/vision'; 
    // Ajuste o endpoint conforme necessário

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async getImageMeasure(base64Image: string): Promise<number | null> {
        try {
            const response = await axios.post(
                this.apiUrl,
                { image: base64Image },
                { headers: this.createHeaders() }
            );
            return this.extractMeasureValue(response.data);
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    private createHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
    }

    private extractMeasureValue(data: any): number | null {
        return data?.measure_value ?? null;
    }

    private handleError(error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error(`API Error: ${error.message}`);
        } else if (error instanceof Error) {
            console.error('Unexpected Error:', error.message);
        } else {
            console.error('Unexpected Error:', String(error));
        }
    }
}
