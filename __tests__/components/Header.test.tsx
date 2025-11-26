import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import Header from '../../src/components/Header';

describe('Header', () => {
  it('should render with title', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<Header title="Test Title" />);
    });
    expect(tree!).toBeTruthy();
  });

  it('should render with title and subtitle', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <Header title="Test Title" subtitle="Test Subtitle" />,
      );
    });
    expect(tree!).toBeTruthy();
  });
});
