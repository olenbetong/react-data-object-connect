function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

const { React } = window;
const PureComponent = React.PureComponent;
const Component = React.Component;
const useState = React.useState;
const useEffect = React.useEffect;

function useCurrentIndex(dataObject) {
  var _useState = useState(dataObject.getCurrentIndex()),
      _useState2 = _slicedToArray(_useState, 2),
      index = _useState2[0],
      setIndex = _useState2[1];

  useEffect(function () {
    dataObject.attachEvent("onCurrentIndexChanged", setIndex);
    setIndex(dataObject.getCurrentIndex());
    return function () {
      return dataObject.detachEvent("onCurrentIndexChanged", setIndex);
    };
  }, [dataObject]);
  return index;
}
var dataUpdateEvents = ["onFieldChanged", "onRecordCreated", "onRecordDeleted", "onRecordRefreshed", "onAfterSave", "onCancelEdit", "onDataLoaded"];
function useCurrentRow(dataObject) {
  var _useState3 = useState({}),
      _useState4 = _slicedToArray(_useState3, 2),
      record = _useState4[0],
      setRecord = _useState4[1];

  function updateRecord() {
    setRecord(dataObject.currentRow());
  }

  useEffect(function () {
    var recordUpdateEvents = ["onCurrentIndexChanged"].concat(dataUpdateEvents);
    recordUpdateEvents.forEach(function (event) {
      return dataObject.attachEvent(event, updateRecord);
    });
    updateRecord();
    return function () {
      return recordUpdateEvents.forEach(function (event) {
        return dataObject.detachEvent(event, updateRecord);
      });
    };
  }, [dataObject]);
  return record;
}
function useData(dataObject) {
  var _useState5 = useState([]),
      _useState6 = _slicedToArray(_useState5, 2),
      data = _useState6[0],
      setData = _useState6[1];

  function updateData() {
    setData(dataObject.getData());
  }

  useEffect(function () {
    dataUpdateEvents.forEach(function (event) {
      return dataObject.attachEvent(event, updateData);
    });
    updateData();
    return function () {
      return dataUpdateEvents.forEach(function (event) {
        return dataObject.detachEvent(event, updateData);
      });
    };
  }, [dataObject]);
  return data;
}
function useDirty(dataObject) {
  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      isDirty = _useState8[0],
      setDirty = _useState8[1];

  useEffect(function () {
    dataObject.attachEvent("onDirtyChanged", setDirty);
    setDirty(dataObject.isDirty());
    return function () {
      dataObject.detachEvent("onDirtyChanged", setDirty);
    };
  }, [dataObject]);
  return isDirty;
}
function useError(dataObject) {
  var _useState9 = useState(null),
      _useState10 = _slicedToArray(_useState9, 2),
      loadError = _useState10[0],
      setError = _useState10[1];

  useEffect(function () {
    dataObject.attachEvent("onDataLoadFailed", setError);
    return function () {
      dataObject.detachEvent("onDataLoadFailed", setError);
    };
  }, [dataObject]);
  return loadError;
}
function useLoading(dataObject) {
  var _useState11 = useState(dataObject.isDataLoading()),
      _useState12 = _slicedToArray(_useState11, 2),
      isLoading = _useState12[0],
      setLoading = _useState12[1];

  function setIsLoading() {
    setLoading(true);
  }

  function setIsNotLoading() {
    setLoading(false);
  }

  useEffect(function () {
    dataObject.attachEvent("onBeforeLoad", setIsLoading);
    dataObject.attachEvent("onDataLoaded", setIsNotLoading);
    dataObject.attachEvent("onDataLoadFailed", setIsNotLoading);
    setLoading(dataObject.isDataLoading);
    return function () {
      dataObject.detachEvent("onBeforeLoad", setIsLoading);
      dataObject.detachEvent("onDataLoaded", setIsNotLoading);
      dataObject.detachEvent("onDataLoadFailed", setIsNotLoading);
    };
  }, [dataObject]);
  return isLoading;
}
function useStatus(dataObject) {
  var _useState13 = useState(false),
      _useState14 = _slicedToArray(_useState13, 2),
      isSaving = _useState14[0],
      setIsSaving = _useState14[1];

  var _useState15 = useState(false),
      _useState16 = _slicedToArray(_useState15, 2),
      isDeleting = _useState16[0],
      setIsDeleting = _useState16[1];

  function setSaving() {
    setIsSaving(true);
  }

  function setNotSaving() {
    setIsSaving(false);
  }

  function setDeleting() {
    setIsDeleting(true);
  }

  function setNotDeleting() {
    setIsDeleting(false);
  }

  useEffect(function () {
    dataObject.attachEvent("onBeforeSave", setSaving);
    dataObject.attachEvent("onAfterSave", setNotSaving);
    dataObject.attachEvent("onSaveFailed", setNotSaving);
    dataObject.attachEvent("onRecordDeleting", setDeleting);
    dataObject.attachEvent("onRecordDeleted", setNotDeleting);
    return function () {
      dataObject.detachEvent("onBeforeSave", setSaving);
      dataObject.detachEvent("onAfterSave", setNotSaving);
      dataObject.detachEvent("onSaveFailed", setNotSaving);
      dataObject.detachEvent("onRecordDeleting", setDeleting);
      dataObject.detachEvent("onRecordDeleted", setNotDeleting);
    };
  }, [dataObject]);
  return {
    isDeleting: isDeleting,
    isSaving: isSaving
  };
}
function usePermissions(dataObject) {
  var _useState17 = useState(dataObject.isDeleteAllowed()),
      _useState18 = _slicedToArray(_useState17, 2),
      allowDelete = _useState18[0],
      setAllowDelete = _useState18[1];

  var _useState19 = useState(dataObject.isInsertAllowed()),
      _useState20 = _slicedToArray(_useState19, 2),
      allowInsert = _useState20[0],
      setAllowInsert = _useState20[1];

  var _useState21 = useState(dataObject.isUpdateAllowed()),
      _useState22 = _slicedToArray(_useState21, 2),
      allowUpdate = _useState22[0],
      setAllowUpdate = _useState22[1];

  useEffect(function () {
    dataObject.attachEvent("onAllowDeleteChanged", setAllowDelete);
    dataObject.attachEvent("onAllowInsertChanged", setAllowInsert);
    dataObject.attachEvent("onAllowUpdateChanged", setAllowUpdate);
    return function () {
      dataObject.detachEvent("onAllowDeleteChanged", setAllowDelete);
      dataObject.detachEvent("onAllowInsertChanged", setAllowInsert);
      dataObject.detachEvent("onAllowUpdateChanged", setAllowUpdate);
    };
  }, [dataObject]);
  return {
    allowDelete: allowDelete,
    allowInsert: allowInsert,
    allowUpdate: allowUpdate
  };
}

export { useCurrentIndex, useCurrentRow, useData, useDirty, useError, useLoading, useStatus, usePermissions };
