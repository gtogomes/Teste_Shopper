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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const axios_1 = __importDefault(require("axios"));
class GeminiService {
    // Ajuste o endpoint conforme necessário
    constructor(apiKey) {
        this.apiUrl = 'https://api.gemini.com/vision';
        this.apiKey = apiKey;
    }
    getImageMeasure(base64Image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(this.apiUrl, { image: base64Image }, { headers: this.createHeaders() });
                return this.extractMeasureValue(response.data);
            }
            catch (error) {
                this.handleError(error);
                return null;
            }
        });
    }
    createHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
    }
    extractMeasureValue(data) {
        var _a;
        return (_a = data === null || data === void 0 ? void 0 : data.measure_value) !== null && _a !== void 0 ? _a : null;
    }
    handleError(error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error(`API Error: ${error.message}`);
        }
        else if (error instanceof Error) {
            console.error('Unexpected Error:', error.message);
        }
        else {
            console.error('Unexpected Error:', String(error));
        }
    }
}
exports.GeminiService = GeminiService;
