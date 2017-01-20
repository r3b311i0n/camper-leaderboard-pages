const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: ["whatwg-fetch", "./src/index.tsx"],
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist",
        publicPath: "/dist/"
    },

    devtool: "source-map",

    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".jsx", "css"]
    },

    module: {
        loaders: [
            {test: /\.tsx?$/, loader: "awesome-typescript-loader"},
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?importLoaders=1!postcss-loader')
            }
        ],

        preLoaders: [
            {test: /\.js$/, loader: "source-map-loader"}
        ]
    },
    plugins: [
        new ExtractTextPlugin("styles.css")
    ],
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
};