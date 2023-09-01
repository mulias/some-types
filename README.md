# Some Types

Have some types! They're home grown, organic, GMO-free, and rich in
antioxidants. Types for a true TypeScript gourmand.

This library features a handful of useful types that leverage advanced
TypeScript features while still fitting in seamlessly with your existing code.
Each type comes with a full suite of type-oriented utility functions.

## Types and Namespaces

`some-types` is organized into modules which each provide a type and functions
that operate on said type. At the top-level each module is exported as a single
variable which is both a type and a namespace. Each module can also be imported
from directly, and exports both the main module type/namespace and the contents
of the namespace. For example:

```
import { Option, Tuple } form "some-types"
import { Result, Ok, Err, ok, err, isOk, isErr } from "some-types/Result"
```

In this case `Option`, `Tuple`, `Result`, `Ok`, and `Err` are all both types
and namespaces. `Ok` and `Err` are types/namespaces from the `Result` module,
and can also be accessed as `Result.Ok` and `Result.Err`. Similarly `ok`, `err`,
`isOk`, and `isErr` are functions from the `Result` module, and can also be
accessed as `Result.ok`, etc.

A number of functions have both a version that's meant to be imported directly,
and an alias that's easier to use with the namespace prefix. For example
`timestamp` and `Timestamp.of` are both functions to create a timestamp value.

## Provided Modules

### `Option`

An `Option<A>` is a value that may or may not be present. Values of this type are
either:

- `Some<A>`, a desired value of type `A`, or

- `None`, the lack of that value encoded as `undefined`.

The type `Option<A>` isn't a special wrapper of any kind, it's an alias
for `A | undefined`. TypeScript has great built-in support for values that might
be `undefined`, so this module expands on that with utility functions to handle
common cases at a higher level of abstraction.

In the following example we use `Option.ifSome` to apply a function to a value that
might be `undefined` without having to first narrow the type.

```
import { Option } from "some-types"

const inc = (x: number) => x + 1;

let num: Option<number> = 10;

const withTernary = num !== undefined ? inc(num) : num; // 11

const withOption = Option.ifSome(num, inc); // 11
```

In this example we use `Option.encase` to wrap a function that might throw an
error and create a new function that will never throw an error and instead
returns `undefined` for all error cases.

```
import { Option } from "some-types"

const assertPositive = (n: number) => {
  if (n > 0) return n
  throw "Not a positive number!"
}

const keepPositive = Option.encase(assertPositive)

const a = keepPositive(10); // 10
const b = keepPositive(-5); // undefined
```

### `Result`

A `Result<V, E>` is the result of a computation that might fail. Values of this type
are either:

- `Ok<V>`, a desired value of type `V`, or

- `Err<E>`, an object `E` inheriting from `Error`, specifying what went wrong.

Similar to `Option`, `Result<V, E>` isn't implemented as a [discriminated union],
it's a simple union type `V | E` where we know that `E` is an `Error` object.

In this example the `submit` function takes an array of numbers and either
performs a calculation if the numbers are valid, or reports the first invalid
number. The error type must inherit from `Error`, so we use `DataError`,
an error object which also stores data of a parametrized type.

```
import { Result } from "some-types"

const validateNumber = (n: number): Result<number, DataError<number>> => {
  if (n === 5) return Result.errData(n, "I don't like 5")
  if (n < 0) return Result.errData(n, "can't be negative")
  if (n === 55) return Result.errData(n, "I don't like 55 either")
  if (n % 2 !== 1) return Result.errData(n, "must be odd")

  return n;
}

const validateNumbers = (ns: number[]): Result<number[], Error> =>
  Result.consolidate(ns.map(validateNumber))

const submit(ns: number[]): string => {
  const result = validateNumbers(ns);

  if (Result.isOk(result)) {
    const sum = result.reduce((acc, n) => acc + n);
    return `Thanks for these great numbers! Their sum is ${sum}.`;
  } else {
    return `Error: Invalid number ${result.data}, ${result.message}.`
  }
}

submit([1, 3, 7, 9, 11]) // "Thanks for these great numbers! Their sum is 31."
submit([1, 3, 7, 12, 55, -1]) // "Error: Invalid number 12, must be odd."
```

[discriminated union]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions

### `RemoteData`

`RemoteData<D, E>` models the lifecycle of async requests, where data starts
uninitialized, a request is made, and then either a successful or
unsuccessful response is received. These four stages correspond to the types

- `NotAsked`, a constant to indicate that nothing has happened yet,

- `Loading`, a constant to indicate that the request is in progress,

- `Success<D>`, the requested data of type `D`, and

- `Failure<E>`, an object `E` inheriting from `Error`, specifying what went wrong.

This type uses [symbols] to ensure that `NotAsked` and `Loading` are unique
types that won't overlap with the success type `D`.

In this example we make a request to an [API] that provides random images of
dogs. With `RemoteData` we can use one variable to track the entire state of the
request. Because the failure case must inherit from `Error` we use `DataError`,
an object which uses an additional `data` field to track the message and http
code associated with the failure.

```
import { RemoteData, DataError } from "some-types"

type DogRequest = RemoteData<string, DogError>;
type DogError = DataError<{ message: string; code?: number }>;

let dogImageRequest: DogRequest = RemoteData.notAsked;

function getRandomDogImage(): Promise<void> {
  dogImageRequest = RemoteData.loading;

  try {
    const response = await fetch("https://dog.ceo/api/breeds/image/random")
    const json = await response.json()

    if (json.status === "success") {
      dogImageRequest = RemoteData.success(json.message);
    } else {
      dogImageRequest = RemoteData.failureData({
        message: json.message,
        code: json.code
      });
    }
  } catch {
    dogImageRequest = RemoteData.failureData({ message: "Request failed" });
  }
}
```

When we render our UI we can base our logic off of the current value of
`dogImageRequest`, no additional state variables necessary.

```
function displayDogImage(dogImageRequest: DogRequest): string {
  return RemoteData.caseOf(dogImageRequest, {
    NotAsked: () => "Request a dog!",
    Loading: () => "Loading!",
    Success: (url) => `Here's your dog! ${url}`,
    Failure: (err) => `Error: ${err.data.message}`
  })
}
```

[symbols]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
[api]: https://dog.ceo/dog-api/documentation/random

### `DataError`

A `DataError<D>` is an instance of the `DataError` class which inherits
from `Error` but additionally has a parametrized `data` field which can
store a value of type `D`. When thrown `DataError` has the same behavior as
`Error`.

The `Result` and `RemoteData` modules may use `DataError` to track arbitrary
data on `Result.Err` or `RemoteData.Failure`.

### `NonEmptyArray`

A `NonEmptyArray<A>` is an immutable array where the elements have type `A` and
the array contains at least one element.

### `Tuple`

A `Tuple<A, B, C>` is an immutable array with a fixed length. For simplicity we
provide utilities for tuples of length 0, 1, 2, and 3, although TypeScript
has support for larger tuples. These tuple variants are called `Empty`,
`Single<A>`, `Pair<A, B>`, and `Triple<A, B, C>`.

In this example the type of `pairs` is inferred as `Array<Pair<number, string>>`.
This means that for each element in the array the type checker is aware that the
element is an array of length 2 containing a number at index 0 and a string at
index 1.

```
import { Tuple } from "some-types"

const nums = [1,2,3,4,5];
const chars = ["a", "b", "c", "d", "e"];

const pairs = Tuple.zip(nums, chars);
const firstNumber : number = pairs[0][0]; // 1
const firstString : string = pairs[0][1]; // "a"
```

### `ReadonlyDate`

Similar to `ReadonlyArray`, `ReadonlyDate` is a `Date` object where all mutable
methods have been removed from the type declaration.

### `ValidDate`

A `ValidDate` is a `Date` object which we know is not invalid.

A quirk of JavaScript `Date`s is that if a date is constructed with invalid
inputs then the internal representation will be `NaN`. The `ValidDate` type
indicates that the date has been checked and is known to be valid.

One downside of this type is that in order to ensure the date stays valid it
is a `ReadonlyDate`, which does not have access to the mutable methods of the
`Date` type. Similar to how a `ReadonlyArray` can't be used in places where
an `Array` is required, `ReadonlyDate` can't be used when a `Date` is
required. To get around this limitation the `ValidDate` must be explicitly
cast to a `Date`, breaking the read-only guarantee.

### `Timestamp`

A `Timestamp` is a number encoding of a `Date`, measured as the time
in milliseconds that has elapsed since the UNIX epoch.

The JavaScript `Date` object uses an integer timestamp for its internal
representation, so `Timestamp` values map directly to valid `Date`s. Unlike
`Date`s timestamps are immutable, can be compared by value, and are easy to
sort. Many date utility libraries will accept timestamps instead of
`Date`s as function arguments, so in many cases `Timestamp`s can be used as
a drop-in replacement for `Date`s.

```
import { isMonday } from "date-fns";
import { Timestamp } from "some-types";

const year = 2023;
const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((monthIndex) =>
  Timestamp.of({ year, monthIndex, day: 1 }),
);

const monthsStartingOnMonday : Timestamp[] = months.filter(isMonday);

monthsStartingOnMonday.map((t) => Timestamp.toDate(t).toUTCString());
// ["Mon, 01 May 2023 05:00:00 GMT"]
```

### `DateString`

A `DateString` is a string encoding of a `Date`, guaranteed to parse to a valid
Date object. Internally `DateString`s use ISO 8601 format, which is commonly used to
communicate dates between systems.

`DateString`s have many of the same benefits of `Timestamp`s, in that they
are immutable and use string value comparison instead of reference
comparison. Many date utility libraries will accept strings instead of
`Date`s, but libraries such as `date-fns` are less permissive and require
strings to first be explicitly parsed to dates.

## Prior Art

A number of libraries, guides, and blog posts shaped the design of this library.
Here's a non-exhaustive list.

- https://ramdajs.com/

- https://remedajs.com/

- https://gigobyte.github.io/purify/

- https://mobily.github.io/ts-belt/

- https://github.com/gcanti/fp-ts

- http://blog.jenkster.com/2016/06/how-elm-slays-a-ui-antipattern.html

- https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch08

- https://zachholman.com/talk/utc-is-enough-for-everyone-right
