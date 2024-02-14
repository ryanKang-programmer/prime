import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { increseCount } from "../../Strore/reducers/counter";

/**
 * Pipeline Overview
 */

function ImportCoordinates(props) {
    // const iconSize = '2.5rem';
    const dispatch = useDispatch();

    const { count } = useSelector(state => state.counter);

    const increse = () => {
        dispatch(increseCount());
    };

    return (
        <div style={{display: 'flex', height: '100%', width: '100%', padding: '1rem', flexDirection: 'column'}}>
            <h1 style={{alignSelf: 'flex-start', justifySelf: 'flex-start'}}>Pipeline Overview {'>'} Import Coordinates</h1>
            <div style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                {/* <VscTools size={iconSize}/> */}
                <h1>Development in progress</h1>
                {count}
                <button onClick={increse}>Add</button>
            </div>
        </div>
    )

}

export default ImportCoordinates;