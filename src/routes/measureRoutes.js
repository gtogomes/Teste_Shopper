"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const measureController_1 = require("../controllers/measureController");
const router = (0, express_1.Router)();
router.post('/upload', measureController_1.MeasureController.upload);
router.patch('/confirm', measureController_1.MeasureController.confirm);
router.get('/:customer_code/list', measureController_1.MeasureController.list);
exports.default = router;
