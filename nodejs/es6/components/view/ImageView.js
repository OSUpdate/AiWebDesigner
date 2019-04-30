// eslint-disable-next-line no-unused-vars
import React, {Component} from "react";
// eslint-disable-next-line no-unused-vars
import ImageItem from "./ImageItem";
// eslint-disable-next-line no-unused-vars
import ImageList from "./ImageList";

class App extends Component {
    /*
    constructor(props){
        super(props);
    }
	static defaultProps = {
	    name : "기본이름"
	}
	static propTypes = {
	    name : propTypes.string
    }
    */
	state = {
	    id: "",
	    pw: "",
	    check: "",
	    email: ""
	}
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    handleClick = (e) => {
        e.preventDefault();
        const validCheck = Array.prototype.slice.call(document.querySelectorAll("div#root p")).every(text => !text.textContent);
        const nullCheck = Object.values(this.state).every(text=>text);
        
        if(validCheck && nullCheck)
            // eslint-disable-next-line no-console
            console.log("test1");
        else
            // eslint-disable-next-line no-console
            console.log(validCheck);
    }
    render(){
        const {id,pw,check,email} = this.state;
        const {
            handleChange
        } = this;
	    return (
	        <React.Fragment>
                <form>
	                <Id onChange={handleChange} value={id}/>
	                <Password onChange={handleChange} value={pw}/>
                    <Check onChange={handleChange} pw={pw} value={check}/>
	                <Email onChange={handleChange} value={email}/>
                    <input type="submit" value="테스트" onClick={this.handleClick}/>
                </form>
	        </React.Fragment>
	    );
    }
}
export default App;
