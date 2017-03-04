import shallow from 'enzyme/shallow';
import React from 'react';
import Player from '../../src/components/player';

const context = {
  setVideo() {},
};

test('mount', () => {
  const player = shallow(<Player location={{ search: '' }} />, { context });
  expect(player.find('div').length).toBe(1);
});

test('have search', () => {
  const player = shallow(<Player location={{ search: 'https://example.com/index.m3u8' }} />, { context });
  expect(player.find('div').length).toBe(1);
});
