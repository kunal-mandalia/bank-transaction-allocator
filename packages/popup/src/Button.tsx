import React from 'react';

type BtnStyle = 'success' | 'warning' | undefined;

interface IButton {
  label: string;
  onClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined;
  btnStyle: BtnStyle
}

const buttonStyle = {
  fontSize: 'medium',
  width: '100px',
  height: '40px',
  color: 'white',
  border: 'none'
}

const successColour = 'rgb(0, 117, 36)';
const warningColour = '#ad7626';

function getButtonColour(btnStyle: BtnStyle) {
  switch (btnStyle) {
    case 'success':
      return successColour;

    case 'warning':
      return warningColour;
    default:
      return 'grey'
  }
}

export const Button = ({ label, onClick, btnStyle }: IButton) => (
  <button
   style={{
     float: 'right',
     ...buttonStyle,
     backgroundColor: getButtonColour(btnStyle)
   }}
   onClick={onClick}>{label}
  </button>
)