"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const getAll = async (req, res) => {
    try {
        res.json({ success: true, message: "Endpoint is working for tour", data: [] });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getAll = getAll;
//# sourceMappingURL=tour.controller.js.map