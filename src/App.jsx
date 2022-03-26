import './App.css';
import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import Settings from './components/Settings';
import Instructions from './components/Instructions';
import Simulation from './components/Simulation';
import API from './services/api';

function App() {
  const [currentSteps, setCurrentSteps] = useState([])
  const [processors, setProcessors] = useState([
    {
        state: '',
        register: '',
        value: '',
    },
    {
        state: '',
        register: '',
        value: '',
    },
    {
        state: '',
        register: '',
        value: '',
    }
]);


  return (
    <div className='w-full min-h-screen px-16 py-10'>
      <Helmet>
        <title>Cache Coherency Simulator</title>
      </Helmet>

      <h1 className='text-3xl font-bold mb-10'>Cache Coherency Simulator</h1>

      <div className='flex flex-row'>
        <div className='flex flex-col pr-4 w-1/2 xl:w-2/5 gap-y-8'>
          <Settings setProcessors={setProcessors}/>
          <Instructions setCurrentSteps={setCurrentSteps}/>
        </div>
        <div className='pl-4 w-1/2 xl:w-3/5'>
          <Simulation current_steps={currentSteps} processors={processors}/>

          <div className='mt-10'>
            <strong>For debugging purposes:</strong><br/> 
            <pre>{JSON.stringify(processors, undefined, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
