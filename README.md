[![Build Status](https://travis-ci.org/drcmda/mauerwerk.svg?branch=master)](https://travis-ci.org/drcmda/mauerwerk) [![npm version](https://badge.fury.io/js/mauerwerk.svg)](https://badge.fury.io/js/mauerwerk)

    npm install mauerwerk

<p align="middle">
  <img src="assets/grid.gif" />
</p>

&nbsp;
&nbsp;
&nbsp;

Demo: https://codesandbox.io/embed/0582jolnl

Simplified Demo: https://codesandbox.io/embed/z6ly40071p

## How to use

```jsx
import { Grid } from 'mauerwerk'

<Grid
  // Arbitrary data, should contain keys, possibly heights, etc.
  data={this.state.data}
  // Key accessor, instructs grid on how to fetch individual keys from the data set
  keys={d => d.key}
  // Can be a fixed value or an individual data accessor (for variable heights)
  // If you leave it undefined it will assume 100% container height
  heights={d => d.height}
  // Optional: number of columns (make it responsive yourself using react-measure/react-media)
  columns={3}
  // Optional: space between elements
  margin={0}
  // Optional: removes the possibility to scroll away from a maximized element
  lockScroll={false}
  // Optional: delay before minimizing an opened element
  closeDelay={500}
  // Optional: animates the grid in if true (default)
  transitionMount={true}>
  {(data, open, toggle) => (
    <div>
      {data.title}
      {open && <div>Opened/maximized content here</div>}
      <button onClick={toggle}>{open ? 'Close' : 'Open'}</button>
    </div>
  )}
</Grid>
```

You feed mauerwerk any data-set (an array of objects most likely), give it accessors so it can access keys (which can be names, hashes, etc., the same keys you'd normally hand over to React), and either a fixed cell height or individual heights. You render out each individual cell via render-prop. You'll receive three arguments:

1. `data`, the item from your data-set
2. `open`, the cells state, depending on whether it is `true` or `false` you can display varying content or use further animation prototypes to transition from cell-state to maximized-state
3. `toggle`, use this to maximize/minimize your cell

## Effects

You probably don't want flip between open/closed content using static conditions. mauerwerk comes with two simple to use effects:

- `Fade` will fade contents in according to the `show` property. It's a simgple wrapper around react-spring's `Transition`, you can feed it the same properties (config, from, enter, leave, update). By default it will just move opacity from 0 -> 1.
- `Slug` lets elements "crawl" in. It's a wrapper around react-spring's `Trail`. By default it will move opacity from 0 -> 1 and translate y from 40px -> 0px.

These two would work outside the Grids context if you wanted to use them elsewhere.

```jsx
import { Grid, Slug, Fade } from 'mauerwerk'

<Grid {...props}>
  {(data, open, toggle) => (
    <div>
      <Fade show={open}>
        <Slug>
          <h1>Opened content</h1>
          <span>Some text</span>
          <button onClick={toggle}>Close</button>
        </Slug>
      </Fade>
      <Fade show={!open}>
        <Slug>
          <h1>Cell content</h1>
          <span>Some text</span>
          <button onClick={toggle}>Open</button>
        </Slug>
      </Fade>
      <div>Content that would apply to both open and closed state</div>
    </div>
  )}
</Grid>
```

---

mauerwerk depends on [react-spring](https://github.com/drcmda/react-spring) and [react-measure](https://github.com/souporserious/react-measure).
