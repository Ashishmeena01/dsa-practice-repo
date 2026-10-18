import { createContext, useContext, useReducer } from 'react'
import Navbar from '@/Navbar'
import rd, { theme } from './reducer';

let themeContext = createContext<{themee:string,updateTheme:()=>void} | null>(null);

function Theme() {
    // const [themee,setTheme] = useState("dark");
    const som = useReducer(rd,theme);

    const updateTheme = () =>{
        som[1](som[0]);
        console.log(som)
        document.body.classList.replace(som[0], som[0] === "dark" ? "light" : "dark")
        // setTheme((val) =>val === "dark" ? "light" : "dark")
        // document.body.classList.add(theme);
    };


  return (
        <themeContext.Provider value={{themee:som[0],updateTheme}}>
          <div className="w-32 h-32 bg-red-500  ">
              <Navbar/>
          </div>
        </themeContext.Provider>
  )
}

const useTheme = () => useContext(themeContext);
export {useTheme};

export default Theme

