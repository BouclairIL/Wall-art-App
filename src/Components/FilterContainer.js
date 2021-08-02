import React, {useState, useEffect} from 'react';
import { Button,Accordion, Card } from 'react-bootstrap';
import stc from 'string-to-color';
import { v4 as uuidv4 } from 'uuid';
import Slider from 'rc-slider';
const { Range } = Slider;


const FilterContainer = ({filters, setFilterColor, setFilterPrice}) => {
    const [price, setPrice] = useState([]);
    const [defaultPrices, setDefaultPrices] = useState([]);
    const [currentColor, setCurrentColor] = useState('');

    useEffect(() => {
        setPrice([filters.minPrice, filters.maxPrice]);
        setDefaultPrices([filters.minPrice, filters.maxPrice]);
    }, [filters.minPrice, filters.maxPrice]);

    const priceChangeHandler = (value) => {
        setPrice(value);
    }

    const renderPriceFilter = () => {
        if(filters.minPrice !== undefined && filters.maxPrice !== undefined) {
            return (
                <div className="filter-range">
                    <div className="filter-range-tooltip">
                        ${price[0]} to ${price[1]}
                    </div>
                    <Range
                        min={defaultPrices[0]}
                        max={defaultPrices[1]}
                        allowCross={false}
                        value={price}
                        onChange={value => priceChangeHandler(value)}
                        onAfterChange={() => setFilterPrice(price)}
                    />
                </div>
            )
        } else {
            return null;
        }
    }

    const handleColorsChange = (color) => {
        setFilterColor(color);
        setCurrentColor(color);
    }

    const currentColorRender = () => {
        if(currentColor) {
            return <div style={{ borderRadius: '50%', border: '1px solid rgba(0,0,0,.25)', width: '20px', height: '20px', background: `${stc(currentColor)}` }}></div>;
        } else {
            return null;
        }
    }

        return (
            <div className="filter-container">
                <div className="filter-content">
                    <Accordion>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    Color
                                </Accordion.Toggle>
                                {currentColorRender()}
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    {filters.colors && filters.colors.map(item => {
                                        return (
                                            <div key={uuidv4()} className="color-filter-item" onClick={() => handleColorsChange(item.color)}>
                                                <span style={{ borderRadius: '50%', border: '1px solid rgba(0,0,0,.25)', width: '20px', height: '20px', background: `${stc(item.color)}` }}></span>
                                                <div className="color-value">{item.color}</div>
                                            </div>
                                        )
                                    })}
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    <div>Price</div>
                                </Accordion.Toggle>
                                <div style={{ color: 'grey', fontSize: '12px', fontWeight: 300}}>Prices ${price[0]} to ${price[1]}</div>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    {renderPriceFilter()}
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            </div>
        )
}

export default FilterContainer;