function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var dataObjectConnect = function dataObjectConnect(dataObject) {
  var currentRowOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return function connect(WrappedComponent) {
    var connector =
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(connector, _React$Component);

      function connector(props) {
        var _this;

        _classCallCheck(this, connector);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(connector).call(this, props));
        _this.handleAllowDeleteChanged = _this.handleAllowDeleteChanged.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleAllowUpdateChanged = _this.handleAllowUpdateChanged.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleAllowInsertChanged = _this.handleAllowInsertChanged.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleSaveFailed = _this.handleSaveFailed.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handlePartialDataLoaded = _this.handlePartialDataLoaded.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleDataLoadFailed = _this.handleDataLoadFailed.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleFieldChanged = _this.handleFieldChanged.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleRecordCreated = _this.handleRecordCreated.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleRecordRefreshed = _this.handleRecordRefreshed.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleRecordDeleting = _this.handleRecordDeleting.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleRecordDeleted = _this.handleRecordDeleted.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleAfterSave = _this.handleAfterSave.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleBeforeSave = _this.handleBeforeSave.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleBeforeLoad = _this.handleBeforeLoad.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleCancelEdit = _this.handleCancelEdit.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleCurrentIndexChanged = _this.handleCurrentIndexChanged.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleDataLoaded = _this.handleDataLoaded.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.handleDirtyChanged = _this.handleDirtyChanged.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.setFieldValue = _this.setFieldValue.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.setFieldValues = _this.setFieldValues.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        var initialState = {};

        if (currentRowOnly) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = dataObject.getFields()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var field = _step.value;
              initialState[field.name] = null;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } else {
          initialState.data = [];
        }

        _this.state = Object.assign({
          canDelete: dataObject.isDeleteAllowed(),
          canUpdate: dataObject.isUpdateAllowed(),
          canInsert: dataObject.isInsertAllowed(),
          currentIndex: dataObject.getCurrentIndex(),
          isDirty: dataObject.isDirty(),
          isDeleting: false,
          isLoading: false,
          isSaving: false,
          loadError: null,
          saveFailed: false
        }, initialState);
        return _this;
      }

      _createClass(connector, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          dataObject.attachEvent('onAllowDeleteChanged', this.handleAllowDeleteChanged);
          dataObject.attachEvent('onAllowUpdateChanged', this.handleAllowUpdateChanged);
          dataObject.attachEvent('onAllowInsertChanged', this.handleAllowInsertChanged);
          dataObject.attachEvent('onSaveFailed', this.handleSaveFailed);
          dataObject.attachEvent('onPartialDataLoaded', this.handlePartialDataLoaded);
          dataObject.attachEvent('onDataLoadFailed', this.handleDataLoadFailed);
          dataObject.attachEvent('onFieldChanged', this.handleFieldChanged);
          dataObject.attachEvent('onRecordCreated', this.handleRecordCreated);
          dataObject.attachEvent('onRecordRefreshed', this.handleRecordRefreshed);
          dataObject.attachEvent('onRecordDeleting', this.handleRecordDeleting);
          dataObject.attachEvent('onRecordDeleted', this.handleRecordDeleted);
          dataObject.attachEvent('onAfterSave', this.handleAfterSave);
          dataObject.attachEvent('onBeforeLoad', this.handleBeforeLoad);
          dataObject.attachEvent('onBeforeSave', this.handleBeforeSave);
          dataObject.attachEvent('onCancelEdit', this.handleCancelEdit);
          dataObject.attachEvent('onCurrentIndexChanged', this.handleCurrentIndexChanged);
          dataObject.attachEvent('onDataLoaded', this.handleDataLoaded);
          dataObject.attachEvent('onDirtyChanged', this.handleDirtyChanged);
          this.updateData();
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          dataObject.detachEvent('onAllowDeleteChanged', this.handleAllowDeleteChanged);
          dataObject.detachEvent('onAllowUpdateChanged', this.handleAllowUpdateChanged);
          dataObject.detachEvent('onAllowInsertChanged', this.handleAllowInsertChanged);
          dataObject.detachEvent('onSaveFailed', this.handleSaveFailed);
          dataObject.detachEvent('onPartialDataLoaded', this.handlePartialDataLoaded);
          dataObject.detachEvent('onDataLoadFailed', this.handleDataLoadFailed);
          dataObject.detachEvent('onFieldChanged', this.handleFieldChanged);
          dataObject.detachEvent('onRecordCreated', this.handleRecordCreated);
          dataObject.detachEvent('onRecordRefreshed', this.handleRecordRefreshed);
          dataObject.detachEvent('onRecordDeleting', this.handleRecordDeleting);
          dataObject.detachEvent('onRecordDeleted', this.handleRecordDeleted);
          dataObject.detachEvent('onAfterSave', this.handleAfterSave);
          dataObject.detachEvent('onBeforeLoad', this.handleBeforeLoad);
          dataObject.detachEvent('onBeforeSave', this.handleBeforeSave);
          dataObject.detachEvent('onCancelEdit', this.handleCancelEdit);
          dataObject.detachEvent('onCurrentIndexChanged', this.handleCurrentIndexChanged);
          dataObject.detachEvent('onDataLoaded', this.handleDataLoaded);
          dataObject.detachEvent('onDirtyChanged', this.handleDirtyChanged);
        }
      }, {
        key: "cancelEdit",
        value: function cancelEdit() {
          dataObject.cancelEdit();
        }
      }, {
        key: "deleteRow",
        value: function deleteRow(idx) {
          return new Promise(function (resolve) {
            var callback = function callback(error, data) {
              resolve({
                data: data,
                error: error
              });
            };

            if (currentRowOnly) {
              dataObject.deleteCurrentRow(callback);
            } else {
              dataObject.deleteRow(idx, callback);
            }
          });
        }
      }, {
        key: "endEdit",
        value: function endEdit(callback) {
          return new Promise(function (resolve) {
            dataObject.endEdit(function (error, data) {
              'function' === typeof callback && callback(error, data);
              resolve({
                data: data,
                error: error
              });
            });
          });
        }
      }, {
        key: "updateData",
        value: function updateData() {
          var otherState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          if (currentRowOnly) {
            var record = dataObject.currentRow();
            this.setState(Object.assign(record, otherState));
          } else {
            var data = dataObject.getData();
            var current = dataObject.currentRow();
            this.setState(Object.assign({
              current: current,
              data: data
            }, otherState));
          }
        }
      }, {
        key: "handleAllowDeleteChanged",
        value: function handleAllowDeleteChanged(allowed) {
          this.setState({
            canDelete: allowed
          });
        }
      }, {
        key: "handleAllowUpdateChanged",
        value: function handleAllowUpdateChanged(allowed) {
          this.setState({
            canUpdate: allowed
          });
        }
      }, {
        key: "handleAllowInsertChanged",
        value: function handleAllowInsertChanged(allowed) {
          this.setState({
            canInsert: allowed
          });
        }
      }, {
        key: "handleSaveFailed",
        value: function handleSaveFailed() {
          this.setState({
            saveFailed: true
          });
        }
      }, {
        key: "handlePartialDataLoaded",
        value: function handlePartialDataLoaded() {}
      }, {
        key: "handleDataLoadFailed",
        value: function handleDataLoadFailed(loadError) {
          if (loadError) {
            this.setState({
              isLoading: false,
              loadError: loadError
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        }
      }, {
        key: "handleFieldChanged",
        value: function handleFieldChanged(_ref) {
          var name = _ref.name,
              value = _ref.value;
          this.updateData();
        }
      }, {
        key: "handleRecordCreated",
        value: function handleRecordCreated() {
          this.updateData();
        }
      }, {
        key: "handleRecordRefreshed",
        value: function handleRecordRefreshed() {
          this.updateData();
        }
      }, {
        key: "handleRecordDeleting",
        value: function handleRecordDeleting() {
          this.setState({
            isDeleting: true
          });
        }
      }, {
        key: "handleRecordDeleted",
        value: function handleRecordDeleted() {
          this.updateData({
            isDeleting: false
          });
        }
      }, {
        key: "handleAfterSave",
        value: function handleAfterSave() {
          this.updateData({
            isSaving: false
          });
        }
      }, {
        key: "handleBeforeLoad",
        value: function handleBeforeLoad() {
          this.setState({
            isLoading: true
          });
        }
      }, {
        key: "handleBeforeSave",
        value: function handleBeforeSave() {
          this.setState({
            isSaving: true,
            saveFailed: false
          });
        }
      }, {
        key: "handleCancelEdit",
        value: function handleCancelEdit() {
          this.updateData({
            isSaving: false
          });
        }
      }, {
        key: "handleCurrentIndexChanged",
        value: function handleCurrentIndexChanged(currentIndex) {
          if (currentRowOnly) {
            this.updateData();
          } else {
            this.updateData();
            this.setState({
              currentIndex: currentIndex
            });
          }
        }
      }, {
        key: "handleDataLoaded",
        value: function handleDataLoaded() {
          this.updateData({
            isLoading: false,
            isSaving: false,
            isDeleting: false,
            saveFailed: false
          });
        }
      }, {
        key: "handleDirtyChanged",
        value: function handleDirtyChanged() {
          this.setState({
            isDirty: dataObject.isDirty()
          });
        }
      }, {
        key: "refreshData",
        value: function refreshData(callback) {
          return new Promise(function (resolve) {
            dataObject.refreshDataSource(function (error, data) {
              'function' === typeof callback && callback(error, data);
              resolve({
                data: data,
                error: error
              });
            });
          });
        }
      }, {
        key: "refreshRow",
        value: function refreshRow(callback) {
          return new Promise(function (resolve) {
            dataObject.refreshCurrentRow(function (error, data) {
              'function' === typeof callback && callback(error, data);
              resolve({
                data: data,
                error: error
              });
            });
          });
        }
      }, {
        key: "setFieldValue",
        value: function setFieldValue(name, value) {
          dataObject.currentRow(name, value);
          this.updateData();
        }
      }, {
        key: "setFieldValues",
        value: function setFieldValues(fields) {
          for (var field in fields) {
            if (fields.hasOwnProperty(field)) {
              dataObject.currentRow(field, fields[field]);
            }
          }

          this.updateData();
        }
      }, {
        key: "setCurrentIndex",
        value: function setCurrentIndex(idx) {
          dataObject.setCurrentIndex(idx);
        }
      }, {
        key: "setParameter",
        value: function setParameter() {
          dataObject.setParameter.apply(dataObject, arguments);
        }
      }, {
        key: "render",
        value: function render() {
          return React.createElement(WrappedComponent, _extends({}, this.state, {
            onCancelEdit: this.cancelEdit,
            onCurrentIndexChange: this.setCurrentIndex,
            onDeleteRow: this.deleteRow,
            onEndEdit: this.endEdit,
            onFieldChange: this.setFieldValue,
            onFieldsChange: this.setFieldValues,
            onRefreshData: this.refreshData,
            onRefreshRow: this.refreshRow,
            onSetParameter: this.setParameter
          }, this.props));
        }
      }]);

      return connector;
    }(React.Component);

    function getDisplayName() {
      return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }

    connector.displayName = "".concat(dataObject.getDataSourceId(), "(").concat(getDisplayName(), ")");
    return connector;
  };
};

dataObjectConnect.properties = ['onCancelEdit', 'onCurrentIndexChange', 'onEndEdit', 'onDeleteRow', 'onFieldChange', 'onFieldsChange', 'onRefreshData', 'onRefreshRow', 'onSetParameter', 'canDelete', 'canUpdate', 'canInsert', 'currentIndex', 'isDirty', 'isDeleting', 'isLoading', 'isSaving', 'loadError', 'saveFailed'];

export default dataObjectConnect;
