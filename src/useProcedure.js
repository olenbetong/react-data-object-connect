import { useEffect, useRef, useState } from "react";
import equals from "fast-deep-equal";

export default function useProcedure(procedure, params) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const lastParams = useRef(null);

  useEffect(() => {
    let isAborted = true;

    if (params && procedure) {
      if (!equals(lastParams.current, params)) {
        lastParams.current = params;

        setIsExecuting(true);
        procedure.execute(params, (err, data) => {
          if (isAborted) {
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
    }

    return () => {
      isAborted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [procedure, params]);

  return { data, error, isExecuting };
}
