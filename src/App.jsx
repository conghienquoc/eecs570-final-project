import './App.css';
import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import Settings from './components/Settings';
import Instructions from './components/Instructions';
import Simulation from './components/Simulation';
import API from './services/api';

const debug = false;  // Print out procs and mem states/val

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

const action_to_index = {
  'Load': 0,
  'Store': 1,
  'Evict': 2,
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
  const [queue_instructions, setQueue] = useState([[], [], [], []]);  // [proc1, proc2, proc3, memory]
  const [lines, setLines] = useState([]); // Keep track of all lines created to remove at the end
  const [tooltip_buttons, setTooltipButtons] = useState([[], [], [], [], []]);   // Arr of 5 elts [p0, p1, p2, mem, bus]
  const [currentType, setCurrentType] = useState(types.unspecified);   // Keep track of current type to know to disable correct buttons
  const [isRunning, setRunning] = useState(false);
  const [disableProcAction, setDisableProcAction] = useState(
    [
      [true, true, true],
      [true, true, true],
      [true, true, true]
    ]   
  )

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

  const clearQueueInstructions = () => {
    setQueue([[], [], [], []]);;
  }

const executeProcessorAction = (proc_num, action, value=null) => {
    // Make sure to save changes before sending request
    clearAndCommit();

    var body = {
        'processor': proc_num,
        'action': action,
        'value': value
    }

    API.executeProcessorAction(body).then( res=> {
      setCurrentSteps(res);

      // Update bus and queue as well
      API.getBusEvents().then( busEvents => {setBusInstructions(busEvents)});
      API.getQueueEvents().then( queueEvents => {setQueue(queueEvents)});
      enableValidInstructions();
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
    clearQueueInstructions();
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
      console.log('new memory');
      console.log(new_memory);
      if (new_memory.new_value !== null) new_memory.value = new_memory.new_value;
      new_memory.new_value = null;
      setMemory(new_memory);
  }

  const getNextStep = (busIndex=0) => {
    // Make sure to save changes before sending request
    clearAndCommit();

    console.log(`Execute bus event at index ${busIndex}`);
    API.executeBusEvent({'busIndex': busIndex}).then( res=> {
      setCurrentSteps(res);

      // Update bus and queue as well
      API.getBusEvents().then( busEvents => {setBusInstructions(busEvents)});
      API.getQueueEvents().then( queueEvents => {setQueue(queueEvents)});
      enableValidInstructions();
    });    
  }

  const executeQueueEvent = (index) => {
    // Make sure to save changes before sending request
    clearAndCommit();

    console.log(`Execute queue event at index ${index}`);
    API.executeQueueEvent({'processor': index}).then( res=> {
      setCurrentSteps(res);

      // Update bus and queue as well
      API.getBusEvents().then( busEvents => {setBusInstructions(busEvents)});
      API.getQueueEvents().then( queueEvents => {setQueue(queueEvents)});
      enableValidInstructions();
    });    
  }

  const enableValidInstructions = () => {
    API.getValidInstructions().then(res => {
      let newDisableProcAction = [
        [true, true, true],
        [true, true, true],
        [true, true, true]
      ];

      res.forEach(proc => {
        proc['actions'].forEach(action => {
          newDisableProcAction[proc['processor']][action_to_index[action]] = false;
        })
      })

      console.log(newDisableProcAction);
      setDisableProcAction(newDisableProcAction);
    });
  }

  return (
    <div id="page-wrapper" className='w-full min-h-screen px-20 py-16'>
      <Helmet>
        <title>Cache Coherency Simulator</title>
      </Helmet>
      

      <div className='flex flex-col xl:flex-row gap-x-4 lg:gap-x-10'>
        <div className='flex flex-col pr-4 w-full xl:w-1/3 gap-y-12'>
          <div>
            <h1 className='text-5xl font-bold font-monospace mb-10 text-white'>
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#12dbaf] to-[#b2db57]'>Cache Coherency</span> Simulator
            </h1>
            <p className='text-base'> The simulator replicates a multiprocessor snooping-based system under various cache coherency protocols
                — MSI (with the option for split-transaction), MESI, MOSI, and MOESI. Each processor and the main memory have an L1 cache of size 1,
                interacting with one another through bus transactions.
            </p>
          </div>
          <Settings
            setProcessors={setProcessors}
            setMemory={setMemory}
            setCurrentType={setCurrentType}
            setRunning={setRunning}
            enableValidInstructions={enableValidInstructions}
            disableGetInitialState={isRunning}
          />
          <div className={isRunning ? '' : 'hidden'}>
            <Instructions
              currentSteps={currentSteps}
              executeProcessorAction={executeProcessorAction}
              getNextStep={getNextStep}
              disableStepButton={currentSteps.length === 0}  // Disable step button if no more steps for current action
              hideStepButton={currentType !== types.atomic}  // Only show step button if in atomic mode
              disableProcButtons={!isRunning || (currentType !== types.split && currentSteps.length !== 0)}
              disableProcAction={disableProcAction}
              setDisableProcAction={setDisableProcAction}
            />
          </div> 
          
        </div>
        <div className={'flex mt-16 pl-4 w-full xl:w-2/3 min-w-fit justify-between ' + (isRunning ? '' : 'invisible')}>
          <div className='w-full'>
            <Simulation
              current_steps={currentSteps}
              processors={processors}
              memory={memory}
              setProcessors={setProcessors}
              setMemory={setMemory}
              bus_instructions={bus_instructions}
              queue_instructions={queue_instructions}
              lines={lines}
              tooltip_buttons={tooltip_buttons}
              setTooltipButtons={setTooltipButtons}
              disableBusButtons={currentType !== types.split}   // Only allow bus buttons to be clicked in split transaction mode
              getNextStep={getNextStep}
              executeQueueEvent={executeQueueEvent}
              currentType={currentType}
            />
          </div>          

          <div className={'mt-10 flex flex-row gap-x-10 ' + (debug ? '' : 'hidden')}>
            <div>
              <strong>Procs</strong><br/> 
              <pre>{JSON.stringify(processors, undefined, 2)}</pre>
            </div>
            <div>
              <strong>Memory</strong><br/> 
              <pre>{JSON.stringify(memory, undefined, 2)}</pre>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
