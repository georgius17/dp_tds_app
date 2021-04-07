import { DataGrid } from '@material-ui/data-grid';
import classes from './DataTable.module.css';

export const DataTable = (props) => {
    console.log(props.rows);
    return (
        <DataGrid rows={props.rows} columns={props.columns} pageSize={99} checkboxSelection />
    )
}