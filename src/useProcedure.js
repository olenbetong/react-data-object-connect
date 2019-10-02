import { useEffect, useRef, useState } from "react";
import equals from "fast-deep-equal";

function useDeepCompareMemoize(value) {
  const ref = useRef();

  if (!equals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export function useDeepCompareEffect(callback, dependencies) {
  useEffect(callback, useDeepCompareMemoize(dependencies));
}

export default function useProcedure(procedure, params) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useDeepCompareEffect(() => {
    let isAborted = false;

    if (params && procedure) {
      setIsExecuting(true);
      procedure.execute(params, (err, data) => {
        if (!isAborted) {
          setIsExecuting(false);
          if (err) {
            setError(err);
            setData([]);
          } else {
            setData(data);
            setError(null);
          }
        }
      });
    }

    return () => {
      isAborted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [procedure, params]);

  return { data, error, isExecuting };
}
