"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasureController = void 0;
const geminiService_1 = require("../services/geminiService");
const measures = [];
const geminiService = new geminiService_1.GeminiService(process.env.GEMINI_API_KEY);
class MeasureController {
    static upload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { image, customer_code, measure_datetime, measure_type } = req.body;
            // Validar dados
            if (!image || !customer_code || !measure_datetime || !['WATER', 'GAS'].includes(measure_type)) {
                return res.status(400).json({ error_code: 'INVALID_TYPE', error_description: 'Dados inválidos' });
            }
            // Verificar se já existe uma leitura no mês
            const existingMeasure = measures.find(m => m.customer_code === customer_code &&
                new Date(m.measure_datetime).getMonth() === new Date(measure_datetime).getMonth() &&
                m.measure_type === measure_type);
            if (existingMeasure) {
                return res.status(409).json({ error_code: 'DOUBLE_REPORT', error_description: 'Leitura do mês já realizada' });
            }
            // Obter valor da imagem via Gemini API
            const measure_value = yield geminiService.getMeasureFromImage(image);
            const measure_uuid = 'some-unique-id'; // Gerar um UUID
            const newMeasure = {
                measure_uuid,
                customer_code,
                measure_datetime: new Date(measure_datetime),
                measure_type,
                image_url: 'temporary-link-to-image',
                measure_value,
                has_confirmed: false
            };
            measures.push(newMeasure);
            res.status(200).json({
                image_url: newMeasure.image_url,
                measure_value: newMeasure.measure_value,
                measure_uuid: newMeasure.measure_uuid
            });
        });
    }
    static confirm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    static list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { customer_code } = req.params;
            const { measure_type } = req.query;
            let customerMeasures = measures.filter(m => m.customer_code === customer_code);
            if (measure_type) {
                if (!['WATER', 'GAS'].includes(measure_type)) {
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
        });
    }
}
exports.MeasureController = MeasureController;
