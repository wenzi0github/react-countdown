import { Component } from 'react';

interface CountDownProps {
    total?: number;
    endTime?: number;
    format: string | ((progress: number) => string); // 展示的格式
    diff?: number; // 循环的时间
    onStart?: () => void;
    onStep?: (step: number) => void;
    onEnd?: () => void;
}

interface StateProps {
    endTime: number; // 结束时间
    progress: number; // 当前时间
    status: 'pending' | 'running' | 'suspend' | 'ended',
}

export default class CountDown extends Component<CountDownProps> {
    timer: any = null;

    state: StateProps = {
        status: 'pending',
        endTime: 0,
        progress: 0
    };

    // 开始倒计时
    start() {
        this.execute('onStart');
        this.setState({ status: 'running' });
        const { diff, format } = this.props;

        const running = () => {
            const now = Date.now();
            const progress = Math.max(this.state.endTime - now, 0);
            let _progress = '';
            if (typeof format === 'string') {
                _progress = this.formatTime(progress, format);
            } else if (typeof format === 'function') {
                _progress = format.call(null, progress);
            }

            this.setState({ progress: _progress })
            this.execute('onStep', _progress);

            if (progress === 0) {
                this.stop();
            }
            return progress;
        }
        if (diff && diff >= 17) {
            this.timer = setInterval(() => {
                running();
            }, diff);
        } else {
            const requestAnimFrame =
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };

            setTimeout(() => {
                (function loop() {
                    const progress = running();
                    if (progress > 0) {
                        requestAnimFrame(loop);
                    }
                })();
            }, 0)
        }
    }

    // 停止倒计时
    stop() {
        clearInterval(this.timer);
        this.setState({ status: 'ended' });
        this.execute('onEnd');
    }

    componentDidMount() {
        const { endTime, total } = this.props;

        if (!endTime && !total) {
            // 至少需要一个参数
            console.error(`endTime and total need least one`);
        } else {
            const now = Date.now();
            let _endTime = 0;
            if (!endTime) {
                _endTime = now + (total || 0);
            } else {
                _endTime = endTime;
            }
            // 为防止结束时间比当前时间早，没有格式
            // 无论当前是否已结束，均执行一次流程
            this.setState({ endTime: _endTime });
            this.start();
        }
    }

    formatTime(timestamp: number, format: string = 'dd hh:mm:ss.ii'): string {
        const dateFormat: any = {
            'd+': Math.floor(timestamp / 1000 / 60 / 60 / 24), // 天
            'h+': Math.floor(timestamp / 1000 / 60 / 60 % 24), // 时
            'm+': Math.floor(timestamp / 1000 / 60 % 60), // 分
            's+': Math.floor((timestamp / 1000) % 60),  // 秒
            'i+': timestamp % 1000 // 毫秒
        };

        for (let key in dateFormat) {
            if (new RegExp('(' + key + ')').test(format)) {
                format = format.replace(RegExp.$1, () => {
                    const regLen = RegExp.$1.length;
                    if (/i+/.test(RegExp.$1)) {
                        return (dateFormat[key] + '000').substr(0, regLen);
                    }
                    return regLen === 1 ? dateFormat[key] : ('00' + dateFormat[key]).substr(('' + dateFormat[key]).length)
                });
            }
        }
        return format;
    };

    // 触发props中传过来的回调
    execute(fn: string, ...params: string[] | number[]) {
        const func = (this.props as any)[fn];
        if (typeof func === 'function') {
            func(...params);
        }
    }

    render() {
        return (<p>{this.state.progress}</p>);
    }
}