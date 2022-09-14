/**
 * @file Fixtures - Counter.jsx
 * @module fixtures/Counter.jsx
 */

import { useState } from 'react'

/**
 * Renders a basic counter.
 *
 * @see https://dev.to/estheragbaje/how-to-use-react-hooks-to-create-a-counter-component-1bmp
 *
 * @return {JSX.Element} JSX element
 */
function Counter() {
  const [count, setcount] = useState(0)

  /**
   * Decreases {@link count}.
   *
   * @return {void} Nothing when complete
   */
  const decrement = () => setcount(prev => prev - 1)

  /**
   * Increases {@link count}.
   *
   * @return {void} Nothing when complete
   */
  const increment = () => setcount(prev => prev + 1)

  return (
    <div style={{ margin: '0 auto', width: '100%' }}>
      <h4 style={{ marginBlock: '1.5rem', textAlign: 'center' }}>
        Count is {count}
      </h4>
      <div
        style={{
          alignContent: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <button onClick={decrement} style={{ padding: '.75rem 1.25rem' }}>
          -
        </button>
        <button onClick={increment} style={{ padding: '.75rem 1.25rem' }}>
          +
        </button>
        <button
          onClick={() => setcount(0)}
          style={{ padding: '.75rem 1.25rem' }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default Counter
