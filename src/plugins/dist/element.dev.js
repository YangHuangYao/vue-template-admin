"use strict";

var _vue = _interopRequireDefault(require("vue"));

require("element-ui/lib/theme-chalk/index.css");

var _elementUi = require("element-ui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_elementUi.Button);

_vue["default"].use(_elementUi.Dialog);

_vue["default"].use(_elementUi.Breadcrumb);

_vue["default"].use(_elementUi.BreadcrumbItem);

_vue["default"].use(_elementUi.Menu);

_vue["default"].use(_elementUi.Submenu);

_vue["default"].use(_elementUi.MenuItem);

_vue["default"].use(_elementUi.MenuItemGroup);

_vue["default"].use(_elementUi.Input);

_vue["default"].use(_elementUi.InputNumber);

_vue["default"].use(_elementUi.Radio);

_vue["default"].use(_elementUi.RadioGroup);

_vue["default"].use(_elementUi.RadioButton);

_vue["default"].use(_elementUi.Checkbox);

_vue["default"].use(_elementUi.CheckboxButton);

_vue["default"].use(_elementUi.CheckboxGroup);

_vue["default"].use(_elementUi.Switch);

_vue["default"].use(_elementUi.Select);

_vue["default"].use(_elementUi.Option);

_vue["default"].use(_elementUi.OptionGroup);

_vue["default"].use(_elementUi.Table);

_vue["default"].use(_elementUi.TableColumn);

_vue["default"].use(_elementUi.Pagination);

_vue["default"].use(_elementUi.Form);

_vue["default"].use(_elementUi.FormItem);

_vue["default"].use(_elementUi.Icon);

_vue["default"].use(_elementUi.Row);

_vue["default"].use(_elementUi.Col);

_vue["default"].use(_elementUi.DatePicker);

_vue["default"].use(_elementUi.TimeSelect);

_vue["default"].use(_elementUi.TimePicker);

_vue["default"].use(_elementUi.Loading.directive);

_vue["default"].prototype.$loading = _elementUi.Loading.service;
_vue["default"].prototype.$msgbox = _elementUi.MessageBox;
_vue["default"].prototype.$alert = _elementUi.MessageBox.alert;
_vue["default"].prototype.$confirm = _elementUi.MessageBox.confirm;
_vue["default"].prototype.$prompt = _elementUi.MessageBox.prompt;
_vue["default"].prototype.$message = _elementUi.Message;