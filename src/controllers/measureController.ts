import { Request, Response } from 'express';
import { GeminiService } from '../services/geminiService';
import { Measure } from '../models/measure';

const measures: Measure[] = [];
const geminiService = new GeminiService(process.env.GEMINI_API_KEY!);

export class MeasureController {
    static async upload(req: Request, res: Response) {
        const { image, customer_code, measure_datetime, measure_type } = req.body;

        // Validar dados
        if (!image || !customer_code || !measure_datetime || !['WATER', 'GAS'].includes(measure_type)) {
            return res.status(400).json({ error_code: 'INVALID_TYPE', error_description: 'Dados inválidos' });
        }

        // Verificar se já existe uma leitura no mês
        const existingMeasure = measures.find(m => 
            m.customer_code === customer_code &&
            new Date(m.measure_datetime).getMonth() === new Date(measure_datetime).getMonth() &&
            m.measure_type === measure_type
        );

        if (existingMeasure) {
            return res.status(409).json({ error_code: 'DOUBLE_REPORT', error_description: 'Leitura do mês já realizada' });
        }

        // Obter valor da imagem via Gemini API
        const measure_value: number | null = await geminiService.extractMeasureValue(image);
        const measure_value_converted: number | undefined = measure_value !== null ? measure_value : undefined;

        const measure_uuid = 'some-unique-id';  // Gerar um UUID

        const newMeasure: Measure = {
            measure_uuid,
            customer_code,
            measure_datetime: new Date(measure_datetime),
            measure_type,
            image_url: 'temporary-link-to-image',
            measure_value: measure_value_converted,
            has_confirmed: false
        };

        measures.push(newMeasure);

        res.status(200).json({
            image_url: newMeasure.image_url,
            measure_value: newMeasure.measure_value,
            measure_uuid: newMeasure.measure_uuid
        });
    }

    static async confirm(req: Request, res: Response) {
        const { measure_uuid, confirmed_value } = req.body;

        const measure = measures.find(m => m.measure_uuid === measure_uuid);

        if (!measure) {
            return res.status(404).json({ error_code: 'MEASURE_NOT_FOUND', error_description: 'Leitura não encontrada' });
        }

        if (measure.has_confirmed) {
            return res.status(409).json({ error_code: 'CONFIRMATION_DUPLICATE', error_description: 'Leitura já confirmada' });
        }

        measure.measure_value = confirmed_value;
        measure.has_confirmed = true;

        res.status(200).json({ success: true });
    }

    static async list(req: Request, res: Response) {
        const { customer_code } = req.params;
        const { measure_type } = req.query;

        let customerMeasures = measures.filter(m => m.customer_code === customer_code);

        if (measure_type) {
            if (!['WATER', 'GAS'].includes(measure_type as string)) {
                return res.status(400).json({ error_code: 'INVALID_TYPE', error_description: 'Tipo de medição não permitida' });
            }
            customerMeasures = customerMeasures.filter(m => m.measure_type === measure_type);
        }

        if (customerMeasures.length === 0) {
            return res.status(404).json({ error_code: 'MEASURES_NOT_FOUND', error_description: 'Nenhuma leitura encontrada' });
        }

        res.status(200).json({
            customer_code,
            measures: customerMeasures
        });
    }
}
