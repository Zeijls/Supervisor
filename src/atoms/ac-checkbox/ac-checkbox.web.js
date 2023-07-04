// Imports => React
import React from 'react';

// Imports => Controller
import AcCheckboxController from './ac-checkbox.controller';

// Component
class AcCheckbox extends AcCheckboxController {
  render() {
    const { children, value, position, disabled } = this.props;

    return (
      <label
        htmlFor="ac-checkbox"
        className={this.getStyleClassNames()}
        onClick={this.onChangeEvent}
      >
        <input
          type={'checkbox'}
          value={value}
          disabled={disabled}
          onChange={this.onChangeEvent}
          checked={this.isChecked()}
          className={this.getInputClassNames()}
        />
        <span className={this.getLabelClassNames()}>
          {position === 'before' && children}
          <span
            className={this.getDisplayClassNames()}
            role={'button'}
            ref={node => (this.display = node)}
            data-active={this.isChecked()}
          />
          {position === 'after' && children}
        </span>
      </label>
    );
  }
}

export default AcCheckbox;
