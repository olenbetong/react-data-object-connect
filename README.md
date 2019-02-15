# React Data Object Connect

Utilities to connect AppframeWeb data objects to React components. Higher order components for class components, and hooks for function components.

## Getting Started

### Installation

Install using npm

```
npm install --save @olenbetong/react-data-object-connect
```

or include the umd build in a script

```html
<script src="https://unpkg.com/@olenbetong/react-data-object-connect@latest/dist/data-object-connect.umd.min.js"></script>
```

### Usage

Use the connect and connectRow functions to create a higher order component that can be used to connect the data object to React components.

The connect function will pass all records to the component in a property named `data`, while the connectRow passes all the fields in the current row as properties to the component.

Example connecting to all records:

```jsx
import React from "react";
import { connect } from "@olenbetong/react-data-object-connect";

const MyListComponent = props => (
  <ul>
    {props.data.map(item => (
      <li key={item.PrimKey}>{item.Title}</li>
    ))}
  </ul>
);

const MyConnectedList = connect(dsMyDataObject)(MyListComponent);
```

Example connecting to a single record, and checking if it is modified:

```jsx
import React from 'react';
import { connectRow } from '@olenbetong/react-data-object-connect';

const MyRecordComponent = (props) => (
  <p>
	  {props.isDirty && <div>(Data not saved</div>)}
	  {props.Title}
  </p>
)

const MyConnectedComponent = connectRow(dsMyDataObject)(MyRecordComponent);
```

#### Properties

Status properties passed to the component:

- **canDelete** (bool) whether the data object allows deleting rows
- **canUpdate** (bool) whether the data object allows updating rows
- **canInsert** (bool) whether the data object allows inserting rows
- **currentIndex** (int) current index selected
- **isDirty** (bool) whether the currently selectec row has been modified
- **isDeleting** (bool) whether the data object is currently deleting a row
- **isLoading** (bool) whether the data object is currently loading data
- **isSaving** (bool) whether the data object is currently saving a record
- **loadError** (string) error message if the data failed to load

Function properties passed to the component:

- **onCancelEdit** used to cancel all changes made to the current record
- **onCurrentIndexChange** used to select a row by index
- **onEndEdit** used to attempt to save changes made to the current record
- **onDeleteRow** used to delete a row. A component connected to the current row will always delete the current row, otherwise an index can be passed
- **onFieldChange** used to update a field in the current row (name of field and value as parameters)
- **onFieldsChange** used to update multiple fields in the current row (object with field names as keys, and values as values)
- **onRefreshData** used to refresh data
- **onRefreshRow** used to refresh only the current row
- **onSetParameter** used to set a parameter on the data object

## Hooks

If using a React with hooks, there are also data object hooks available.

- useCurrentIndex(dataObject) - Returns only the current index
- useCurrentRow(dataObject) - Returns the current record
- useData(dataObject) - Returns an array with all records currently in the data object
- useDirty(dataObject) - Returns a boolean indicating if the current row is dirty or not
- useError(dataObject) - Returns any loading error message
- useLoading(dataObject) - Returns a boolean indicating if the data object is loading or not
- useStatus(dataObject) - Returns booleans indicating if the data object is saving or deleting records
- usePermissions(dataObject) - Returns booleans indicating if the user can delete, insert or update records

The above hooks uses the data objects internal state to pass data to the components. If you do not want to depend on the data objects current row or data storage, you can use the following hooks. They return data from the data object's data handler directly, and will not affect the data objects internal state.

- useFetchData(dataObject, filter) - Returns data matching the filter
- useFetchRecord(dataObject, filter) - Use if the filter is expected to only return a single row. If multiple rows are returned from the server, only the first record will be returned to the component.

### Examples

#### Getting all state from the data object

This will list all reacords in the data object, and create an editor for the current row.

```jsx
import {
  useCurrentIndex,
  useCurrentRow,
  useData,
  useDirty,
  useError,
  useLoading,
  useStatus,
  usePermissions
} from "@olenbetong/react-data-object-connect";

function MyFunctionComponent(props) {
  const currentIndex = useCurrentIndex(dsMyDataObject);
  const myRecord = useCurrentRow(dsMyDataObject);
  const myRecords = useData(dsMyDataObject);
  const isDirty = useDirty(dsMyDataObject);
  const error = useError(dsMyDataObject);
  const isLoading = useLoading(dsMyDataObject);
  const { isDeleting, isSaving } = useStatus(dsMyDataObject);
  const { allowDelete, allowInsert, allowUpdate } = usePermissions(
    dsMyDataObject
  );

  return (
    <div>
      {isLoading && <i className="fa fa-spin fa-spinner" />}
      {error && <Error message={error} />}
      <MyEditor {...myRecord} isDirty={isDirty} />
      {myRecords.map(record => (
        <ListItem {...item} />
      ))}
    </div>
  );
}
```

#### Getting data from the data source without affecting the data object

```jsx
import {
  useFetchData,
  useFetchRecord
} from "@olenbetong/react-data-object-connect";

function MyFunctionComponent(props) {
  const { isLoading, data, refresh } = useFetchData(
    dsMyDataObject,
    `[EntityCategory] = 1`
  );

  return (
    <div>
      {isLoading && <i className="fa fa-spin fa-spinner" />}
      {data.map(data => (
        <ListItem {...item} />
      ))}
    </div>
  );
}

function MyRecordComponent(props) {
  const { isLoading, record, refresh } = useFetchRecord(
    dsMyDataObject,
    `[EntityID] = ${props.id}`
  );

  return (
    <div>
      {isLoading && <Spinner />}
      <button onClick={refresh}>
        <i className="fa fa-refresh" /> Refresh
      </button>
      <MyEditor {...record} />
    </div>
  );
}
```

## Changelog

### [2.1.5] - 2019-02-15

- Initial isLoading state will now check the data object's isDataLoading()

### [2.1.1] - 2019-01-31

#### Changed

- [FIXED] Missing property "type" on the supplied filter element!

### [2.1.0] - 2019-01-31

#### Changed

- The filter argument passed to the useFetchRecord and useFetchData can now be a filter object

#### Added

- connectRow alias to connect to a row without second parameter.
- getData - the function used by useFetchRecord and useFetchData is now exported

#### Deprecated

- dataObjectConnect has been renamed to connect
- useSingleRow has been renamed to useFetchRecord
- useDataWithoutState has been renamed to useFetchData

### [2.0.1] - 2019-01-30

#### Added

- Added useDataWithoutState hook

#### Breaking changes

- Hooks are now top level exports instead of children of dataObjectHooks

### [1.1.0] - 2019-01-28

#### Added

- Added useSingleRow hook

[2.1.5]: https://github.com/olenbetong/react-data-object-connect/compare/v2.1.1...v2.1.5
[2.1.1]: https://github.com/olenbetong/react-data-object-connect/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/olenbetong/react-data-object-connect/compare/v2.0.0...v2.1.0
[2.0.1]: https://github.com/olenbetong/react-data-object-connect/compare/v1.1.0...v2.0.1
[1.1.0]: https://github.com/olenbetong/react-data-object-connect/compare/v1.0.1...v1.1.0
