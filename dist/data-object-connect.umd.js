(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.dataObjectConnect = factory());
}(this, (function () { 'use strict';

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
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

  var events = ['AllowDeleteChanged', 'AllowUpdateChanged', 'AllowInsertChanged', 'SaveFailed', 'PartialDataLoaded', 'DataLoadFailed', 'FieldChanged', 'RecordCreated', 'RecordRefreshed', 'RecordDeleting', 'RecordDeleted', 'AfterSave', 'BeforeLoad', 'BeforeSave', 'CancelEdit', 'CurrentIndexChanged', 'DataLoaded', 'DirtyChanged'];

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

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "updateData", function () {
            var otherState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (currentRowOnly) {
              var record = dataObject.currentRow();

              _this.setState(Object.assign(record, otherState));
            } else {
              var data = dataObject.getData();
              var current = dataObject.currentRow();

              _this.setState(Object.assign({
                current: current,
                data: data
              }, otherState));
            }
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleAllowDeleteChanged", function (allowed) {
            return _this.setState({
              canDelete: allowed
            });
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleAllowUpdateChanged", function (allowed) {
            return _this.setState({
              canUpdate: allowed
            });
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleAllowInsertChanged", function (allowed) {
            return _this.setState({
              canInsert: allowed
            });
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleSaveFailed", function () {
            return _this.setState({
              saveFailed: true
            });
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handlePartialDataLoaded", function () {
            return null;
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleDataLoadFailed", function (loadError) {
            if (loadError) {
              _this.setState({
                isLoading: false,
                loadError: loadError
              });
            } else {
              _this.setState({
                isLoading: false
              });
            }
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleFieldChanged", _this.updateData);

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleRecordCreated", _this.updateData);

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleRecordRefreshed", _this.updateData);

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleRecordDeleting", function () {
            return _this.setState({
              isDeleting: true
            });
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleRecordDeleted", function () {
            return _this.updateData({
              isDeleting: false
            });
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleAfterSave", function () {
            return _this.updateData({
              isSaving: false
            });
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleBeforeLoad", function () {
            return _this.setState({
              isLoading: true
            });
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleBeforeSave", function () {
            return _this.setState({
              isSaving: true,
              saveFailed: false
            });
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleCancelEdit", function () {
            return _this.updateData({
              isSaving: false
            });
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleCurrentIndexChanged", function (currentIndex) {
            if (currentRowOnly) {
              _this.updateData();
            } else {
              _this.updateData();

              _this.setState({
                currentIndex: currentIndex
              });
            }
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleDataLoaded", function () {
            return _this.updateData({
              isLoading: false,
              isSaving: false,
              isDeleting: false,
              saveFailed: false
            });
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleDirtyChanged", function () {
            return _this.setState({
              isDirty: dataObject.isDirty()
            });
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setFieldValue", function (name, value) {
            dataObject.currentRow(name, value);

            _this.updateData();
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setFieldValues", function (fields) {
            for (var field in fields) {
              if (fields.hasOwnProperty(field)) {
                dataObject.currentRow(field, fields[field]);
              }
            }

            _this.updateData();
          });

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
            for (var _i = 0; _i < events.length; _i++) {
              var event = events[_i];
              dataObject.attachEvent('on' + event, this['handle' + event]);
            }

            this.updateData();
          }
        }, {
          key: "componentWillUnmount",
          value: function componentWillUnmount() {
            for (var _i2 = 0; _i2 < events.length; _i2++) {
              var event = events[_i2];
              dataObject.detachEvent('on' + event, this['handle' + event]);
            }
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

  return dataObjectConnect;

})));
