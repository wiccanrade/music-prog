import { ChakraProvider } from '@chakra-ui/react';
import MusicGenerator from './components/MusicGenerator';

function App() {
  return (
    <ChakraProvider>
      <MusicGenerator />
    </ChakraProvider>
  );
}

export default App;