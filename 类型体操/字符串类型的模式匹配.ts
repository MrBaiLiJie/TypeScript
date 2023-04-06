`1、Stringify - 将类型字符串化`;
/**
 * 将支持的类型转化为字符串
 * @example
 * type Result = Stringify<0> // "0"
 */

// 将类型转为字符串有一定的限制，仅支持下面的类型
type CanStringified = string | number | bigint | boolean | null | undefined;
type Stringify<T extends CanStringified> = `${T}`;
type Result = Stringify<0>; // "0"
/** 原理：TS 内置的模板字符串类型 */

`2、GetChars - 获取字符`;
/**
 * @exports
 * 获取模板字符串类型中的字符
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html
 * @example
 * type Result = GetChars<'abc'> // 'a' | 'b' | 'c'
 */
type GetChars<S> = GetCharsHelper<S, never>;
type Result = GetChars<"abcde">; // 'a' | 'b' | 'c' | 'd' | 'e'

/**
 * 以 尾递归 tail-recursive 的方式优化 GetChars，不导出为工具类型
 */
type GetCharsHelper<S, Acc> = S extends `${infer Char}${infer Rest}`
  ? GetCharsHelper<Rest, Char | Acc>
  : Acc;
type Result = GetCharsHelper<"你好", "">;

/** 原理：通过模板字符串类型的模式匹配，使用 GetCharsHelper 匹配出字符串类型的第一个字符和剩余字符，
 *  然后将剩余字符继续放入 GetCharsHelper 中进行处理
 *  每次匹配的结果通过 Acc 参数传递，当 S 为空字符串时，S 不能分配给 ${infer Char}${infer Rest}，
 *  走到 false 分支中，结束递归，即返回 Acc 类型 */

`3、 Split - 分割字符串`;
/**
 * 拆分字符串变为一个元组
 * @example
 * type Result = Split<'1,2,3', ','> // ["1", "2", "3"]
 */
type SplitString<
  T,
  Separator extends string,
  A extends string[] = []
> = T extends ""
  ? A
  : T extends `${infer Char}${Separator}${infer Rest}`
  ? SplitString<Rest, Separator, [...A, Char]>
  : [...A, T];

type Split<S extends string, SplitStr extends string = ""> = SplitString<
  S,
  SplitStr
>;
type Result = Split<"1,2,3", ",">; // ["1", "2", "3"]
type Result = Split<"你-好", "-">; // ["你", "好"]
type Result = Split<"你.好.啊", ".">; // ["你", "好", "啊"]
type Result = Split<"你-好", ",">; // ["你-好"]
/** 原理：分割字符串类型，是把字符串类型转为元组类型，参数中需要设置一个元组类型用作返回结果
 *  模板字符串类型的模式匹配是从左往右的，
 *  如果字符类型 S 为 '1,2,3'，${infer Char}${','}${infer Rest} 中 Char 即为 '1'，Rest 即为 '2,3'，
 *  同理，如果 S 为 '2,3'，${infer Char}${','}${infer Rest} 中 Char 即为 '2'，Rest 即为 '3'
 *  这样的话，我们只需要把每次匹配出的 Char 放到元组类型参数 T 中的最后一项，在匹配结束后，返回 T 的类型即可
 */

`4、GetStringLength - 获取字符串长度`;
/**
 * 获取字符串的长度
 * @example
 * type Result = GetStringLength<"123"> // 3
 */
type GetStringLength<S extends string> = Split<S>["length"];
type Result = GetStringLength<"123456k">; // 7
/** 原理：元组的长度是可以获取的，通过上文的 Split 可以将字符串类型按照 '' 分割成元组类型，
 * 再取元组的 length 即为字符串类型的长度 
 */

`5、CharAt - 获取字符串在索引位 I 下的 字符`
/**
 * 获取字符串在索引位 I 下的 字符
 * @example
 * type Result = CharAt<"123", 1> // "2"
 */
type CharAt<S extends string, I extends number> = Split<S>[I]
type Result = CharAt<"123456k",6>; // k
/** 原理：元组类型可以进行索引访问，可以将字符串类型按照 '' 分割成元组类型，
 * 然后通过 索引访问，得到索引位 I 处的字符
 */

`6、Concat - 拼接两个字符串`
/**
 * 拼接两个字符串
 * @example
 * type Result = Concat<"123", "456"> // "123456"
 */
type Concat<S1 extends string, S2 extends number> = `${S1}${S2}`
type Result = Concat<"123456k",6>; // "123456k6"
/** 原理：TS 模板字符串类型用法 */

`7、Includes - 判断字符串是否包含子串`
/**
 * 判断字符串是否包含子串
 * @example
 * type Result = Includes<"123", "12"> // true
 */
 type Includes<
 S1 extends string,
 S2 extends string
> = S1 extends `${infer Left}${S2}${infer Right}` ? true : false
type Result = Includes<"你好吗", "好"> // true
type Result = Includes<"你好吗", "不"> // false
/** 原理：模式匹配可判断字符串类型中是否含有子串 */

`8、StartsWith - 判断字符串是否以子串为起始,StartsWith<T, U>`
/**
 * 接收两个 string 类型参数,然后判断T是否以U开头,根据结果返回true或false
 * @example
 * type Result = StartsWith<"123", "12"> // true
 */
 type StartsWith<T extends string, U extends string> = T extends `${U}${string}`
 ? true
 : false;
type Result = StartsWith<"你好", "你">; // true
/** 原理：模式匹配时，左侧不写 infer Left，代表左侧只包含空字符串，不存在任何有长度的子串 */

`9、EndsWith - 判断字符串是否以子串为结束,EndsWith<T, U>`
/**
 * 接收两个 string 类型参数,然后判断T是否以U结尾,根据结果返回true或false
 * @example
 * type Result = StartsWith<"123", "23"> // true
 */
 type EndsWith<T extends string, U extends string> = T extends `${string}${U}`
  ? true
  : false;
type Result = EndsWith<"你好", "你">; // false
/** 原理：模式匹配时，右侧不写 infer Right，代表右侧只包含空字符串，不存在任何有长度的子串 */

type D = "你好";
// 获取字符串中第一个元素的类型
type GetStringFirst<str extends string> = str extends `${infer First}${string}`
  ? First
  : never; // 把需要提取的部分放到 infer声明的局部变量里
type GetStringFirstResult = GetStringFirst<D>; // '你'
type ExampleD = D extends `${infer First}${infer Rest}` ? First : never; // '你'

// 获取字符串中最后一个元素的类型
type ExampleD3 = D extends `${infer Rest}${infer Last}` ? Last : never; // '好'

`10、Replace - 在字符串中查找并替换一处子串`
/**
 * 在字符串中查找并替换字符串中的一部分，
 * Replace,可以通过模式匹配取出这段字符串前后的子串，通过 infer 放入不同的变量，然后和替换后的部分组成新字符串
 * @example
 * type Result = Replace<'你好，我是Java','Java','前端'> // '你好，我是前端'
 */

type ReplaceStr<
  T extends string,
  F extends string,
  TO extends string
> = T extends `${infer Left}${F}${infer Right}` ? `${Left}${TO}${Right}` : T;
type replaceStr = ReplaceStr<"你好，我是Java", "Java", "前端">; // '你好，我是前端'
// 不匹配时
type replaceStr2 = ReplaceStr<"你好，我是Java", "?", "前端">; // '你好，我是Java'
/** 原理：声明要替换的字符串T,待替换的字符串F,最终替换成的字符串TO 3个类型参数，都被约束为 string 类型，
 *  用T去匹配模式串，模式串由F和之前之后的字符串组成，把之前之后的字符串放到通过 infer 声明局部变量Left、Right中，
 *  用Left、Right加上替换到的字符串TO构成新的字符串类型返回。、
 */

`11、TrimLeft - 去掉字符串前、后的空格`
/**
 * 去掉字符串类型左侧的空格
 * @example
 * type Result = TrimLeft<'   0123'> // '0123'
 */
 type TrimLeft<T extends string> = T extends `${" " | "\t" | "\n"}${infer Rest}`
 ? TrimLeft<Rest>
 : T;
 type trimLeft = TrimLeft<"  你好">; // '你好'

/**
 * 去掉字符串类型右侧的空格
 * @example
 * type Result = TrimRight<'0123  '> // '0123'
 */
 type TrimRight<T extends string> = T extends `${infer Rest}${" " | "\t" | "\n"}`
 ? TrimLeft<Rest>
 : T;
 type trimRight = TrimRight<"你好  ">; // '你好'

/** 二者结合 */
type trimResult = TrimLeft<TrimRight<"  你好  ">>; // '你好'

type Trim<T extends string> = T extends `${" " | "\t" | "\n"}${infer Rest}`
  ? Trim<Rest>
  : T extends `${infer Rest}${" " | "\t" | "\n"}`
  ? Trim<Rest>
  : T;
type trim = Trim<"   你好  ">; // '你好'

/** 类型参数T 是要Trim的字符串，如果T匹配字符串 + 空白字符（空格、制表符、换行符），
 * 就把字符串放到infer声明的局部变量Rest里，将Rest作为类型参数递归，直到不匹配时
 */ 
/** 原理: trim :去掉前后的空格、制表符、换行符，通过模式匹配取出后面的字符，通过 infer 放入新的变量返回。 */ 

`12、ToLowerCase - 字符串转大、小写`
/**
 * 字符串转大写
 * @example
 * type Result = ToUpperCase<'abc'> // 'ABC'

 * 字符串转小写
 * @example
 * type Result = ToUpperCase<'ABC'> // 'abc'
 */
 type ToUpperCase<S extends string> = Uppercase<S>
 type Result = ToUpperCase<'abcd'> // 'ABCD'

 type ToLowerCase<S extends string> = Lowercase<S>
 type Result = ToLowerCase<'ABCD'> // 'abcd'

/** 原理：TS 内置 */