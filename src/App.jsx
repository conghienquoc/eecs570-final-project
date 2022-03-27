import './App.css';
import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import Settings from './components/Settings';
import Instructions from './components/Instructions';
import Simulation from './components/Simulation';
import API from './services/api';

const coherency_states = {
  'Invalid': 'I',
  'Shared': 'S',
  'Modified': 'M',
}


function App() {
  const [currentSteps, setCurrentSteps] = useState([])
  const [processors, setProcessors] = useState([
    {
        state: '',
        new_state: null,
        register: '',
        value: '',
        new_value: null,
    },
    {
        state: '',
        new_state: null,
        register: '',
        value: '',
        new_value: null,
    },
    {
        state: '',
        new_state: null,
        register: '',
        value: '',
        new_value: null,
    }
  ]);
  const [memory, setMemory] = useState({
        register: '',
        value: '',
        new_value: null,
  });
  const [lines, setLines] = useState([]); // Keep track of all lines created to remove at the end
  const [tooltip_buttons, setTooltipButtons] = useState([[], [], [], [], []]);   // Arr of 5 elts [p0, p1, p2, mem, bus]

  const clearLines = () => {
    console.log(lines);
    lines.forEach((line) => {
        line.remove();
    });
    
    // lines = [];
    // existing_edges = [];
    setLines([]);    
}

const clearTooltips = () => {
  setTooltipButtons([[], [], [], [], []])
}

  const getNextSteps = (proc_num, action, value=null) => {
    // Make sure to save changes before sending request
    clearLines();
    clearTooltips();
    commitMemory();
    commitProcs();

    var body = {
        'processor': proc_num,
        'action': action,
        'value': value
    }
    API.getNextStep(body).then( res => {
        setCurrentSteps(res);
    })
  }

  const commitProcs = () => {
    var new_processors = processors.slice(0);
    new_processors.forEach((proc) => {
        if (proc.new_value !== null) proc.value = proc.new_value;
        proc.new_value = null;
        if (proc.new_state !== null) proc.state = proc.new_state;
        proc.new_state = null;
    });
    setProcessors(new_processors);
}

  const commitMemory = () => {
      var new_memory = JSON.parse(JSON.stringify(memory));
      if (new_memory.new_state !== null) new_memory.state = new_memory.new_state;
      new_memory.new_state = null;
      setMemory(new_memory);
  }

  return (
    <div className='w-full min-h-screen px-16 py-10'>
      <Helmet>
        <title>Cache Coherency Simulator</title>
      </Helmet>

      <h1 className='text-3xl font-bold mb-10'>Cache Coherency Simulator</h1>

      <div className='flex flex-row'>
        <div className='flex flex-col pr-4 w-1/2 xl:w-2/5 gap-y-8'>
          <Settings setProcessors={setProcessors} setMemory={setMemory}/>
          <Instructions currentSteps={currentSteps} sendRequest={getNextSteps}/>
        </div>
        <div className='pl-4 w-1/2 xl:w-3/5'>
          <Simulation
            current_steps={currentSteps}
            processors={processors}
            memory={memory}
            setProcessors={setProcessors}
            setMemory={setMemory}
            lines={lines}
            tooltip_buttons={tooltip_buttons}
            setTooltipButtons={setTooltipButtons}
          />

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
