import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from "./contexts/ThemeContext";


const App = () => {

  useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);

  return (
    <ThemeProvider>
      
            {/* <Navbar /> */}
    <div>
      <div><Toaster position='top-right'/></div>
    </div>
    </ThemeProvider>
  )
}

export default App