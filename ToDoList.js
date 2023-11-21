import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Container, Card, CardHeader, CardContent, Checkbox, Dialog, DialogTitle, DialogContent, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, DialogActions } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCancel, faEdit, faPlusCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';



const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [currTodo, setcurrTodo] = useState({
    description: '',
    deadline: '',
    priority: '',
    isComplete: false,
  });

  const [errors, setErrors] = useState({}); //state for erros

  const [openModal, setOpenModal] = useState(false);

  // add = true; update = false
  const [addUpdateFlag, setAddUpdateFlag] = useState(true);

  const handleModalOpenAdd = () => {
    setOpenModal(true);
    setAddUpdateFlag(true);
    setcurrTodo({
      task: '',
      description: '',
      deadline: '',
      priority: '',
      isComplete: false,
    });
  };

  const handleModalOpenUpdate = (task) => {
    setOpenModal(true);
    setAddUpdateFlag(false);
    setcurrTodo(task);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setcurrTodo({
      ...currTodo,
      [name]: value,
    });
    // should remove error once input added
    setErrors({
      ...errors,
      [name]: '',
    });
  };

// tried implementing functional programming here by having previous state of todos list. Not sure how this defers 
  const handleCompleteToggle = (taskId) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === taskId ? { ...todo, isComplete: !todo.isComplete } : todo
      )
    );
  };

  const validateTitle = (newErrors) => {
    if (!currTodo.task) {
      newErrors.task = 'Task is required';
    } else {
      for (const existingTodo of todos) {
        if (existingTodo.task === currTodo.task) {
          newErrors.task = 'This task title already exists. Select a new title.';  
        }
      }
    }
    return newErrors;
  }

  const validateDescription = (newErrors) => {
    if (!currTodo.description) {
      newErrors.description = 'Description is required';
    }
    return newErrors;
  }

  const validateDeadline = (newErrors) => {
    if (!currTodo.deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    return newErrors;
  }

  const validatePriority = (newErrors) => {
    if (!currTodo.priority) {
      newErrors.priority = 'Priority is required';
    }
    return newErrors;
  }

  const validateFormAdd = () => {
    var newErrors = {};
    
    newErrors = validateTitle(newErrors);
    newErrors = validateDescription(newErrors);
    newErrors = validateDeadline(newErrors);
    newErrors = validatePriority(newErrors);
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // If there are no errors, the form is considered valid
  };

  const addTodo = () => {
    if (!validateFormAdd()) {
      // Error because one of the fields incomplete 
      toast.error('Please fill in all the required fields.', {
        position: toast.POSITION.BOTTOM_RIGHT});
      return; // Do not proceed with adding a new task and exit
    }

    setTodos([...todos, { id: todos.length + 1, ...currTodo }]);
    setcurrTodo({
      task: '',
      description: '',
      deadline: '',
      priority: '',
      isComplete: false,
    });
    handleModalClose();
    toast.success('Task added successfully!', {
      position: toast.POSITION.BOTTOM_RIGHT});
  };

  const validateFormUpdate = () => {
    var newErrors = {};
    
    newErrors = validateDescription(newErrors);
    newErrors = validateDeadline(newErrors);
    newErrors = validatePriority(newErrors);
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // If there are no errors, the form is considered valid
  };

  const updateTodo = () => {
    if (!validateFormUpdate()) {
      // Error because one of the fields incomplete 
      toast.error('Please fill in all the required fields.', {
        position: toast.POSITION.BOTTOM_RIGHT});
      return; // Do not proceed with adding a new task and exit
    } 
    setTodos((prevTodos) =>
    prevTodos.map((todo) =>
      todo.id === currTodo.id ? { ...todo, ...currTodo } : todo
    ));
    setcurrTodo({
      task: '',
      description: '',
      deadline: '',
      priority: '',
      isComplete: false,
    });
    handleModalClose();
    toast.success('Task updated successfully!', {
      position: toast.POSITION.BOTTOM_RIGHT});
  };
   

  function removeTaskbyID(id) {
    setTodos((prevTodos) => prevTodos.filter((obj) => obj.id !== id));
    toast.success('Task successfully deleted!', {
      position: toast.POSITION.BOTTOM_RIGHT});
  }


  return (
    <Container maxWidth="xl" style={{padding: '1px', marginTop: "1px", alignItems: 'center', minHeight: '100vh'  }}>
        <ToastContainer />

        <Card>
        <CardHeader
            title={
            <Typography variant="h5" style={{ color: 'white' }}>
              <FontAwesomeIcon icon={faBars} style={{ marginRight: '8px' }} />
              FRAMEWORKS
            </Typography>
            }
            action={
                <Button variant="contained" color="primary" onClick={handleModalOpenAdd} >
                    <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '8px'}} />
                    Add
                </Button>
              }
            style={{ backgroundColor: '#2196F3' }}
        />

        <CardContent>
            <TableContainer component={Paper} style={{ height: '100%'}}>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell align="center">Task</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Deadline</TableCell>
                    <TableCell align="center">Priority</TableCell>
                    <TableCell align="center">Is Complete</TableCell>
                    <TableCell align="center">Action</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {todos.map((todo) => (
                    <TableRow key={todo.id}>
                    <TableCell align="center">{todo.task}</TableCell>
                    <TableCell align="center">{todo.description}</TableCell>
                    <TableCell align="center">{moment(todo.deadline).format('MM/DD/YYYY')}</TableCell>
                    <TableCell align="center">{todo.priority}</TableCell>
                    <TableCell align="center">
                    <Checkbox
                      checked={todo.isComplete}
                      onChange={() => handleCompleteToggle(todo.id)}
                    />
                    </TableCell >
                    <TableCell align="center" >
                      <div>
                        {/* only displays if task not completed*/ }
                        {!todo.isComplete && 
                        <Button onClick={() => handleModalOpenUpdate(todo)} color="primary" variant="contained" sx={{ width: '50%' }}>
                          <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} />
                          Update
                        </Button>}
                      </div>
                      <div>
                        <Button onClick={() => removeTaskbyID(todo.id)} variant="contained" sx={{ bgcolor: 'red', width: '50%'}}>
                          <FontAwesomeIcon icon={faXmarkCircle} style={{ marginRight: '8px' }} />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </CardContent>

        <form
            onSubmit={(e) => {
            e.preventDefault();
            addTodo();
            }}
        >
            {/* ... (same as before) */}
        </form>
        </Card>
        {/* Used ternary operators to choose between add vs update */}
        <Dialog open={openModal} onClose={handleModalClose}>
        {addUpdateFlag ? (
          <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>
              <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '8px' }} />
              Add Task
          </DialogTitle>
          ) : (
          <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} />
              Edit Task
          </DialogTitle>
          )
        }
        <DialogContent>
        {addUpdateFlag ? (
          <TextField
            label="Title"
            name="task"
            value={currTodo.task}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!errors.task} // mark field as with error
            helperText={errors.task} // error message below task
          />
          ) : null }
          <TextField
            label="Description"
            name="description"
            value={currTodo.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!errors.description} 
            helperText={errors.description} 
          />
          <TextField
            label="Deadline"
            name="deadline"
            type="date"
            value={currTodo.deadline}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
                shrink: true,
              }}
            error={!!errors.deadline} 
            helperText={errors.deadline} 
          />
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Priority</FormLabel>
            <RadioGroup
              aria-label="priority"
              name="priority"
              value={currTodo.priority}
              onChange={handleInputChange}
              row
            >
              <FormControlLabel value="low" control={<Radio />} label="Low" />
              <FormControlLabel value="med" control={<Radio />} label="Medium" />
              <FormControlLabel value="high" control={<Radio />} label="High" />
            </RadioGroup>
            {errors.priority && (
              <Typography variant="caption" color="error">
                {errors.priority}
              </Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
        {addUpdateFlag ? (
          <Button onClick={addTodo} color="primary" variant="contained" sx={{ width: '25%'}} >
              <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '8px' }} />
              Add
          </Button>
        ) : (
          <Button onClick={updateTodo} color="primary" variant="contained" sx={{ width: '25%'}}>
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} />
              Update
          </Button>
        ) }
          <Button onClick={handleModalClose} variant="contained" sx={{ bgcolor: 'red', width: '25%'}}>
          <FontAwesomeIcon icon={faCancel} style={{ marginRight: '8px' }}/>
            Cancel
          </Button>
          
        </DialogActions>
      </Dialog>

    </Container>
    

  );
};

export default TodoList;
