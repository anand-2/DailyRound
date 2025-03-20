import React from 'react'
import './NavBar.css'
import { AppBar } from "@mui/material";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Avatar from '@mui/material/Avatar';

function NavBar({userList,setUsersList,currentUser}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
        <Toolbar style={{backgroundColor:'#80b156',justifyContent:'space-between'}}>
            <div className="todo_main">Todo List</div> 
            <div className="navBar_features">
                <Button
                variant="contained"
                className="export_button"
                startIcon={<CloudDownloadIcon sx={{fontSize:'18px'}}/>}
                >
                Export              
                </Button>
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