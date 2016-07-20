import * as webpack from 'webpack';
import * as path from 'path';
import { CliConfig } from './config';

export const getWebpackTestConfig = function(projectRoot: string, sourceDir: string) {
  return {
    devtool: 'inline-source-map',
    context: path.resolve(__dirname, './'),
    resolve: {
      extensions: ['', '.ts', '.js'],
      root: path.resolve(projectRoot, `./${sourceDir}`)
    },
    entry: {
      test: path.resolve(projectRoot, `./${sourceDir}/test.ts`)
    },
    output: {
      path: './dist.test',
      filename: '[name].bundle.js'
    },
    module: {
      preLoaders: [
        {
          test: /\.ts$/,
          loader: 'tslint-loader',
          exclude: [
            path.resolve(projectRoot, 'node_modules')
          ]
        },
        {
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [
            path.resolve(projectRoot, 'node_modules/rxjs'),
            path.resolve(projectRoot, 'node_modules/@angular')
          ]
        }
      ],
      loaders: [
        {
          test: /\.ts$/,
          loaders: [
            {
              loader: 'awesome-typescript-loader',
              query: {
                useWebpackText: true,
                tsconfig: path.resolve(projectRoot, `./${sourceDir}/tsconfig.json`),
                module: "commonjs",
                target: "es5",
                useForkChecker: true,
                removeComments: true
              }
            },
            {
              loader: 'angular2-template-loader'
            }
          ],
          exclude: [/\.e2e\.ts$/]
        },
        { test: /\.json$/, loader: 'json-loader'},
        { test: /\.css$/,  loaders: ['raw-loader', 'postcss-loader'] },
        { test: /\.styl$/, loaders: ['raw-loader', 'postcss-loader', 'stylus-loader'] },
        { test: /\.less$/, loaders: ['raw-loader', 'postcss-loader', 'less-loader'] },
        { test: /\.scss$/, loaders: ['raw-loader', 'postcss-loader', 'sass-loader'] },
        { test: /\.(jpg|png)$/, loader: 'url-loader?limit=128000'},
        { test: /\.html$/, loader: 'raw-loader', exclude: [path.resolve(projectRoot, `./${sourceDir}/index.html`)] }
      ],
      postLoaders: [
        {
          test: /\.(js|ts)$/, loader: 'sourcemap-istanbul-instrumenter-loader',
          exclude: [
            /\.(e2e|spec)\.ts$/,
            /node_modules/
          ]
        }
      ]
    },
    tslint: {
      emitErrors: false,
      failOnHint: false,
      resourcePath: `./${sourceDir}`
    },
    node: {
      global: 'window',
      process: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  };
}
