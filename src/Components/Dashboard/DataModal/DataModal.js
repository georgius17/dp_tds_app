import { Resources } from '../../../Resources/Resources';
import { Row, Col, Dropdown, Button, Modal, InputGroup, FormControl, Accordion, Card } from 'react-bootstrap';
import ColorPicker from "react-pick-color";

export const DataModal = (props) => {
    let sensorData = props.data;
    
    return (
        <Modal show={props.show}>
        <Modal.Header closeButton>
          <Modal.Title>{Resources.ModalItems.Options}{props.objectID+1}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
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

        <br />
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
                    {Resources.ModalItems.SelectX}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {/* {sensorData[0] !== undefined && sensorData[0].map(i => {
                        return <Dropdown.Item onClick={() => props.onDataChange("X", i)}>{i}</Dropdown.Item>
                    })} */}

                    {sensorData[0] !== undefined && 
                        <Dropdown.Item onClick={()=> props.onDataChange("X", sensorData[0].location_values)}>
                            {sensorData[0].location_values}
                        </Dropdown.Item>
                    }
                    {sensorData[0] !== undefined && 
                        <Dropdown.Item onClick={()=> props.onDataChange("X", sensorData[0].tds_values)}>
                            {sensorData[0].tds_values}
                        </Dropdown.Item>
                    }
                    {sensorData[0] !== undefined && 
                        <Dropdown.Item onClick={()=> props.onDataChange("X", sensorData[0].temp_values)}>
                            {sensorData[0].temp_values}
                        </Dropdown.Item>
                    }
                </Dropdown.Menu>
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
                    {Resources.ModalItems.SelectY}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {sensorData[0] !== undefined && 
                        <Dropdown.Item onClick={()=> props.onDataChange("Y", sensorData[0].location_values)}>
                            {sensorData[0].location_values}
                        </Dropdown.Item>
                    }
                    {sensorData[0] !== undefined && 
                        <Dropdown.Item onClick={()=> props.onDataChange("Y", sensorData[0].tds_values)}>
                            {sensorData[0].tds_values}
                        </Dropdown.Item>
                    }
                    {sensorData[0] !== undefined && 
                        <Dropdown.Item onClick={()=> props.onDataChange("Y", sensorData[0].temp_values)}>
                            {sensorData[0].temp_values}
                        </Dropdown.Item>
                    }
                </Dropdown.Menu>
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
           
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.onClose(true)}>
            {Resources.ModalItems.CloseModal}
          </Button>
        </Modal.Footer>
      </Modal>
    )
}