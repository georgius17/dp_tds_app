import * as React from "react";
import { Row, Col, Dropdown, Button, Modal } from 'react-bootstrap';
import { Resources } from '../../Resources/Resources';
import Chart from "chart.js";
import { useToasts } from 'react-toast-notifications'
import { ValidateJSON } from '../UI/ValidateJSON';
import { DataModal } from './DataModal/DataModal';
import { JSONConverter } from './JSONConverter';
import { UploadedData } from './UploadedData/UploadedData';
import { DataMap } from './DataMap/DataMap';
import { DataTable } from './DataTable/DataTable';
import { DataOptions } from './DataOptions/DataOptions';
import { TimeGenerator } from './TimeGenerator';
import { ObjectConstants } from '../../Components/Constants/ObjectConstants';
import { SensorConstants } from '../../Components/Constants/SensorConstants';
import classes from './Dashboard.module.css';

const Dashboard = (props) => {

    const [sensorData, setSensorData] = React.useState([]); //transformed data from JSON
    const [selectedFile, setSelectedFile] = React.useState(null); 
    const [objects, setObjects] = React.useState([]); //options and data origin for charts/tables/map
    const [displayedObjects, setDisplayedObjects] = React.useState([]); //object instances, refs
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
                temp_values: extractedData.chartTemp,
                time_values: TimeGenerator(selectedFile.length)
            }]);
        } else {

            let uploadedData = [];
            sensorData.map(i => {
                uploadedData.push({
                    location_values: i.location_values,
                    tds_values: i.tds_values,
                    temp_values: i.temp_values,
                    time_values: TimeGenerator(selectedFile.length)
                })
            });
            uploadedData.push({
                location_values: extractedData.chartLocation,
                tds_values: extractedData.chartSensor,
                temp_values: extractedData.chartTemp,
                time_values: TimeGenerator(selectedFile.length)
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

        const newDisplayedObjects = [];
        displayedObjects.map(o => {
            o.object.destroy();
        });
        objects.map(o => {
            if (o.objectType === ObjectConstants.Types.Graph) {
                let newGraph = addNewChart(o);  
                newDisplayedObjects.push(newGraph);
            }
        });
        setDisplayedObjects([...newDisplayedObjects]);

    }, [objects]);

    //TYPE = "graph" || "table" || "map"
    const addObject = (type) => {
        let newObject = {};

        if (type === ObjectConstants.Types.Graph) {
            newObject = {
                objectType: ObjectConstants.Types.Graph,
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
        }

        if (type === ObjectConstants.Types.Map) {
            newObject = {
                objectType: ObjectConstants.Types.Map,
                id : objects.length,
                coords: [
                    // { 'lat': 49.329636, 'lng': 17.777622 },
                    // { 'lat': 49.330636, 'lng': 17.777622 },
                    // { 'lat': 49.331636, 'lng': 17.777622 }
                  ],
                title: '',
                note: '',
            }
            changeDataModal(newObject.id);
        }

        if (type === ObjectConstants.Types.Table) {
            newObject = {
                objectType: ObjectConstants.Types.Table,
                id : objects.length,
                columns: [
                    {field: 'id', headerName: SensorConstants.Values.id_values},
                    {field: 'gps', headerName: SensorConstants.Values.location_values},
                    {field: 'tds', headerName: SensorConstants.Values.tds_values},
                    {field: 'temp', headerName: SensorConstants.Values.temp_values},
                    {field: 'time', headerName: SensorConstants.Values.time_values},
                ],
                rows: [
                    { id: 1, gps: 'Snow', tds: 'Jon', temp: 35, time: 20 },
                ]                
            }
        }
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

    const changeDataModal = (id) => {
        setSelectedObjectID(id);
        setShowModal(true);
    }

    const changeObjectData = (type, values) => {
        let object = objects.find(x => x.id === selectedObjectID);
        if (type === "X") {
            object.data.x = values;
        } 
        if (type === "Y") {
            object.data.y = values;
        }
        if (type === "coords") {
            object.coords = values;
        }
        if (type === "rows") {
            object.rows = values;
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

    const exportChart = (id, objectType) => {

        if (objectType !== ObjectConstants.Types.Graph) return;

        let canvas = document.getElementById(id);
        let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
       
        let w=window.open('about:blank','image from canvas');
        w.document.write("<img src='"+image+"' alt='from canvas'/>");
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

                    <Dropdown className="m-1">
                        <Dropdown.Toggle variant="secondary">
                            Přidat objekt
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={()=>addObject(ObjectConstants.Types.Graph)}>{Resources.AddObjects.Graph}</Dropdown.Item>
                            <Dropdown.Item onClick={()=>addObject(ObjectConstants.Types.Table)}>{Resources.AddObjects.Table}</Dropdown.Item>
                            <Dropdown.Item onClick={()=>addObject(ObjectConstants.Types.Map)}>{Resources.AddObjects.Map}</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

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
                    <Col className="mt-5" lg="6" id={"col"+o.id} key={o.id}>
                        <DataOptions
                            objectType={o.objectType} 
                            onChangeChartType={(type) => changeChartType(o.id, type)}
                            onDelete={() => deleteChart(o.id)}
                            onExport={() => exportChart(o.id, o.objectType)}
                            onDataChange={() => changeDataModal(o.id)}
                        />

                        {o.objectType === ObjectConstants.Types.Graph && <canvas id={o.id} ref={o.ref} /> }
                        
                        {o.objectType === ObjectConstants.Types.Map && o.coords.length !== 0 ?
                         <div>
                            <h6>{o.title}</h6>
                            <DataMap 
                                coords={o.coords}
                            />
                            <h6>{o.note}</h6>
                        </div> : o.objectType === ObjectConstants.Types.Map && o.coords.length === 0  && <h6>Přidejte data pro mapu</h6>
                        }
                        {o.objectType === ObjectConstants.Types.Table && 
                            <DataTable
                                id={o.id}
                                rows={o.rows}
                                columns={o.columns} 
                            />
                        }

                    </Col>
                )
            })}

            {objects.length !== 0 && selectedObjectID !== "" && objects[selectedObjectID] !== undefined && 
            <DataModal 
                show={showModal} 
                objectID={selectedObjectID !== null ? selectedObjectID : ""}
                onDataChange={(type, values) => changeObjectData(type, values)} 
                onClose={()=>setShowModal(false)}
                onSetColor={(hex) => changeAxeColor(hex)}
                onTextChanged={(type, note) => changeText(type, note)}
                objectData={objects.find(x => x.id === selectedObjectID)}
                data={sensorData} 
                selectedFile={selectedFile}
                />
                }
        </Row>
    )
}

export default Dashboard;