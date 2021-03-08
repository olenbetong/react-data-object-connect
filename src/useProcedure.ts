import { RequestError, Procedure } from "@olenbetong/data-object";
import React, { useCallback, useEffect, useRef, useState } from "react";
import equals from "./fastDeepEqual";

function useDeepCompareMemoize<T>(value: T) {
  const ref = useRef<T>();

  if (!equals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export function useDeepCompareEffect(callback: React.EffectCallback, dependencies: React.DependencyList) {
  useEffect(callback, useDeepCompareMemoize(dependencies));
}

export default function useProcedure<TParams, TResult>(
  procedure: Procedure<TParams, TResult>,
  params: TParams,
  options: any,
) {
  const [data, setData] = useState<TResult | []>([]);
  const [error, setError] = useState<null | string | RequestError>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const parameters = useDeepCompareMemoize(params);
  const optionsRef = useDeepCompareMemoize(options);

  const execute = useCallback(() => {
    let isAborted = false;

    if (parameters && procedure) {
      const removeInvalid = optionsRef?.removeInvalidParameters ?? false;
      let execParameters: Partial<TParams> = {};

      if (removeInvalid) {
        const validParameters = procedure.getParameters();
        for (let param of validParameters) {
          if (param.name in parameters) {
            execParameters[param.name as keyof TParams] = parameters[param.name as keyof TParams];
          }
        }
      } else {
        execParameters = parameters;
      }

      setIsExecuting(true);
      procedure.execute(execParameters as TParams, (err, data) => {
        if (!isAborted) {
          setIsExecuting(false);
          if (err) {
            setError(err);
            setData([]);
          } else {
            setData(data as TResult);
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
