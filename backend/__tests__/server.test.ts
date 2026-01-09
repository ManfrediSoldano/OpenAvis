import request from 'supertest';
import { otpStore } from '../app';

// Create jest mocks for the services methods
const mockSendOtp = jest.fn().mockResolvedValue(true);
const mockSendConfirmation = jest.fn().mockResolvedValue(true);
const mockSaveDonor = jest.fn().mockResolvedValue({ id: '123', email: 'test@example.com' });

// Mock the Service Classes
jest.mock('../services/email', () => {
    return {
        EmailService: jest.fn().mockImplementation(() => {
            return {
                sendOtp: mockSendOtp,
                sendConfirmation: mockSendConfirmation
            };
        })
    };
});

jest.mock('../services/database', () => {
    return {
        DatabaseService: jest.fn().mockImplementation(() => {
            return {
                saveDonor: mockSaveDonor,
                getDonor: jest.fn()
            };
        })
    };
});

// Import app after mocks are defined
import app from '../app';

describe('Backend Integration Tests', () => {

    beforeEach(() => {
        // Clear mock calls and OTP store before each test
        mockSendOtp.mockClear();
        mockSendConfirmation.mockClear();
        mockSaveDonor.mockClear();

        for (const k in otpStore) delete otpStore[k];
    });

    describe('GET /api', () => {
        it('should return a welcome message', async () => {
            const res = await request(app).get('/api');
            expect(res.status).toBe(200);
            expect(res.body.message).toContain('Welcome');
        });
    });

    describe('POST /api/send-otp', () => {
        it('should fail if email is missing', async () => {
            const res = await request(app).post('/api/send-otp').send({});
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Email required');
        });

        it('should send OTP and store it', async () => {
            const email = 'test@example.com';
            const res = await request(app).post('/api/send-otp').send({ email });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(otpStore[email]).toBeDefined();
            expect(mockSendOtp).toHaveBeenCalledWith(email, otpStore[email]);
        });
    });

    describe('POST /api/verify-otp', () => {
        it('should fail if fields are missing', async () => {
            const res = await request(app).post('/api/verify-otp').send({ email: 'foo@bar.com' });
            expect(res.status).toBe(400);
        });

        it('should fail if OTP is incorrect', async () => {
            const email = 'test@example.com';
            otpStore[email] = '123456';

            const res = await request(app).post('/api/verify-otp').send({ email, otp: '000000' });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should succeed if OTP is correct', async () => {
            const email = 'test@example.com';
            otpStore[email] = '123456';

            const res = await request(app).post('/api/verify-otp').send({ email, otp: '123456' });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            // OTP should be consumed
            expect(otpStore[email]).toBeUndefined();
        });
    });

    describe('POST /api/signup', () => {
        const validDonor = {
            email: 'test@example.com',
            firstName: 'Mario',
            lastName: 'Rossi',
            phone: '1234567890'
        };

        it('should fail if mandatory fields are missing', async () => {
            const res = await request(app).post('/api/signup').send({ email: 'test@example.com' });
            expect(res.status).toBe(400);
        });

        it('should save donor and send confirmation email', async () => {
            const res = await request(app).post('/api/signup').send(validDonor);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);

            expect(mockSaveDonor).toHaveBeenCalledWith(expect.objectContaining({
                email: 'test@example.com',
                firstName: 'Mario'
            }));

            expect(mockSendConfirmation).toHaveBeenCalledWith('test@example.com');
        });
    });
});
