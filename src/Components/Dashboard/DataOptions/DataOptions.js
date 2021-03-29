import { Row, Col, Dropdown, Button, Modal } from 'react-bootstrap';
import { Resources } from '../../../Resources/Resources';

export const DataOptions = (props) => {
    return (
        <Dropdown className="m-1">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                {Resources.GraphItems.Options}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {props.objectType === 'graph' && <Dropdown.Item onClick={()=>props.onChangeChartType("doughnut")}>{Resources.GraphItems.Doughnut}</Dropdown.Item>}
                {props.objectType === 'graph' && <Dropdown.Item onClick={()=>props.onChangeChartType("line")}>{Resources.GraphItems.Line}</Dropdown.Item>}
                {props.objectType === 'graph' && <Dropdown.Item onClick={()=>props.onChangeChartType("bar")}>{Resources.GraphItems.Bar}</Dropdown.Item>}

                <Dropdown.Item onClick={()=>props.onDelete()}>{Resources.ObjectActions.Delete}</Dropdown.Item>
                <Dropdown.Item onClick={()=>props.onDataChange()}>{Resources.ObjectActions.ChangeData}</Dropdown.Item>
                <Dropdown.Item onClick={()=>props.onExport()}>{Resources.ObjectActions.Export}</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>

    )
}