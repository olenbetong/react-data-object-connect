# React Data Object Connect

Utilities to connect AppframeWeb data objects to React components. Higher order components for class components, and hooks for function components.

## Getting Started

### Installation

Install using npm

```sh
npm install @olenbetong/react-data-object-connect
```

or include the umd build in a script

```html
<script src="https://unpkg.com/@olenbetong/react-data-object-connect@4.0.0/dist/iife/index.min.js"></script>
```

### Hooks or connect/connectRow?

This package provides 2 primary ways of connecting React components to Appframe data objects: the connect/connectRow HoC components, and hooks. `connect`/`connectRow` provide most of the state from the data objects, while with hooks you might need to use several hooks to get the information you need.

Not sure if you should use the connect/connectRow functions, or the hooks? If you are using a React version > 16.8, it is recommended to only use the hooks, as they are more flexible, and usually result in smaller bundles.

## Hooks

If using a React with hooks, there are also data object hooks available.

- **useCurrentIndex**(dataObject) - Returns only the current index
- **useCurrentRow**(dataObject) - Returns the current record
- **useData**(dataObject) - Returns an array with all records currently in the data object
- **useDataWithFilter**(dataObject, filter, type) - Like useData, but loads data with the given filter. Type can be filterString or whereClause (defaults to filterString) and must be a string
- **useDirty**(dataObject) - Returns a boolean indicating if the current row is dirty or not
- **useError**(dataObject) - Returns any loading error message
- **useLoading**(dataObject) - Returns a boolean indicating if the data object is loading or not
- **useStatus**(dataObject) - Returns booleans indicating if the data object is saving or deleting records
- **usePermissions**(dataObject) - Returns booleans indicating if the user can delete, insert or update records

The above hooks uses the data objects internal state to pass data to the components. If you do not want to depend on the data objects current row or data storage, you can use the following hooks. They return data from the data object's data handler directly, and will not affect the data objects internal state.

- useFetchData(dataObject, filter) - Returns data matching the filter
- useFetchRecord(dataObject, filter) - Use if the filter is expected to only return a single row. If multiple rows are returned from the server, only the first record will be returned to the component.

One hook is also available for procedures.

- useProcedure(procedure, parameters) - Returns an object containing `data`, `isExecuting` and `error` properties. Executes whenever the procedure or parameters arguments change.

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

Automatically getting data with a given filter

```jsx
import {
  useDataWithFilter,
  useLoading
} from "@olenbetong/react-data-object-connect";

function MyComponent({ someId }) {
  const isLoading = useLoading(dsMyDataObject);
  const data = useDataWithFilter(dsMyDataObject, `[SomeID] = ${someId}`);

  return (
    <div>
      {isLoading && <i className="fa fa-spin fa-spinner" />}
      {data.map(record => (
        <ListItem {...record} />
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

#### Executing a stored procedure

```jsx
import { useProcedure } from "@olenbetong/react-data-object-connect";

function MyComponent() {
  const { data, error, isExecuting } = useProcedure(
    procMyProcedure,
    {
      Parameter: "value",
      OtherParam: 52,
      ThirdParam: "Oh, hai!"
    }
  );

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      {isExecuting && <Spinner />}
      {data && data.length > 0 && data[0].map(record => (
        <RecordComponent key={record.IdentityField} {...record} />
      )}
  )
}
```

## connect/connectRow

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

### Properties

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

## Reducing script size

### Bundlers (webpack/rollup/parcel etc.)

In the node package, the scripts are located in the `es` folder, and you can include the parts you need instead of the whole package.

For example, if you only use the `useData` hook, import it like this:

```js
import useData from "@olenbetong/react-data-object-connect/es/useData";
```

Or for the `connect`/`connectRow` functions:

```js
import { connect, connectRow } from "@olenbetong/react-data-object-connect/es/connect";
```

### Browser

In the `dist/iife` there are a few files you can choose to add. If you only need hooks, use `hooks.min.js`, which exports all the hooks in global variable `dataObjectHooks`. `connect.min.js` exports the connect and connectRow functions in global variable `dataObjectConnect`.

## Changelog

See the GitHub [releases] page

[releases]: https://github.com/olenbetong/react-data-object-connect/releases