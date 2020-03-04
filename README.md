# react-countdown

# react 的倒计时组件

这是基于抢金达人活动中使用的倒计时总结出来的。

简单的使用：

```jsx
<CountDown
    endTime={Date.now() + 4 * 1000}
    format={progress => 'wenzi ' + progress}
    diff={10}
    onStep={step => console.log(step)}
    onEnd={() => console.log('end')}
/>
```

### 参数的说明：

| 参数    | 定义               | 说明                                                 |
| ------- | ------------------ | ---------------------------------------------------- |
| total   | number             | 倒计时的时间                                         |
| endTime | number             | 结束的时间点，与 total 二选一，且优先级更高          |
| format  | string \| function | 要展示的时间格式，可以是字符串或者函数，下面相信说明 |
| diff    | number             | 频率                                                 |
| onStart | function           | 倒计时开始时的回调                                   |
| onStep  | function(step)     | 每次更新时执行的回调                                 |
| onEnd   | function           | 结束时的回调                                         |

### format 的介绍

该参数表示要展示的时间格式，可以是字符串或者函数。

#### format 字符串

完整的格式是：`dd hh:mm:ss.iii`。

-   d: 天数
-   h: 小时
-   m: 分
-   s: 秒
-   i: 毫秒

#### format 函数

完整的格式：

```javascript
function(progress) {
    return progress;
}
```

接收的参数为距离结束时的毫秒级时间戳，返回的类型为 string 类型，即要展示的数据。
