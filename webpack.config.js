const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
	devServer: {
		compress: true,
		port: 10888,
		https: true,
	},
	output: {
		path: path.join(__dirname, '/build'), // путь к каталогу выходных файлов - папка public
		filename: 'bundle.js', // название создаваемого файла
	},
	optimization: {
		minimizer: [new UglifyJsPlugin()],
	},
	module: {
		rules: [
			//загрузчик для js
			{
				test: /\.js$/, // определяем тип файлов
				exclude: /(node_modules)/, // исключаем из обработки папку node_modules
				loader: 'babel-loader', // определяем загрузчик
				options: {
					presets: ['@babel/preset-env', '@babel/preset-react'], // используемые плагины
				},
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
			},
			{
				test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
				loader: 'url-loader?limit=100000',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: 'server',
			analyzerHost: 'localhost',
			analyzerPort: 8889,
			reportFilename: 'report.html',
			defaultSizes: 'parsed',
			openAnalyzer: true,
			generateStatsFile: false,
			statsFilename: 'stats.json',
			statsOptions: null,
			logLevel: 'info',
		}),
	],
};
