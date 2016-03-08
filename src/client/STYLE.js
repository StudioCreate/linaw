const STYLE = {
  LInAW: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  header: {
    flex: '0 0 auto',
    padding: 10
  },
  body: {
    flex: '1 1 1px',
    overflow: 'auto'
  },
  nav: {
    display: 'flex',
  },
  navLink: (selected)=>({
    padding: '.5em 1em',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    borderColor: selected ? 'currentColor' : 'transparent'
  })
};

export default STYLE