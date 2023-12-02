/**
 * @jest-environment jsdom
 */
import {render, screen} from '@testing-library/react'
import Nav from './nav';
import '@testing-library/jest-dom'


test('Logo is rendered and is a link to the home page', () => {
    render(<Nav />);
    const logoLink = screen.getByRole('link', { name: /formula one logo/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
});


test('All navigation buttons are rendered with correct links', () => {
    render(<Nav />);
    const teamsButton = screen.getByRole('link', { name: /teams/i });
    const driversButton = screen.getByRole('link', { name: /drivers/i });
    const racesButton = screen.getByRole('link', { name: /races/i });

    expect(teamsButton).toBeInTheDocument();
    expect(teamsButton).toHaveAttribute('href', '/teams');

    expect(driversButton).toBeInTheDocument();
    expect(driversButton).toHaveAttribute('href', '/drivers');

    expect(racesButton).toBeInTheDocument();
    expect(racesButton).toHaveAttribute('href', '/races');
});

