import * as React from "react";
import { Row, Col, Dropdown, Button, Modal } from 'react-bootstrap';
import { Resources } from '../../Resources/Resources';
import Chart from "chart.js";
import { useToasts } from 'react-toast-notifications'
import { ValidateJSON } from '../UI/ValidateJSON';
import { DataModal } from './DataModal/DataModal';
import { JSONConverter } from './JSONConverter';
import { UploadedData } from './UploadedData/UploadedData';
import ColorPicker from "react-pick-color";
import classes from './Dashboard.module.css';

const Dashboard = (props) => {

    const [sensorData, setSensorData] = React.useState([]);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [objects, setObjects] = React.useState([]);
    const [displayedObjects, setDisplayedObjects] = React.useState([]);

    const [showModal, setShowModal] = React.useState(false);
    const [showUploadedData, setShowUploadedData] = React.useState(false);
    const [selectedObjectID, setSelectedObjectID] = React.useState(null);

    const { addToast } = useToasts()

    const saveFile = async (e) => {
        e.preventDefault()
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
               // const JSON5 = require('json5');
                //console.log(correctJson);
                setSelectedFile(JSONConverter(e.target.result));
                addToast(Resources.Toaster.Success, {
                    appearance: 'success',
                    autoDismiss: false,
                  })
            } catch (error) {
                console.log(error);
                addToast(Resources.Toaster.Error, {
                    appearance: 'error',
                    autoDismiss: false,
                  })
            }
        }

        reader.readAsText(e.target.files[0])
    }

    React.useEffect(() => {
        if (selectedFile === null || selectedFile === undefined) return;
        let extractedData = extractdata(selectedFile);

        if (sensorData.length === 0) {
            setSensorData([{
                location_values: extractedData.chartLocation,
                tds_values: extractedData.chartSensor,
                temp_values: extractedData.chartTemp
            }]);
        } else {

            let uploadedData = [];
            sensorData.map(i => {
                uploadedData.push({
                    location_values: i.location_values,
                    tds_values: i.tds_values,
                    temp_values: i.temp_values
                })
            });
            uploadedData.push({
                location_values: extractedData.chartLocation,
                tds_values: extractedData.chartSensor,
                temp_values: extractedData.chartTemp
            })
            console.log(uploadedData);
            setSensorData(uploadedData);

        }
    }, [selectedFile])

    const extractdata = (data) => {
        let chartLocation = [];
        let chartSensor = [];
        let chartTemp = [];
        data.map(i => {
            chartLocation.push(i.GPS);
            chartSensor.push(i.TDS);
            chartTemp.push(i.TEMP);
        })
        return {chartLocation, chartSensor, chartTemp};
    }

    React.useEffect(() => {
        if (objects.length === 0) return;
       // console.log(objects);

        // let newObject = [...objects].pop();
        // let newGraph = addNewChart(newObject);
        // setDisplayedObjects([...displayedObjects, newGraph]);

        const newDisplayedObjects = [];
        displayedObjects.map(o => {
            o.object.destroy();
        })
        objects.map(o => {
            let newGraph = addNewChart(o);  
            newDisplayedObjects.push(newGraph);
        });
        setDisplayedObjects([...newDisplayedObjects]);

    }, [objects]);

    const addChart = () => {
        const newObject = {
            id : objects.length,
            ref : React.createRef(),
            type: "line",
            data: {
                x: [],
                y: []
            },
            colors: {
                x: 'rgba(75,192,192, 0.4)',
                y: 'rgba(75,192,192, 0.4)'
            },
            title: '',
            note: '',
            legend: '',
            xLabel: '',
            yLabel: ''
            
        };
        setObjects([...objects, newObject]);
        //CALL USE-EFFECT ONCHANGE OBJECTS -> addNewChart
    }

    const addNewChart = (object) => {
        let myChartRef = object.ref.current.getContext("2d");
        // console.log(object);

        return {
            ref: myChartRef,
            id: object.id,
            object: new Chart(myChartRef, {
                type: object.type,
                data: {
                    labels: [...object.data.x],
                    datasets: [
                        {
                            label: "TDS",
                            data: [...object.data.y],
                            backgroundColor: [
                                object.colors.y
                               ],
                        }
                    ]
                },
                options: {
                    title: {
                        display: true,
                        text: object.title
                    },
                    legend: {
                        display: true,
                        labels: {
                            fontColor: 'rgb(255, 99, 132)'
                        }
                    },
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: object.yLabel
                            }
                        }],
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: object.xLabel
                            }
                        }]
                    }
                }
            })
        }
    }

    const changeChartType = (id, type) => {
        const object = objects.find(x => x.id === id);
        object.type = type;
        setObjects([...objects]);
    }

    const deleteChart = (id) => {
        const filteredObjects = objects.filter(x => x.id !== id);
        setObjects([...filteredObjects]);
    }

    const changeDataChart = (id) => {
        setSelectedObjectID(id);
        setShowModal(true);
    }

    const changeObjectAxeData = (axe, values) => {
        let object = objects.find(x => x.id === selectedObjectID);
        if (axe === "X") {
            object.data.x = values;
        } 
        if (axe === "Y") {
            object.data.y = values;
        }
        setObjects([...objects]);
    }

    const changeAxeColor = (hex) => {
        let object = objects.find(x => x.id === selectedObjectID);
        object.colors.y = hex;
        setObjects([...objects]);
    }

    const changeText = (type, text) => {
        let object = objects.find(x => x.id === selectedObjectID);

        if (type === 'title') {
            object.title = text;
        } 
        if (type === 'note') {
            object.note = text;
        }
        if (type === 'xlabel') {
            object.xLabel = text;
        }
        if (type === 'ylabel') {
            object.yLabel = text;
        }

        setObjects([...objects]);
    }

    const exportChart = (id) => {
        let canvas = document.getElementById(id);
        let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        window.location.href=image;
    }

    return (
        <Row className="justify-content-md-center">
            <Col className="d-flex justify-content-md-center" md={{ span: 12}}>
                <h1>Dashboard</h1>
            </Col>
            
            {sensorData.length !== 0 && <h4> Počet nahraných dat: {sensorData.length}</h4>}
            <Col className="d-flex justify-content-md-center" md={{ span: 12}}>
                
                <div className={classes.divActions}>
                    <label className={classes.uploadFile}>
                        <input
                            type="file"
                            onChange={(e) => saveFile(e)}
                            className={classes.inputFile}
                        />
                        {sensorData.length === 0 ? 'Nahrát soubor' : 'Nahrát další soubor'}
                    </label>
                    <Button className="m-1" onClick={()=>addChart()}>
                        {Resources.GraphItems.Add}
                    </Button>

                    {sensorData.length !== 0 && 
                        <Button className="m-1" onClick={() => setShowUploadedData(!showUploadedData)}> 
                            {!showUploadedData ? 'Zobrazit nahraná data' : 'Skrýt nahraná data'}
                        </Button>
                    }
                </div>
            </Col>

           {showUploadedData && 
            <UploadedData  
                sensorData={sensorData} 
                selectedFile={selectedFile}
            />
           }

            {objects.map(o => {
                return (
                    <Col className="mt-1" lg="6" id={"col"+o.id} key={o.id}>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                {Resources.GraphItems.Options}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={()=>changeChartType(o.id, "doughnut")}>{Resources.GraphItems.Doughnut}</Dropdown.Item>
                                <Dropdown.Item onClick={()=>changeChartType(o.id, "line")}>{Resources.GraphItems.Line}</Dropdown.Item>
                                <Dropdown.Item onClick={()=>changeChartType(o.id, "bar")}>{Resources.GraphItems.Bar}</Dropdown.Item>
                                <Dropdown.Item onClick={()=>deleteChart(o.id)}>{Resources.GraphItems.Delete}</Dropdown.Item>
                                <Dropdown.Item onClick={()=>changeDataChart(o.id)}>{Resources.GraphItems.ChangeData}</Dropdown.Item>
                                <Dropdown.Item onClick={()=>exportChart(o.id)}>{Resources.GraphItems.Export}</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                         <canvas id={o.id} ref={o.ref}  />
                         <h6>{o.note}</h6>
                    </Col>
                )
            })}
            <DataModal 
                show={showModal} 
                objectID={selectedObjectID !== null ? selectedObjectID : ""}
                onDataChange={(axe, values) => changeObjectAxeData(axe, values)} 
                onClose={()=>setShowModal(false)}
                onSetColor={(hex) => changeAxeColor(hex)}
                onTextChanged={(type, note) => changeText(type, note)}
                objectData={objects.find(x => x.id === selectedObjectID)}
                data={sensorData} 
                />
        </Row>
    )
}

export default Dashboard;