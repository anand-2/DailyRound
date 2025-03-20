import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./TodoContent.css";
import { Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputAdornment, MenuItem, Select, TextField, Typography } from "@mui/material";
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
  const [filteredResult, setFilteredResult] = useState([]);
  const [open, setOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [newPriority, setNewPriority] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [dialogHeading, setDialogHeading] = useState("");
  const [editedTodoId, setEditedTodoId] = useState(null);
  const [addingNoteItemId, setAddingNoteItemId] = useState(null);

  // Infinite scroll state
  const [visibleCount, setVisibleCount] = useState(10);
  const loadChunk = 5; // Number of items to load each time

  const getTagColor = (tagName) => {
    const tag = tags.find((t) => t.name === tagName);
    return tag ? tag.color : "#616161";
  };

  // Fetch initial data
  useEffect(() => {
    if (props.currentUser) {
      axios.get(`http://localhost:3000/api/todos/${props.currentUser}`).then((res) => {
        setTodo(res.data);
        setFilteredResult(res.data);
      });
    }
  }, [props.currentUser]);

  // Filter based on priority
  useEffect(() => {
    if (Array.isArray(props.prioritySelected) && props.prioritySelected.length > 0) {
      setFilteredResult(todo.filter((item) => props.prioritySelected.includes(item.priority)));
    } else {
      setFilteredResult(todo);
    }
    // Reset visible count when filtering
    setVisibleCount(10);
  }, [props.prioritySelected, todo]);

  // Filter based on tags
  useEffect(() => {
    if (Array.isArray(props.selectedTags) && props.selectedTags.length > 0) {
      setFilteredResult(todo.filter((item) =>
        item.tags.some((tag) => props.selectedTags.includes(tag))
      ));
    } else {
      setFilteredResult(todo);
    }
    // Reset visible count when filtering
    setVisibleCount(10);
  }, [props.selectedTags, todo]);

  const fetchTodoListFromDB = () => {
    if (props.currentUser) {
      axios.get(`http://localhost:3000/api/todos/${props.currentUser}`).then((res) => {
        setTodo(res.data);
        setFilteredResult(res.data);
      });
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const itemId = Number(value);
    setSelectedTodo((prev) => (checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)));
  };

  const handleSearch = (event) => {
    const search = event.target.value;
    setFilteredResult(todo.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    ));
    setVisibleCount(10);
  };

  const handleAddTodos = () => {
    setDialogHeading("Add Todo");
    setOpen(true);
  };

  const handleNoteAdd = () => {
    if (noteInput.trim()) {
      setNotes([...notes, noteInput.trim()]);
    }
  };

  const handleClose = () => {
    setDialogHeading("");
    setDesc("");
    setTitle("");
    setNewPriority("");
    setSelectedTags([]);
    setOpen(false);
  };

  const handleNotesClose = () => {
    setNotes([]);
    setNoteInput("");
    setNotesOpen(false);
  };

  const setNewPriorityFunction = (event) => {
    setNewPriority(event.target.value);
  };

  const handleTagChange = (id) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(id) ? prevTags.filter(tagId => tagId !== id) : [...prevTags, id]
    );
  };

  const extractMentions = (text) => {
    const mentionRegex = /@(\w+)/g;
    return [...new Set(text.match(mentionRegex)?.map(match => match.slice(1)) || [])];
  };

  const handleAddTodoSubmit = () => {
    const selectedTagNames = Array.from(selectedTags).map((index) => tags[index].name);
    const mentionedUsers = extractMentions(title + " " + desc);

    const addedData = {
      userId: props.currentUser,
      title: title,
      description: desc,
      priority: newPriority,
      tags: selectedTagNames,
      notes: notes,
      mentions: mentionedUsers
    };

    console.log("Submitted Data:", addedData);
    if (addedData.title !== "") {
      axios.post(`http://localhost:3000/api/addTodos`, addedData).then((response) => {
        fetchTodoListFromDB();
        console.log(response);
        setOpen(false);
      });
    } else {
      console.log("Missing data");
    }
  };

  const handleAddingNote = (item) => {
    setNotesOpen(true);
    setAddingNoteItemId(item.id);
  };

  const handleAddNewNoteSubmit = () => {
    const data = { notes: notes };
    if (data.notes.length > 0) {
      axios.put(`http://localhost:3000/api/addNewTodoNote/${addingNoteItemId}`, data).then(() => {
        fetchTodoListFromDB();
        setNotesOpen(false);
      });
    } else {
      console.log("Notes cannot be empty");
    }
  };

  const handleEditTodoSubmit = () => {
    const selectedTagNames = selectedTags.map((index) => tags[index].name);
    const updatedData = {
      title: title,
      description: desc,
      priority: newPriority,
      tags: selectedTagNames,
      notes: notes
    };

    console.log("Edited Data:", updatedData);
    if (updatedData.title !== "") {
      axios.put(`http://localhost:3000/api/editTodos/${editedTodoId}`, updatedData).then((response) => {
        fetchTodoListFromDB();
        console.log(response);
        setOpen(false);
      });
    } else {
      console.log("Missing data");
    }
    setOpen(false);
  };

  const handleDeleteTodos = (item) => {
    setTodo((prevTodos) => prevTodos.filter((result) => result.id !== item.id));
    setFilteredResult(filteredResult.filter((result) => result.id !== item.id));
    axios.put(`http://localhost:3000/api/deleteTodo/${item.id}`).then((response) => {
      console.log(response);
    });
  };

  const handleEditTodos = (item) => {
    setDialogHeading("Edit Todo");
    console.log(item);
    setOpen(true);
    setDesc(item.desciption);
    setTitle(item.title);
    setNewPriority(item.priority);
    setEditedTodoId(item.id);
    const selectedTagIndices = item.tags.map(tagName =>
      tags.findIndex(tag => tag.name === tagName)
    ).filter(index => index !== -1);
    setSelectedTags(selectedTagIndices);
  };

  // Function to load more items
  const fetchMoreData = () => {
    if (visibleCount < filteredResult.length) {
      setVisibleCount((prev) => Math.min(prev + loadChunk, filteredResult.length));
    }
  };

  return (
    <div className="todoContent_main">
      <div className="searchSection">
        <TextField
          variant="outlined"
          placeholder="Search todo"
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          className="searchInput"
        />
        <Button className="todo_add_button" variant="contained" onClick={handleAddTodos}>Add Todo</Button>
      </div>
      <InfiniteScroll
        dataLength={visibleCount}
        next={fetchMoreData}
        hasMore={visibleCount < filteredResult.length}
        loader={<h4>Loading...</h4>}
        endMessage={<p style={{ textAlign: "center" }}>No more todos</p>}
      >
        {filteredResult.slice(0, visibleCount).map((item, i) => (
          <div key={i} className="todoContent_card">
            <div style={{ alignItems: 'center', display: 'flex' }}>
              <Checkbox
                sx={{ padding: "2px", height: "20px", width: "20px", marginRight: "15px" }}
                icon={<CheckBoxOutlineBlankIcon sx={{ color: "#a79b9b" }} />}
                checkedIcon={<CheckBoxIcon sx={{ color: "#80b156" }} />}
                value={item.id}
                checked={selectedTodo.includes(item.id)}
                onChange={handleCheckboxChange}
              />
              {item.title}
              {item?.tags?.map((tagName, index) => (
                <Chip
                  key={index}
                  label={tagName}
                  sx={{
                    backgroundColor: getTagColor(tagName),
                    height: "21px",
                    fontSize: "10px",
                    color: "white",
                    marginLeft: "10px",
                  }}
                />
              ))}
              <Chip
                label={item.priority}
                sx={{
                  backgroundColor: "#d32f2f",
                  border: '1px solid #d32f2f',
                  height: "21px",
                  fontSize: "10px",
                  color: "white",
                  marginLeft: "10px",
                }}
              />
            </div>
            <div style={{ alignItems: 'center', display: 'flex', gap: '10px' }}>
              <NoteAddIcon onClick={() => handleAddingNote(item)} className="todo_noteButton" sx={{ color: 'grey' }} />
              <EditIcon onClick={() => handleEditTodos(item)} className="todo_editButton" sx={{ color: 'grey' }} />
              <DeleteIcon onClick={() => handleDeleteTodos(item)} className="todo_editButton" sx={{ color: '#d32f2f' }} />
            </div>
          </div>
        ))}
      </InfiniteScroll>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontFamily: 'Poppins !important' }}>{dialogHeading}</DialogTitle>
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
          <FormControl required sx={{ marginTop: '8px' }} size="small" fullWidth>
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
                key={index}
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
                    backgroundColor: selectedTags.includes(index) ? tagName.color : "#6b7f88 !important",
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
        <DialogTitle sx={{ fontFamily: 'Poppins !important' }}>Add Note</DialogTitle>
        <DialogContent>
          <Textarea
            margin="dense"
            id="note"
            name="note"
            placeholder="Write your thoughts here..."
            fullWidth
            size="lg"
            sx={{ minWidth: '400px', minHeight: '200px' }}
            color="neutral"
            variant="outlined"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onBlur={handleNoteAdd}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={handleAddNewNoteSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TodoContent;