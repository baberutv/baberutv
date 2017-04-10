import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import Player from '../../src/components/player';

const context = {
  setVideo() {},
};

test('mount', () => {
  const renderer = new ReactShallowRenderer();
  const result = renderer.render(<Player location={{ search: '' }} />, context);
  expect(result.type).toBe('div');
});

test('have search', () => {
  const renderer = new ReactShallowRenderer();
  const result = renderer.render(
    <Player location={{ search: 'https://example.com/index.m3u8' }} />,
    context,
  );
  expect(result.type).toBe('div');
});
