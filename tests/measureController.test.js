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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe('MeasureController', () => {
    it('should upload a new measure', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/measure/upload')
            .send({
            image: 'base64-string',
            customer_code: 'customer1',
            measure_datetime: new Date().toISOString(),
            measure_type: 'WATER'
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('measure_uuid');
    }));
    it('should not allow double reporting in the same month', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            image: 'base64-string',
            customer_code: 'customer1',
            measure_datetime: new Date().toISOString(),
            measure_type: 'WATER'
        };
        yield (0, supertest_1.default)(app_1.default).post('/measure/upload').send(payload);
        const response = yield (0, supertest_1.default)(app_1.default).post('/measure/upload').send(payload);
        expect(response.status).toBe(409);
    }));
});
