// Imports => React
import React from 'react';
import { Fade } from 'react-reveal';

// Imports => Utilities
import { AcIsSet } from '@utils';

// Imports => Controller
import AcTextInputController from './ac-text-input.controller';

// Component
class AcTextInput extends AcTextInputController {
  buildError = () => {
    const { hasError, touched } = this.state;

    if (hasError && !touched) return null;
    if (hasError === true) return null;

    return (
      <Fade duration={400} key={hasError}>
        <div
          className={this.getErrorClassNames()}
          dangerouslySetInnerHTML={{
            __html: hasError,
          }}
        />
      </Fade>
    );
  };

  buildInstructions = () => {
    const { instructions } = this.props;
    return (
      <div
        className={this.getInstructionsClassNames()}
        dangerouslySetInnerHTML={{
          __html: instructions,
        }}
      />
    );
  };

  buildAction = () => {
    const { action } = this.props;
    if (!action) return null;
    return action;
  };

  buildTextInput = () => {
    const {
      value,
      disabled,
      readonly,
      maxLength,
      min,
      max,
      focus,
      autocomplete,
    } = this.props;
    const { name, reference, type } = this.state;

    let pattern = null;
    if (type === 'number') pattern = '[-+]?[0-9]*[.,]?[0-9]+';

    let _props = {};

    if (AcIsSet(pattern)) _props = { ..._props, pattern };
    if (AcIsSet(min)) _props = { ..._props, min };
    if (AcIsSet(max)) _props = { ..._props, max };

    if (type === 'number' || type === 'textarea') _props = { ..._props, value };
    else _props = { ..._props, defaultValue: value };

    if (type === 'number') _props = { ..._props, inputMode: 'numeric' };

    if (focus) _props = { ..._props, autoFocus: true };

    if (type === 'textarea') {
      return (
        <textarea
          type={type}
          name={name}
          id={reference}
          value={value}
          aria-labelledby={`label-${reference}`}
          placeholder={this.getPlaceholder()}
          className={this.getInputClassNames()}
          disabled={disabled}
          readOnly={readonly}
          autoComplete={autocomplete ? autocomplete : 'new-password'}
          tabIndex={0}
          onChange={this.onChange}
          onKeyUp={this.onKeyUp}
          ref={this.element}
          {..._props}
        />
      );
    }

    return (
      <input
        type={type}
        name={name}
        id={reference}
        aria-labelledby={`label-${reference}`}
        placeholder={this.getPlaceholder()}
        className={this.getInputClassNames()}
        disabled={disabled}
        readOnly={readonly}
        pattern={pattern}
        autoComplete={autocomplete ? autocomplete : 'new-password'}
        autoCapitalize={'none'}
        autoCorrect={'none'}
        tabIndex={0}
        maxLength={maxLength || 524288}
        onChange={this.onChange}
        onKeyUp={this.onKeyUp}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        ref={this.element}
        {..._props}
      />
    );
  };

  render() {
    const { label, disabled, readonly, instructions, action } = this.props;
    const { hasError, reference } = this.state;

    return (
      <div
        ref={(node) => (this.el = node)}
        className={this.getStyleClassNames()}
        disabled={disabled}
        readOnly={readonly}
      >
        {this.buildTextInput()}
        {label && (
          <label
            id={`label-${reference}`}
            htmlFor={reference}
            className={this.getLabelClassNames()}
            dangerouslySetInnerHTML={{
              __html: label,
            }}
          />
        )}
        {action && this.buildAction()}
        {hasError && this.buildError()}
        {instructions && this.buildInstructions()}
      </div>
    );
  }
}

export default AcTextInput;
