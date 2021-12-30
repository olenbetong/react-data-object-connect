import { RequestError } from "@olenbetong/data-object";

/**
 * Checks if the given object is a request error. It will return true
 * for any object that has an error property.
 *
 * @param potentialError Object to check if it is a request error
 * @returns True if the potentialError parameter is a request error object
 */
export function isRequestError(
  potentialError: any
): potentialError is RequestError {
  return (
    potentialError &&
    Object.prototype.hasOwnProperty.call(potentialError, "error")
  );
}
