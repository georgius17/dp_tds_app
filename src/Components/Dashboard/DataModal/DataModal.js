import * as React from "react";
import { Resources } from '../../../Resources/Resources';
import { Row, Col, Dropdown, Button, Modal, InputGroup, FormControl, Accordion, Card, ListGroup } from 'react-bootstrap';
import { SensorConstants } from '../../Constants/SensorConstants';
import { ObjectConstants } from '../../Constants/ObjectConstants';
import ColorPicker from "react-pick-color";
import classes from './DataModal.module.css';

export const DataModal = (props) => {
    let sensorData = props.data;
    const [showDataindex, setShowDataindex] = React.useState(0);
    const [dataCut, setDataCut] = React.useState(0);
    
    //Table options
    const [deletePreviousData, setDeletePreviousData] = React.useState(true);
    const [tableDataCount, setTableDataCount] = React.useState(0);

    //Graph options
    const [chosenAxes, setChosenAxes] = React.useState({x: null, y: null});

    const mutateLocationData = (data) => {
        let coords = [];

        data.map(i => {
            coords.push({
                'lat': Number(i.slice(0, 9)),
                'lng': Number(i.slice(10, 19))
            })
        })
        console.log(coords);

        return coords;
    }

    // React.useEffect(() => {
    //     if ()

    // }, [props.data])

    const dataCutReminder = () => {
        if (props.data !== undefined && props.data.length > 1) {
            let dataLengths = [];
            for (let i = 0; i < props.data.length; i++ ) {
                dataLengths.push(props.data[i].date_values.length);
            }
            const min = Math.min(...dataLengths);
            
            return <h6>Nejmenší počet záznamů ve všech nahraných souborech: {min}</h6>
        }
    }

    const mutateTableRows = () => {
        if (props.selectedFile === null || props.selectedFile === undefined) return
        let uploadedRows = [];
        let startIndex = 0;

        if (!deletePreviousData) {
            props.objectData.rows.map(i => {
                startIndex += 1;
                uploadedRows.push({
                    id: i.id,
                    gps: i.gps,
                    tds: i.tds,
                    temp: i.temp,
                    time: i.time
                })
            })
        }
        
        props.selectedFile.map(i => {
            startIndex += 1;
            uploadedRows.push({
                id: startIndex,
                gps: i.GPS,
                tds: i.TDS,
                temp: i.TEMP,
                time: i.DATE
            })
            
        });

        setTableDataCount(tableDataCount+1);
        console.log(uploadedRows);
        props.onDataChange("rows", uploadedRows, dataCut);
    }

    React.useEffect(() => {
        if (props.data !== undefined && props.data[showDataindex].date_values !== undefined) {
            setDataCut(props.data[showDataindex].date_values.length);
        }
    }, [props.data])
    
    return (
        <Modal className={classes.divModal} show={props.show}>
        <Modal.Header closeButton>
          <Modal.Title>{Resources.ModalItems.Options}{props.objectID+1}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {sensorData[showDataindex] !== undefined ?
            <div className="d-flex flex-wrap align-items-md-center border-bottom ">
                <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                        {sensorData[showDataindex] !== undefined && <>Data č.{showDataindex + 1} </>}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    
                    {sensorData !== undefined && sensorData.map((i, index) => {
                        return (
                            <Dropdown.Item 
                                key={index}
                                onClick={() => setShowDataindex(sensorData.indexOf(i))}
                            > 
                            Data č. {index + 1}
                            </Dropdown.Item>
                        )
                    })}
                    </Dropdown.Menu>
                </Dropdown>

                <p className="m-0 p-0 w-50">Počet záznamů vybranách dat: <strong>{sensorData[showDataindex].date_values.length}</strong></p>

                <InputGroup className="w-50 mb-2">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-sm">Oříznutí záznamů</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        type="number"
                        value={dataCut}
                        onChange={(e) => {
                            if (e.target.value <= sensorData[showDataindex].date_values.length)
                            setDataCut(e.target.value)
                        }}
                    />
                </InputGroup>
                {sensorData[showDataindex].date_values.length != dataCut && <h6>Záznamy budou oříznuty při opakoveném nahrání</h6> }
                {sensorData[showDataindex].date_values.length != dataCut && dataCutReminder()}
            </div>
        : <h6>Nahrejte data</h6>
        }
        <br />

        {/* Název objektu */}
        <InputGroup className="mb-3">
            <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-default">{Resources.ModalItems.Title}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                onChange={(e) => props.onTextChanged('title', e.target.value )}
                value={props.objectData !== undefined && props.objectData.title}
            />
        </InputGroup>

        {/* Poznámka k objektu */}
        <InputGroup size="sm" className="mb-3">
            <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-sm">{Resources.ModalItems.Note}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl 
                aria-label="Small" 
                aria-describedby="inputGroup-sizing-sm" 
                onChange={(e) => props.onTextChanged('note', e.target.value )}
                value={props.objectData !== undefined && props.objectData.note}
            />
        </InputGroup>

        {/* ----------Polozky pro mapu----------- */}
        {props.objectData !== undefined && props.objectData.objectType === ObjectConstants.Types.Map &&
            <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                Vybrat souřadnice GPS
            </Dropdown.Toggle>
                {sensorData[showDataindex] !== undefined && 
                <Dropdown.Menu>
                    <Dropdown.Item onClick={()=> props.onDataChange("coords", mutateLocationData(sensorData[showDataindex].location_values), dataCut )}>
                        {sensorData[showDataindex].location_values}
                    </Dropdown.Item>
                    {/* <Dropdown.Item 
                        onClick={()=>mutateLocationData(sensorData[showDataindex].location_values)}>
                            {sensorData[showDataindex].location_values}
                    </Dropdown.Item> */}
                    
                </Dropdown.Menu>
                }
        </Dropdown>
        }

        <br />
        {/* ----------Polozky pro graf----------- */}
        {props.objectData.objectType === ObjectConstants.Types.Graph && <> 
            {/* Popis strany x */}
            <InputGroup size="sm" className="mb-3">
            <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-sm">Název osy X</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl 
                aria-label="Small" 
                aria-describedby="inputGroup-sizing-sm" 
                onChange={(e) => props.onTextChanged('xlabel', e.target.value )}
                value={props.objectData !== undefined && props.objectData.xLabel}
            />
            </InputGroup>

            {/* Data strany x */}
            <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                    {props.objectData.data.x.length === 0 ? Resources.ModalItems.SelectX : `Data pro osu X: ${SensorConstants.Values[chosenAxes.x]}`}
                   
                </Dropdown.Toggle>
                    {sensorData[showDataindex] !== undefined && 
                    <Dropdown.Menu>
                        {Object.keys(sensorData[showDataindex]).map((i, index) => {
                            return (
                            <Dropdown.Item key={index} onClick={() => {
                                props.onDataChange("X", sensorData[showDataindex][i], dataCut)
                                props.onTextChanged('xlabel', SensorConstants.Values[i])
                                setChosenAxes((prevState) => ({...prevState, x: i}))
                                }}>
                                {SensorConstants.Values[i]}
                            </Dropdown.Item>
                            )
                        })}
                    </Dropdown.Menu>
                    }
            </Dropdown>
            
            {/* Vyber barvy pro X */}
            <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                    {Resources.ModalItems.SelectColorX}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item >
                    <ColorPicker color={"#fff"} onChange={(color) => props.onSetColor(color.hex)} />
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
             
             <br />
             {/* Popis strany Y */}
             <InputGroup size="sm" className="mb-3">
            <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-sm">Název osy Y</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl 
                aria-label="Small" 
                aria-describedby="inputGroup-sizing-sm" 
                onChange={(e) => props.onTextChanged('ylabel', e.target.value )}
                value={props.objectData !== undefined && props.objectData.yLabel}
            />
            </InputGroup>
            
            {/* Data strany Y */}
            <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                {props.objectData.data.y.length === 0 ? Resources.ModalItems.SelectY : `Data pro osu Y: ${SensorConstants.Values[chosenAxes.y]}`}
                </Dropdown.Toggle>
                {sensorData[showDataindex] !== undefined && 
                    <Dropdown.Menu>
                        {Object.keys(sensorData[showDataindex]).map((i, index) => {
                            return (
                            <Dropdown.Item key={index} onClick={() => { 
                                props.onDataChange("Y", sensorData[showDataindex][i], dataCut)
                                props.onTextChanged('ylabel', SensorConstants.Values[i])
                                setChosenAxes((prevState) => ({...prevState, y: i}))
                                }}>
                                {SensorConstants.Values[i]}
                            </Dropdown.Item>
                            )
                        })}
                    </Dropdown.Menu>
                    }
            </Dropdown>

            {/* Vyber barvy pro Y */}
            <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                    {Resources.ModalItems.SelectColorY}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item >
                    <ColorPicker color={"#fff"} onChange={(color) => props.onSetColor(color.hex)} />
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>}

        {/* ----------Polozky pro tabulku----------- */}
        {props.objectData.objectType === ObjectConstants.Types.Table && 
        <>  
        <div className="form-check" > 
            <label className="form-check-label">
                <input type="checkbox" className="form-check-input" onChange={()=> setDeletePreviousData(!deletePreviousData)} checked={deletePreviousData} /> 
                Smazat předchozí data
            </label>
        </div>
        <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                Vybrat data pro řádky
            </Dropdown.Toggle>
            <Dropdown.Menu>
              
            {sensorData[showDataindex] !== undefined && 
                
                    <Dropdown.Item 
                        onClick={() => mutateTableRows()}
                    > 
                    Aktuálně uložený soubor
                    </Dropdown.Item>
                
            }
               
            </Dropdown.Menu>
        </Dropdown>
        
        <h6>Počet vybraných souborů pro řádky: {tableDataCount}</h6>

    </>}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.onClose(true)}>
            {Resources.ModalItems.CloseModal}
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

