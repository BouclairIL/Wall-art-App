import React from "react";
import {useDrag} from "react-dnd";

const ItemTypes = {
    IMAGE: 'image'
}

export default function Image({ index, src, alt, onMouseDownHandle, onTouchStartHandle }) {
    const [{opacity}, drag] = useDrag({
        item: {
            type: ItemTypes.IMAGE,
            imageIndex: index,
            source: src
        },
        collect: monitor => ({
            opacity: monitor.isDragging() ? 0.5 : 1
        })
    });

    return (
        <div className="images-board--item"
             key={index}
             ref={drag}
             style={{opacity}}
             onMouseDown={e => onMouseDownHandle(e, index)}
             onTouchStart={e => onTouchStartHandle(e, index)}
        >
            <img src={src} alt={alt} />
        </div>
    )
}