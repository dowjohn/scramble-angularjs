// import styles from './app.styles'
'use strict'
import templateUrl from './app.template'

const controller = class {
  // styles = styles
  sentence = ''
  sentenceOutput

  scramble () {
    let lettersArray = concatMultipleStringsIntoArray(this.sentence)
    let outArray = new Array(lettersArray.length)
    for (let i = 0; i < outArray.length; i++) {
      let letterInt = numGen(lettersArray)
      outArray[i] = lettersArray[letterInt]
      lettersArray.splice(letterInt, 1)
    }
    outArray.splice(Math.floor(Math.random() * outArray.length), 0, ' ')
    this.sentenceOutput = outArray.join('').trim()
    console.log(this.sentence)
  }
}

export const greatestApp = {
  templateUrl,
  bindings: {
    sentence: '<'
  },
  controller,
  controllerAs: 'app'
}

const numGen = (letters) =>
  Math.floor(Math.random() * letters.length)

const concatMultipleStringsIntoArray = (...args) => {
  return [...args].reduce(
    (previous, current) => {
      return previous.concat(current.split(''))
    }, [])
}
