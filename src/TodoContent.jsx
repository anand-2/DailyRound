import React, { useEffect, useState } from "react";
import "./TodoContent.css";
import { Autocomplete, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormLabel, Input, InputAdornment, InputLabel, MenuItem, OutlinedInput, Pagination, Select, TextareaAutosize, TextField, Typography } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Textarea from '@mui/joy/Textarea';
import axios from "axios";

function TodoContent(props) {
  const tags = [
    { name: "School", color: "#81d4fa" },
    { name: "Work", color: "#a5d6a7" },
    { name: "Fun", color: "#ef9a9a" },
    { name: "Sport", color: "#80cbc4" },
    { name: "Learning", color: "#7e57c2" },
  ];

  const [todo, setTodo] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState([]);
  const [filteredResult, setFilteredResult] = useState(todo);
  const [open, setOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [openedTask,setOpenedTask] = useState()
  const [newPriority, setNewPriority] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);  
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [notes,setNotes] = useState([])
  const [noteInput, setNoteInput] = useState("");
  const [dialogHeading , setDialogHeading] = useState("")
  const [editedTodoId, setEditedTodoId] = useState(null);
  const [addingNoteItemId,setAddingNoteItemId] = useState(null)
  
  useEffect(() => {
    if (Array.isArray(props.prioritySelected) && props.prioritySelected.length > 0) {
      setFilteredResult(todo.filter((item) => props.prioritySelected.includes(item.priority)));
    } else {
      setFilteredResult(todo);
    }
  }, [props.prioritySelected, todo]);

  useEffect(() => {
    console.log(props.selectedTags);
    if (Array.isArray(props.selectedTags) && props.selectedTags.length > 0) {
      setFilteredResult(todo.filter((item) => 
        item.tags.some((tag) => props.selectedTags.includes(tag))
      ));
    } else {
      setFilteredResult(todo);
    }
  }, [props.selectedTags, todo]);

  useEffect(()=>{
    if (props.currentUser !== null && props.currentUser !== undefined) {
      axios.get(`http://localhost:3000/api/todos/${props.currentUser}`).then((res)=>{
        setTodo(res.data)
        setFilteredResult(res.data);
      })
    }
  },[props.currentUser])

  const fetchTodoListFromDB = (add) =>{
    if (props.currentUser !== null && props.currentUser !== undefined) {
      axios.get(`http://localhost:3000/api/todos/${props.currentUser}`).then((res)=>{
        if(add) {
          setTodo((prevTodos) => {
            const updatedTodos = [...prevTodos, res.data]; 
            setFilteredResult(updatedTodos);  
            const totalPages = Math.ceil(updatedTodos.length / rowsPerPage);
            handleChangePage(null, totalPages);  
            return updatedTodos;
          });
        }
        setTodo(res.data)
        setFilteredResult(res.data);
        setNotes(res?.data?.notes);
      })
    }
  }

  const handleCheckboxChange = (item) => {
    const updatedTodos = todo.map((t) =>
      t.id === item.id ? { ...t, complete_status: !t.complete_status } : t
    );
  
    setTodo(updatedTodos);
    setFilteredResult(updatedTodos); 
    const updatedData = {
      title: item.title,
      description: item.description,  
      priority: item.priority,
      tags: item.tags,
      notes: item.notes,
      complete_status: !item.complete_status
    };
  
    axios.put(`http://localhost:3000/api/editTodos/${item.id}`,updatedData).then((response) => {
      console.log(response);
    });
  };  

  const handleSearch = (event) => {
    const search = event.target.value;
    setFilteredResult(todo.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())))
  }

  const handleAddTodos = () => {
    setDialogHeading("Add Todo")
    setOpen(true);
  }

  // const handleNoteAdd = () => {
  //   if (noteInput.trim()) {
  //     setNotes([...notes, noteInput.trim()]); 
  //   }
  // };

  const handleClose = () => {
    setDialogHeading("")
    setDesc("")
    setTitle("")
    setNewPriority("")
    setSelectedTags([])
    setOpen(false);
  };

  const handleNotesClose = () => {
    setNoteInput("")
    setNotesOpen(false);
  }

  const handleTaskClose = () => {
    setTaskOpen(false)
  }

  const handleTaskPopUp = (item) => {
    setTaskOpen(true)
    setOpenedTask(item)
  }
  
  const setNewPriorityFunction = (event) => {
    setNewPriority(event.target.value);
  };

  const handleTagChange = (id) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(id) ? prevTags.filter(tagId => tagId !== id) : [...prevTags, id]
    );
  };

  const handleAddTodoSubmit = () => {
    const selectedTagNames = Array.from(selectedTags).map((index) => tags[index].name);
  
    const addedData = {
      userId: props.currentUser,
      title : title,
      description : desc,
      priority: newPriority,
      tags: selectedTagNames,
      notes : notes,
      complete_status: false
    };  
    if(addedData.title !== "")    {
      axios.post(`http://localhost:3000/api/addTodos`,addedData).then((response)=>{
        fetchTodoListFromDB(true)
        console.log(response)
        handleClose()
      })
    } else{
      console.log("Add Mising data")
    }
  };

  const handleAddingNote = (event,item) => {
    event.stopPropagation()
    setNotesOpen(true)
    setAddingNoteItemId(item.id)
    setNotes(item.notes)
  }

  const handleAddNewNoteSubmit = () =>{
    if (noteInput.trim()) {
      console.log(notes)
      const updatedNotes = [...notes, noteInput.trim()]; 
      const data = {notes: updatedNotes};
    
      if(data.notes !== "")    {
        axios.put(`http://localhost:3000/api/addNewTodoNote/${addingNoteItemId}`,data).then(()=>{
          setNotes(updatedNotes);
          fetchTodoListFromDB()
          handleNotesClose()   
        })
      } else{
        console.log("Notes cannot be empty")
      }  
    }
  }

  const handleEditTodoSubmit = () => {
    const selectedTagNames = selectedTags.map((index) => tags[index].name);
  
    const updatedData = {
      title : title,
      description : desc,
      priority: newPriority,
      tags: selectedTagNames,
      notes : notes ? notes : []
    };
  
    console.log("Edited Data:", updatedData);  
    if(updatedData.title !== "")    {
      axios.put(`http://localhost:3000/api/editTodos/${editedTodoId}`,updatedData).then((response)=>{
        fetchTodoListFromDB()
        console.log(response)
        setOpen(false)
      })
    } else{
      console.log("Add Mising data")
    }
  
    setOpen(false);
  };  

  const handleDeleteTodos = (event,item) => {
    event.stopPropagation()
    setTodo((prevTodos) => {
      const updatedTodos = prevTodos.filter((result) => result.id !== item.id);      
      setFilteredResult((prevFiltered) => prevFiltered.filter((result) => result.id !== item.id));  
      if (updatedTodos.length > 0 && (page - 1) * rowsPerPage >= updatedTodos.length) {
        handleChangePage(null, Math.max(page - 1, 1));
      }  
      return updatedTodos;
    });
  
    axios.put(`http://localhost:3000/api/deleteTodo/${item.id}`).then((response) => {
      console.log(response);
    });
  };  

  const handleEditTodos = (event,item) => {
    event.stopPropagation()
    setDialogHeading("Edit Todo")
    console.log(item)
    setOpen(true)
    setDesc(item.desciption)
    setTitle(item.title)
    setNewPriority(item.priority)
    setEditedTodoId(item.id)
    const selectedTagIndices = item.tags.map(tagName => 
      tags.findIndex(tag => tag.name === tagName)
    ).filter(index => index !== -1);

    setSelectedTags(selectedTagIndices);
  }

  const [page, setPage] = useState(1);
  const rowsPerPage = 6;
  const paginatedData = filteredResult.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const handleChangePage = (_, value) => {
    setPage(value);
  };

  return (
    <>
      {paginatedData.length > 0 ?
      <div className="todoContent_main">
        <div className="searchSection">
          <OutlinedInput startAdornment={(<InputAdornment position="start"><SearchIcon /></InputAdornment>)} onChange={handleSearch} className="searchInput" placeholder="Search todo" />
          <Button className="todo_add_button" variant="contained" onClick={handleAddTodos}>Add Todo</Button>
        </div>
        <div className="todoContent_card_section">
          {paginatedData.length > 0 && paginatedData?.map((item,i) => (
            <div key={i} className="todoContent_card" style={item.complete_status ? {pointerEvents:'none',backgroundColor:'#eeeeee',border:'0.5px solid #ccc'} : {}} onClick={()=>handleTaskPopUp(item)}>
              <div style={{alignItems:'center',display:'flex'}}>
                <Checkbox
                  sx={{ padding: "2px", height: "20px", width: "20px", marginRight: "15px",pointerEvents: item.complete_status ? 'auto' : ''  }}
                  icon={<CheckBoxOutlineBlankIcon sx={{ color: "#a79b9b" }} />}
                  checkedIcon={<CheckBoxIcon sx={{ color: "#80b156" }} />}
                  checked={item.complete_status}
                  onClick={(event)=>event.stopPropagation()}
                  onChange={() => handleCheckboxChange(item)}
                />
                <div style={item.complete_status ? {textDecoration:'line-through'} : {}} >{item.title}</div>
                {item?.tags ?.map((tagName, index) => (
                  <div key={index} style={{display:'inline'}}>
                    <Chip                
                      label={tagName}
                      sx={{
                        backgroundColor:'#01579b ',
                        border:"1px solid #01579b",
                        "&:hover": {
                          backgroundColor: "#0277bd !important", 
                        },
                        height: "21px",
                        fontSize: "10px",
                        color: "white",
                        marginLeft: "10px",
                      }}
                    />              
                  </div>
                ))}
                <Chip
                  label={item.priority}
                  sx={{
                    backgroundColor: "#e57373",
                    border: '1px solid #e57373',
                    height: "21px",
                    fontSize: "10px",
                    color: "white",
                    marginLeft: "10px",
                  }}
                />
              </div>     
              <div style={{alignItems:'center',display:'flex',gap:'10px'}}>
                <NoteAddIcon onClick={(event)=>handleAddingNote(event,item)} className="todo_noteButton" sx={{color:'grey'}}></NoteAddIcon>
                <EditIcon onClick={(event)=>{handleEditTodos(event,item)}} className="todo_editButton" sx={{color:'grey'}}></EditIcon>
                <DeleteIcon onClick={(event)=>handleDeleteTodos(event,item)} className="todo_editButton" sx={{color:'#d32f2f'}}></DeleteIcon> 
              </div>     
            </div>
          ))}
          <Pagination
            count={Math.ceil(filteredResult.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
          />
        </div>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{fontFamily:'Poppins !important'}}>{dialogHeading}</DialogTitle>
          <DialogContent>
            <DialogContentText>
            Enter the details for your new task below. Make sure to set a title, priority, and tags to keep your work organized.
            </DialogContentText>
              <TextField
                autoFocus        
                required    
                margin="dense"
                id="title"
                name="title"
                label="Title"
                type="text"
                fullWidth
                size="small"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />     
            <TextField
              margin="dense"
              id="desc"
              name="desc"
              label="Description"
              type="text"
              fullWidth
              size="small"
              variant="outlined"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <FormControl required sx={{marginTop:'8px'}} size="small" fullWidth>
              <Select
                required
                labelId="priority-label"
                id="demo-select-small"
                value={newPriority}
                displayEmpty
                onChange={setNewPriorityFunction}
              >
                <MenuItem value="" disabled>
                  Select Priority
                </MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
            <div className="dialog_tags_section">
              <Typography>Select suitable tags*</Typography>
              {tags.map((tagName, index) => (
                  <Chip            
                    onClick={() => handleTagChange(index)}    
                    label={tagName.name} 
                    sx={{
                      border: '1px solid grey',
                      height: "21px",
                      fontSize: "10px",
                      color: "black",
                      marginTop: '5px',
                      marginLeft: index === 0 ? "0px" : "10px",
                      backgroundColor: selectedTags.includes(index) ? tagName.color : "white !important",
                      "&:hover": {
                        backgroundColor: selectedTags.includes(index) ? tagName.color : "#6b7f88 !important", // Slightly darker hover effect
                      }
                    }}
                  />              
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button type="submit" onClick={dialogHeading === 'Add Todo' ? handleAddTodoSubmit : handleEditTodoSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={notesOpen} onClose={handleNotesClose}>
          <DialogTitle  sx={{fontFamily:'Poppins !important'}}>Add Note</DialogTitle>
          <DialogContent>          
            <Textarea
              margin="dense"
              id="note"
              name="note"
              label="Note"
              type="text"
              placeholder="Write your thoughts here..."
              fullWidth
              size="lg"
              sx={{ minWidth: '400px',minHeight:'200px' }}
              color="neutral"
              variant="outlined"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />     
          </DialogContent>
          <DialogActions>
            <Button type="submit" onClick={()=>{handleAddNewNoteSubmit()}}>Submit</Button>
          </DialogActions>
        </Dialog>

        <Dialog fullWidth maxWidth="sm" sx={{"& .MuiDialog-paper": {minHeight: "200px",maxHeight:'90vh'}}} open={taskOpen} onClose={handleTaskClose}>
          <div className="taskTitleSection">
            <div className="taskTitle">{openedTask?.title}</div>            
            <div className="taskPriority">Priority : {openedTask?.priority}</div>
          </div>
          <div className="taskBodySection">  
            <div>
              <div className="taskDescription">{openedTask?.desciption}</div>  
              <div className="notesSection">
                <div className="notesHeading">Notes</div>  
                {openedTask?.notes.map((item, index) => (
                  <div className="notesItem" key={index}>{item}</div>
                ))}
              </div>  
            </div>
          </div>
        </Dialog>
      </div> : 
      <div style={{display:"flex",justifyContent:'center',flexDirection:'column',gap:'20px',alignItems:'center'}}>
        <img style={{width:'390px',height:'300px'}} src="/noData.jpg" alt="" />
        No Data found for this User
      </div>
      } 
    </>
  );
}

export default TodoContent;