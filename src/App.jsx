import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./NavBar";
import TodoBody from "./todoBody";
import axios from "axios";

function App() {
  const [userList,setUsersList] = useState([])  
  const [currentUser,setCurrentUser] = useState()
  useEffect(()=>{
    axios.get('http://localhost:3000/api/users').then((response)=>{
      setUsersList(response.data)
      setCurrentUser(response.data[0].id)
    })
  },[])
  return (
    <>
     <NavBar userList={userList} setCurrentUser={setCurrentUser} currentUser={currentUser} setUsersList={setUsersList}></NavBar>
     <TodoBody userList={userList} currentUser={currentUser}></TodoBody>
    </>
  );
}

export default App;
