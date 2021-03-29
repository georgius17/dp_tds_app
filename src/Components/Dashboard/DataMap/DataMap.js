import { Map, PathLayer, Path } from 'react-mapycz'

export const DataMap = (props) => {
    console.log(props.coords);
    return (
        <Map center={props.coords !== undefined ? props.coords[0]:[]} zoom={12}>
            <PathLayer>
                <Path
                    coords={props.coords !== undefined ? props.coords : []}
                    criterion="fast"
                    dynamicRoute={true}
                />
            </PathLayer>
        </Map>
    )
}