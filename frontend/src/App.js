import React, {useContext} from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthContext from './store/auth-context';
import DashboardPage from './pages/Dashboard';

const App = () => {
  const authCtx = useContext(AuthContext)
  return (
      <BrowserRouter>
        <Navigation />
            <Routes>
            <Route path ='/' element={<HomePage />}/>

            {!authCtx.isLoggedIn && (
              <Route path ='/auth' element={<AuthPage />}/>
            )}

            {authCtx.isLoggedIn && (
              <Route path ='/dashboard/:userId' element={<DashboardPage />}/>
            )}
            </Routes>
      </BrowserRouter>
  );
}

export default App;