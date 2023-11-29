// __tests__/index.test.js

import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import '@testing-library/jest-dom';

describe('Home', () => {
  it('Renders component heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: "Most Recent Race:",
    })

    expect(heading).toBeInTheDocument()
  })
});