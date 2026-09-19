import request from 'supertest';
import 'dotenv/config.js';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export function api() {
    return request(BASE_URL);
}