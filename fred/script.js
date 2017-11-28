class Greeting extends React.Component {
  render() {
    return <p>Hello, Universe</p>;
  }
}

ReactDOM.render(
  <Greeting/>,
  document.getElementById('root')
);
