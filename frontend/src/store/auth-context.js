import React, {useState, useCallback, useEffect} from 'react';

const AuthContext = React.createContext({
    isLoggedIn: false,
    userId: null,
    token: null,
    onLogin: () => {},
    onLogout: () => {}
})

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(false);
    const [userId, setUserId] = useState(null);

    const loginHandler = useCallback((userId, token) => {
        setToken(token);
        setUserId(userId);
        localStorage.setItem('userData', JSON.stringify({
            userId: userId,
            token: token
        }))
    }, []);
  
    const logoutHandler = useCallback(() => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem('userData');
    }, []);
    
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && storedData.token) {
            loginHandler(storedData.userId, storedData.token);
        }
    }, [loginHandler]);

    const contextValue = {
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        onLogin: loginHandler,
        onLogout: logoutHandler
    }

    return (
        <AuthContext.Provider value = {contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}
export default AuthContext;