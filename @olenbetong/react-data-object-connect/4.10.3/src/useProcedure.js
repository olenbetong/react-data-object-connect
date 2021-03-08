import { useCallback, useEffect, useRef, useState } from "react";
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

export default function useProcedure(procedure, params, options) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const parameters = useDeepCompareMemoize(params);
  const optionsRef = useDeepCompareMemoize(options);

  const execute = useCallback(() => {
    let isAborted = false;

    if (parameters && procedure) {
      const removeInvalid = optionsRef?.removeInvalidParameters ?? false;
      let execParameters = {};

      if (removeInvalid) {
        const validParameters = procedure.getParameters();
        for (let param of validParameters) {
          if (param.name in parameters) {
            execParameters[param.name] = parameters[param.name];
          }
        }
      } else {
        execParameters = parameters;
      }

      setIsExecuting(true);
      procedure.execute(execParameters, (err, data) => {
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
  }, [parameters, procedure, optionsRef]);

  useEffect(() => {
    return execute();
  }, [execute]);

  return { data, error, execute, isExecuting };
}