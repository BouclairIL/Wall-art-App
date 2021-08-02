import React, {useState} from "react";
import Image from "./Image";
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi';
import {useRef} from 'react';
import {useDrop} from "react-dnd";

const ItemTypes = {
    IMAGE: 'image',
    BOX: 'box'
}

export default function ImagesContainer({initialState, onMouseDownHandle, onTouchStartHandle,onBoxDeleteFromBox,filterValues}) {
    const imagesBoardInner = useRef(null);
    const imagesContainer = useRef(null);
    const [move, setMove] = useState(0);


    const [{isOver}, drop] = useDrop({
        accept: ItemTypes.BOX,
        drop: (item, monitor) => {
            onBoxDeleteFromBox(item.boxIndex);
        },
        collect: monitor => {
            return {
                isOver: monitor.isOver()
            }
        }
    });

    const style = {
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        transition: 'all .3s ease',
        transform: `translateX(${move}px)`
    }


    function renderImages() {
        let state = [...initialState];

        if(filterValues.color.length > 0) {
            state = state.filter(image => image.color == filterValues.color);
        }

        if(filterValues.price.length > 0){
            state = state.filter(image => image.price <= filterValues.price[1] && image.price >= filterValues.price[0]);
        }

        return state.map(image => {
                return <Image key={image.id} index={image.id} src={image.src} alt={image.alt} onMouseDownHandle={onMouseDownHandle} onTouchStartHandle={onTouchStartHandle}/>
            });
    }

    function slideRight() {
        if((initialState.length * 152) > Math.abs(move)){
            setMove(move - 165);
        }
    }

    function slideLeft() {
        if(move !== 0) {
            setMove(move + 165);
        }
    }

    return (
        <div className='images-board-container'
             style={{
                border: isOver ? '3px dashed blue' : null
             }}
             ref={drop}
        >
            <span className="slide-arrow slide-arrow--left" onClick={() => slideLeft()}><HiArrowCircleLeft /></span>
            <span className="slide-arrow slide-arrow--right" onClick={() => slideRight()}><HiArrowCircleRight /></span>
            <div className="images-board" ref={imagesContainer}>
                <div
                    className="images-board-inner"
                    ref={imagesBoardInner}
                    style={style}
                >
                    {renderImages()}
                </div>
            </div>
        </div>
    )
}