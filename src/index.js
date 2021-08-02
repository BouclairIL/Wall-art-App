import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';
import {DndProvider} from "react-dnd";
import { TouchBackend } from 'react-dnd-touch-backend';
import { usePreview } from 'react-dnd-preview';
import 'bootstrap/dist/css/bootstrap.min.css';

const MyPreview = () => {
    const {display, itemType, item, style} = usePreview();
    if (!display) {
        return null;
    }

    if(itemType === "image") {
        return(
            <div className="images-board--item big-width" style={style}>
                <img src={item.source} />
            </div>
        )
    }

    if(itemType === "box") {
        return (
            <div className="images-board--item image-landed" style={{...style, width: `${item.cssWidth}px`}} >
                <span className="delete-icon active" >&times;</span>
                <div className="scale-container active">
                    <span className="scale-container__plus">+</span>
                    <span className="scale-container__minus">-</span>
                </div>
                <img src={item.source} />
            </div>
        )
    }

};

function Wrapper() {
    return (
        <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true}}>
            <App />
            <MyPreview />
        </DndProvider>
    )
}

ReactDOM.render( <Wrapper />, document.getElementById('root'));

