import { useTheme } from "./Theme";




function Navbar() {
    const {themee,updateTheme} = useTheme()??{theme:"dark",updateTheme:()=>null};
  return (
      <div style={{
            background: themee === "dark" ? "white" : "black",
            color:themee === "dark" ? "black" : "white",
      }} className={`w-full flex item-center justify-center bg-text-${themee==="dark"?"white":"black"}`}>
      <div>{themee}</div>
      <button onClick={updateTheme} >{themee === "dark"?"light-theme":"dark-theme"}</button>
    </div>
  )
}

export default Navbar;
