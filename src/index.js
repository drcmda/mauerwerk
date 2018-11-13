import React from 'react'
import PropTypes from 'prop-types'
import Measure from 'react-measure'
import { Transition, Trail, animated, interpolate, config } from 'react-spring'

const styles = {
  outer: { position: 'relative', width: '100%', height: '100%' },
  inner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    minHeight: '100%',
  },
  cell: {
    position: 'absolute',
    willChange: 'transform, width, height, opacity',
  },
}

export class Grid extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array,
    keys: PropTypes.func,
    occupySpace: PropTypes.bool,
    columns: PropTypes.number,
    margin: PropTypes.number,
    heights: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
    lockScroll: PropTypes.bool,
    closeDelay: PropTypes.number,
    transitionMount: PropTypes.bool,
    open: PropTypes.string,
  }
  state = {
    mounted: false,
    width: 0,
    height: 0,
    heightOuter: 0,
    widthOuter: 0,
    curOpen: null,
    lastOpen: null,
  }
  scrollOut = e => {
    if (!this.props.lockScroll) {
      this.state.curOpen && this.toggle(null)
      this.clicked = false
    }
  }
  toggle = key =>
    this.setState(
      state => ({
        lastOpen: state.curOpen,
        curOpen: state.curOpen === key ? null : key,
      }),
      () => (this.clicked = true)
    )
  resize = (width, height, props) =>
    this.setState({
      [width]: props.client.width,
      [height]: props.client.height,
      mounted: width === 'width' || this.state.mounted,
    })
  resizeOuter = props => this.resize('widthOuter', 'heightOuter', props)
  resizeInner = props => this.resize('width', 'height', props)
  update = ({ key, x, y, width, height }) => {
    const curOpen = this.state.curOpen === key
    return {
      opacity: this.state.open && !open ? 0 : 1,
      x: curOpen ? this.outerRef.scrollLeft : x,
      y: curOpen ? this.outerRef.scrollTop : y,
      width: curOpen ? this.state.width : width,
      height: curOpen ? this.state.heightOuter : height,
    }
  }

  componentDidUpdate() {
    this.clicked = false
  }

  static getDerivedStateFromProps(props, state) {
    if (props.open !== undefined && props.open !== state.curOpen) {
      return { lastOpen: state.curOpen, curOpen: props.open }
    } else return null
  }

  cell = ({ key, object }, i) => ({ opacity, x, y, width, height }) => {
    const { lastOpen, curOpen } = this.state
    const { open } = this.props
    return (
      <animated.div
        style={{
          ...styles.cell,
          opacity,
          width,
          height,
          zIndex: lastOpen === key || curOpen === key ? 1000 : i,
          transform: interpolate(
            [x, y],
            (x, y) => `translate3d(${x}px,${y}px, 0)`
          ),
        }}
        children={this.props.children(
          object,
          curOpen === key,
          open !== undefined && (() => this.toggle(key))
        )}
      />
    )
  }

  render() {
    let {
      columns = 3,
      margin = 0,
      occupySpace = true,
      lockScroll = false,
      closeDelay = 0,
      transitionMount = true,
      children,
      impl,
      config,
      data,
      keys,
      heights,
      open,
      ...rest
    } = this.props
    let { curOpen, height, width, widthOuter, heightOuter } = this.state
    let column = 0
    let columnHeights = new Array(columns).fill(0)

    let displayData = data.map((child, i) => {
      let index = occupySpace
        ? columnHeights.indexOf(Math.min(...columnHeights))
        : column++ % columns
      let cellWidth = width / columns - margin / (1 - 1 / (columns + 1))
      let left = cellWidth * index
      let offset = (index + 1) * margin
      let top = columnHeights[index] + margin
      let cellHeight =
        typeof heights === 'function'
          ? heights(child)
          : heights || heightOuter - margin * 2
      columnHeights[index] += cellHeight + margin
      return {
        x: margin ? left + offset : left,
        y: top,
        width: cellWidth,
        height: cellHeight,
        key: keys(child, i),
        object: child,
      }
    })
    const overflow = lockScroll ? (curOpen ? 'hidden' : 'auto') : 'auto'
    const totalHeight = Math.max(...columnHeights) + margin

    return (
      <Measure
        client
        innerRef={r => (this.outerRef = r)}
        onResize={this.resizeOuter}>
        {({ measureRef }) => (
          <div
            ref={measureRef}
            style={{ ...styles.outer, ...this.props.style, overflow }}
            {...rest}
            onScroll={this.scrollOut}
            onWheel={this.scrollOut}
            onTouchMove={this.scrollOut}>
            <Measure
              client
              innerRef={r => (this.innerRef = r)}
              onResize={this.resizeInner}>
              {({ measureRef }) => (
                <div
                  ref={measureRef}
                  style={{ ...styles.inner, height: totalHeight }}>
                  <Transition
                    native
                    delay={this.clicked && !curOpen ? closeDelay : 0}
                    items={displayData}
                    keys={d => d.key}
                    from={{ opacity: 0 }}
                    leave={{ opacity: 0 }}
                    enter={this.update}
                    update={this.update}
                    impl={impl}
                    config={config}
                    children={(transitionMount || this.state.mounted) && displayData.map(this.cell)}
                  />
                </div>
              )}
            </Measure>
          </div>
        )}
      </Measure>
    )
  }
}

export default props =>
  console.warn(
    'The default export will be deprecated next version, import { Grid } from mauerwerk instead!'
  ) || <Grid {...props} />

const wrap = (child, styles) => {
  styles = { willChange: Object.keys(styles).join(','), ...styles }
  if (!animated[child.type]) {
    // Wrap components into animated divs
    return <animated.div style={{ ...styles }}>{child}</animated.div>
  } else {
    // Otherwise inject styles into existing component-props
    const Component = animated[child.type]
    const props = {
      ...child.props,
      style: {
        ...child.props.style,
        ...styles,
      },
    }
    return <Component {...props} />
  }
}

// Wrapper around react-springs Trail component.
// It will make each child (which must be a dom node) fade and trail in.
export class Slug extends React.PureComponent {
  static propTypes = {
    from: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    to: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  }
  render() {
    const {
      children,
      from = { opacity: 0, transform: 'translate3d(0,40px,0)' },
      to = { opacity: 1, transform: 'translate3d(0,0px,0)' },
      ...rest
    } = this.props
    const result = React.Children.map(children, child => styles =>
      wrap(child, styles)
    )
    return (
      <Trail
        native
        {...rest}
        keys={result.map((_, i) => i)}
        from={from}
        to={to}
        children={result}
      />
    )
  }
}

// Wrapper around react-springs Transition.
// It will Transition the child node in and out depending on the "show" prop.
export class Fade extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    show: PropTypes.bool,
    from: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    enter: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    leave: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  }
  render() {
    const {
      children,
      show = true,
      from = { opacity: 0 },
      enter = { opacity: 1 },
      leave = { opacity: 0 },
      ...rest
    } = this.props
    const result = styles => wrap(children, styles)
    return (
      <Transition
        native
        keys={show.toString()}
        {...rest}
        from={from}
        enter={enter}
        leave={leave}
        children={show ? result : undefined}
      />
    )
  }
}
