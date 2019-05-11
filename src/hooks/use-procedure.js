import { useEffect, useRef, useState } from "react";

function areEqualShallow(a, b) {
  for (let key in a) {
    if (!(key in b) || a[key] !== b[key]) {
      return false;
    }
  }

  for (let key in b) {
    if (!(key in a) || a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}

export default function useProcedure(procedure, params) {
  const prev = useRef([null, null]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let [prevProc, prevParams] = prev.current;

    if (params && procedure) {
      if (prevProc !== procedure || !areEqualShallow(prevParams, params)) {
        prev.current = [procedure, params];
        setIsExecuting(true);
        procedure.execute(params, (err, data) => {
          if (isMounted) {
            setIsExecuting(false);
            if (err) {
              setError(err);
            } else {
              setData(data);
            }
          }
        });
      }
    }

    return () => (isMounted = false);
  }, [procedure, params]);

  return { data, error, isExecuting };
}
