import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Btn from '@/components/atoms/Btn/Btn'; // 직접 import

// CSS Modules 모킹 (vanilla-extract 사용 중이라면)
jest.mock('@/styles/variants.css', () => ({
  btnSizeVariants: { small: '', medium: '', large: '' },
  colorVariants: { primary: '', secondary: '' },
}));

jest.mock('./btn.css', () => ({
  btn: '',
  moreBtn: '',
}));

describe('Btn', () => {
  it('클릭 시 onClick이 호출된다', () => {
    const handleClick = jest.fn();
    render(<Btn onClick={handleClick}>클릭</Btn>);

    fireEvent.click(screen.getByText('클릭'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled일 때 클릭이 되지 않는다', () => {
    const handleClick = jest.fn();
    render(
      <Btn onClick={handleClick} disabled>
        클릭
      </Btn>,
    );

    fireEvent.click(screen.getByText('클릭'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('type="more"일 때 Link로 렌더링된다', () => {
    render(
      <Btn type='more' href='products'>
        더보기 ⟩
      </Btn>,
    );
    expect(screen.getByText('더보기 ⟩')).toBeInTheDocument();
  });
});
