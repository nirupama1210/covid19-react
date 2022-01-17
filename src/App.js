import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import {Routes,Route,Link} from "react-router-dom";
import Home from './components/Home'
import State from './components/State';
function Empty()
{
  return <h1>There's Nothing to display</h1>
}
function App() {
  return (
    <>    

<Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="state" element={<State/>}/>
 
      
        <Route path="*" element={<Empty/>}/>
        </Routes>
      

    </>

   );
}

export default App;
