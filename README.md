[![Build Status](https://travis-ci.org/drcmda/mauerwerk.svg?branch=master)](https://travis-ci.org/drcmda/mauerwerk) [![npm version](https://badge.fury.io/js/mauerwerk.svg)](https://badge.fury.io/js/mauerwerk)

    npm install mauerwerk

Animated masonry-like react-grid with enter/exit transitions and maximized cells.

<p align="middle">
  <img src="assets/grid.gif" />
</p>

&nbsp;
&nbsp;
&nbsp;

Demo: https://codesandbox.io/embed/048079xzw

Simplified Demo: https://codesandbox.io/embed/z6ly40071p

```jsx
import Grid from 'mauerwerk'

const App = () => (
  <Grid
    // Arbitrary data, should contain keys, possibly heights, etc.
    data={this.state.data}
    // Key accessor, instructs grid on how to fetch individual keys from the data set
    keys={d => d.name}
    // Can be a fixed value or an individual data accessor (for variable heights)
    heights={d => d.height}
    // Number of columns (make it responsive yourself using react-measure/react-media for instance)
    columns={2}
    // Space between elements
    margin={30}
    // Removes the possibility to scroll away from a maximized element
    lockScroll={false}
    // Delay when maximized elements are minimized again
    inactiveDelay={500}>
    {(data, maximized, toggle) => (
      <div>
        {data.title}
        {maximized && <div>Maximized content here</div>}
        <button onClick={toggle}>{maximized ? 'Close' : 'Open'</button>
      </div>
    )}
  </Grid>
)
```

You feed mauerwerk any data-set (an array of objects most likely), give it accessors so it can access keys, and optionally individual heights. You reder out each cell via render-prop. You'll receive three arguments:

1. `data`, an item from your data-set
2. `maximized`, the cells state, depending on whether it is `true` or `false` you can display alternating content or use further animation prototypes to transition from cell-state to maximized-state
3. `toggle`, use this to maximize/minimize your cell
