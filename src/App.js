import './App.css';
import { Helmet } from 'react-helmet';
import Settings from './components/Settings';

function App() {
  return (
    <div className='w-full min-h-screen p-8'>
      <Helmet>
        <title>Cache Coherency Simulator</title>
      </Helmet>

      <h1 className='text-3xl font-bold mb-10'>Cache Coherency Simulator</h1>

      <div className='flex flex-row'>
        <div className='flex flex-col w-2/5'>
          <Settings/>
        </div>
        <div className='w-3/5'>
          Right col
        </div>
      </div>
    </div>
  );
}

export default App;
