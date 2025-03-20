import React, { useState } from 'react'
import './NavBar.css'
import { AppBar, Menu, MenuItem } from "@mui/material";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { Person } from '@mui/icons-material';

function NavBar({userList,currentUser , setCurrentUser}) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const fetchTodoListFromDBAndDownload = () => {
    if (currentUser !== null && currentUser !== undefined) {
      axios.get(`http://localhost:3000/api/todos/${currentUser}`)
        .then((response) => {
          const data = response.data;          
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          
          const url = URL.createObjectURL(blob);          
          const a = document.createElement('a');
          a.href = url;
          a.download = 'todos.json'; 
          document.body.appendChild(a);
          a.click();  
          document.body.removeChild(a);            
          URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error('Error fetching todo list:', error);
        });
    }
  };  

  const handleUserChange = (userId) => {
    setCurrentUser(userId); 
    handleMenuClose(); 
  };

  const handleMenuClose = () => {
    setOpenDropdown(null);
  };

  const handleMenuOpen = (event) => {
    setOpenDropdown(event.currentTarget); 
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
        <Toolbar style={{backgroundColor:'#003366',justifyContent:'space-between'}}>
            <div className="todo_main">Todo List</div> 
            <div className="navBar_features">
                <Button
                variant="contained"
                className="export_button"
                onClick={()=>{fetchTodoListFromDBAndDownload()}}
                startIcon={<CloudDownloadIcon sx={{fontSize:'18px'}}/>}
                >
                Export              
                </Button>
                <Button
                  variant="contained"
                  className="export_button"
                  sx={openDropdown ? {borderBottomLeftRadius: '0px',borderBottomRightRadius: '0px'} : ''}
                  onClick={handleMenuOpen}
                  startIcon={<Person sx={{ fontSize: '18px' }} />}
                >
                  Switch User
                </Button>
                <Menu
                  sx={{marginTop: '0.5px','& .MuiPaper-root': {borderTopLeftRadius: '0px',borderTopRightRadius: '0px'}}}
                  anchorEl={openDropdown}
                  open={Boolean(openDropdown)}
                  onClose={handleMenuClose}
                >
                  {userList.map(user => (
                    <MenuItem style={{width:'136px'}} key={user.id} onClick={() => handleUserChange(user.id)}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Menu>
                <div className='username_title'>                  
                {userList.length > 0 ? (userList.find(user => user.id === currentUser)?.name || "John Doe"): "John Doe"}
                  <Avatar style={{height:'30px',width:'30px'}} alt="Travis Howard" src="/avatar.jpg" />                
                </div>
            </div>
        </Toolbar>
        </AppBar>
    </Box>
  )
}

export default NavBar