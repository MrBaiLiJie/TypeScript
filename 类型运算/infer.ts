/** infer : 这个词的含义即 推断，实际作用可以用四个字概括：类型推导。
 * 它会在类型未推导时进行占位，等到真正推导成功后，它能准确地返回正确的类型 */
// 内置 ReturnType
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
// 这个示例中定义了一个类型别名 ReturnType，
// 它接受一个函数类型 T 作为参数，并将该函数的返回值类型推断为一个名为 R 的待推断类型参数。
// 如果 T 能够被赋值给一个带有任意参数的函数类型，则返回 R，否则返回 any 类型
function foo(): number {
  return 1997;
}
type FooReturnType = ReturnType<typeof foo>; // 类型为 number

/** 总结，infer 关键字使得 TypeScript 能够在类型级别上进行更精确的推断，从而增强了代码的类型安全性和可读性 */

// 解读: 如果泛型变量T是 () => infer R的`子集`，那么返回 通过infer获取到的函数返回值，否则返回boolean类型
type Func<T> = T extends () => infer R ? R : false;

let func1: Func<number>; // => false
let func2: Func<''>; // => false
let func3: Func<() => Promise<number>>; // => Promise<number>

// 同上，但当a、b为不同类型的时候，返回不同类型的联合类型
type Obj<T> = T extends {a: infer VType, b: infer VType} ? VType : false;

let obj1: Obj<string>; // => false
let obj2: Obj<true>; // => false
let obj3: Obj<{a: number, b: number}>; // => false
let obj4: Obj<{a: number, b: () => void}>; // => number | () => void

interface w {
  x: number
}
interface e {
  x: number
  y: number
}
const r: e = {
  x: 1,
  y: 2,
}
const p: w = r // ok





