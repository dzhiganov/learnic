import darker from './darker';

test('Should return darker color', () => {
  const c1 = 'hsl(357, 100%, 100%)';
  const c2 = 'hsl(564, 55%, 50%)';
  const c3 = 'hsl(233, 33%, 10%)';

  expect(darker(c1)).toEqual('hsl(357, 100%, 60%)');
  expect(darker(c2)).toEqual('hsl(564, 55%, 10%)');
  expect(darker(c3)).toEqual('hsl(233, 33%, 0%)');
});
