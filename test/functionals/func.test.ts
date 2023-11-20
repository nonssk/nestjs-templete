import { getPoint } from '../setup/func';

describe('Func test', () => {
  it('should getPoint', async () => {
    const result = await getPoint(1);
    expect(result).toEqual(1);
  });
});
