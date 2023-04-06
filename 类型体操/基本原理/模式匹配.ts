/** 通过 extends 对传入的类型参数 T 做模式匹配，
 * 通过 infer 类声明一个局部变量 R 来保存，如果匹配，就返回匹配到的 R，
 * 否则就返回 never 代表没匹配到 */ 
type GetValueType<T> = T extends Promise<infer R> ? R : never  
type PromiseType = Promise<'你好'>
type res = GetValueType<PromiseType>

/** 小结： Typescript 类型的模式匹配是通过 extends 对类型参数做匹配，
 * 结果保存到通过 infer 声明的局部类型变量里，
 * 如果匹配就能从该局部变量里拿到提取出的类型 */