/**
 * @file Fixtures - Button
 * @module fixtures/Button
 */

import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type ForwardedRef
} from 'react'
import s, { css } from 'styled-components'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button background color.
   *
   * @default 'black'
   */
  $bg?: ButtonHTMLAttributes<HTMLButtonElement>['color']

  /**
   * Button text color.
   *
   * @default 'white'
   */
  $color?: ButtonHTMLAttributes<HTMLButtonElement>['color']

  /**
   * Button font size.
   *
   * @default '1.25rem'
   */
  $fontsize?: number | string

  /**
   * Mark button as disabled.
   */
  disabled?: boolean
}

interface CounterButtonProps extends ButtonProps {
  /**
   * Initial click count.
   *
   * @default 0
   */
  count?: number
}

/**
 * Renders an HTML `<button>` element.
 *
 * @see https://developer.mozilla.org/docs/Web/HTML/Element/button
 * @see https://developer.mozilla.org/docs/Web/API/HTMLButtonElement
 *
 * @visibleName Button
 */
const Button = s.button.attrs<ButtonProps>(p => ({
  'aria-disabled': p.disabled ?? undefined,
  'aria-hidden': p.hidden ?? undefined
}))<ButtonProps>(p => {
  return css`
    background-color: ${p.$bg};
    color: ${p.$color};
  `
})

Button.defaultProps = {
  $bg: 'black',
  $color: 'white',
  $fontsize: '1.25rem',
  type: 'button'
}

/**
 * Renders a button that displays how many times it has been clicked.
 *
 * @param {CounterButtonProps} [props={}] - Component props
 * @param {ForwardedRef<HTMLButtonElement>} [ref] - `<button>` reference
 * @return {JSX.Element} Counter button markup
 */
const CounterButton = forwardRef(function (
  props: CounterButtonProps = {},
  ref?: ForwardedRef<HTMLButtonElement>
): JSX.Element {
  const { count, ...rest } = props

  const [clicks, setclicks] = useState<number>(count!)

  /**
   * Increases {@link clicks}.
   *
   * @return {void} Nothing when complete
   */
  const increment = (): void => setclicks(prev => prev + 1)

  return (
    <Button {...rest} onClick={increment} ref={ref}>
      {clicks}
    </Button>
  )
})

CounterButton.displayName = 'CounterButton'
CounterButton.defaultProps = {}

export {
  Button as default,
  CounterButton,
  type ButtonProps,
  type CounterButtonProps
}
