import React, { useState } from 'react'
import './todoBody.css'
import Grid from '@mui/material/Grid2';
import SideBar from './SideBar';
import TodoContent from './TodoContent';

function TodoBody({userList,currentUser}) {
  const [prioritySelected,setPrioritySelected] = useState([])
  const [selectedTags, setSelectedTags] = useState([]);
  return (
    <div className='todoBody_main'>
        <Grid container spacing={2}>
            <Grid size={3}>
                <SideBar selectedTags={selectedTags} setSelectedTags={setSelectedTags} selectedPriorities={prioritySelected} setSelectedPriorities={setPrioritySelected}></SideBar>
            </Grid>  
            <Grid size={9}>
                <TodoContent userList={userList} currentUser={currentUser} prioritySelected={prioritySelected} selectedTags={selectedTags}></TodoContent>
            </Grid>           
        </Grid>       
    </div>
  )
}

export default TodoBody