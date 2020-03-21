const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env = {}) => {
  const { mode = 'development' } = env;
  const isProd = mode === 'production';
  const isDev = mode === 'development';

  const getStyleLoaders = () => {
    return [isProd ? MiniCssExtractPlugin.loader : 'style-loader'];
  };

  const getPlugins = () => {
    const plugins = [
      new HtmlWebpackPlugin({
        template: 'index.html',
        filename: 'index.html',
      }),
    ];

    if (isProd) {
      plugins.push(
        new MiniCssExtractPlugin({
          filename: 'style-[hash:8].css',
        })
      );
    }
    return plugins;
  };
  return {
    context: path.resolve(__dirname, 'src'),
    mode: isProd ? 'production' : isDev && 'development',
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDev ? 'script/script.js' : 'script/bundle-[hash:8].js',
    },
    resolve: {
      extensions: ['.js'],
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 4200,
    },
    devtool: isDev ? 'source-map' : '',
    module: {
      rules: [
        // Loading Images
        {
          test: /\.(svg|jpg|png|gif|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name]-[hash:8].[ext]',
                outputPath: './assets/img',
                esModule: false,
                useRelativePath: true,
              },
            },
          ],
        },
        // Loading Fonts
        {
          test: /\.(ttf|woff|woff2|eot)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: './assets/fonts',
                useRelativePath: true,
              },
            },
          ],
        },
        // HTML Loading
        {
          test: /\.(html)$/,
          use: {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href'],
            },
          },
        },
        // Loading CSS
        {
          test: /\.css$/,
          use: getStyleLoaders(),
        },
        // Loading SCSS
        {
          test: /\.s[ac]ss$/,
          use: [
            ...getStyleLoaders(),
            {
              loader: 'css-loader',
              options: { sourceMap: true },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        },
        // loading Fix in code
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            failOnError: true,
          },
        },
        // Loading JS
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
    plugins: getPlugins(),
  };
};
