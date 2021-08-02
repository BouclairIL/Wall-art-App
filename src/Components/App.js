import React, {useEffect, useState} from 'react';
import "./App.css";
import { v4 as uuidv4 } from 'uuid';
import Board from "./Board";
import ImagesContainer from "./ImagesContainer";
import { parse } from 'fast-xml-parser';
import FilterContainer from "./FilterContainer";
import 'rc-slider/assets/index.css';


const backgroundsList = [
    {
        id: uuidv4(),
        src: 'images/inspo_1.jpg',
        realWidth: 120, // inches
        pixelWidth: 1250, // pixels
        pixelWidthInCm: (1250 * 0.0104166667) // 13 inches
    }
    // {
    //     id: uuidv4(),
    //     src: 'images/inspo_2.jpg'
    // },
    // {
    //     id: uuidv4(),
    //     src: 'images/emptyWall.jpg'
    // },
    // {
    //     id: uuidv4(),
    //     src: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80'
    // },
    // {
    //     id: uuidv4(),
    //     src: 'https://images.unsplash.com/photo-1523878288860-7ad281611901?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80'
    // },
    // {
    //     id: uuidv4(),
    //     src: 'https://images.unsplash.com/photo-1531481517150-2228446fb6b0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80'
    // },
    // {
    //     id: uuidv4(),
    //     src: null
    // }
]

const testState = [
    {
        id: 9397328,
        //src: "https://www.bouclair.com/dw/image/v2/BBWQ_PRD/on/demandware.static/-/Sites-masterCatalog_bouclair/default/dw4e765060/images/highres/9397328.jpg?sw=1000&amp;sh=1000&amp;sm=fit&amp;q=70",
        src: 'images/artexample.jpg',
        alt: "Yellow Westfalia Printed Canvas",
        shiftX: 0,
        shiftY: 0,
        price: 15.99,
        color: "Yellow",
        width: 12
    },
    {
        id: 9400429,
        src: "https://www.bouclair.com/dw/image/v2/BBWQ_PRD/on/demandware.static/-/Sites-masterCatalog_bouclair/default/dw5f58edd2/images/highres/9400429.jpg?sw=1000&amp;sh=1000&amp;sm=fit&amp;q=70",
        alt: "Perched Cardinal Printed Canvas",
        shiftX: 0,
        shiftY: 0,
        price: 24.99,
        color: "Red",
        width: 16
    },
    {
        id: 9398502,
        src: "https://www.bouclair.com/dw/image/v2/BBWQ_PRD/on/demandware.static/-/Sites-masterCatalog_bouclair/default/dw45678ec5/images/highres/9398502.jpg?sw=1000&amp;sh=1000&amp;sm=fit&amp;q=70",
        alt: "Round Wood-Framed Mirror",
        shiftX: 0,
        shiftY: 0,
        price: 79.99,
        color: "Brown",
        width: 21
    },
    {
        id: 9400430,
        src: "https://www.bouclair.com/dw/image/v2/BBWQ_PRD/on/demandware.static/-/Sites-masterCatalog_bouclair/default/dw54600773/images/highres/9400430.jpg?sw=1000&amp;sh=1000&amp;sm=fit&amp;q=70",
        alt: "Road in Mountains Printed Canvas",
        shiftX: 0,
        shiftY: 0,
        price: 69.99,
        color: "Red",
        width: 24
    },
    {
        id: 9399483,
        src: "https://www.bouclair.com/dw/image/v2/BBWQ_PRD/on/demandware.static/-/Sites-masterCatalog_bouclair/default/dwa77b27ba/images/highres/9399483.jpg?sw=1000&amp;sh=1000&amp;sm=fit&amp;q=70",
        alt: "Wood Framed Mirror",
        shiftX: 0,
        shiftY: 0,
        price: 249.99,
        color: "Brown",
        width: 27
    }
];

export default function App() {
    const [initialState, setInitialState] = useState([]);
    const [droppedImages, setImages] = useState([]);
    const [stateBg, setBg] = useState(backgroundsList[0]);
    const [filters, setFilters] = useState({});
    const [filteredState, setFilteredState] = useState([]);
    const [filterValues, setFilterValues] = useState({color: '', price: []});


    useEffect(() => {
        async function getXMLResponse() {
            const response = await fetch('bouclair.xml')
            const responseText = await response.text();
            let XMLitems = parse(responseText).rss.channel.item;
            const wallDecorItems = XMLitems.filter(item => {
                if(item['g:product_type'] === undefined) {
                    return false;
                }
                return item['g:product_type'].includes('Wall Decor') === true;
            });
            const arrayForState = wallDecorItems.map(item => {
                return {
                    id: item['g:id'],
                    src: item['g:image_link'],
                    alt: item['title'],
                    shiftX: 0,
                    shiftY: 0,
                    price: Number(item["g:price"].substring(0, item["g:price"].length-4)),
                    color: item["g:color"]
                }
            });


            for(let i = 0; i < arrayForState.length; i++) {
                arrayForState[i]["color"] = arrayForState[i]["color"].replace('&amp;', '&');
            }


            setInitialState(testState);
            setFilteredState(testState);


            // Array for color filter
            const preColors = arrayForState
                .map(item => item.color)
                .filter((v, i, a) => a.indexOf(v) === i);


            const colors = preColors.map(color => {
                return {
                    color: color,
                    active: false
                }
            })

            // Finding max price
            const prices = wallDecorItems
                .map(item =>  Number(item["g:price"].substring(0, item["g:price"].length - 4)));
            var maxPrice = Math.max(...prices);
            var minPrice = Math.min(...prices);

            maxPrice = Math.round(maxPrice);
            minPrice = Math.round(minPrice);

            // Apply in state for filters
            setFilters({colors, maxPrice, minPrice});
        }
        getXMLResponse();
    }, []);



    function onMouseDownHandle(e, id) {
        let images = [...filteredState];
        let shiftX = e.clientX - e.target.getBoundingClientRect().left;
        let shiftY = e.clientY - e.target.getBoundingClientRect().top;
        for(let i = 0; i < images.length; i++) {
            if(images[i].id == id) {
                images[i].shiftX = shiftX;
                images[i].shiftY = shiftY;
            }
        }
        setFilteredState(images);
    }

    function onTouchStartHandle(e, id) {
        let images = [...filteredState];
        let shiftX = e.touches[0].clientX - e.touches[0].target.x;
        let shiftY = e.touches[0].clientY - e.touches[0].target.y;
        for(let i = 0; i < images.length; i++) {
            if(images[i].id == id) {
                images[i].shiftX = shiftX;
                images[i].shiftY = shiftY;
            }
        }
        setFilteredState(images);
    }

    function onImageDrop(id, xCoords, yCoords) {
        // copy existing state
        const DIcopy = [...droppedImages];
        for(let i = 0; i < initialState.length; i++) {
            if(initialState[i].id === id) {
                DIcopy.push({
                    id: uuidv4(),
                    src: initialState[i].src,
                    alt: initialState[i].alt,
                    x: xCoords - initialState[i].shiftX,
                    y: yCoords - initialState[i].shiftY - (28 - window.pageYOffset),
                    // additional width attribute(test)
                    width: 13 * initialState[i].width / 120
                });
            }
        }
        setImages(DIcopy);
    }

    function onBoxPositionChange(id, left, top) {
        // copy existing state
        const DIcopy = [...droppedImages];
        for(let i = 0; i < DIcopy.length; i++) {
            if(DIcopy[i].id === id) {
                    DIcopy[i].x = left;
                    DIcopy[i].y = top;
            }
        }
        setImages(DIcopy);
    }

    function onBoxDelete(e, id) {
        // copy existing state
        const DIcopy = [...droppedImages];
        const filtered = DIcopy.filter(item => {
            return item.id !== id;
        });
        setImages(filtered);
    }

    function onBoxDeleteFromBox(id) {
        // copy existing state
        const DIcopy = [...droppedImages];
        const filtered = DIcopy.filter(item => {
            return item.id !== id;
        });
        setImages(filtered);
    }

    function backgroundSelect(e, id) {
        for(let i = 0; i < backgroundsList.length; i++) {
            if(backgroundsList[i].id === id) {
                setBg(backgroundsList[i]);
            }
        }
    }

    function setFilterColor(color) {
        setFilterValues(Object.assign({},filterValues, { color: color}));
    }

    function setFilterPrice(price) {
        setFilterValues(Object.assign({},filterValues, { price: price}));
    }

        return (
            <div className="wrapper">
                <div className="top-block">
                    <Board
                        droppedImages={droppedImages}
                        onImageDrop={onImageDrop}
                        onBoxPositionChange={onBoxPositionChange}
                        onBoxDelete={onBoxDelete}
                        backgroundsList={backgroundsList}
                        backgroundSelect={backgroundSelect}
                        stateBg={stateBg}
                    />
                </div>
                <FilterContainer
                    filters={filters}
                    setFilterColor={setFilterColor}
                    setFilterPrice={setFilterPrice}
                />
                <ImagesContainer
                    initialState={filteredState}
                    filterValues={filterValues}
                    onMouseDownHandle={onMouseDownHandle}
                    onTouchStartHandle={onTouchStartHandle}
                    onBoxDeleteFromBox={onBoxDeleteFromBox}
                />
            </div>
        )
}