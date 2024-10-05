---
title: C++ 20 协程入门
authors:
  - me
---

WIP

{/* truncate */}

## 前言

这篇文章是对 Lewis Baker 撰写的关于 C++ 协程的博文，以及其他关于 C++ 协程的文章的概括，可能有些细节不会深入。

## 原文链接，以及其他值得参考的文章

[Lewis Baker](https://github.com/lewissbaker) 是 C++ 协程库 [cppcoro](https://github.com/lewissbaker/cppcoro) 的作者。他在[他的个人博客](https://lewissbaker.github.io/)中撰写了 5 篇关于 C++ 协程的博文。

- [Coroutine Theory](https://lewissbaker.github.io/2017/09/25/coroutine-theory)
- [C++ Coroutines: Understanding operator `co_await`](https://lewissbaker.github.io/2017/11/17/understanding-operator-co-await)
- [C++ Coroutines: Understanding the promise type](https://lewissbaker.github.io/2018/09/05/understanding-the-promise-type)
- [C++ Coroutines: Understanding Symmetric Transfer](https://lewissbaker.github.io/2020/05/11/understanding_symmetric_transfer)
- [C++ Coroutines: Understanding the Compiler Transform](https://lewissbaker.github.io/2022/08/27/understanding-the-compiler-transform)

其他值得参考的文章：

- [Coroutines - CppReference](https://en.cppreference.com/w/cpp/language/coroutines)
  - cppref ，无需多言。更偏向于「复习材料」而不是「入门读物」。
- [C++ 20 协程原理和应用 - 知乎](https://zhuanlan.zhihu.com/p/497224333)
  - 内容大致是 Lewis Baker 的 5 篇的省流版。由于是中文，比较易读，可以先看一遍有个印象，再去读上面的 5 篇英文文章。
- [Writing custom C++20 coroutine systems](https://www.chiark.greenend.org.uk/~sgtatham/quasiblog/coroutines-c++20/)
  - 还没看。
- [Boost Coroutine2 Introduction](https://www.boost.org/doc/libs/1_86_0/libs/coroutine2/doc/html/coroutine2/intro.html)
  - 尽管 Coroutine2 是一个有栈协程库，并不是本文讨论的 C++ 20 的无栈协程，但是其文档的 Introduction 部分介绍了语言无关的协程概念，并且对比了各种类型的协程，是非常好的入门读物。

## 概览

WIP

## 什么是 C++ 协程

在下文中，当我们提到协程或者 C++ 协程时，我们指的是 C++ 20 标准中的，基于 `co_await` 等关键字的无栈协程。

本文假定您已经理解了语言无关的协程的概念。如果您对其并不了解，可以参考 [Boost Coroutine2 的 Introduction](https://www.boost.org/doc/libs/1_86_0/libs/coroutine2/doc/html/coroutine2/intro.html) ，或者类比您之前接触过的其他语言（JavaScript / Python / ...）中的 Async Function 。

在 C++ 中不仅能实现无栈协程，也能实现有栈协程，比如 [Boost 的 Coroutine2](https://www.boost.org/doc/libs/1_86_0/libs/coroutine2/doc/html/index.html)。

## 从函数到协程

协程是可以主动挂起的函数。挂起可以简单理解为「去做别的事」。

我们希望在一个函数执行过程中去做别的事，往往是因为该函数的某个阶段必须等待某些外部条件达成，才能继续工作。如果占着 CPU 等待，会造成 CPU 资源的浪费。而协程支持在执行过程中挂起，将 CPU 交给这个协程的调用者。这个调用者可能是我们编写的另一个函数/协程，或者是某个 Scheduler 。通过合理的调度策略，我们可以更充分地利用 CPU 。

协程与函数的区别主要体现在 Control Flow 以及 Context 存储方式上；而 Context 的存储方式又主要取决于 Control Flow 。所以接下来我们会先介绍函数的 Control Flow 以及存储 Context，再拓展到协程的 Control Flow ，最终对比函数与协程对应的 Context 存储方式。

我们会先从抽象的概念入手，最终对应到实际的实现。

### 函数的 Control Flow

从函数的视角看，主要有两种操作：Call 和 Return 。这里暂时不讨论 Exception ，或者您也可以将 Exception 理解为某种 Return 。

Call 指的是 Caller 初始化 Callee 的 Context ，保存自身的 Context ，并将 CPU 交给 Callee 。

Return 指的是 Callee 结束执行，将 CPU 返还给 Caller ，并销毁自身的 Context 。

从 Call 和 Return 的描述可以看出，函数调用的 Control Flow 与 Context 的生命周期满足嵌套关系。

### 协程的 Control Flow

从协程的视角看，除了函数支持的 Call 和 Return ，协程另有 Suspend ，Resume 和 Destroy 三种操作。

协程在创建之初是 Suspend 状态。Call 时可以选择是否立即 Resume 。

Suspend 指的是 Callee 保存 Context ，让出 CPU ，回到外部。

Resume 指的是在 Suspend 状态，外部恢复 Callee 的执行。

Destroy 指的是在 Suspend 状态，外部销毁 Callee 的 Context 。

我们这里不再说 Caller 而是说外部，是因为 Suspend 的出现，使得协程的生命周期能够超越（Outlive）Caller 的生命周期，协程可能在 A 函数中被创建，被传递到 B 函数中被 Resume ，再被传递到 C 函数中被 Destroy ……这打破了上文提到的嵌套关系。

然而如果我们在协程内 Call 其他函数，或者 Resume 其他协程，此时的 Control Flow 又会是怎么样的呢？

由于：

- 协程 Call 其他函数，对应函数一定会 Return ，回到当前协程；
- 协程 Call / Resume 其他协程，对应协程一定会 Suspend 或 Return ，回到当前协程；

所以我们会发现，在相邻 Suspension 之间，Control Flow 和 Context 的生命周期仍然满足嵌套关系。

### 函数和协程怎么保存 Context 

对于函数，一旦通过 Call 创建 Context 并进入函数，除了 Call 其他函数之外，我们不能在中途离开这个函数，直到我们通过 Return 销毁 Context 并退出这个函数。这保证了函数的生命周期构成严格的嵌套关系。

这个嵌套关系保证了同一时刻，所有未被销毁的 Context 可以按调用顺序堆叠在内存空间中：Call 时，将新函数的 Context 放在当前所有 Context 的尾部；Return 时，将当前 Context 也就是最末尾的 Context 销毁。这个过程构成了我们所熟悉的栈。

对于协程，由于无法保证生命周期的嵌套关系，协程的 Context 需要存储在栈以外的地方，也就是堆。如果从外部看，Call 时会在堆上创建 Context 并且拿到一个 Handle ；Resume 时会通过 Handle 跳转到 Suspend 的地方继续执行。

而在协程内部，由于相邻 Suspension 之间仍然存在上面提到的生命周期的嵌套关系，这当中的 Context 仍然可以存储在栈上。而跨 Suspension 的 Context 仍然需要存储在堆上。

不过，如果我们通过静态分析，能保证某个协程一定不会 Outlive 它的 Caller ，那么我们也可以直接将跨 Suspension 的 Context 存储在栈上。

