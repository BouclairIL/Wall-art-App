import React from 'react';
import BackgroundItem from "./BackgroundItem";

const BackgroundList = ({backgroundsList, backgroundSelect, stateBg}) => {
    return (
        <div className="background-list">
            {backgroundsList.map(item => {
                return <BackgroundItem src={item.src}  key={item.id} id={item.id} backgroundSelect={backgroundSelect} stateBg={stateBg}/>
            })}
        </div>
    )
}

export default BackgroundList;