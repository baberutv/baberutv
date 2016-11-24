import provideContext from 'context-provider/lib/provideContext';
import mount from 'enzyme/mount';
import React, { PropTypes } from 'react';
import Header from '../../src/components/header';

@provideContext({
  editVideo: PropTypes.func.isRequired,
  insertCss: PropTypes.func.isRequired,
})
class MockHeader extends Header {
}

const dummyContext = {
  editVideo() {},
  insertCss() {},
};

test('mount', () => {
  const header = mount(<MockHeader context={dummyContext} />);
  expect(header.find('header').length).toBe(1);
});

test('aria-hidden=true', () => {
  const header = mount(<MockHeader context={dummyContext} />);
  expect(header.find('header[aria-hidden]').length).toBe(1);
});

test('aria-hidden=false', () => {
  const header = mount(<MockHeader context={dummyContext} src="https://example.com/index.m3u8" />);
  expect(header.find('header[aria-hidden=false]').length).toBe(1);
});
