import React, {useState, useEffect} from "react";
import {useDrag} from "react-dnd";

const ItemTypes = {
    BOX: 'box',
    IMAGE: 'image'
}

export default function Image({ source, alterText, index, top, left, onBoxDelete, widthOnDensity }) {

    const [framed, setFrame] = useState(false);
    const [timer, setTimer] = useState(null);
    const [width, setWidth] = useState();
    const [enter, setMouse] = useState(false);

    const [{opacity}, drag] = useDrag({
        item: {
            type: ItemTypes.BOX,
            boxIndex: index,
            left: left,
            top: top,
            source: source,
            cssWidth: width
        },
        collect: monitor => ({
            opacity: monitor.isDragging() ? 0.5 : 1
        }),
        // begin: (monitor) => {
        //     if(timer) {
        //         clearTimeout(timer);
        //     }
        //     setFrame(true);
        // },
        // end: (item, monitor) => {
        //     let time = setTimeout(function (){
        //         setFrame(false);
        //     }, 3000);
        //     setTimer(time);
        // }
    });

    // function onMouseEnterHandle() {
    //     if(timer) {
    //         clearTimeout(timer);
    //         setMouse(true);
    //     }
    // }
    //
    // function onMouseLeaveHandle() {
    //     if(enter) {
    //         setFrame(false);
    //     }
    // }
    //
    // function onMouseHoverImage() {
    //     setFrame(true);
    // }

    useEffect(() => {
        setFrame(true);
        setWidth(widthOnDensity*96);
    }, []);

    function onMouseLeaveHandle() {
        let time = setTimeout(function (){
                                setFrame(false);
                            }, 3000);
        setTimer(time);
    }

    function onMouseEnterHandle() {
        if(timer) {
            clearTimeout(timer);
        }
        if(!framed) {
            setFrame(true);
        }
    }


    return (
        <div
            className="images-board--item image-landed"
            style={{ top: `${top}px`, left: `${left}px`, opacity, width: `${width}px` }}
            ref={drag}
            onMouseLeave={() => onMouseLeaveHandle()}
            onMouseEnter={() => onMouseEnterHandle()}
        >
            <span className={`delete-icon ${framed ? "active" : ""}`} onClick={e => onBoxDelete(e, index)}>&times;</span>
            <div
                className={`scale-container ${framed ? "active" : ""}`}
                // onMouseEnter={() => onMouseEnterHandle()}
                // onMouseLeave={() => onMouseLeaveHandle()}
            >
                <span onClick={() => setWidth(width + 30)} className="scale-container__plus">+</span>
                <span onClick={() => setWidth(width - 30)} className="scale-container__minus">-</span>
            </div>
            <img src={source} alt={alterText} />
        </div>
    )
}