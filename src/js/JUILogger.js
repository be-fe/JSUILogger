// Mini Hi 在调试过程中有些问题, 控制台无法使用,因而我做了这个工具,用来解决这个问题.

(function (global) {

    // 全局不可变变量
    var name = 'JSUILogger';
    var version = '1.0.0';
    var author = 'leiquan';
    var console = global.console;
    var wraper = document.createElement('div');
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
        log: 'purple',
        info: 'green',
        default: '#555',
        input: '#cf4646'
    };
    var showConsole = true;

    // 覆盖原生的 console.log
    (function () {
        console.oldLog = console.log;

        console.log = function () {
            global.JSUILogger.output([].join.call(arguments, ''), levelColor.log);
            this.oldLog.apply(this, arguments);
        };

        console.debug = function () {
            global.JSUILogger.output([].join.call(arguments, ''), levelColor.debug);
            this.oldLog.apply(this, arguments);
        };

        console.error = function () {
            global.JSUILogger.output([].join.call(arguments, ''), levelColor.error);
            this.oldLog.apply(this, arguments);
        };

        console.info = function () {
            global.JSUILogger.output([].join.call(arguments, ''), levelColor.info);
            this.oldLog.apply(this, arguments);
        };

        console.debug = function () {
            global.JSUILogger.output([].join.call(arguments, ''), levelColor.debug);
            this.oldLog.apply(this, arguments);
        };
    })();

    var JSUILogger = function () {
        // 类属性
    }

    JSUILogger.prototype.UI = function () {

        var self = this;

        var initUI = function () {

            wraper.className = 'JSUILogger-wraper';
            btn.className = 'JSUILogger-btn';
            container.className = 'JSUILogger-container';
            output.className = 'JSUILogger-output';
            input.className = 'JSUILogger-input';
            input.placeholder = 'input...';
            input.autofocus = 'autofocus';

            document.body.appendChild(wraper);

            wraper.appendChild(btn);
            wraper.appendChild(container);
            container.appendChild(output);
            container.appendChild(input);

        }

        var initCSS = function () {

            wraper.style.width = '100%';
            wraper.style.height = 'auto';
            wraper.style.position = 'fixed';
            wraper.style.top = '0';
            wraper.style.left = '0';
            wraper.zIndex = '10000';

            btn.style.width = '40px';
            btn.style.height = '63px'
            btn.style.lineHeight = '63px'
            btn.style.color = 'white';
            btn.style.backgroundColor = '#020202';
            btn.zIndex = '9999';

            btn.style.float = 'left';
            btn.style.cursor = 'pointer';
            btn.style.textAlign = 'center';
            btn.innerHTML = '《';
            btn.style.userSelect = 'none';


            container.style.width = '600px';
            container.style.height = 'auto';
            container.style.minHeight = '50px';
            container.style.border = '#e3e3e3 1px solid';
            container.style.marginLeft = '40px';
            container.style.boxSizing = 'border-box';
            container.style.opacity = '0.6';
            container.style.boxShadow = '0px 6px 5px #020202';
            container.zIndex = '9999';

            output.style.width = '100%';
            output.style.height = 'auto';
            output.style.maxHeight = '200px';
            output.style.padding = '0';
            output.style.margin = '0';
            output.style.minHeight = '0';
            output.style.overflowY = 'scroll';
            output.style.boxSizing = 'border-box';
            output.zIndex = '9999';

            input.style.width = '100%';
            input.style.height = '35px';
            input.style.boxSizing = 'border-box';
            input.style.border = 'none';
            input.style.outline = 'none';
            input.style.margin = '0';
            input.style.minHeight = '0';
            input.style.paddingLeft = '10px';
            input.style.boxSizing = 'border-box';
            input.style.fontSize = '14px';
            input.zIndex = '9999';

        };

        var initEvent = function () {

            input.addEventListener('keydown', function (e) {

                if (e.which == 13) {
                    var cmdJson = input.value;
                    cmd.push(cmdJson);

                    self.output(cmdJson, levelColor.input);

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

    JSUILogger.prototype.input = function (value) {

        // 这里首先要对 input 进行初步处理
        input.value = '';
        if (value.charAt(0) == ':') {
            this.optionHandle(value);
        } else {
            try {
                var res = window.eval(value);
                this.output(res);
            } catch (e) {
                console.log(e);
            }
        }
    };

    JSUILogger.prototype.output = function (value, level) {

        if (!level) {
            level = levelColor.default;
        }

        var li = document.createElement('li');
        li.innerHTML = '<span style="color:' + level + '">' + value + '</span>';
        li.style.borderBottom = '1px solid #ccc';
        li.style.fontSize = '14px';
        li.style.height = 'auto';
        li.style.minHeight = '25px';
        li.style.lineHeight = '25px';
        li.style.padding = '0px';
        li.style.paddingLeft = '10px';
        li.style.margin = '0';
        li.style.boxSizing = 'border-box';

        output.appendChild(li);

        li.scrollIntoView();
    };

    // 指令处理
    JSUILogger.prototype.optionHandle = function (opt) {
        var option = opt.substr(1, opt.length);

        if (option == 'clear') {
            alert('清除');
        }
        else if (option == 'close') {
            alert('关闭');
        }
        else if (option == 'filter') {
            alert('filter');
        }
    }

    JSUILogger.prototype.JSONFormater = function (json) {

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

    JSUILogger.prototype.version = version;

    JSUILogger.prototype.author = author;

    JSUILogger.prototype.name = name;

    JSUILogger.prototype.start = function () {
        this.UI();
    };

    global.JSUILogger = new JSUILogger();

    console.debug('Welcome to ' + global.JSUILogger.name + ': ' + global.JSUILogger.version);

})(window)