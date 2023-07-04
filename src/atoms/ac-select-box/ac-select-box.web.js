// Imports => React
import React from 'react';
import { Fade } from 'react-reveal';

// Imports => Controller
import AcSelectBoxController from './ac-select-box.controller';

// Component
class AcSelectBox extends AcSelectBoxController {
  buildError() {
    const { hasError } = this.state;
    return <div className={this.getErrorClassNames()}>{hasError}</div>;
  }

  buildInstructions() {
    const { instructions } = this.props;
    return (
      <div className={this.getInstructionsClassNames()}>{instructions}</div>
    );
  }

  buildListOptions() {
    const { name, options } = this.props;

    return (
      options &&
      this.parseOptionsList(options).map((option, index) => {
        return (
          <li
            key={`select-box-${name}-item-${index}`}
            onClick={event => this.onItemClick(event, option)}
            className={this.getListItemClassNames()}
            ref={node => (option.element = node)}
          >
            {option.label}
          </li>
        );
      })
    );
  }

  render() {
    const { disabled, instructions, label, value } = this.props;
    const { hasError, reference, name, tabindex } = this.state;

    const selectedLabel = this.getLabelFromValue(value);

    return (
      <div
        ref={this.$element}
        aria-roledescription={'input'}
        aria-labelledby={`label-${reference}`}
        className={this.getStyleClassNames()}
        disabled={disabled}
      >
        <input
          type={'text'}
          name={name}
          id={reference}
          defaultValue={value}
          onChange={event => this.onChange(event)}
          disabled={disabled}
          tabIndex={tabindex}
        />
        <div className={this.getInputClassNames()} onClick={this.toggleOptions}>
          <div className={this.getInputLabelClassNames()}>
            <Fade key={`select-box-value-${selectedLabel}`}>
              {selectedLabel}
            </Fade>
          </div>
          <ul
            ref={this.$list}
            className={this.getListClassNames()}
            style={this.getListInlineStyles()}
          >
            {this.buildListOptions()}
          </ul>
        </div>
        <label
          id={`label-${reference}`}
          htmlFor={reference}
          className={this.getLabelClassNames()}
        >
          {label}
        </label>
        {hasError && this.buildError()}
        {!hasError && instructions && this.buildInstructions()}
      </div>
    );
  }
}

export default AcSelectBox;
