import { useEffect, useState } from "react";

export default function useProcedure(procedure, params) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const deps = typeof params === "object" ? [procedure, ...Object.values(params)] : [procedure, params];

  useEffect(() => {
    let isAborted = true;

    if (params && procedure) {
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

    return () => {
      isAborted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, isExecuting };
}
