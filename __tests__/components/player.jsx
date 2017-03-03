import shallow from 'enzyme/shallow';
import React from 'react';
import Player from '../../src/components/player';

const context = {
  styleManager: {
    render: () => ({
      player: 'player',
    }),
  },
};

test('mount', () => {
  const player = shallow(<Player />, { context });
  expect(player.find('.player').length).toBe(1);
});

test('aria-hidden=true', () => {
  const player = shallow(<Player />, { context });
  expect(player.find('.player[aria-hidden]').length).toBe(1);
});

test('aria-hidden=false', () => {
  const player = shallow(<Player src="https://example.com/index.m3u8" />, { context });
  expect(player.find('.player[aria-hidden=false]').length).toBe(1);
});
