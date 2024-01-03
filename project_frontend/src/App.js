import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Login from './Login';
import Signup from './SignUp';
import Profile from './Profile';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path = '/' element={<Login />} />
          <Route path = '/signup' element={<Signup />} />
          <Route path = '/profile/:username' element={<Profile />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
