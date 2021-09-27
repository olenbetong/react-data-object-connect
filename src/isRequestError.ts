import { RequestError } from "@olenbetong/data-object";

export function isRequestError(
  potentialError: any
): potentialError is RequestError {
  return (
    potentialError &&
    Object.prototype.hasOwnProperty.call(potentialError, "error")
  );
}
