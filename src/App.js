import { Game } from './modules';
import { AppContextConsumer, AppContextProvider } from './shared/context';

const App = () => {
  return (
    <AppContextProvider>
      <AppContextConsumer>
        {() => (
          <Game />
        )}
      </AppContextConsumer>
    </AppContextProvider>
  )
};

export default App;
