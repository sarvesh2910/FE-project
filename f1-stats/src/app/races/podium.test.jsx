import { render, screen } from '@testing-library/react';
import Podium from './podium';

const mockData = {
    first: 'Driver 1',
    second: 'Driver 2',
    third: 'Driver 3',
};

// just check if Podium renders without crashing
test('Podium renders without crashing', () => {
    render(<Podium data={mockData} />);
});

test('Whether driver names are displayed in the podium', () => {
    render(<Podium data={mockData} />);
    const firstDriver = screen.getByText(/Driver 1/i);
    const secondDriver = screen.getByText(/Driver 2/i);
    const thirdDriver = screen.getByText(/Driver 3/i);


    expect(firstDriver).toBeInTheDocument();
    expect(secondDriver).toBeInTheDocument();
    expect(thirdDriver).toBeInTheDocument();


    const stepOne = screen.getByText('1');
    expect(stepOne).toBeInTheDocument();
});

// steps in podium should have the corresponding classes.
test('Correct styles are applied to podium steps', () => {
    render(<Podium data={mockData} />);
    const stepOne = screen.getByText('1');
    const stepTwo = screen.getByText('2');
    const stepThree = screen.getByText('3');

    expect(stepOne).toHaveClass('stepOne');
    expect(stepTwo).toHaveClass('stepTwo');
    expect(stepThree).toHaveClass('stepThree');
});

