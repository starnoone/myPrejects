const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry:{
		index:'./src/js/index.js',
	},
	plugins:[
		new CleanWebpackPlugin(['dist']),
		new ExtractTextPlugin("./static/css/styles.css"),
		new HtmlWebpackPlugin({
			title:'output',
			filename:'index.html',
			template:'src/index.html',
			inject:'body',
			chunk:['index']
		})
	],
	output: {
		filename:'./static/js/[name].bundle.js',
		path:path.resolve(__dirname,'dist')
	},
	module:{
		rules:[
			{
				test:/\.css$/,
				use:ExtractTextPlugin.extract({
		          fallback: "style-loader",
		          use: "css-loader"
		        })
			},{
				test:/\.scss$/,
				use:ExtractTextPlugin.extract({
		          fallback: "style-loader",
		          use: ["css-loader","sass-loader"]
		        })
			},{
				test:/\.(png|jpg|svg|gif)$/,
				use:[
					{
						loader:'file-loader',
						options: {
							outputPath: 'static',
							publicPath:'../images',
						    name: '[name].[ext]',
						    useRelativePath:true
						}
					}
				]
			}
		]
	}
}