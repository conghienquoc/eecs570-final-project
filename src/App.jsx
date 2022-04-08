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

const types = {
  unspecified: "",
  atomic: "Atomic",
  split: "Split Transaction",
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
  const [bus_instructions, setBusInstructions] = useState([]);
  const [lines, setLines] = useState([]); // Keep track of all lines created to remove at the end
  const [tooltip_buttons, setTooltipButtons] = useState([[], [], [], [], []]);   // Arr of 5 elts [p0, p1, p2, mem, bus]
  const [currentType, setCurrentType] = useState(types.unspecified);   // Keep track of current type to know to disable correct buttons
  const [isRunning, setRunning] = useState(false);

  const clearLines = () => {
    console.log(lines);
    lines.forEach((line) => {
        line.remove();
    });
    
    setLines([]);    
}

  const clearTooltips = () => {
    setTooltipButtons([[], [], [], [], []])
  }

  const clearBusInstructions = () => {
    setBusInstructions([]);
  }

const executeProcessorAction = (proc_num, action, value=null) => {
    // Make sure to save changes before sending request
    clearAndCommit();

    var body = {
        'processor': proc_num,
        'action': action,
        'value': value
    }
    // API.getNextStep(body).then( res => {
    //     setCurrentSteps(res);
    // })

    API.executeProcessorAction(body).then( res=> {
      setCurrentSteps(res);

      // If doing split transaction then update bus as well
      API.getBusEvents().then( busEvents => {setBusInstructions(busEvents)});
    })
  }


  // Clear lines and save changes made to processors/memory
  // SHould be called before next steps
  const clearAndCommit = () => {
    clearLines();
    clearTooltips();
    commitMemory();
    commitProcs();
    clearBusInstructions();
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

  const getNextStep = (busIndex=0) => {
    // Make sure to save changes before sending request
    clearAndCommit();

    console.log(`Execute bus event at index ${busIndex}`);
    API.executeBusEvent({'busIndex': busIndex}).then( res=> {
      setCurrentSteps(res);

      console.log('Get bus event');
      API.getBusEvents().then( busEvents => {setBusInstructions(busEvents)});
    });    
  }

  return (
    <div className='w-full min-h-screen px-16 py-10'>
      <Helmet>
        <title>Cache Coherency Simulator</title>
      </Helmet>

      <h1 className='text-3xl font-bold mb-10'>Cache Coherency Simulator</h1>

      <div className='flex flex-row'>
        <div className='flex flex-col pr-4 w-1/2 xl:w-2/5 gap-y-8'>
          <Settings
            setProcessors={setProcessors}
            setMemory={setMemory}
            setCurrentType={setCurrentType}
            setRunning={setRunning}
            disableGetInitialState={isRunning}
          />
          <Instructions
            currentSteps={currentSteps}
            executeProcessorAction={executeProcessorAction}
            getNextStep={getNextStep}
            disableStepButton={currentSteps.length === 0}  // Disable step button if no more steps for current action
            hideStepButton={currentType !== types.atomic}  // Only show step button if in atomic mode
            disableProcButtons={!isRunning || (currentType !== types.split && currentSteps.length !== 0)}
          />
        </div>
        <div className='pl-4 w-1/2 xl:w-3/5 min-w-fit'>
          <Simulation
            current_steps={currentSteps}
            processors={processors}
            memory={memory}
            setProcessors={setProcessors}
            setMemory={setMemory}
            bus_instructions={bus_instructions}
            setBusInstructions={setBusInstructions}
            lines={lines}
            tooltip_buttons={tooltip_buttons}
            setTooltipButtons={setTooltipButtons}
            disableBusButtons={currentType !== types.split}   // Only allow bus buttons to be clicked in split transaction mode
            getNextStep={getNextStep}
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
