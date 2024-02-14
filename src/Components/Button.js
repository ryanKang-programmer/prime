import {useState, useEffect} from "react";

const BlueButton = (props) => {
    const [title, setTitle] = useState('');
    const [disabled, setDisabled] = useState(false);
    
    useEffect(() => {
        setTitle(props.title);
    }, [])

    return (
        <input type="button"
            value={title}
            style={{
                backgroundColor: disabled ? 'grey' : 'blue',
                color: 'white',
                border: '1px lightblue solid',
                borderRadius: '5px',
                marginLeft: '0.5rem',
            }}
            onClick={() => {setTitle('Submitted'); setDisabled(true)}}
        disabled={disabled}
        />
    )
}

export default BlueButton;