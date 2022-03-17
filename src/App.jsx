import './App.css';
import { Helmet } from 'react-helmet';
import Settings from './components/Settings';
import Instructions from './components/Instructions';
import Processor from './components/Processor';

function App() {
  return (
    <div className='w-full min-h-screen p-8'>
      <Helmet>
        <title>Cache Coherency Simulator</title>
      </Helmet>

      <h1 className='text-3xl font-bold mb-10'>Cache Coherency Simulator</h1>

      <div className='flex flex-row'>
        <div className='flex flex-col pr-4 w-1/2 xl:w-2/5 gap-y-8'>
          <Settings/>
          <Instructions/>
        </div>
        <div className='pl-4 w-1/2 xl:w-3/5'>
          <Processor
            id={1}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
