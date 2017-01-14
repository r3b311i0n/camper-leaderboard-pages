import * as React from 'react';

export interface AppProps {
}

export class App extends React.Component<AppProps, undefined> {
    constructor() {
        super();
    }

    render() {
        return (
                <h1>IT WORKS!</h1>
        );
    }
}