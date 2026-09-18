import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  it('returns an ok status', () => {
    expect(new HealthController().getHealth()).toEqual({ status: 'ok' });
  });
});
