import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../server/index.js';

let server;
let baseUrl;

beforeAll(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}/api`;
      resolve();
    });
  });
});

afterAll(() => {
  server?.close();
});

describe('Team workload API', () => {
  it('GET /api/team/workload returns per-member aggregates', async () => {
    const res = await fetch(`${baseUrl}/team/workload`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    const rachel = data.find((m) => m.name === 'Rachel Torres');
    expect(rachel).toBeDefined();
    expect(rachel.total_tasks).toBeGreaterThan(10);
    expect(rachel.is_overloaded).toBe(true);
    expect(rachel.by_priority).toMatchObject({
      urgent: expect.any(Number),
      high: expect.any(Number),
      medium: expect.any(Number),
      low: expect.any(Number),
    });

    const member = data.find((m) => m.total_tasks === 0);
    if (member) {
      expect(member.is_overloaded).toBe(false);
    }
  });
});
