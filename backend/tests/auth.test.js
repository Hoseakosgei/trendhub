// tests/auth.test.js
const request = require('supertest')
const app     = require('../server')

describe('Auth Routes', () => {

  const testUser = {
    name:     'Test Kamau',
    email:    `test_${Date.now()}@trendhub.co.ke`,
    phone:    '0712345678',
    password: 'Test@1234',
  }
  let accessToken

  // ── Register ──────────────────────────────────────────────────
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user and return tokens', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201)

      expect(res.body.user.email).toBe(testUser.email)
      expect(res.body.accessToken).toBeDefined()
      expect(res.body.user.passwordHash).toBeUndefined()
    })

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(409)

      expect(res.body.error).toMatch(/already exists/i)
    })

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...testUser, email: 'other@test.com', password: 'weak' })
        .expect(422)

      expect(res.body.fields).toBeDefined()
    })

    it('should reject invalid phone number', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...testUser, email: 'other2@test.com', phone: '123' })
        .expect(422)
    })
  })

  // ── Login ─────────────────────────────────────────────────────
  describe('POST /api/v1/auth/login', () => {
    it('should login and return access token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200)

      expect(res.body.accessToken).toBeDefined()
      accessToken = res.body.accessToken
    })

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: 'WrongPass1!' })
        .expect(401)

      expect(res.body.error).toMatch(/invalid/i)
    })

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'nobody@trendhub.co.ke', password: 'Test@1234' })
        .expect(401)
    })
  })

  // ── Me ────────────────────────────────────────────────────────
  describe('GET /api/v1/auth/me', () => {
    it('should return current user with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(res.body.user.email).toBe(testUser.email)
    })

    it('should reject request without token', async () => {
      await request(app).get('/api/v1/auth/me').expect(401)
    })

    it('should reject invalid token', async () => {
      await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401)
    })
  })
})

// ── Products (public) ─────────────────────────────────────────
describe('Products Routes', () => {
  describe('GET /api/v1/products/categories', () => {
    it('should return all categories', async () => {
      const res = await request(app)
        .get('/api/v1/products/categories')
        .expect(200)

      expect(Array.isArray(res.body.data)).toBe(true)
      expect(res.body.data.length).toBeGreaterThan(0)
    })
  })

  describe('GET /api/v1/products', () => {
    it('should return paginated product list', async () => {
      const res = await request(app)
        .get('/api/v1/products')
        .expect(200)

      expect(res.body.data).toBeDefined()
      expect(res.body.pagination).toBeDefined()
      expect(res.body.pagination.total).toBeGreaterThanOrEqual(0)
    })

    it('should filter by category', async () => {
      const res = await request(app)
        .get('/api/v1/products?category=fashion')
        .expect(200)

      res.body.data.forEach(p => {
        expect(p.categoryId).toBe('fashion')
      })
    })
  })
})

// ── Health Check ──────────────────────────────────────────────
describe('Health Check', () => {
  it('GET /health should return ok', async () => {
    const res = await request(app).get('/health').expect(200)
    expect(res.body.status).toBe('ok')
  })
})
