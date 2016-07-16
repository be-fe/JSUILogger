// 上帝说,你们在 Mini Hi 上的调试有些问题,需要一个库,于是便有了这个库

/**
 *库的结构:
 * 1.界面呈现和操作,一个输入输出界面,界面的拉伸,隐藏和显示
 * 2.处理输入界面,将结果显示在输出界面
 * 3.json,函数等的格式化显示,高亮显示
 * */

(function (global) {

    // 全局不可变变量
    var name = 'JUILogger';
    var version = '1.0.0';
    var author = 'leiquan';
    var console = global.console;
    var btn = document.createElement('div');
    var container = document.createElement('div');
    var output = document.createElement('ul');
    var input = document.createElement('input');
    var cmd = []; // 缓存命令,供上下键使用
    var cmdIndex = 0;
    var levelColor = {
        debug: 'blue',
        error: 'red',
        warning: 'yellow',
        log: 'black',
        info: 'green',
        default: '#999'
    };
    var showConsole = true;

    // 覆盖原生的 console.log
    (function () {
        console.oldLog = console.log;

        console.log = function () {
            global.JUILogger.output([].join.call(arguments, ''), levelColor.log);
            this.oldLog.apply(this, arguments);
        };

        console.debug = function () {
            global.JUILogger.output([].join.call(arguments, ''), levelColor.debug);
            this.oldLog.apply(this, arguments);
        };

        console.error = function () {
            global.JUILogger.output([].join.call(arguments, ''), levelColor.error);
            this.oldLog.apply(this, arguments);
        };

        console.info = function () {
            global.JUILogger.output([].join.call(arguments, ''), levelColor.info);
            this.oldLog.apply(this, arguments);
        };

        console.debug = function () {
            global.JUILogger.output([].join.call(arguments, ''), levelColor.debug);
            this.oldLog.apply(this, arguments);
        };
    })();

    var JUILogger = function () {
        // 类属性
    }

    JUILogger.prototype.UI = function () {

        var self = this;

        var initUI = function () {

            btn.className = 'juilogger-btn';
            container.className = 'juilogger-container';
            output.className = 'juilogger-output';
            input.className = 'juilogger-input';
            input.placeholder = 'input...';

            document.body.appendChild(btn);
            document.body.appendChild(container);
            container.appendChild(output);
            container.appendChild(input);

        }

        var initCSS = function () {

            btn.style.width = '20px';
            btn.style.height = '52px'
            btn.style.lineHeight = '52px'
            btn.style.color = 'white';
            btn.style.backgroundColor = '#020202';
            btn.style.position = 'fixed';
            btn.style.top = '0';
            btn.style.left = '0';
            btn.style.cursor = 'pointer';
            btn.style.textAlign = 'center';
            btn.innerHTML = '《';


            container.style.width = '400px';
            container.style.height = 'auto';
            container.style.minHeight = '50px';
            container.style.border = '#e3e3e3 1px solid';
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '20px';
            container.style.boxSizing = 'border-box';
            container.style.boxShadow = '6px 6px 3px #020202';
            container.style.opacity = '0.6';

            output.style.width = '100%';
            output.style.height = 'auto';
            output.style.maxHeight = '200px';
            output.style.padding = '0';
            output.style.margin = '0';
            output.style.minHeight = '0';
            output.style.overflowY = 'scroll';
            output.style.boxSizing = 'border-box';

            input.style.width = '100%';
            input.style.height = '30px';
            input.style.boxSizing = 'border-box';
            input.style.border = 'none';
            input.style.outline = 'none';
            input.style.margin = '0';
            input.style.minHeight = '0';
            input.style.paddingLeft = '10px';
            input.style.boxSizing = 'border-box';


        };

        var initEvent = function () {

            input.addEventListener('keydown', function (e) {

                if (e.which == 13) {
                    var cmdJson = input.value;
                    cmd.push(cmdJson);
                    self.input(input.value);
                    cmdIndex = cmd.length - 1;
                } else if (e.which == 38) {

                    if (cmdIndex == 0) {
                        input.value = cmd[0] ? cmd[0] : '';
                    } else {
                        input.value = cmd[cmdIndex];
                        cmdIndex--;
                    }

                } else if (e.which == 40) {

                    if (cmdIndex == cmd.length - 1) {
                        input.value = cmd[cmdIndex];
                    } else {

                        if (cmd[cmdIndex]) {
                            input.value = cmd[cmdIndex];
                            cmdIndex++;
                        } else {
                            input.value = '';
                        }

                    }

                }
            }, false);

            btn.addEventListener('click', function (e) {
                if (showConsole) {
                    showConsole = false;
                    btn.innerHTML = '》';
                    container.style.visibility = 'hidden';
                } else {
                    showConsole = true;
                    btn.innerHTML = '《';
                    container.style.visibility = 'visible';
                }
            }, false);

        };

        initUI();
        initCSS();
        initEvent();

    };

    JUILogger.prototype.input = function (value) {
        input.value = '';
        try {
            var res = window.eval(value);
            this.output(res);
        } catch (e) {
            console.log(e);
        }
    };

    JUILogger.prototype.output = function (value, level) {

        if (!level) {
            level = levelColor.default;
        }

        var li = document.createElement('li');
        li.innerHTML = '<span style="color:' + level + '">' + value + '</span>';
        li.style.borderBottom = '1px solid #ccc';
        li.style.fontSize = '12px';
        li.style.height = 'auto';
        li.style.minHeight = '20px';
        li.style.lineHeight = '20px';
        li.style.padding = '0px';
        li.style.paddingLeft = '10px';
        li.style.margin = '0';
        li.style.boxSizing = 'border-box';

        output.appendChild(li);

        li.scrollIntoView();
    };

    JUILogger.prototype.JSONFormater = function (json) {

        var p = [],
            push = function (m) {
                return '\\' + p.push(m) + '\\';
            },
            pop = function (m, i) {
                return p[i - 1]
            },
            tabs = function (count) {
                return new Array(count + 1).join('\t');
            };

        p = [];
        var out = "",
            indent = 0;

        // Extract backslashes and strings
        json = json
            .replace(/\\./g, push)
            .replace(/(".*?"|'.*?')/g, push)
            .replace(/\s+/, '');

        // Indent and insert newlines
        for (var i = 0; i < json.length; i++) {
            var c = json.charAt(i);

            switch (c) {
                case '{':
                case '[':
                    out += c + "\n" + tabs(++indent);
                    break;
                case '}':
                case ']':
                    out += "\n" + tabs(--indent) + c;
                    break;
                case ',':
                    out += ",\n" + tabs(indent);
                    break;
                case ':':
                    out += ": ";
                    break;
                default:
                    out += c;
                    break;
            }
        }

        // Strip whitespace from numeric arrays and put backslashes
        // and strings back in
        out = out
            .replace(/\[[\d,\s]+?\]/g, function (m) {
                return m.replace(/\s/g, '');
            })
            .replace(/\\(\d+)\\/g, pop) // strings
            .replace(/\\(\d+)\\/g, pop); // backslashes in strings

        return out;
    };

    JUILogger.prototype.version = version;

    JUILogger.prototype.author = author;

    JUILogger.prototype.name = name;

    JUILogger.prototype.start = function () {
        this.UI();
    };

    global.JUILogger = new JUILogger();

    console.log('Welcome to ' + global.JUILogger.name + ': ' + global.JUILogger.version);

})(window)