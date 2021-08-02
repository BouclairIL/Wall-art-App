import React from 'react';

const BackgroundItem = ({ src, id, backgroundSelect, stateBg}) => {
    return (
        <div
            className="background-list__item"
            onClick={e => backgroundSelect(e, id)}
        >
            <div style={{
                background: `#fff url(${src}) no-repeat center center / 60px`,
                borderColor: id === stateBg.id ? 'black' : null
            }}>{null}</div>
        </div>
    )
}

export default BackgroundItem;