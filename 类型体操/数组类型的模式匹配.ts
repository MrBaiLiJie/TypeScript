type C = [1, '2', 3]

/**
 * 获取数组中第一个元素
 * @example
 * type Result = GetFirst<[1, 2, 3]> // 1
 */
type GetFirst<arr extends unknown[]> = arr extends [infer First,...unknown[]] ? First : never  // 类型参数arr 通过 extends 约束为只能是数组类型，数组元素为unknown 任意值
type GetFirstResult = GetFirst<C>   // 1
type GetFirstEmptyResult = GetFirst<[]> // never
type ExampleC1 = C extends [infer First,...infer Rest] ? First : never // 1

/**
 * 获取数组中最后一个元素
 * @example
 * type Result = GetLast<[1, 2, 3]> // 3
 */
type GetLast<arr extends unknown[]> = arr extends [...unknown[],infer Last] ? Last : never  // 类型参数arr 通过 extends 约束为只能是数组类型，数组元素为unknown 任意值
type GetLastResult = GetLast<C>   // 3
type GetLastEmptyResult = GetLast<[]> // never
type ExampleC3 = C extends [...infer Rest,infer Last] ? Last : never // 3

/**
 * 去掉元组的最后一个元素
 * @example
 * type Result = Pop<[1, 2, 3]> // [1, 2]
 */
type PopArr<T extends unknown[]> = T extends [...infer Rest, infer R] ? [...Rest] : never  // 通过模式匹配取出最后一个元素的类型和前面的元素的类型，分别用 infer 放入不同的变量里，然后构造一个新的数组类型返回
/** 更简单的写法：type PopArr<T extends unknown[]> = T extends [...infer Rest, infer R] ? Rest : never */
type popArr = PopArr<C>  // [1,'2']
type popArr1 = PopArr<[]> // never

/**
 * 去掉数组的第一个元素
 * @example
 * type Result = Shift<[1, 2, 3]> // [2, 3]
 */
type ShiftArr<T extends unknown[]> = T extends [infer R,...infer Rest ] ? [...Rest] : never 
type shiftArr = ShiftArr<C>  // ['2'，3]
type shiftArr1 = ShiftArr<[]> // never
