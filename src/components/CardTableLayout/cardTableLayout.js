import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import OptionCard from "../OptionCard/OptionCard";
import './cardTableLayout.css';
const CardTableLayout = ({ cardList, onCardClick }) => {
    const gradientList =[`radial-gradient( circle farthest-corner at 10% 20%,  rgba(235,131,130,1) 0%, rgba(235,131,130,0.75) 38.6%, rgba(211,177,125,0.52) 72.1%, rgba(211,177,125,0.24) 94.7% )`,`radial-gradient( circle farthest-corner at 10% 20%,  rgba(235,131,130,1) 0%, rgba(235,131,130,0.75) 38.6%, rgba(211,177,125,0.52) 72.1%, rgba(211,177,125,0.24) 94.7% )`,`radial-gradient( circle farthest-corner at 10% 20%,  rgba(235,131,130,1) 0%, rgba(235,131,130,0.75) 38.6%, rgba(211,177,125,0.52) 72.1%, rgba(211,177,125,0.24) 94.7% )`,`radial-gradient( circle farthest-corner at 10% 20%,  rgba(235,131,130,1) 0%, rgba(235,131,130,0.75) 38.6%, rgba(211,177,125,0.52) 72.1%, rgba(211,177,125,0.24) 94.7% )`,`radial-gradient( circle farthest-corner at 10% 20%,  rgba(235,131,130,1) 0%, rgba(235,131,130,0.75) 38.6%, rgba(211,177,125,0.52) 72.1%, rgba(211,177,125,0.24) 94.7% )`,`radial-gradient( circle farthest-corner at 10% 20%,  rgba(235,131,130,1) 0%, rgba(235,131,130,0.75) 38.6%, rgba(211,177,125,0.52) 72.1%, rgba(211,177,125,0.24) 94.7% )`]
    return(
        <Container fluid="md">
            <Row>
            {cardList.map(
                ({ contract, expiry, currency, currencyLogo, id }, idx) => {
                return (
                    <Col xs>
                        <div className="table-container">
                        <OptionCard
                            id={contract}
                            currency={currency}
                            currencyLogo={currencyLogo}
                            expiry={Number(expiry)}
                            onCardClick={onCardClick}
                            key={id}
                            type={'tableformat'}
                            bgGrident = {gradientList[idx]}
                        /> 
                        </div>
                    </Col> 
                );
                }
            )} 
            </Row>
        </Container>
    )
}
export default CardTableLayout;