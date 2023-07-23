/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
  allPass, andThen, applySpec,
  call,
  compose, composeWith,
  converge,
  curry, equals,
  flip,
  gte, identity, ifElse,
  juxt,
  length,
  lte, match, modulo,
  not,
  nth, partial, prop,
  props,
  split,
  startsWith,
  tap, toString
} from 'ramda';
import {curryRight} from 'lodash';

const api = new Api();

// Не смог побороть выборку нескольких аргументов из пропсов в рамках одной композиции
const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
  const lenLessThanTen = compose(
    flip(lte)(10),
    length
  )

  const lenMoreThanTwo = compose(
    flip(gte)(2),
    length
  )

  const isDecimal = compose(
    not,
    equals(0),
    length,
    match(/^[1-9]\d*\.?\d*$/)
  )

  const validate = allPass([
    lenMoreThanTwo,
    lenLessThanTen,
    isDecimal,
  ])

  const logValidationError = partial(handleError, ['Validation Error'])

  const processString = compose(
    tap(writeLog),
    Math.round,
    Number
  )

  const get = api.get

  const paramsForRebase = applySpec({
    from: () => 10,
    to: () => 2,
    number: identity
  })

  const getResult = prop('result')

  const logFetchResult = compose(
    tap(writeLog),
    getResult,
  )

  const getBinary = compose(
    andThen(tap(logFetchResult)),
    get('https://api.tech/numbers/base'),
    paramsForRebase,
    processString,
  )

  const getLength = compose(
    tap(writeLog),
    length,
  )

  const square = flip(curry(Math.pow))(2)

  const getSquare = compose(
    tap(writeLog),
    square,
  )

  const getModule3 = flip(modulo)(3)

  const processBinary = compose(
    getModule3,
    getSquare,
    getLength,
    getResult,
  )

  const getFetchString = (s) => `https://animals.tech/${s}`

  const getAnimal = compose(
    andThen(get(getFetchString)),
    andThen(tap(writeLog)),
    andThen(processBinary),
    getBinary,
  )


  return (compose(
    ifElse(
      validate,
      getAnimal,
      logValidationError,
    ),
    tap(writeLog),
  ))(value)
};

export default processSequence;
