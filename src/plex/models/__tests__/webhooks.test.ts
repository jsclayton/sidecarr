import { Payload } from '../webhooks';
import fixture from '../__fixtures__/Payload'

describe('Payload model', () => {

  test('can parse JSON', () => {

    const payload = Payload.parse(JSON.stringify(fixture));
    expect(payload).toBeInstanceOf(Payload);
  });

  test('can parse object', () => {

    const payload = Payload.parse(fixture);
    expect(payload).toBeInstanceOf(Payload);
  });
});
