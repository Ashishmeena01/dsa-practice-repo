
let theme = "light";

type ints = string;
type tp = string

const rd = (it:ints,tp:tp)=> {
    switch (tp) {
        case "light":
            it = "dark"
            return it;
            break;
        default:
            it = "light"
            return it;
            break;
    }
}

export {theme};

export default rd;