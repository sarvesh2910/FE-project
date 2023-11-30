// __tests__/index.test.js

import { render, screen } from '@testing-library/react';
import LastRace from '@/app/components/lastrace';
import '@testing-library/jest-dom';

describe('LastRace', () => {
  it('Renders component heading', () => {
    render(<LastRace />)

    const heading = screen.getByRole('heading', {
      name: "Most Recent Race:",
    })

    expect(heading).toBeInTheDocument()
  })
});