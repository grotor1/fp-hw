/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {
  allPass, any, anyPass, complement,
  compose,
  curry,
  equals,
  filter, flip,
  gt, gte,
  juxt,
  length,
  lte, not,
  prop,
  tap,
  uniq,
} from 'ramda';
import {COLORS, SHAPES} from '../constants';

const log = (s) => console.log(s);


const getStar = prop(SHAPES.STAR);
const getSquare = prop(SHAPES.SQUARE);
const getTriangle = prop(SHAPES.TRIANGLE);
const getCircle = prop(SHAPES.CIRCLE);

const isWhite = equals(COLORS.WHITE);
const isGreen = equals(COLORS.GREEN);
const isRed = equals(COLORS.RED);
const isBlue = equals(COLORS.BLUE);
const isOrange = equals(COLORS.ORANGE);

// 1. Красная звезда, зеленый квадрат, все остальные белые.

const isRedStar = compose(isRed, getStar);
const isGreenSquare = compose(isGreen, getSquare);
const isWhiteCircle = compose(isWhite, getCircle);
const isWhiteTriangle = compose(isWhite, getTriangle);

export const validateFieldN1 = allPass([
  isRedStar,
  isGreenSquare,
  isWhiteCircle,
  isWhiteTriangle
]);

// 2. Как минимум две фигуры зеленые.
const getColors = juxt([
  getStar,
  getCircle,
  getTriangle,
  getSquare,
]);

const getGreenColorCount = compose(
  length,
  filter(isGreen),
  getColors
);

const curriedLte = curry(lte);
const greaterOrEquals2 = curriedLte(2);

const getIsMoreOrEquals2Green = compose(
  greaterOrEquals2,
  getGreenColorCount,
);
export const validateFieldN2 = getIsMoreOrEquals2Green;

// 3. Количество красных фигур равно кол-ву синих.
const getRedColorCount = compose(
  length,
  filter(isRed),
  getColors
);

const getBlueColorCount = compose(
  length,
  filter(isBlue),
  getColors
);

const getCountList = juxt([
  getBlueColorCount,
  getRedColorCount
]);


const allEqual = compose(
  equals(1),
  length,
  uniq,
);

const isRedAndBlueEquals = compose(
  allEqual,
  getCountList
);

export const validateFieldN3 = isRedAndBlueEquals;

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
const isBlueCircle = compose(isBlue, getCircle);
const isOrangeSquare = compose(isOrange, getSquare);

export const validateFieldN4 = allPass([
  isBlueCircle,
  isRedStar,
  isOrangeSquare,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
const getOrangeColorCount = compose(
  length,
  filter(isOrange),
  getColors,
);

const getColorsCount = juxt([
  getBlueColorCount,
  getRedColorCount,
  getOrangeColorCount,
  getGreenColorCount,
]);

const gte3 = flip(gte)(3);

const isAnyGte3 = compose(
  any(gte3),
  getColorsCount
);
export const validateFieldN5 = isAnyGte3;

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
const isTwoGreen = compose(
  equals(2),
  getGreenColorCount,
);

const isGreenTriangle = compose(
  isGreen,
  getTriangle,
);

const isOneRed = compose(
  equals(1),
  getRedColorCount,
);

export const validateFieldN6 = allPass([
  isTwoGreen,
  isOneRed,
  isGreenTriangle,
]);

// 7. Все фигуры оранжевые.
const isAllFiguresOrange = compose(
  equals(4),
  getOrangeColorCount
);

export const validateFieldN7 = isAllFiguresOrange;

// 8. Не красная и не белая звезда, остальные – любого цвета.
const isWhiteStar = compose(isWhite, getStar);
const nonePass = compose(
  complement,
  anyPass,
)

export const validateFieldN8 = nonePass([
  isWhiteStar,
  isRedStar,
]);

// 9. Все фигуры зеленые.
const isAllFiguresGreen = compose(
  equals(4),
  getGreenColorCount,
);

export const validateFieldN9 = isAllFiguresGreen;

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
const isNotWhiteTriangle = compose(
  not,
  isWhite,
  getTriangle
)
const isNotWhiteSquare = compose(
  not,
  isWhite,
  getSquare
)

const getTriangleAndSquareColors = juxt([
  getSquare,
  getTriangle,
])

const isTriangleAndSquareColorEquals = compose(
  allEqual,
  getTriangleAndSquareColors
)

export const validateFieldN10 = allPass([
  isNotWhiteTriangle,
  isNotWhiteSquare,
  isTriangleAndSquareColorEquals,
]);
