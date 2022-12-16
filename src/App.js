import Routes from "./config/Routes";
import { Provider } from 'react-redux'
import store from "./config/Redux";

function App() {
  return (
    <div className="App">
      <Provider store={store}> 
        <Routes />
      </Provider>
    </div>
  );
}

export default App;
