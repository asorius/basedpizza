import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/pizzas';
describe('/api/pizzas', () => {
  test('test if this even works', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });
    await handler(req, res);
    const data = res._getJSONData();
    console.log(console.log(data));
  });
});
