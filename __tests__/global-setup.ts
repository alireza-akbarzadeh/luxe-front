// __tests__/global-setup.ts
import { request, type FullConfig } from '@playwright/test';

// Use environment variables with fallbacks (never hardcode secrets)
const TEST_USER = {
    email:  'e2e@example.com',
    password:  'E2ePass123!',
    firstName:  'E2E',
    lastName:  'User',
};

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function globalSetup(config: FullConfig) {
    console.log(`🌍 Global setup: ensuring test user ${TEST_USER.email}`);

    const ctx = await request.newContext({
        baseURL: API_BASE_URL,
    });

    try {
        // ✅ Idempotent: endpoint should create user if not exists (or ignore if already there)
        const response = await ctx.post('/api/test/setup', {
            data: {
                email: TEST_USER.email,
                password: TEST_USER.password,
                firstName: TEST_USER.firstName,
                lastName: TEST_USER.lastName,
            },
        });

        if (!response.ok()) {
            const errorText = await response.text();
            throw new Error(`Failed to create test user: ${response.status()} ${errorText}`);
        }

        // ✅ (Optional) If your endpoint returns the user ID or tokens, you can store them
        const userData = await response.json();
        // Save data for tests via environment variable (see next section)
        // TEST_USER.id = userData.id;
        // TEST_USER.accessToken = userData.accessToken;

        console.log(`✅ Test user ready: ${TEST_USER.email}`);
    } catch (error) {
        console.error('❌ Global setup failed:', error);
        throw error; // Fail fast – no point running tests without a valid user
    } finally {
        await ctx.dispose();
    }
}

export default globalSetup;