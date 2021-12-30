import { RequestError, Procedure } from "@olenbetong/data-object";
import { useCallback, useEffect, useRef, useState } from "react";
import equals from "./fastDeepEqual.js";

function useDeepCompareMemoize<T>(value: T) {
  const ref = useRef<T>();

  if (!equals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export function useDeepCompareEffect(
  callback: React.EffectCallback,
  dependencies: React.DependencyList
) {
  useEffect(callback, useDeepCompareMemoize(dependencies)); // eslint-disable-line react-hooks/exhaustive-deps
}

type useProcedureOptions = {
  /**
   * If true, any parameter that does not exist in the procedure will be
   * removed before the parameters are sent to the procedure. Otherwise,
   * the procedure will be called with the parameters as they are which
   * will result in an error if some of the parameters are invalid.
   */
  removeInvalidParameters?: boolean;
};

/**
 * Executes the given procedure whenever the parameters change. If false is
 * passed instead of a parameters object, the procedure will not be called.
 *
 * @param procedure Procedure to execute
 * @param params Parameters to pass to the procedure. If false, the procedure
 * will not be called.
 * @param options Options to control how the procedure is executed
 * @returns Data returned from the procedure, a method to force a new procedure call,
 * an error if the procedure fails, and a boolean indicating if the procedure is
 * currently executing.
 */
export function useProcedure<TParams, TResult>(
  procedure: Procedure<TParams, TResult>,
  params: TParams | false,
  options?: useProcedureOptions
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
            execParameters[param.name as keyof TParams] =
              parameters[param.name as keyof TParams];
          }
        }
      } else {
        execParameters = parameters;
      }

      setIsExecuting(true);
      procedure.execute(
        execParameters as TParams,
        (err: any, data: TResult | null | undefined) => {
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
        }
      );
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
