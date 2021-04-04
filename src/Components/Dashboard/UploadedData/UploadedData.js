import * as React from "react";
import { Col, Dropdown, Button } from 'react-bootstrap';
import classes from './UploadedData.module.css';

export const UploadedData = (props) => {

    const [showDataindex, setShowDataindex] = React.useState(0);
    console.log(props.sensorData);

    React.useEffect(() => {
        console.log(showDataindex);
    },[showDataindex])

    const dataModifier = () => {

    }

    return (
        <Col className="d-flex-column bg-light" md={{ span: 12 }}>
            <div className="d-flex align-items-md-center justify-content-start w-60">
                <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                        Data č. {showDataindex + 1}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    
                    {props.sensorData !== undefined && props.sensorData.map((i, index) => {
                        return (
                            <Dropdown.Item 
                                key={index}
                                onClick={(index) => setShowDataindex(props.sensorData.indexOf(i))}
                            > 
                            Data č. {index + 1}
                            </Dropdown.Item>
                        )
                    })}
                    
                    </Dropdown.Menu>
                </Dropdown>
                <p className="m-0 p-0">Celkový počet dat: <strong>{props.sensorData.length}</strong></p>
                <p className="m-0 p-0">Počet záznamů vybranách dat: <strong>{props.sensorData[showDataindex].date_values.length}</strong></p>
                <p className="m-0 p-0">Datum:<strong>{props.sensorData[showDataindex].date_values[0].slice(0, 10)}</strong></p>
                <p className="m-0 p-0">Počátek měření: <strong>{props.sensorData[showDataindex].date_values[0].slice(11)}</strong></p>
            </div>        
            

            {props.sensorData[showDataindex] !== undefined &&
            <div className={classes.divData}>
                        <div className={classes.divItem}>
                            <h6>GPS:</h6>
                            {props.sensorData[showDataindex].location_values.map((gps, index) => <p key={index}>{gps}</p>)}
                        </div>
                        <div className={classes.divItem}>
                            <h6>TDS:</h6>
                            {props.sensorData[showDataindex].tds_values.map((tds, index) => <p key={index}>{tds}</p> )}
                        </div>
                        <div className={classes.divItem}>
                            <h6>Teplota:</h6>
                            {props.sensorData[showDataindex].temp_values.map((temp, index) => <p key={index}>{temp}</p> )}
                        </div>
            </div>
            } 
         </Col>
    )
}