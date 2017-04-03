'use strict'

// webpack build configuration
// see https://webpack.js.org/configuration/
// for a more detailed explanation of the
// options specified here

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')

// lets us see & debug pre-compiled code in the browser
// different values have different levels of quality and
// performance impact
const devtool =
  'source-map'

// what are the primary "main methods" of our app?
const entry = {
  // we only have one right now, main.js, which loads
  // our app.module, bootstrapping our app
  main: [
    // adds unsupported language features, like
    // Promises and Proxies
    'babel-polyfill',

    // the path to our entry script
    path.resolve(
      // the directory this (as in, the one you're reading)
      // file lives in
      __dirname,
      // the path to our entry script, relative to this file's
      // directory
      'src/main.js'
    )
  ]
}

// where webpack puts its compilation results
const output = {
  path: path.resolve(__dirname, 'dist'),
  filename: '[name].[hash].js'
}

// rules for how webpack finds imported files
const resolve = {
  // allows loading of .js, .css, and .html files
  // with or without extensions
  extensions: [
    '.js',
    '.css',
    '.html'
  ],
  // allows absolute module imports (i.e. import 'foo'
  // instead of import './foo') from node_modules
  // (allowed by default) and lib folders (not allowed
  // by default), following node's directory-based
  // module scoping rules
  modules: [
    'node_modules',
    'lib'
  ]
}

// rules tell webpack what loaders to use on which files
// each rule defines which files it matches, which loaders
// to use, which options to configure those loaders with,
// and in what order they should be applied
const rules = [{
  // javascript rule
  // uses babel to process ES6 JS and emit
  // browser-compatible JS

  // the test is usually a regex, and webpack uses it on
  // every file loaded to see if the rule it's associated with
  // should be applied
  test: /\.js$/,

  // exclude tells webpack to ignore certain file paths for this loader
  // entirely. Here, the regex /node_modules/ says to exclude any file
  // path that includes the substring "node_modules"
  exclude: [/node_modules/],

  // use tells webpack which loaders to use for this rule.
  use: [
    // where ngInject annotations are present, ng-annotate-loader
    // will add the appropriate $inject properties to conform
    // with ng-strict-di
    'ng-annotate-loader',
    // babel loader will read the babel configuration in
    // our package.json
    'babel-loader'
  ]
}, {
  // css loading (external styles, globally
  // scoped by default)
  test: /\.css$/,
  // external styles means we don't want
  // to include our own styles, so we
  // exclude the source folder
  exclude: [path.resolve(__dirname, 'src')],
  use: [
    // style-loader takes the css string
    // exported by css-loader and injects it
    // into a <style></style> tag in the
    // document header
    'style-loader',
    // css-loader loads a css file as a string
    // and exports that string along with
    // css class names mentioned in the file
    'css-loader'
  ]
}, {
  // css loading (internal styles, locally
  // scoped by default)
  test: /\.css$/,
  // internal styles means we don't want dependency styles,
  // so we exclude any node_modules folder
  exclude: [/node_modules/],
  use: [
    // since we're using locally-scoped css class names,
    // we need a way to  resolve the names we use in code to the actual
    // css names generated. classnames-loader gives us that functionality
    'classnames-loader',
    'style-loader',
    // with the modules flag, css-loader will scope all
    // classnames locally by default. see
    // https://github.com/webpack-contrib/css-loader#local-scope
    // and https://github.com/webpack-contrib/css-loader#css-modules
    // and https://github.com/css-modules/css-modules
    // for a general explanation
    // see https://github.com/css-modules/css-modules/blob/master/docs/css-modules-with-angular.md
    // for a basic idea of how to use this with angular
    'css-loader?modules&localIdentName=[path]$[name]$[local]'
  ]
}, {
  // raw html loading
  // used by HtmlWebpackPlugin
  test: /\.html$/,
  // we want to use ngtemplate-loader for angular templates,
  // so this html rule only applies to html files from outside of
  // the project's src folder
  exclude: [path.resolve(__dirname, 'src')],
  use: 'html-loader'
}, {
  // angular template loading
  // used to load angular templates (html files) into
  // the angular template cache automatically,
  // greatly improving render speed
  test: /\.html$/,
  // we don't want this rule to apply to any html files other than angular
  // templates, so we exclude the static directory and all node_modules
  // directories
  exclude: [/node_modules/, path.resolve(__dirname, 'static')],
  use: [
    // ngtemplate-loader takes the html string exported by
    // html-loader, adds it to angular's template cache, and exports
    // a string that represents the template's url
    'ngtemplate-loader',
    'html-loader'
  ]
}]

// plugins are additions to webpack that aren't tied
// to the loading of individual modules, but instead
// apply to the entire webpack build process
const plugins = [
  // the HtmlWebpackPlugin is used to inject our compiled
  // javascript files into a given template
  // index.html file, allowing us to use auto-generated
  // file names
  new HtmlWebpackPlugin({
    title: 'scramble',
    // tells webpack to inject the compiled files into the
    // head of the document
    inject: 'head',
    // path to the index.html template file
    template: path.resolve(__dirname, 'static/index.html')
  }),
  // the DashboardPlugin makes the webpack dev server CLI look
  // waaaay prettier ;)
  // see the package.json's script section to see how it's used
  new DashboardPlugin()
]

// configures the webpack dev server, which serves the compiled bundle
// and watches source files for changes, recompiling and re-serving the
// app automatically. Hot reloading (automatic client update) can be enabled
// here, but it is easier to enable as a commandline flag. See the
// package.json's script section to see how.
const devServer = {
  // use gzip compression to send files to the browser.
  // improves network performance
  compress: true,
  // render the app inline. by default, the app will be served
  // inside of an iframe
  inline: true,
  // render a fullscreen overlay on the client when the dev server
  // encounters an error.
  overlay: true
}

// the entire configuration must be exported for webpack to
// recognize it
module.exports = {
  devtool,
  entry,
  output,
  resolve,
  module: { rules },
  plugins,
  devServer
}
