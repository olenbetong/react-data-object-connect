# React Data Object Connect

Hooks to connect AppframeWeb data objects to React components. 

## Getting Started

### Installation

Install using npm

```sh
npm install @olenbetong/react-data-object-connect
```

or include the IIFE build in a script

```html
<script src="https://unpkg.com/@olenbetong/react-data-object-connect@latest/dist/iife/dataObjectHooks.min.js"></script>
```

## Hooks

If using a React with hooks, there are also data object hooks available.

- **useCurrentIndex**(dataObject) - Returns only the current index
- **useCurrentRow**(dataObject) - Returns the current record
- **useData**(dataObject, options) - Returns an array with all records currently
  in the data object
- **useDataLength**(dataObject) - Returns the current number of records in the
  data object
- **useDataWithFilter**(dataObject, filter, type) - Like useData, but loads data
  with the given filter.
- **useDirty**(dataObject) - Returns a boolean indicating if the current row is
  dirty or not
- **useError**(dataObject) - Returns any loading error message
- **useFilter**(dataObject, filter, type) - Refreshes data object whenever the
  filter changes
- **useLoading**(dataObject) - Returns a boolean indicating if the data object
  is loading or not
- **useStatus**(dataObject) - Returns booleans indicating if the data object is
  saving or deleting records
- **usePaging**(dataObject) - Returns page, page count and a method to change
  the page
- **useParameter**(dataObject, parameter) - Returns the current value of
  parameter
- **usePermissions**(dataObject) - Returns booleans indicating if the user can
  delete, insert or update records

The above hooks uses the data objects internal state to pass data to the
components. If you do not want to depend on the data objects current row or data
storage, you can use the following hooks. They return data from the data
object's data handler directly, and will not affect the data objects internal
state.

- **useFetchData**(dataObject, filter) - Returns data matching the filter. If
  the filter is set to `false`, data will not be loaded.
- **useFetchRecord**(dataObject, filter) - Use if the filter is expected to only
  return a single row. If multiple rows are returned from the server, only the
  first record will be returned to the component.

One hook is also available for procedures.

- **useProcedure**(procedure, parameters, options) - Returns an object
  containing `data`, `execute`, `isExecuting` and `error` properties. Executes
  whenever the procedure or parameters arguments change. `execute` can be used
  to manually execute the procedure again

### useData options
`useData` accepts a second options argument. Available options are:
- **includeDirty** (default `true`) - Includes currently dirty data in the
  dataset. Disable this to optimize if the data is used many places.

### Examples

#### Getting all state from the data object

This will list all reacords in the data object, and create an editor for the
current row.

```jsx
import {
  useCurrentIndex,
  useCurrentRow,
  useData,
  useDataLength,
  useDirty,
  useError,
  useLoading,
  useStatus,
  usePermissions,
  useParameter,
} from "@olenbetong/react-data-object-connect";

function MyFunctionComponent(props) {
  const currentIndex = useCurrentIndex(dsMyDataObject);
  const myRecord = useCurrentRow(dsMyDataObject);
  const myRecords = useData(dsMyDataObject);
  const count = useDataLength(dsMyDataObject);
  const isDirty = useDirty(dsMyDataObject);
  const error = useError(dsMyDataObject);
  const isLoading = useLoading(dsMyDataObject);
  const { isDeleting, isSaving } = useStatus(dsMyDataObject);
  const { allowDelete, allowInsert, allowUpdate } = usePermissions(dsMyDataObject);
  const filter = useParameter(dsMyDataObject, "filterString");

  return (
    <div>
      {isLoading && <i className="fa fa-spin fa-spinner" />}
      {error && <Error message={error} />}
      <MyEditor {...myRecord} isDirty={isDirty} />
      {myRecords.map(record => (
        <ListItem {...item} />
      ))}
      There are {count} records matching {filter}
    </div>
  );
}
```

Automatically getting data with a given filter.

If you want to conditionally load data, you may set the filter to `false`.

```jsx
import { useDataWithFilter, useLoading } from "@olenbetong/react-data-object-connect";

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

If you want to conditionally load data, you may set the filter to `false`.

The refreshRows method can be used to update only a subset of the current data.
The first parameter is the filter that will be used to fetch data. The second
parameter is the field that will be used to compare fetched data with current
data (defaults to PrimKey). If the refreshRows fetches records that are not in
the current set, they will not be added.

```jsx
import { useFetchData, useFetchRecord } from "@olenbetong/react-data-object-connect";

function MyFunctionComponent(props) {
  const { isLoading, data, refresh, refreshRows } = useFetchData(dsMyDataObject, `[EntityCategory] = 1`);

  return (
    <div>
      {isLoading && <i className="fa fa-spin fa-spinner" />}
      {data.map(data => (
        <ListItem {...item} onRefresh={refreshRows(`[PrimKey] = '${item.PrimKey}'`, "PrimKey")} />
      ))}
    </div>
  );
}

function MyRecordComponent(props) {
  const { isLoading, record, refresh } = useFetchRecord(dsMyDataObject, `[EntityID] = ${props.id}`);

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

If 'Parameter', 'OtherParam', 'ThirdParam' are not valid parameters for
'procMyProcedure', they will be removed before executing the procedure. This way
the procedure can be executed even if the actual parameters haven't changed. If
'removeInvalidParameters' isn't set to true, an error will occur instead.

```jsx
import { useProcedure } from "@olenbetong/react-data-object-connect";

function MyComponent() {
  const { data, execute, error, isExecuting } = useProcedure(
    procMyProcedure,
    {
      Parameter: "value",
      OtherParam: 52,
      ThirdParam: "Oh, hai!",
    },
    { removeInvalidParameters: true }
  );

  return (
    <div>
      <button onClick={execute}>Refresh data</button>
      {error && <div className="alert alert-danger">{error}</div>}
      {isExecuting && <Spinner />}
      {data && data.length > 0 && data[0].map(record => <RecordComponent key={record.IdentityField} {...record} />)}
    </div>
  );
}
```

#### Paging component

```jsx
import { usePaging } from "@olenbetong/react-data-object-connect";

function PagingComponent() {
  const { changePage, page, pagecount } = usePaging(dsMyDataObject);

  return (
    <div>
      <button onClick={() => changePage(page - 1)} disabled={page <= 0}>
        Previous
      </button>
      Page {page + 1} of {pageCount}
      <button onClick={() => changePage(page + 1)} disabled={page + 1 >= pageCount}>
        pagecount
      </button>
    </div>
  );
}
```

## Changelog

See the GitHub [releases] page

[releases]: https://github.com/olenbetong/react-data-object-connect/releases
