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
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
const User_1 = require("./entities/User");
const app = (0, express_1.default)();
app.use(express_1.default.json());
data_source_1.AppDataSource.initialize().then(() => {
    console.log('[✅] DB connected');
    app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield data_source_1.AppDataSource.getRepository(User_1.User).find();
        res.json(users);
    }));
    app.listen(3001, () => {
        console.log('[🚀] Server running at http://localhost:3001');
    });
}).catch(err => console.error('[❌] DB connection error:', err));
