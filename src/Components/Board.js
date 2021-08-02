import React from "react";
import { useDrop } from "react-dnd";
import DroppedImage from "./DroppedImage";
import BackgroundList from "./BackgroundList";

const ItemTypes = {
    IMAGE: 'image',
    BOX: 'box'
}

export default function Board({ droppedImages,
                                  onImageDrop,
                                  onBoxPositionChange,
                                  onBoxDelete,
                                  backgroundsList,
                                  backgroundSelect,
                                  stateBg }) {


    const [{isOver}, drop] = useDrop({
        accept: [ItemTypes.IMAGE, ItemTypes.BOX],
        drop: (item, monitor) => {
            if(item.type === "image") {
                onImageDrop(item.imageIndex, monitor.getClientOffset().x, monitor.getClientOffset().y);
            } else {
                const delta = monitor.getDifferenceFromInitialOffset();
                const left = Math.round(item.left + delta.x);
                const top = Math.round(item.top + delta.y);
                onBoxPositionChange(item.boxIndex, left, top);
                return undefined;
            }

        },
        collect: monitor => {
            if(monitor.getItemType() === "image") {
                return {
                    isOver: monitor.isOver()
                }
            } else {
                return {
                    isOver: false
                }
            }
        }
    })

    return (
        <div className="drop-board"
             ref={drop}
             style={{
                background: `#fff url(${stateBg.src}) no-repeat center center / cover`,
                border: isOver ? '2px dashed red' : null
             }}
        >
            <BackgroundList backgroundsList={backgroundsList} backgroundSelect={backgroundSelect} stateBg={stateBg}/>
            {droppedImages.map(dimage => {
                return (
                    <DroppedImage
                        key={dimage.id}
                        source={dimage.src}
                        alterText={dimage.src}
                        index={dimage.id}
                        top={dimage.y}
                        left={dimage.x}
                        onBoxDelete={onBoxDelete}
                        widthOnDensity={dimage.width}
                    />
                )
            })}
        </div>
    )
}