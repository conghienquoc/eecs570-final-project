import os
# import flask #TODO: Does this file need this? I don't think so.

num_lines = 2

#TODO 1: Determine exclusive functions for each MSI,MOSI,MESI protocols
#TODO 2: Determine actual structure of storage
#TODO 3: Do we want to build an actual EX-stage for MSI, MOSI, MESI?
#TODO 4: Do we want to manage editing all of the State Machines here, or should we 
#        let some controller function be in control of dealing with the logic behind that?
#TODO 5: Are we going to need 3 separate return packet classes to return the type of packet
#        I imagine not, but this is a preliminary thought

# These would be more than likely moved to Nicks file 
MSI = ["Modified", "Shared", "Invalid"]
MOSI = ["Modified", "Owned", "Shared", "Invalid"]
MESI = ["Modified", "Exclusive", "Shared", "Invalid"]
MOESI = ["Modified", "Owned", "Exclusive", "Shared", "Invalid"]

# This is a return packet
class return_packet:
    def __init__(self):
        #TODO: What actually makes up this packet?
        return 

# This is potentially pushed to SQL 
class CacheLine:
    def __init__(self):
        #Is the cache line valid?
        self.valid = 0 

        #Current state of the cache line
        self.state = "Invalid"

        #What is currently being held here?
        self.data = [] #TODO: Determine data-type that goes here 

        #TODO: Discuss dirty bit
        self.dirty = 0

    #DEBUG function
    def print(self): 
        print(self.valid)
        print(self.state)
        print(self.data)

# Base StateMachine call 
class StateMachine:
    
    def __init__(self):
        #What is the current protocol
        self.protocol = "Invalid"

        #Instantiate Information
        self.lines[num_lines] = CacheLine()

        #Reset Qualifier - This is a check statement
        self.has_been_reset = 0

    #REQUIRES: self is a valid machine
    def reset_machine(self):
        # clear lines
        for x in range(num_lines):
            self.lines[x].valid = 0
            self.lines[x].state = "Invalid"
            self.lines[x].data = 0

        # update machine 
        self.protocol = "Invalid"
        self.has_been_reset = 1

    #REQUIRES: new_protocol is a valid protocol 
    def update_protocol(self, new_protocol):
        #Check to make sure the system is in a reset state 
        if (self.has_been_reset == 0):
            self.reset_machine()
        
        #update protocol
        self.has_been_reset = 0
        self.protocol = new_protocol

    #### These Functions update the Cacheline Class ####

    def print_cachelines(self): # DEBUG Function 
        #print all current lines 
        for x in self.lines:
            x.print()
        
        #Uncertain on if this works so it is commented
        # print(self.lines)
    
    #TODO: Should this act like a EX-stage in a pipeline
    #      ie. do we want to deal with add/nor/load/st/etc. here? 
    def update_lines(self, line_to_update, update_value): #TODO: Combine with update_line_state
        #Iterate through the number of lines processor may be holding  
        for x in range(num_lines):
            #Check to see if lines[x] is the same information we're updating 
            if (self.lines[x].data == line_to_update):
                #Update the line
                self.lines[x].data = update_value 

    def update_line_state(self, line_to_update, updated_state): #TODO: Combine with update_lines 
        #iterate through the lines 
        for x in range(num_lines):
            if (self.lines[x].data == line_to_update):
                self.lines[x].state = updated_state

    #TODO: Design Function
    def evict_line(self, line_to_evict):
        #iterate through the lines 
        for x in range(num_lines):
            if (self.lines[x].data == line_to_evict):
                self.lines[x].data = 0
                self.lines[x].state = "Invalid"
                self.lines[x].valid = 0
        return 

    #TODO: Design Function
    def send_to_mem():
        return 

    #TODO: Design Function
    def send_to_bus():
        return 
        
#TODO: Design Function
def create_return_packet():
    packet = return_packet()

    # ... 
    # ...
    # ...

    return packet

def main(json_packet):

    proc_a = StateMachine() # These would be more than likely moved to Nicks file 
    proc_b = StateMachine() # These would be more than likely moved to Nicks file 
    proc_c = StateMachine() # These would be more than likely moved to Nicks file 

    # socket style waiting for packet probably?

#TODO: Ask Nick about this syntax, I believe this is correct
if __name__ == "__main__":
    main()