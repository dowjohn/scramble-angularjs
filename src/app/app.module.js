import angular from 'angular'

// import { clkButton } from 'components/button'
// import { clkLabel } from 'components/label'
//
// import { clkApp } from './app.component'
import { greatestApp } from './app.component'

export default
  angular
    .module('great.app', [])
    .component('greatestApp', greatestApp)
    // .component('clkApp', clkApp)
    // .component('clkButton', clkButton)
    // .component('clkLabel', clkLabel)
    .name
