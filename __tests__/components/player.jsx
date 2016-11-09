import provideContext from 'context-provider/lib/provideContext';
import mount from 'enzyme/mount';
import React, { PropTypes } from 'react';
import Player from '../../src/components/player';

@provideContext({
  insertCss: PropTypes.func.isRequired,
})
class MockPlayer extends Player {
}

function insertCss() {}

test('mount', () => {
  const player = mount(<MockPlayer context={{ insertCss }} />);
  expect(player.find('.player').length).toBe(1);
});

test('aria-hidden=true', () => {
  const player = mount(<MockPlayer context={{ insertCss }} />);
  expect(player.find('.player[aria-hidden]').length).toBe(1);
});

test('aria-hidden=false', () => {
  const player = mount(<MockPlayer context={{ insertCss }} src="https://example.com/index.m3u8" />);
  expect(player.find('.player[aria-hidden=false]').length).toBe(1);
});