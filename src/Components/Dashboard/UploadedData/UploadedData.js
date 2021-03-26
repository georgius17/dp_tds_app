import * as React from "react";
import { Col, Dropdown, Button } from 'react-bootstrap';
import classes from './UploadedData.module.css';

export const UploadedData = (props) => {

    const [showDataindex, setShowDataindex] = React.useState(0);
    console.log(props.sensorData);

    React.useEffect(() => {
        console.log(showDataindex);
    },[showDataindex])

    return (
        <Col className="d-flex-column bg-light" md={{ span: 12 }}>
                <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                    Vybrat data
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

            {props.sensorData !== undefined && <h4> Data č.{showDataindex + 1} </h4>}

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
           

            {/* {props.sensorData !== undefined && props.sensorData.map((i, index) => {
                return (
                    <div key={index} className={classes.divData}>
                        <div className={classes.divItem}>
                            <h6>GPS:</h6>
                            {i.location_values.map( (gps, index) => <p key={index}>{gps}</p>)}
                        </div>
                        <div className={classes.divItem}>
                            <h6>TDS:</h6>
                            {i.tds_values.map((tds, index) => <p key={index}>{tds}</p> )}
                        </div>
                        <div className={classes.divItem}>
                            <h6>Teplota:</h6>
                            {i.temp_values.map((temp, index) => <p key={index}>{temp}</p> )}
                        </div>
                    </div>
                )
            })} */}
         </Col>
    )
}