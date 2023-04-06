/** 1、 条件类型: extends?:  */ 
// if 和 else，条件类型冒号左边为 if 右边为 else
type A = 1
type B = 2
// 条件 ? true 表达式 : false 表达式 
type Example = A extends B ? true : false // false 

// 传入类型参数，经过一系列类型运算逻辑后，返回新的类型就叫高级类型
type IsTwo<T> = T extends 2 ? true : false
type Result1 = IsTwo<1>  // false
type Result2 = IsTwo<2>  // true
/** 如果是静态的值，直接算出结果即可，没必要写类型逻辑 */

/** End */

/** 2、判断相等 */ 

/**若位于 extends 右侧的类型包含位于 extends 左侧的类型(即狭窄类型 extends 宽泛类型)时，
 * 结果为 true，反之为 false 
 */ 
type Example1 = string extends string | number ? true : false // true

// 判断左侧类型是否可以分配给右侧类型
type CheckLeftIsExtendsRight<T extends any, R extends any> = T extends R
? true
: false
type Result3 = CheckLeftIsExtendsRight<1,2>  // false

// 判断左侧类型是否和右侧类型一致
type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <
T1
>() => T1 extends B ? 1 : 2
? true
: false
type Result4 = IsEqual<2,2> // true

type Example2 = { a: 1; b : 2 } extends { a: 1 } ? true : false // true
type Example3 = 1 | 2 extends 1 ? true : false // false

/** End */

/** 3、条件类型约束 */ 
type MessageOf<T extends { message: unknown }> = T["message"];  // 约束 T 有一个名为 message 的属性

interface Email {
  message: '你好';
}
interface Age {
  num: 22;
}
interface Dog {
  bark(): void;
}
 
type EmailMessageContents = MessageOf<Email>;  // 你好
type DogMessageContents = MessageOf<Dog>; // 类型"Dog"不满足约束“{ message: unknown; }”。类型 "Dog" 中缺少属性 "message"
type AgeMessageContents = MessageOf<Age>; // 类型"Age"不满足约束“{ message: unknown; }”。类型 "Age" 中缺少属性 "message"

/**当我们希望 MessageOf2 接受任何类型，
 * 并且在 message 属性不可用的情况下默认为 never 之类的类型,
 * 我们可以通过 移出约束并引入条件类型 来实现 
 */ 
type MessageOf2<T> = T extends {message:unknown} ? T['message']:never;
type EmailMessageContents2 = MessageOf2<Email>;  // 你好
type DogMessageContents2 = MessageOf2<Dog>; // never
type AgeMessageContents2 = MessageOf2<Age>; // never

/** End */

/** 3、 循环可以通过递归来实现 */ 
type Example4<
  C extends boolean = true,
  Tuple extends unknown[] = [1]
> = C extends true ? Example4<false, [...Tuple, 1]> : Tuple

type Result5 = Example4 // [1, 1]

// 还可以通过 分布式条件类型

type Example5<T> = T extends number ? T : never   // 泛型参数 T 为联合类型,条件类型即为分布式条件类型,会将 T 中的每一项分别分发给 extends 进行比对
type Result6 = Example5<"1" | "2" | 3 | 4> // 3 | 4   

/** 总结：
 * 只有当条件类型作用在泛型上，
 * 并且泛型参数为联合类型时，
 * 条件类型的结果才会分发为联合类型 
 */

// 映射类型，固定写法，in 操作符会分发 T 成为新对象类型的键
type Example6<T> = {
  [Key in T]: Key
}
type Result7 = Example6<"1" | "2" | 3 | 4> // { 1: "1"; 2: "2"; 3: 3; 4: 4; }

/** End */