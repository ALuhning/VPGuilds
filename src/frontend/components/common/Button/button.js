import React from 'react';
import './button.css'

const Button = ({action,description,disabled = false}) => {
    return (
      <button
        className="Button"
        onClick={action}
        disabled={disabled}>{description}</button>
    )
}

export default Button