import * as React from 'react';

export interface CamperProps {
    camperArray: any
}

export class Camper extends React.Component<CamperProps, {}> {
    public render(): JSX.Element {
        return (
            <tbody className="Camper">
            {this.props.camperArray.map((camper: any) => {
                return (<tr className="Camper" key={camper["username"]}>
                        <td><img src={camper["img"]} alt="portrait"
                                 className="Camper-pic"/>{camper["username"]}</td>
                        <td className="Text-center">{camper["recent"]}</td>
                        <td className="Text-center">{camper["alltime"]}</td>
                    </tr>
                );
            })}
            </tbody>
        );
    }
}